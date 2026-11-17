import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const paths = ['/', '/?dia=1', '/?dia=13', '/?dia=21', '/?dia=24']
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch()
const failures = []

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  for (const path of paths) {
    await page.goto(`${base}${path}`, { waitUntil: 'networkidle' })
    const violations = (await new AxeBuilder({ page }).analyze()).violations
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    if (violations.length > 0) {
      failures.push(
        `${viewport.name} ${path}: ${violations.map((violation) => violation.id).join(', ')}`,
      )
    }
    if (overflow > 1) failures.push(`${viewport.name} ${path}: horizontal overflow ${overflow}px`)
  }
  await context.close()
}

await browser.close()

if (failures.length > 0) {
  console.error(`Audit failed with ${failures.length} issue(s):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`Audit OK: ${paths.length} views × ${viewports.length} viewports, 0 axe violations.`)
