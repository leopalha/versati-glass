'use client'

import { ConditionalField } from '@/components/quote/conditional-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GUARD_RAIL_SYSTEMS,
  HARDWARE_COLORS,
  GLASS_TYPES,
  GLASS_COLORS,
  GLASS_THICKNESSES,
  HANDRAIL_TYPES,
} from '@/lib/catalog-options'
import { Checkbox } from '@/components/ui/checkbox'

interface GuardaCorpoFieldsProps {
  category: string
  currentValues: Record<string, any>
  // Estados
  model: string
  setModel: (value: string) => void
  hardwareColor: string
  setHardwareColor: (value: string) => void
  // Campos de vidro (CONDICIONAL - não aparece se GRADIL_INOX)
  glassType?: string
  setGlassType?: (value: string) => void
  glassColor?: string
  setGlassColor?: (value: string) => void
  thickness?: string
  setThickness?: (value: string) => void
  // Corrimão
  hasHandrail: boolean
  setHasHandrail: (value: boolean) => void
  handrailType?: string
  setHandrailType?: (value: string) => void
  // Controle de edição
  isEditing?: boolean
  isFromProductSelection?: boolean
}

/**
 * Campos específicos para categoria GUARDA_CORPO
 *
 * CRÍTICO: GRADIL_INOX NÃO tem vidro (é só grade de inox)
 * Outros modelos (AUTOPORTANTE, SPIDER, BOTTONS, TORRES) TEM vidro
 *
 * Campos base:
 * - Modelo (Sistema)
 * - Cor da Ferragem
 *
 * Campos condicionais (SE model ≠ GRADIL_INOX):
 * - Tipo de Vidro (obrigatório: LAMINADO)
 * - Cor do Vidro
 * - Espessura (10mm, 12mm, 15mm, 19mm)
 *
 * Campos opcionais:
 * - Tem Corrimão? (checkbox)
 * - Se sim → Tipo de Corrimão
 *
 * Validações NBR 14718:
 * - Altura mínima: 1.1m
 * - Vidro obrigatório: LAMINADO (exceto Gradil)
 */
export function GuardaCorpoFields({
  category,
  currentValues,
  model,
  setModel,
  hardwareColor,
  setHardwareColor,
  glassType,
  setGlassType,
  glassColor,
  setGlassColor,
  thickness,
  setThickness,
  hasHandrail,
  setHasHandrail,
  handrailType,
  setHandrailType,
  isEditing = false,
  isFromProductSelection = false,
}: GuardaCorpoFieldsProps) {
  // Se veio da seleção de produto (etapa 2), o modelo já está definido e não pode ser alterado
  const modelIsLocked = !isEditing && isFromProductSelection && !!model
  const isGradilInox = model === 'GRADIL_INOX'
  const needsGlass = !isGradilInox

  // Espessuras permitidas para guarda-corpo (NBR 14718)
  const GUARDA_CORPO_THICKNESSES = GLASS_THICKNESSES.filter((t) =>
    ['10MM', '12MM', '15MM', '19MM'].includes(t.id)
  )

  // Tipos de vidro recomendados (preferencialmente LAMINADO)
  const GUARDA_CORPO_GLASS_TYPES = GLASS_TYPES.filter((g) =>
    ['LAMINADO', 'LAMINADO_TEMPERADO', 'TEMPERADO'].includes(g.id)
  )

  return (
    <div className="space-y-4">
      {/* Sistema de Guarda-Corpo - SEMPRE VISÍVEL */}
      <ConditionalField category={category} fieldName="model" currentValues={currentValues}>
        <div>
          <label className="text-theme-muted mb-1 block text-sm">
            Sistema de Guarda-Corpo <span className="text-red-500">*</span>
            {modelIsLocked && (
              <span className="ml-2 text-xs text-green-400">(Pré-selecionado da etapa 2)</span>
            )}
          </label>
          <Select value={model} onValueChange={setModel} disabled={modelIsLocked}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o sistema" />
            </SelectTrigger>
            <SelectContent>
              {GUARD_RAIL_SYSTEMS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConditionalField>

      {/* Cor da Ferragem - SEMPRE VISÍVEL */}
      <ConditionalField category={category} fieldName="hardwareColor" currentValues={currentValues}>
        <div>
          <label className="text-theme-muted mb-1 block text-sm">
            Cor da Ferragem <span className="text-red-500">*</span>
          </label>
          <Select value={hardwareColor} onValueChange={setHardwareColor}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a cor" />
            </SelectTrigger>
            <SelectContent>
              {HARDWARE_COLORS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConditionalField>

      {/* Aviso NBR 14718 */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <p className="text-sm text-blue-300">
          <strong>NBR 14718:</strong> Guarda-corpos devem ter altura mínima de 1.1m e vidro
          laminado.
        </p>
      </div>

      {/* CAMPOS DE VIDRO - CONDICIONAL (não aparece se GRADIL_INOX) */}
      {needsGlass && (
        <>
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <p className="text-sm text-green-300">
              <strong>Sistema com vidro:</strong> Especifique o tipo e características do vidro.
            </p>
          </div>

          {/* Tipo de Vidro */}
          {setGlassType && (
            <ConditionalField
              category={category}
              fieldName="glassType"
              currentValues={currentValues}
            >
              <div>
                <label className="text-theme-muted mb-1 block text-sm">
                  Tipo de Vidro <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-yellow-400">(Recomendado: Laminado)</span>
                </label>
                <Select value={glassType} onValueChange={setGlassType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de vidro" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUARDA_CORPO_GLASS_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                        {opt.id === 'LAMINADO' && ' ✓ NBR'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </ConditionalField>
          )}

          {/* Cor do Vidro */}
          {setGlassColor && (
            <ConditionalField
              category={category}
              fieldName="glassColor"
              currentValues={currentValues}
            >
              <div>
                <label className="text-theme-muted mb-1 block text-sm">Cor do Vidro</label>
                <Select value={glassColor} onValueChange={setGlassColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a cor" />
                  </SelectTrigger>
                  <SelectContent>
                    {GLASS_COLORS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </ConditionalField>
          )}

          {/* Espessura */}
          {setThickness && (
            <ConditionalField
              category={category}
              fieldName="thickness"
              currentValues={currentValues}
            >
              <div>
                <label className="text-theme-muted mb-1 block text-sm">
                  Espessura <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-yellow-400">(Mín: 10mm)</span>
                </label>
                <Select value={thickness} onValueChange={setThickness}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a espessura" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUARDA_CORPO_THICKNESSES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.value}>
                        {opt.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </ConditionalField>
          )}
        </>
      )}

      {/* Aviso para GRADIL_INOX */}
      {isGradilInox && (
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
          <p className="text-sm text-orange-300">
            <strong>Gradil Inox:</strong> Sistema sem vidro (apenas grade de inox). Não é necessário
            especificar tipo ou cor de vidro.
          </p>
        </div>
      )}

      {/* Corrimão - OPCIONAL para todos os modelos */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="hasHandrail" checked={hasHandrail} onCheckedChange={setHasHandrail} />
          <label
            htmlFor="hasHandrail"
            className="text-theme-muted text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Incluir Corrimão
          </label>
        </div>

        {hasHandrail && setHandrailType && (
          <ConditionalField
            category={category}
            fieldName="handrailType"
            currentValues={currentValues}
          >
            <div>
              <label className="text-theme-muted mb-1 block text-sm">
                Tipo de Corrimão <span className="text-red-500">*</span>
              </label>
              <Select value={handrailType} onValueChange={setHandrailType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o corrimão" />
                </SelectTrigger>
                <SelectContent>
                  {HANDRAIL_TYPES.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </ConditionalField>
        )}
      </div>
    </div>
  )
}
