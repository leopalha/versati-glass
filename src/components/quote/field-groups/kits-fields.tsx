'use client'

import { ConditionalField } from '@/components/quote/conditional-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HARDWARE_COLORS } from '@/lib/catalog-options'

interface KitsFieldsProps {
  category: string
  currentValues: Record<string, any>
  // Estados
  model: string
  setModel: (value: string) => void
  hardwareColor: string
  setHardwareColor: (value: string) => void
  // Controle de edição
  isEditing?: boolean
  isFromProductSelection?: boolean
}

/**
 * Campos específicos para categoria KITS
 *
 * CRÍTICO: KITS NÃO tem vidro, NÃO tem dimensões width/height
 * São kits prontos de ferragens (ex: Kit Box Frontal completo)
 *
 * Campos exibidos:
 * - Modelo do Kit (BOX_FRONTAL, BOX_PIVOTANTE, etc)
 * - Cor da Ferragem (obrigatório)
 */
export function KitsFields({
  category,
  currentValues,
  model,
  setModel,
  hardwareColor,
  setHardwareColor,
  isEditing = false,
  isFromProductSelection = false,
}: KitsFieldsProps) {
  // Se veio da seleção de produto (etapa 2), o modelo já está definido e não pode ser alterado
  const modelIsLocked = !isEditing && isFromProductSelection && !!model

  // Modelos disponíveis para KITS
  const KITS_MODELS = [
    { id: 'BOX_FRONTAL', name: 'Kit Box Frontal' },
    { id: 'BOX_PIVOTANTE', name: 'Kit Box Pivotante' },
    { id: 'BOX_CANTO', name: 'Kit Box de Canto' },
    { id: 'BOX_ARTICULADO', name: 'Kit Box Articulado' },
    { id: 'PORTA_PIVOTANTE', name: 'Kit Porta Pivotante' },
    { id: 'JANELA_MAXIM_AR', name: 'Kit Janela Maxim-Ar' },
  ]

  return (
    <div className="space-y-4">
      {/* Modelo do Kit - SEMPRE VISÍVEL */}
      <ConditionalField category={category} fieldName="model" currentValues={currentValues}>
        <div>
          <label className="text-theme-muted mb-1 block text-sm">
            Tipo de Kit <span className="text-red-500">*</span>
            {modelIsLocked && (
              <span className="ml-2 text-xs text-green-400">(Pré-selecionado da etapa 2)</span>
            )}
          </label>
          <Select value={model} onValueChange={setModel} disabled={modelIsLocked}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o kit" />
            </SelectTrigger>
            <SelectContent>
              {KITS_MODELS.map((opt) => (
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

      {/* Aviso Visual: KITS NÃO TEM VIDRO */}
      <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
        <p className="text-sm text-purple-300">
          <strong>Nota:</strong> Kits são conjuntos de ferragens sem vidro. Apenas selecione o
          modelo, cor e quantidade.
        </p>
      </div>
    </div>
  )
}
