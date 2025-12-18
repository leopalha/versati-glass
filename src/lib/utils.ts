import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
  }
  return cpf
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/)
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`
  }
  return cnpj
}

export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{5})(\d{3})$/)
  if (match) {
    return `${match[1]}-${match[2]}`
  }
  return cep
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `OS-${year}-${random}`
}

export function generateQuoteNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `ORC-${year}-${random}`
}

/**
 * Validate CPF using check digit algorithm
 * @param cpf - CPF string (with or without formatting)
 * @returns true if valid, false otherwise
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')

  if (cleaned.length !== 11) return false

  // Check for known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(cleaned)) return false

  // Calculate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(9))) return false

  // Calculate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned.charAt(10))) return false

  return true
}

/**
 * Validate CNPJ using check digit algorithm
 * @param cnpj - CNPJ string (with or without formatting)
 * @returns true if valid, false otherwise
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '')

  if (cleaned.length !== 14) return false

  // Check for known invalid CNPJs (all same digits)
  if (/^(\d)\1{13}$/.test(cleaned)) return false

  // Calculate first check digit
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights1[i]
  }
  let remainder = sum % 11
  const digit1 = remainder < 2 ? 0 : 11 - remainder
  if (digit1 !== parseInt(cleaned.charAt(12))) return false

  // Calculate second check digit
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  sum = 0
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cleaned.charAt(i)) * weights2[i]
  }
  remainder = sum % 11
  const digit2 = remainder < 2 ? 0 : 11 - remainder
  if (digit2 !== parseInt(cleaned.charAt(13))) return false

  return true
}

/**
 * Validate CPF or CNPJ
 * @param value - CPF or CNPJ string (with or without formatting)
 * @returns true if valid CPF or CNPJ, false otherwise
 */
export function validateCPFOrCNPJ(value: string): boolean {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length === 11) {
    return validateCPF(cleaned)
  } else if (cleaned.length === 14) {
    return validateCNPJ(cleaned)
  }

  return false
}

/**
 * Format CPF or CNPJ automatically based on length
 * @param value - CPF or CNPJ string (with or without formatting)
 * @returns formatted string
 */
export function formatCPFOrCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, '')

  if (cleaned.length <= 11) {
    return formatCPF(cleaned)
  } else {
    return formatCNPJ(cleaned)
  }
}
