export function validateScore(value: number): string | null {
  if (!Number.isInteger(value)) return 'Skor harus bilangan bulat'
  if (value === 0) return 'Skor tidak boleh 0'
  return null
}
