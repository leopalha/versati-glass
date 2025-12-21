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
  SERVICE_TYPES,
  SERVICE_URGENCY,
  GLASS_TYPES,
  GLASS_THICKNESSES,
} from '@/lib/catalog-options'

interface ServicosFieldsProps {
  category: string
  currentValues: Record<string, any>
  // Estados
  model: string
  setModel: (value: string) => void
  serviceUrgency: string
  setServiceUrgency: (value: string) => void
  // Campos condicionais (só para TROCA_VIDRO)
  glassType?: string
  setGlassType?: (value: string) => void
  thickness?: string
  setThickness?: (value: string) => void
  // Controle de edição
  isEditing?: boolean
  isFromProductSelection?: boolean
}

/**
 * Campos específicos para categoria SERVICOS
 *
 * CRÍTICO: SERVICOS NÃO tem dimensões width/height por padrão
 * Exceção: Se model = TROCA_VIDRO, então precisa especificar vidro
 *
 * Campos base (todos os serviços):
 * - Tipo de Serviço (model)
 * - Urgência
 *
 * Campos condicionais (APENAS se TROCA_VIDRO):
 * - Tipo de Vidro
 * - Espessura
 */
export function ServicosFields({
  category,
  currentValues,
  model,
  setModel,
  serviceUrgency,
  setServiceUrgency,
  glassType,
  setGlassType,
  thickness,
  setThickness,
  isEditing = false,
  isFromProductSelection = false,
}: ServicosFieldsProps) {
  // Se veio da seleção de produto (etapa 2), o modelo já está definido e não pode ser alterado
  const modelIsLocked = !isEditing && isFromProductSelection && !!model
  const isGlassReplacement = model === 'TROCA_VIDRO'

  return (
    <div className="space-y-4">
      {/* Tipo de Serviço - SEMPRE VISÍVEL */}
      <ConditionalField category={category} fieldName="model" currentValues={currentValues}>
        <div>
          <label className="text-theme-muted mb-1 block text-sm">
            Tipo de Serviço <span className="text-red-500">*</span>
            {modelIsLocked && (
              <span className="ml-2 text-xs text-green-400">(Pré-selecionado da etapa 2)</span>
            )}
          </label>
          <Select value={model} onValueChange={setModel} disabled={modelIsLocked}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o serviço" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConditionalField>

      {/* Urgência - SEMPRE VISÍVEL */}
      <ConditionalField
        category={category}
        fieldName="serviceUrgency"
        currentValues={currentValues}
      >
        <div>
          <label className="text-theme-muted mb-1 block text-sm">
            Urgência <span className="text-red-500">*</span>
          </label>
          <Select value={serviceUrgency} onValueChange={setServiceUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a urgência" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_URGENCY.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.name} - {opt.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConditionalField>

      {/* CONDICIONAL: Campos de vidro APENAS se TROCA_VIDRO */}
      {isGlassReplacement && (
        <>
          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <p className="text-sm text-yellow-300">
              <strong>Troca de Vidro:</strong> Especifique o tipo e espessura do vidro a ser
              instalado.
            </p>
          </div>

          {/* Tipo de Vidro - CONDICIONAL */}
          {setGlassType && (
            <ConditionalField
              category={category}
              fieldName="glassType"
              currentValues={currentValues}
            >
              <div>
                <label className="text-theme-muted mb-1 block text-sm">
                  Tipo de Vidro <span className="text-red-500">*</span>
                </label>
                <Select value={glassType} onValueChange={setGlassType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de vidro" />
                  </SelectTrigger>
                  <SelectContent>
                    {GLASS_TYPES.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </ConditionalField>
          )}

          {/* Espessura - CONDICIONAL */}
          {setThickness && (
            <ConditionalField
              category={category}
              fieldName="thickness"
              currentValues={currentValues}
            >
              <div>
                <label className="text-theme-muted mb-1 block text-sm">
                  Espessura <span className="text-red-500">*</span>
                </label>
                <Select value={thickness} onValueChange={setThickness}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a espessura" />
                  </SelectTrigger>
                  <SelectContent>
                    {GLASS_THICKNESSES.map((opt) => (
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

      {/* Aviso Visual para outros serviços */}
      {!isGlassReplacement && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <p className="text-sm text-green-300">
            <strong>Serviço sem especificação de vidro:</strong> Este serviço não requer seleção de
            materiais. Apenas descreva o trabalho no campo de observações.
          </p>
        </div>
      )}
    </div>
  )
}
