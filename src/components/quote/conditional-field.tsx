'use client'

import { ReactNode } from 'react'
import { shouldShowField, type FieldName } from '@/lib/catalog-field-mapping'

interface ConditionalFieldProps {
  /**
   * Categoria do produto (ex: BOX, FERRAGENS, ESPELHOS)
   */
  category: string

  /**
   * Nome do campo a ser condicionalmente renderizado
   */
  fieldName: FieldName

  /**
   * Valores atuais do formulário para avaliar regras condicionais
   * Ex: { model: 'FRONTAL', width: 1.5, height: 2.0 }
   */
  currentValues: Record<string, any>

  /**
   * Conteúdo a ser renderizado se o campo deve aparecer
   */
  children: ReactNode

  /**
   * Se true, renderiza children mesmo se campo estiver hidden
   * (usado para debug/desenvolvimento)
   */
  forceShow?: boolean
}

/**
 * Componente que renderiza condicionalmente campos baseado na categoria do produto
 *
 * @example
 * ```tsx
 * <ConditionalField
 *   category="FERRAGENS"
 *   fieldName="width"
 *   currentValues={{ model: 'PUXADOR' }}
 * >
 *   <Input label="Largura" />
 * </ConditionalField>
 * // Não renderiza nada porque FERRAGENS não usa width
 * ```
 *
 * @example
 * ```tsx
 * <ConditionalField
 *   category="GUARDA_CORPO"
 *   fieldName="glassType"
 *   currentValues={{ model: 'AUTOPORTANTE' }}
 * >
 *   <Select label="Tipo de Vidro" />
 * </ConditionalField>
 * // Renderiza porque AUTOPORTANTE precisa de vidro
 * ```
 *
 * @example
 * ```tsx
 * <ConditionalField
 *   category="GUARDA_CORPO"
 *   fieldName="glassType"
 *   currentValues={{ model: 'GRADIL_INOX' }}
 * >
 *   <Select label="Tipo de Vidro" />
 * </ConditionalField>
 * // Não renderiza porque GRADIL_INOX não tem vidro
 * ```
 */
export function ConditionalField({
  category,
  fieldName,
  currentValues,
  children,
  forceShow = false,
}: ConditionalFieldProps) {
  // Modo debug: força renderização
  if (forceShow) {
    return <>{children}</>
  }

  // Verifica se o campo deve ser exibido para essa categoria
  const shouldShow = shouldShowField(category, fieldName, currentValues)

  if (!shouldShow) {
    return null
  }

  return <>{children}</>
}

/**
 * Componente utilitário para renderizar múltiplos campos condicionais de uma vez
 *
 * @example
 * ```tsx
 * <ConditionalFieldGroup
 *   category="BOX"
 *   fields={['width', 'height', 'thickness']}
 *   currentValues={{ model: 'FRONTAL' }}
 * >
 *   {(visibleFields) => (
 *     <>
 *       {visibleFields.includes('width') && <Input label="Largura" />}
 *       {visibleFields.includes('height') && <Input label="Altura" />}
 *       {visibleFields.includes('thickness') && <Select label="Espessura" />}
 *     </>
 *   )}
 * </ConditionalFieldGroup>
 * ```
 */
export function ConditionalFieldGroup({
  category,
  fields,
  currentValues,
  children,
}: {
  category: string
  fields: FieldName[]
  currentValues: Record<string, any>
  children: (visibleFields: FieldName[]) => ReactNode
}) {
  // Filtra apenas os campos que devem ser exibidos
  const visibleFields = fields.filter((field) => shouldShowField(category, field, currentValues))

  return <>{children(visibleFields)}</>
}
