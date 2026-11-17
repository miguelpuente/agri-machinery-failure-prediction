export interface CertificateData {
  completed: number
  total: number
  quizCorrect: number
  date: Date
}

export function certificateLines(data: CertificateData): string[] {
  return [
    `${data.completed} de ${data.total} laboratorios completados`,
    `Quizzes: ${data.quizCorrect}/${data.total} correctos`,
    `Fecha: ${data.date.toISOString().slice(0, 10)}`,
  ]
}

export function downloadCertificate(data: CertificateData): void {
  const canvas = document.createElement('canvas')
  canvas.width = 1200
  canvas.height = 800
  const context = canvas.getContext('2d')
  if (!context) return

  context.fillStyle = '#05080d'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.strokeStyle = '#00d1b2'
  context.lineWidth = 6
  context.strokeRect(36, 36, canvas.width - 72, canvas.height - 72)
  context.strokeStyle = '#1c2b33'
  context.lineWidth = 2
  context.strokeRect(56, 56, canvas.width - 112, canvas.height - 112)

  context.fillStyle = '#00d1b2'
  context.font = '700 26px Outfit, Inter, sans-serif'
  context.fillText('SION · MACHINE LEARNING', 88, 116)

  context.fillStyle = '#e6f1f0'
  context.font = '700 72px Outfit, Inter, sans-serif'
  context.fillText('Certificado de recorrido', 88, 220)

  context.fillStyle = '#8fa6a3'
  context.font = '400 28px Inter, sans-serif'
  context.fillText('Mantenimiento predictivo sobre AI4I 2020', 88, 272)

  context.fillStyle = '#e6f1f0'
  context.font = '600 34px Inter, sans-serif'
  certificateLines(data).forEach((line, index) => {
    context.fillText(line, 88, 390 + index * 58)
  })

  context.fillStyle = '#00d1b2'
  context.fillRect(88, 620, 220, 4)

  context.fillStyle = '#8fa6a3'
  context.font = '400 22px Inter, sans-serif'
  context.fillText('chiqui.sion.net.ar', 88, 668)
  context.fillText('Documento de finalización del recorrido; no es una certificación oficial.', 88, 710)

  const link = document.createElement('a')
  link.download = 'sion-machine-learning-certificado.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
