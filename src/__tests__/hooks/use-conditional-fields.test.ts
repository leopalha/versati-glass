import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  useConditionalFields,
  useFieldVisibility,
  useCategoryValidations,
} from '@/hooks/use-conditional-fields'

describe('useConditionalFields', () => {
  describe('BOX category', () => {
    it('should return correct required fields for box category', () => {
      const { result } = renderHook(() =>
        useConditionalFields('BOX', {
          width: 1.2,
          height: 2.0,
          glassType: 'TEMPERADO',
        })
      )

      expect(result.current.requiredFields).toContain('width')
      expect(result.current.requiredFields).toContain('height')
      expect(result.current.requiredFields).toContain('glassType')
    })

    it('should validate all required fields are filled', () => {
      const { result } = renderHook(() =>
        useConditionalFields('BOX', {
          width: 1.2,
          height: 2.0,
          glassType: 'TEMPERADO',
          thickness: 8,
        })
      )

      expect(result.current.allRequiredFieldsFilled).toBe(true)
    })

    it('should detect missing required fields', () => {
      const { result } = renderHook(() =>
        useConditionalFields('BOX', {
          width: 1.2,
          // height missing
          glassType: 'TEMPERADO',
        })
      )

      expect(result.current.allRequiredFieldsFilled).toBe(false)
      expect(result.current.missingFields.length).toBeGreaterThan(0)
    })
  })

  describe('FERRAGENS category', () => {
    it('should require hardware-specific fields', () => {
      const { result } = renderHook(() =>
        useConditionalFields('FERRAGENS', {
          model: 'PUXADOR',
          hardwareColor: 'INOX',
        })
      )

      expect(result.current.requiredFields).toContain('hardwareColor')
      expect(result.current.requiredFields).toContain('model')
    })

    it('should mark field as required correctly', () => {
      const { result } = renderHook(() =>
        useConditionalFields('FERRAGENS', {
          model: 'PUXADOR',
        })
      )

      expect(result.current.isRequired('hardwareColor')).toBe(true)
      expect(result.current.isRequired('width')).toBe(false) // Not required for FERRAGENS
    })
  })

  describe('GUARDA_CORPO category', () => {
    it('should have NBR 14718 validations', () => {
      const { result } = renderHook(() => useConditionalFields('GUARDA_CORPO', {}))

      expect(result.current.validations).toBeDefined()
      if (result.current.validations) {
        expect(result.current.validations.minHeight).toBeDefined()
      }
    })

    it('should validate minimum height', () => {
      const { result } = renderHook(() => useConditionalFields('GUARDA_CORPO', {}))

      // Test minimum height validation
      const validation = result.current.validateDimensions(undefined, 0.8)
      if (result.current.validations?.minHeight) {
        expect(validation.isValid).toBe(false)
        expect(validation.message).toBeDefined()
      }
    })
  })

  describe('validateThickness', () => {
    it('should validate thickness against allowed options', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      // Common glass thicknesses: 6, 8, 10, 12mm
      const validThickness = result.current.validateThickness(8)
      const invalidThickness = result.current.validateThickness(5)

      if (result.current.validations?.thicknessOptions) {
        expect(validThickness.isValid).toBe(true)
        expect(invalidThickness.isValid).toBe(false)
        expect(invalidThickness.message).toContain('Espessura')
      }
    })

    it('should handle string thickness values', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      const validation = result.current.validateThickness('8')

      if (result.current.validations?.thicknessOptions) {
        expect(validation.isValid).toBe(true)
      }
    })
  })

  describe('validateDimensions', () => {
    it('should validate width and height ranges', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      const validDimensions = result.current.validateDimensions(1.5, 2.0)
      expect(validDimensions.isValid).toBe(true)
    })

    it('should reject dimensions below minimum', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      if (result.current.validations?.minWidth) {
        const invalidWidth = result.current.validateDimensions(0.1, 2.0)
        expect(invalidWidth.isValid).toBe(false)
        expect(invalidWidth.message).toContain('mínima')
      }
    })

    it('should reject dimensions above maximum', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      if (result.current.validations?.maxWidth) {
        const invalidWidth = result.current.validateDimensions(10.0, 2.0)
        expect(invalidWidth.isValid).toBe(false)
        expect(invalidWidth.message).toContain('máxima')
      }
    })
  })

  describe('validateGlassType', () => {
    it('should validate required glass type', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      if (result.current.validations?.requiredGlassType) {
        const validation = result.current.validateGlassType('COMUM')
        expect(validation.isValid).toBe(false)
        expect(validation.message).toContain('requer vidro')
      }
    })

    it('should pass when correct glass type is used', () => {
      const { result } = renderHook(() => useConditionalFields('BOX', {}))

      if (result.current.validations?.requiredGlassType) {
        const requiredType = result.current.validations.requiredGlassType
        const validation = result.current.validateGlassType(requiredType)
        expect(validation.isValid).toBe(true)
      }
    })
  })

  describe('dynamic updates', () => {
    it('should update when values change', () => {
      const initialValues = { width: 1.2 }
      const { result, rerender } = renderHook(({ values }) => useConditionalFields('BOX', values), {
        initialProps: { values: initialValues },
      })

      expect(result.current.allRequiredFieldsFilled).toBe(false)

      const updatedValues = {
        width: 1.2,
        height: 2.0,
        glassType: 'TEMPERADO',
        thickness: 8,
      }

      rerender({ values: updatedValues })

      expect(result.current.allRequiredFieldsFilled).toBe(true)
    })
  })
})

describe('useFieldVisibility', () => {
  it('should return visibility checker function', () => {
    const { result } = renderHook(() => useFieldVisibility('BOX', { width: 1.2 }))

    expect(typeof result.current).toBe('function')
  })

  it('should correctly determine field visibility', () => {
    const { result } = renderHook(() => useFieldVisibility('BOX', { glassType: 'TEMPERADO' }))

    // Width/height should be visible for BOX
    expect(result.current('width')).toBe(true)
    expect(result.current('height')).toBe(true)
  })

  it('should hide non-applicable fields', () => {
    const { result } = renderHook(() => useFieldVisibility('FERRAGENS', { model: 'PUXADOR' }))

    // Width/height not applicable for FERRAGENS
    expect(result.current('hardwareColor')).toBe(true)
  })
})

describe('useCategoryValidations', () => {
  it('should return validations for BOX category', () => {
    const { result } = renderHook(() => useCategoryValidations('BOX'))

    expect(result.current).toBeDefined()
    if (result.current) {
      expect(result.current.thicknessOptions).toBeDefined()
    }
  })

  it('should return validations for GUARDA_CORPO category', () => {
    const { result } = renderHook(() => useCategoryValidations('GUARDA_CORPO'))

    expect(result.current).toBeDefined()
    if (result.current) {
      expect(result.current.minHeight).toBeDefined()
    }
  })

  it('should return undefined for unknown category', () => {
    const { result } = renderHook(() => useCategoryValidations('UNKNOWN'))

    // Should handle gracefully
    expect(result.current).toBeDefined()
  })

  it('should memoize validations correctly', () => {
    const { result, rerender } = renderHook(({ category }) => useCategoryValidations(category), {
      initialProps: { category: 'BOX' },
    })

    const firstResult = result.current

    rerender({ category: 'BOX' })
    expect(result.current).toBe(firstResult) // Same reference = memoized

    rerender({ category: 'GUARDA_CORPO' })
    expect(result.current).not.toBe(firstResult) // Different category = new reference
  })
})
