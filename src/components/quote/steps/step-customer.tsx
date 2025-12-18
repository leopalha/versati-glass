'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPhone, formatCEP, formatCPFOrCNPJ, validateCPFOrCNPJ } from '@/lib/utils'
import { ArrowLeft, User } from 'lucide-react'
import { logger, getErrorMessage } from '@/lib/logger'
import { BUSINESS_RULES } from '@/lib/constants'

// FQ.4.4: Schema de validação robusto para dados do cliente
const customerSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter no minimo 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string().email('Email invalido').max(100, 'Email muito longo'),
  phone: z
    .string()
    .regex(BUSINESS_RULES.phoneRegex, 'Telefone invalido (formato: (XX) XXXXX-XXXX)'),
  cpfCnpj: z
    .string()
    .optional()
    .refine((val) => {
      // Se vazio, aceitar (campo opcional)
      if (!val || val.length === 0) return true
      // Validar CPF ou CNPJ com algoritmo de digitos verificadores
      return validateCPFOrCNPJ(val)
    }, 'CPF ou CNPJ invalido'),
  street: z.string().min(1, 'Endereco obrigatorio').max(200, 'Endereco muito longo'),
  number: z.string().min(1, 'Numero obrigatorio').max(10, 'Numero muito longo'),
  complement: z.string().max(100, 'Complemento muito longo').optional(),
  neighborhood: z.string().min(1, 'Bairro obrigatorio').max(100, 'Bairro muito longo'),
  city: z.string().min(1, 'Cidade obrigatoria').max(100, 'Cidade muito longa'),
  state: z
    .string()
    .length(2, 'Estado deve ter 2 letras (ex: RJ)')
    .regex(/^[A-Z]{2}$/, 'Estado invalido (use sigla: RJ, SP, MG, etc)'),
  zipCode: z.string().min(9, 'CEP invalido (formato: XXXXX-XXX)').max(9, 'CEP invalido'),
})

type CustomerFormData = z.infer<typeof customerSchema>

export function StepCustomer() {
  const { data: session } = useSession()
  const { customerData, setCustomerData, nextStep, prevStep } = useQuoteStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: customerData || {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      phone: '',
      cpfCnpj: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  })

  // Pre-fill from session if available
  useEffect(() => {
    if (session?.user && !customerData) {
      setValue('name', session.user.name || '')
      setValue('email', session.user.email || '')
      if (session.user.phone) {
        setValue('phone', formatPhone(session.user.phone))
      }
    }
  }, [session, customerData, setValue])

  const zipCode = watch('zipCode')

  // Auto-fill address from CEP
  useEffect(() => {
    const fetchAddress = async () => {
      const cleanCep = zipCode?.replace(/\D/g, '')
      if (cleanCep?.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
          const data = await response.json()

          if (!data.erro) {
            setValue('street', data.logradouro || '')
            setValue('neighborhood', data.bairro || '')
            setValue('city', data.localidade || '')
            setValue('state', data.uf || '')
          }
        } catch (error) {
          // ARCH-P1-2: Standardized error handling
          const errorMsg = getErrorMessage(error)
          logger.error('[CUSTOMER] Error fetching address from ViaCEP:', {
            error: errorMsg,
            zipCode,
          })
        }
      }
    }

    fetchAddress()
  }, [zipCode, setValue])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setValue('phone', formatted)
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value)
    setValue('zipCode', formatted)
  }

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPFOrCNPJ(e.target.value)
    setValue('cpfCnpj', formatted)
  }

  const onSubmit = (data: CustomerFormData) => {
    setCustomerData(data)
    nextStep()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">Seus dados</h2>
        <p className="text-theme-muted mt-2">
          Preencha seus dados de contato e endereco para instalacao
        </p>
      </div>

      {session?.user && (
        <div className="bg-accent-500/10 mb-6 flex items-center gap-3 rounded-lg p-4">
          <User className="h-5 w-5 text-accent-400" />
          <div>
            <p className="text-sm text-accent-400">Logado como {session.user.name}</p>
            <p className="text-theme-muted text-xs">Seus dados foram preenchidos automaticamente</p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-theme-primary text-lg font-semibold">Dados pessoais</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-theme-muted mb-1 block text-sm">
                  Nome completo *
                </label>
                <Input id="name" aria-label="Nome" {...register('name')} placeholder="Seu nome" />
                {errors.name && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="cpfCnpj" className="text-theme-muted mb-1 block text-sm">
                  CPF/CNPJ
                </label>
                <Input
                  id="cpfCnpj"
                  aria-label="CPF ou CNPJ"
                  {...register('cpfCnpj')}
                  onChange={handleCpfCnpjChange}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                />
                {errors.cpfCnpj && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.cpfCnpj.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="text-theme-muted mb-1 block text-sm">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  aria-label="Email"
                  {...register('email')}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="text-theme-muted mb-1 block text-sm">
                  Telefone *
                </label>
                <Input
                  id="phone"
                  aria-label="Telefone"
                  {...register('phone')}
                  onChange={handlePhoneChange}
                  placeholder="(21) 98765-4321"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-theme-primary text-lg font-semibold">Endereco para instalacao</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="zipCode" className="text-theme-muted mb-1 block text-sm">
                  CEP *
                </label>
                <Input
                  id="zipCode"
                  aria-label="CEP"
                  {...register('zipCode')}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.zipCode.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="street" className="text-theme-muted mb-1 block text-sm">
                  Rua *
                </label>
                <Input
                  id="street"
                  aria-label="Rua"
                  {...register('street')}
                  placeholder="Nome da rua"
                />
                {errors.street && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.street.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="number" className="text-theme-muted mb-1 block text-sm">
                  Numero *
                </label>
                <Input id="number" aria-label="Número" {...register('number')} placeholder="123" />
                {errors.number && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.number.message}
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="complement" className="text-theme-muted mb-1 block text-sm">
                  Complemento
                </label>
                <Input
                  id="complement"
                  aria-label="Complemento"
                  {...register('complement')}
                  placeholder="Apto, bloco..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="neighborhood" className="text-theme-muted mb-1 block text-sm">
                  Bairro *
                </label>
                <Input
                  id="neighborhood"
                  aria-label="Bairro"
                  {...register('neighborhood')}
                  placeholder="Bairro"
                />
                {errors.neighborhood && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.neighborhood.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="text-theme-muted mb-1 block text-sm">
                  Cidade *
                </label>
                <Input id="city" aria-label="Cidade" {...register('city')} placeholder="Cidade" />
                {errors.city && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="text-theme-muted mb-1 block text-sm">
                  Estado *
                </label>
                <Input
                  id="state"
                  aria-label="Estado"
                  {...register('state')}
                  placeholder="UF"
                  maxLength={2}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={prevStep}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit">Continuar</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
