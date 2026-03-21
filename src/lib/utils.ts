import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMoney(value: number, currency: 'BRL' | 'USD' | string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(value)
}

export function convertCurrency(value: number, from: string, to: string, ptaxRate: number): number {
  if (!value) return 0
  const fromCurr = from.toUpperCase()
  const toCurr = to.toUpperCase()
  if (fromCurr === toCurr) return value
  if (fromCurr === 'USD' && toCurr === 'BRL') return value * ptaxRate
  if (fromCurr === 'BRL' && toCurr === 'USD') return value / ptaxRate
  return value
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function getDaysDiff(dateStr: string): number {
  if (!dateStr) return 0
  const date = new Date(dateStr)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - date.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
