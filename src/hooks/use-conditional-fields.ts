import { useMemo } from 'react'
import {
  shouldShowField,
  getRequiredFields,
  getCategoryValidations,
  type FieldName,
} from '@/lib/catalog-field-mapping'

/**
 * Hook para gerenciar campos condicionais baseados na categoria do produto
 *
 * @param category - Categoria do produto (BOX, FERRAGENS, etc)
 * @param currentValues - Valores atuais do formulário
 * @returns Métodos e dados para controle de campos condicionais
 *
 * @example
 * ```tsx
 * const { shouldShow, requiredFields, validations } = useConditionalFields(
 *   'FERRAGENS',
 *   { model: 'PUXADOR', hardwareColor: 'INOX' }
 * )
 *
 * // Verifica se campo deve aparecer
 * if (shouldShow('width')) {
 *   return <Input label="Largura" />
 * }
 *
 * // Pega campos obrigatórios dinamicamente
 * console.log(requiredFields) // ['hardwareColor', 'model', 'puxadorTamanho']
 * ```
 */
export function useConditionalFields(category: string, currentValues: Record<string, any>) {
  /**
   * Verifica se um campo específico deve ser exibido
   */
  const shouldShow = useMemo(() => {
    return (fieldName: FieldName): boolean => {
      return shouldShowField(category, fieldName, currentValues)
    }
  }, [category, currentValues])

  /**
   * Lista de campos obrigatórios (considerando regras condicionais)
   */
  const requiredFields = useMemo(() => {
    return getRequiredFields(category, currentValues)
  }, [category, currentValues])

  /**
   * Validações específicas da categoria
   */
  const validations = useMemo<
    | {
        thicknessOptions?: number[]
        minWidth?: number
        maxWidth?: number
        minHeight?: number
        maxHeight?: number
        requiredGlassType?: string
        requiredHardware?: string
      }
    | undefined
  >(() => {
    return getCategoryValidations(category) as any
  }, [category])

  /**
   * Verifica se um campo é obrigatório
   */
  const isRequired = useMemo(() => {
    return (fieldName: FieldName): boolean => {
      return requiredFields.includes(fieldName)
    }
  }, [requiredFields])

  /**
   * Verifica se todos os campos obrigatórios estão preenchidos
   */
  const allRequiredFieldsFilled = useMemo(() => {
    return requiredFields.every((field) => {
      const value = currentValues[field]
      if (typeof value === 'string') {
        return value.trim() !== ''
      }
      if (typeof value === 'number') {
        return value > 0
      }
      return value != null && value !== ''
    })
  }, [requiredFields, currentValues])

  /**
   * Lista de campos faltantes (obrigatórios mas não preenchidos)
   */
  const missingFields = useMemo(() => {
    return requiredFields.filter((field) => {
      const value = currentValues[field]
      if (typeof value === 'string') {
        return value.trim() === ''
      }
      if (typeof value === 'number') {
        return value <= 0
      }
      return value == null || value === ''
    })
  }, [requiredFields, currentValues])

  /**
   * Valida espessura baseado nas regras NBR da categoria
   */
  const validateThickness = useMemo(() => {
    return (
      thickness: number | string
    ): {
      isValid: boolean
      message?: string
    } => {
      if (!validations?.thicknessOptions) {
        return { isValid: true }
      }

      const numThickness = typeof thickness === 'string' ? parseInt(thickness) : thickness

      if (!validations.thicknessOptions.includes(numThickness)) {
        return {
          isValid: false,
          message: `Espessura deve ser uma das seguintes: ${validations.thicknessOptions.join(', ')}mm`,
        }
      }

      return { isValid: true }
    }
  }, [validations])

  /**
   * Valida dimensões mínimas/máximas baseado nas regras da categoria
   */
  const validateDimensions = useMemo(() => {
    return (
      width?: number,
      height?: number
    ): {
      isValid: boolean
      message?: string
    } => {
      if (!validations) {
        return { isValid: true }
      }

      // Valida largura mínima
      if (validations.minWidth && width && width < validations.minWidth) {
        return {
          isValid: false,
          message: `Largura mínima: ${validations.minWidth}m`,
        }
      }

      // Valida largura máxima
      if (validations.maxWidth && width && width > validations.maxWidth) {
        return {
          isValid: false,
          message: `Largura máxima: ${validations.maxWidth}m`,
        }
      }

      // Valida altura mínima
      if (validations.minHeight && height && height < validations.minHeight) {
        return {
          isValid: false,
          message: `Altura mínima: ${validations.minHeight}m`,
        }
      }

      // Valida altura máxima
      if (validations.maxHeight && height && height > validations.maxHeight) {
        return {
          isValid: false,
          message: `Altura máxima: ${validations.maxHeight}m`,
        }
      }

      return { isValid: true }
    }
  }, [validations])

  /**
   * Valida tipo de vidro obrigatório
   */
  const validateGlassType = useMemo(() => {
    return (
      glassType?: string
    ): {
      isValid: boolean
      message?: string
    } => {
      if (!validations?.requiredGlassType) {
        return { isValid: true }
      }

      if (!glassType || glassType !== validations.requiredGlassType) {
        return {
          isValid: false,
          message: `Esta categoria requer vidro ${validations.requiredGlassType}`,
        }
      }

      return { isValid: true }
    }
  }, [validations])

  return {
    // Funções de verificação
    shouldShow,
    isRequired,

    // Dados computados
    requiredFields,
    missingFields,
    allRequiredFieldsFilled,
    validations,

    // Validadores específicos
    validateThickness,
    validateDimensions,
    validateGlassType,
  }
}

/**
 * Hook simplificado para uso rápido em componentes que só precisam
 * verificar visibilidade de campos
 *
 * @example
 * ```tsx
 * const shouldShow = useFieldVisibility('FERRAGENS', currentValues)
 *
 * return (
 *   <>
 *     {shouldShow('hardwareColor') && <ColorPicker />}
 *     {shouldShow('width') && <Input label="Largura" />}
 *   </>
 * )
 * ```
 */
export function useFieldVisibility(category: string, currentValues: Record<string, any>) {
  return useMemo(() => {
    return (fieldName: FieldName): boolean => {
      return shouldShowField(category, fieldName, currentValues)
    }
  }, [category, currentValues])
}

/**
 * Hook para obter apenas validações de uma categoria
 *
 * @example
 * ```tsx
 * const validations = useCategoryValidations('GUARDA_CORPO')
 *
 * if (validations?.minHeight) {
 *   console.log(`Altura mínima NBR 14718: ${validations.minHeight}m`)
 * }
 * ```
 */
export function useCategoryValidations(category: string) {
  return useMemo<
    | {
        thicknessOptions?: number[]
        minWidth?: number
        maxWidth?: number
        minHeight?: number
        maxHeight?: number
        requiredGlassType?: string
        requiredHardware?: string
      }
    | undefined
  >(() => {
    return getCategoryValidations(category)
  }, [category])
}
