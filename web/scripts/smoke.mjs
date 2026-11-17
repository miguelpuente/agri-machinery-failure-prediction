import { chromium } from 'playwright'

const base = process.env.BASE_URL ?? 'http://localhost:4173'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
const errors = []

page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`)
})
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

function check(condition, message) {
  if (!condition) errors.push(message)
}

await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForSelector('text=Sion Machine Learning')
await page.evaluate(() => document.fonts.ready)
check(
  await page.evaluate(() => document.fonts.check('16px Inter') && document.fonts.check('16px Outfit')),
  'self-hosted fonts did not load',
)
check(
  await page.evaluate(
    () =>
      !performance
        .getEntriesByType('resource')
        .some((entry) => entry.name.includes('fonts.googleapis') || entry.name.includes('fonts.gstatic')),
  ),
  'external Google Fonts should not be requested',
)
check(
  (await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 1,
  'desktop home has horizontal overflow',
)
await page.locator('#glossary-search').fill('leakage')
check(
  (await page.locator('#glosario article').count()) >= 1,
  'glossary search should find leakage',
)
await page.locator('#glossary-search').fill('zzzz-no-existe')
check((await page.locator('text=Sin resultados').count()) > 0, 'glossary empty state should render')
await page.locator('#glossary-search').fill('')

const cards = page.locator('button[data-day-card]')
check((await cards.count()) === 24, `home should render 24 day cards, got ${await cards.count()}`)

for (let day = 1; day <= 24; day += 1) {
  await page.goto(`${base}/?dia=${day}`, { waitUntil: 'networkidle' })
  const dialog = page.locator('[role="dialog"]')
  await dialog.waitFor({ state: 'visible' })
  const title = await dialog.locator('h2').first().textContent()
  check(Boolean(title && title.trim().length > 5), `day ${day} has no title`)
}

await page.goto(`${base}/?dia=1`, { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Corregir lectura' }).click()
check((await page.locator('text=Lectura correcta.').count()) > 0, 'CSV inspector did not correct')
await page.locator('[role="dialog"]').getByRole('button', { name: /^A / }).first().click()
check((await page.locator('text=Correcto.').count()) > 0, 'quiz did not grade the first option')

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })
await mobile.goto(base, { waitUntil: 'networkidle' })
check(
  (await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 1,
  'mobile home has horizontal overflow',
)
for (const day of [1, 13, 21, 24]) {
  await mobile.goto(`${base}/?dia=${day}`, { waitUntil: 'networkidle' })
  check(
    (await mobile.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)) <= 1,
    `mobile day ${day} has horizontal overflow`,
  )
}

await page.goto(base, { waitUntil: 'networkidle' })
await page.evaluate(() => window.localStorage.clear())
await page.reload({ waitUntil: 'networkidle' })
await page.locator('button[data-day-card]').first().click()
await page.locator('[role="dialog"]').waitFor({ state: 'visible' })
await page.locator('[role="dialog"]').getByRole('button', { name: 'Marcar completado' }).first().click()
await page.locator('[role="dialog"] button[aria-label="Cerrar"]').click()
await page.waitForSelector('text=1 de 24 laboratorios')
await page.waitForTimeout(350)
check(
  (await page.evaluate(() => document.activeElement?.getAttribute('data-day-card'))) === '1',
  'closing the day dialog should restore focus to its card',
)

await page.reload({ waitUntil: 'networkidle' })
await page.waitForSelector('text=1 de 24 laboratorios')
check(
  (await page.getByRole('button', { name: /Continuar por el día 02/ }).count()) > 0,
  'hero CTA should continue with the next pending day',
)

await page.getByRole('button', { name: 'Compartir', exact: true }).first().click()
await page.waitForSelector('text=Pasá el link')
check((await page.locator('#share-message').inputValue()).includes('1/24'), 'share text should include progress')
await page.getByRole('button', { name: 'Cerrar', exact: true }).last().click()
await page.waitForTimeout(350)
check(
  (await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))) === 'Compartir',
  'closing the share dialog should restore focus to its trigger',
)

await page.getByRole('button', { name: /Completados/ }).click()
check(
  (await page.locator('button[data-day-card]').count()) === 1,
  'completed filter should show one day',
)

await page.locator('input[type="file"]').setInputFiles({
  name: 'progress.json',
  mimeType: 'application/json',
  buffer: Buffer.from(JSON.stringify({ version: 1, total: 24, completedDays: [2, 3] })),
})
await page.waitForSelector('text=Importados 2 días')
check(
  (await page.locator('text=3 de 24 laboratorios').count()) > 0,
  'import should merge the file with current progress',
)

const downloadPromise = page.waitForEvent('download')
await page.getByRole('button', { name: /Exportar/i }).click()
const download = await downloadPromise
check(
  download.suggestedFilename() === 'sion-machine-learning-progress.json',
  `unexpected download name ${download.suggestedFilename()}`,
)

page.on('dialog', (dialog) => void dialog.accept())
await page.getByRole('button', { name: /Reiniciar/i }).click()
await page.waitForTimeout(300)
check(
  (await page.locator('text=0 de 24 laboratorios').count()) > 0,
  'reset should clear progress',
)

await page.locator('input[type="file"]').setInputFiles({
  name: 'complete.json',
  mimeType: 'application/json',
  buffer: Buffer.from(
    JSON.stringify({
      version: 1,
      total: 24,
      completedDays: Array.from({ length: 24 }, (_, index) => index + 1),
    }),
  ),
})
await page.waitForSelector('text=24 de 24 laboratorios')
check(
  (await page.getByRole('button', { name: 'Certificado' }).count()) > 0,
  'the completion certificate should appear after all 24 days',
)
const certificatePromise = page.waitForEvent('download')
await page.getByRole('button', { name: 'Certificado' }).click()
const certificate = await certificatePromise
check(
  certificate.suggestedFilename() === 'sion-machine-learning-certificado.png',
  `unexpected certificate filename ${certificate.suggestedFilename()}`,
)

await browser.close()

if (errors.length > 0) {
  console.error(`Smoke failed with ${errors.length} issue(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Smoke OK: 24 labs rendered, progress persisted, share/export/reset verified.')
