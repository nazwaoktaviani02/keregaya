export type NeedOrWant = 'need' | 'want'
export type PaymentMethod = 'cash' | 'paylater'
export type ScoreLevel = 'green' | 'yellow' | 'red'

interface ScoringInput {
  price: number
  disposableIncome: number
  needOrWant: NeedOrWant
  paymentMethod: PaymentMethod
  categoryCountThisMonth: number
}

interface ScoringResult {
  baseScore: number
  penaltyPaylater: boolean
  penaltyFrequency: boolean
  penaltyWant: boolean
  finalLevel: ScoreLevel
  adviceText: string
}

const levelOrder: ScoreLevel[] = ['green', 'yellow', 'red']

function bumpLevel(level: ScoreLevel): ScoreLevel {
  const idx = levelOrder.indexOf(level)
  return levelOrder[Math.min(idx + 1, levelOrder.length - 1)]
}

const adviceBank: Record<ScoreLevel, string[]> = {
  green: [
    'Oke, ini masih masuk akal. Beli aja, gak perlu drama.',
    'Aman. Dompetmu masih bisa senyum.',
    'Secara angka, ini wajar. Jalan terus.',
  ],
  yellow: [
    'Boleh sih, tapi kok kayaknya minggu lalu juga "boleh sih" buat barang lain ya?',
    'Masuk akal secara matematika. Nggak masuk akal secara pola belanja bulan ini.',
    'Masih dalam batas, tapi mepet. Yakin ini prioritas?',
  ],
  red: [
    'Ini bukan kebutuhan, ini alarm. Dompetmu udah teriak dari tadi.',
    'Gaya boleh jalan terus, tapi rekening kayaknya udah capek.',
    'Kalau ini paylater, selamat — bulan depan kamu ketemu diri kamu yang nyesel.',
  ],
}

function pickAdvice(level: ScoreLevel): string {
  const options = adviceBank[level]
  return options[Math.floor(Math.random() * options.length)]
}

export function calculateScore(input: ScoringInput): ScoringResult {
  const { price, disposableIncome, needOrWant, paymentMethod, categoryCountThisMonth } = input

  const baseScore = disposableIncome > 0 ? (price / disposableIncome) * 100 : 100

  let level: ScoreLevel = 'green'
  if (baseScore > 30) level = 'red'
  else if (baseScore > 15) level = 'yellow'

  const penaltyPaylater = paymentMethod === 'paylater'
  const penaltyFrequency = categoryCountThisMonth >= 2
  const penaltyWant = needOrWant === 'want'

  if (penaltyPaylater) level = bumpLevel(level)
  if (penaltyFrequency) level = bumpLevel(level)
  if (penaltyWant) level = bumpLevel(level)

  return {
    baseScore: Math.round(baseScore * 10) / 10,
    penaltyPaylater,
    penaltyFrequency,
    penaltyWant,
    finalLevel: level,
    adviceText: pickAdvice(level),
  }
}