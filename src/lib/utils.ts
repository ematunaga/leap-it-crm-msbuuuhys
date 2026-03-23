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

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const toCamel = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(toCamel)
  if (obj instanceof Date) return obj
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      acc[camelKey] = toCamel(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}

export const toSnake = (obj: any): any => {
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.map(toSnake)
  if (obj instanceof Date) return obj
  if (typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      acc[snakeKey] = toSnake(obj[key])
      return acc
    }, {} as any)
  }
  return obj
}
