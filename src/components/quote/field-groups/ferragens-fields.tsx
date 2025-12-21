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

interface FerragensFieldsProps {
  category: string
  currentValues: Record<string, any>
  // Estados
  model: string
  setModel: (value: string) => void
  hardwareColor: string
  setHardwareColor: (value: string) => void
  // Campos condicionais de FERRAGENS
  molaCapacidade?: string
  setMolaCapacidade?: (value: string) => void
  puxadorTamanho?: string
  setPuxadorTamanho?: (value: string) => void
  // Controle de edição
  isEditing?: boolean
  isFromProductSelection?: boolean
}

/**
 * Campos específicos para categoria FERRAGENS
 *
 * CRÍTICO: FERRAGENS NÃO tem vidro, NÃO tem dimensões width/height
 * São apenas peças de hardware (puxadores, molas, acessórios)
 *
 * Campos exibidos:
 * - Modelo (PUXADOR, MOLA, DOBRADICA, ROLDANA)
 * - Cor da Ferragem (obrigatório)
 * - [Condicional] Se MOLA → Capacidade da Mola
 * - [Condicional] Se PUXADOR → Tamanho do Puxador
 */
export function FerragensFields({
  category,
  currentValues,
  model,
  setModel,
  hardwareColor,
  setHardwareColor,
  molaCapacidade,
  setMolaCapacidade,
  puxadorTamanho,
  setPuxadorTamanho,
  isEditing = false,
  isFromProductSelection = false,
}: FerragensFieldsProps) {
  // Se veio da seleção de produto (etapa 2), o modelo já está definido e não pode ser alterado
  const modelIsLocked = !isEditing && isFromProductSelection && !!model
  // Modelos disponíveis para FERRAGENS
  const FERRAGENS_MODELS = [
    { id: 'PUXADOR', name: 'Puxador' },
    { id: 'MOLA', name: 'Mola de Piso' },
    { id: 'DOBRADICA', name: 'Dobradiça' },
    { id: 'ROLDANA', name: 'Roldana' },
  ]

  const MOLA_CAPACIDADES = [
    { id: '60KG', name: '60kg' },
    { id: '80KG', name: '80kg' },
    { id: '100KG', name: '100kg' },
    { id: '120KG', name: '120kg' },
  ]

  const PUXADOR_TAMANHOS = [
    { id: '20CM', name: '20cm' },
    { id: '30CM', name: '30cm' },
    { id: '40CM', name: '40cm' },
    { id: '60CM', name: '60cm' },
    { id: '80CM', name: '80cm' },
    { id: '100CM', name: '100cm' },
  ]

  return (
    <div className="space-y-4">
      {/* Modelo de Ferragem - SEMPRE VISÍVEL */}
      <ConditionalField category={category} fieldName="model" currentValues={currentValues}>
        <div>
          <label className="text-theme-muted mb-1 block text-sm">
            Tipo de Ferragem <span className="text-red-500">*</span>
            {modelIsLocked && (
              <span className="ml-2 text-xs text-green-400">(Pré-selecionado da etapa 2)</span>
            )}
          </label>
          <Select value={model} onValueChange={setModel} disabled={modelIsLocked}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {FERRAGENS_MODELS.map((opt) => (
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

      {/* Capacidade da Mola - CONDICIONAL (só se model = MOLA) */}
      {model === 'MOLA' && setMolaCapacidade && (
        <ConditionalField
          category={category}
          fieldName="molaCapacidade"
          currentValues={currentValues}
        >
          <div>
            <label className="text-theme-muted mb-1 block text-sm">
              Capacidade da Mola <span className="text-red-500">*</span>
            </label>
            <Select value={molaCapacidade} onValueChange={setMolaCapacidade}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a capacidade" />
              </SelectTrigger>
              <SelectContent>
                {MOLA_CAPACIDADES.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </ConditionalField>
      )}

      {/* Tamanho do Puxador - CONDICIONAL (só se model = PUXADOR) */}
      {model === 'PUXADOR' && setPuxadorTamanho && (
        <ConditionalField
          category={category}
          fieldName="puxadorTamanho"
          currentValues={currentValues}
        >
          <div>
            <label className="text-theme-muted mb-1 block text-sm">
              Tamanho do Puxador <span className="text-red-500">*</span>
            </label>
            <Select value={puxadorTamanho} onValueChange={setPuxadorTamanho}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tamanho" />
              </SelectTrigger>
              <SelectContent>
                {PUXADOR_TAMANHOS.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </ConditionalField>
      )}

      {/* Aviso Visual: FERRAGENS NÃO TEM VIDRO */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <p className="text-sm text-blue-300">
          <strong>Nota:</strong> Ferragens são acessórios de hardware sem vidro. Apenas selecione o
          tipo, cor e quantidade.
        </p>
      </div>
    </div>
  )
}
