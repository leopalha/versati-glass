'use client'

import { useQuoteStore } from '@/store/quote-store'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { StepCategory } from './steps/step-category'
import { StepProduct } from './steps/step-product'
import { StepMeasurements } from './steps/step-measurements'
import { StepCustomer } from './steps/step-customer'
import { StepSummary } from './steps/step-summary'
import { StepSchedule } from './steps/step-schedule'

const steps = [
  { number: 1, title: 'Categoria', description: 'Escolha o tipo de produto' },
  { number: 2, title: 'Produto', description: 'Selecione o modelo' },
  { number: 3, title: 'Medidas', description: 'Informe as dimensoes' },
  { number: 4, title: 'Dados', description: 'Seus dados de contato' },
  { number: 5, title: 'Resumo', description: 'Revise seu orcamento' },
  { number: 6, title: 'Agendamento', description: 'Agende a visita' },
]

export function QuoteWizard() {
  const { step } = useQuoteStore()

  return (
    <div className="bg-theme-primary min-h-screen">
      {/* Progress Steps */}
      <div className="border-theme-default bg-theme-secondary border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div
                key={s.number}
                className={cn('flex items-center', index < steps.length - 1 && 'flex-1')}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-all',
                      step === s.number
                        ? 'border-accent-500 bg-accent-500 text-neutral-900'
                        : step > s.number
                          ? 'border-green-500 bg-green-500 text-white'
                          : 'border-neutral-600 bg-transparent text-neutral-400'
                    )}
                  >
                    {step > s.number ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <div className="mt-2 hidden text-center md:block">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        step >= s.number ? 'text-theme-primary' : 'text-theme-subtle'
                      )}
                    >
                      {s.title}
                    </p>
                    <p className="text-theme-subtle text-xs">{s.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'mx-4 h-0.5 flex-1',
                      step > s.number ? 'bg-green-500' : 'border-theme-default'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="container mx-auto px-4 py-8">
        {step === 1 && <StepCategory />}
        {step === 2 && <StepProduct />}
        {step === 3 && <StepMeasurements />}
        {step === 4 && <StepCustomer />}
        {step === 5 && <StepSummary />}
        {step === 6 && <StepSchedule />}
      </div>
    </div>
  )
}
