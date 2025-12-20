'use client'

import { Suspense, lazy, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuoteStore } from '@/store/quote-store'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { QuoteTimeoutChecker } from './quote-timeout-checker'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

// Dynamic imports for heavy step components (code splitting)
const StepLocation = lazy(() =>
  import('./steps/step-location').then((m) => ({ default: m.StepLocation }))
)
const StepCategory = lazy(() =>
  import('./steps/step-category').then((m) => ({ default: m.StepCategory }))
)
const StepProduct = lazy(() =>
  import('./steps/step-product').then((m) => ({ default: m.StepProduct }))
)
const StepDetails = lazy(() =>
  import('./steps/step-details').then((m) => ({ default: m.StepDetails }))
)
const StepItemReview = lazy(() =>
  import('./steps/step-item-review').then((m) => ({ default: m.StepItemReview }))
)
const StepCustomer = lazy(() =>
  import('./steps/step-customer').then((m) => ({ default: m.StepCustomer }))
)
const StepFinalSummary = lazy(() =>
  import('./steps/step-final-summary').then((m) => ({ default: m.StepFinalSummary }))
)
const StepSchedule = lazy(() =>
  import('./steps/step-schedule').then((m) => ({ default: m.StepSchedule }))
)

// Steps config - Step 0 (CEP) is shown separately, steps 1-7 shown in progress bar
const steps = [
  { number: 0, title: 'Localizacao', description: 'Seu CEP para calcular' },
  { number: 1, title: 'Categoria', description: 'Escolha o tipo de produto' },
  { number: 2, title: 'Produto', description: 'Selecione o modelo' },
  { number: 3, title: 'Detalhes', description: 'Informe os detalhes' },
  { number: 4, title: 'Carrinho', description: 'Revise seus itens' },
  { number: 5, title: 'Dados', description: 'Seus dados de contato' },
  { number: 6, title: 'Resumo', description: 'Confirme o orcamento' },
  { number: 7, title: 'Agendamento', description: 'Agende a visita' },
]

// Steps to display in progress bar (exclude step 0)
const progressSteps = steps.filter((s) => s.number > 0)

export function QuoteWizard() {
  const router = useRouter()
  const { step, items, reset, getCurrentProductToDetail } = useQuoteStore()
  const [showExitDialog, setShowExitDialog] = useState(false)

  // Get current product category to determine which details form to show
  const currentProduct = getCurrentProductToDetail()
  const currentCategory = currentProduct?.category

  // Para exibição, mostramos quantos itens tem no carrinho
  const cartCount = items.length

  const handleExit = () => {
    // Se houver itens no carrinho, mostra confirmação
    if (cartCount > 0) {
      setShowExitDialog(true)
    } else {
      // Se não houver itens, pode sair direto
      router.push('/')
    }
  }

  const confirmExit = () => {
    reset() // Limpa o store
    router.push('/') // Volta para home
  }

  return (
    <div className="bg-theme-primary min-h-screen pt-16 md:pt-20">
      {/* FQ.5.4: Timeout checker - limpa store após 30 min de inatividade */}
      <QuoteTimeoutChecker />

      {/* Exit Confirmation Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja sair do orçamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem {cartCount} {cartCount === 1 ? 'item' : 'itens'} no carrinho. Se sair agora,{' '}
              {cartCount === 1 ? 'ele' : 'eles'}{' '}
              {cartCount === 1 ? 'será perdido' : 'serão perdidos'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar orçamento</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-error hover:bg-error/90">
              Sair e descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Progress Steps - Only show for steps 1-7, not for step 0 */}
      {step > 0 && (
        <div className="border-theme-default bg-theme-secondary relative border-b">
          <div className="container mx-auto px-4 py-4 md:py-6">
            {/* Close Button - Mobile and Desktop */}
            <div className="absolute right-4 top-4 z-10 md:right-8 md:top-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExit}
                className="border-neutral-600 bg-neutral-800/50 text-neutral-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                aria-label="Fechar orçamento"
              >
                <X className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Fechar</span>
              </Button>
            </div>

            {/* Mobile: Show current step only */}
            <div className="flex items-center justify-center md:hidden">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium',
                    'border-accent-500 bg-accent-500 text-neutral-900'
                  )}
                >
                  {step}
                </div>
                <div>
                  <p className="text-theme-primary text-sm font-medium">
                    {progressSteps[step - 1]?.title}
                    {step === 4 && cartCount > 0 && ` (${cartCount})`}
                  </p>
                  <p className="text-theme-subtle text-xs">
                    Passo {step} de {progressSteps.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop: Show all steps (compact for 7 steps) */}
            <div className="hidden md:flex md:items-center md:justify-between">
              {progressSteps.map((s, index) => (
                <div
                  key={s.number}
                  className={cn('flex items-center', index < progressSteps.length - 1 && 'flex-1')}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all lg:h-10 lg:w-10 lg:text-sm',
                        step === s.number
                          ? 'border-accent-500 bg-accent-500 text-neutral-900'
                          : step > s.number
                            ? 'border-green-500 bg-green-500 text-white'
                            : 'border-neutral-600 bg-transparent text-neutral-400'
                      )}
                    >
                      {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                    </div>
                    <div className="mt-2 text-center">
                      <p
                        className={cn(
                          'text-xs font-medium lg:text-sm',
                          step >= s.number ? 'text-theme-primary' : 'text-theme-subtle'
                        )}
                      >
                        {s.title}
                        {s.number === 4 && cartCount > 0 && ` (${cartCount})`}
                      </p>
                      <p className="text-theme-subtle hidden text-xs lg:block">{s.description}</p>
                    </div>
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={cn(
                        'mx-2 h-0.5 flex-1 lg:mx-4',
                        step > s.number ? 'bg-green-500' : 'bg-neutral-700'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          {step === 0 && <StepLocation />}
          {step === 1 && <StepCategory />}
          {step === 2 && <StepProduct />}
          {step === 3 && <StepDetails />}
          {step === 4 && <StepItemReview />}
          {step === 5 && <StepCustomer />}
          {step === 6 && <StepFinalSummary />}
          {step === 7 && <StepSchedule />}
        </Suspense>
      </div>
    </div>
  )
}
