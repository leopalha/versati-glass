'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPhone, formatCEP, formatCPFOrCNPJ, validateCPFOrCNPJ } from '@/lib/utils'
import { ArrowLeft, User, LogIn, UserPlus, CheckCircle2, MapPin } from 'lucide-react'
import { logger, getErrorMessage } from '@/lib/logger'
import { BUSINESS_RULES } from '@/lib/constants'
import Link from 'next/link'

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
  const { data: session, status } = useSession()
  const { customerData, locationData, setCustomerData, nextStep, prevStep } = useQuoteStore()
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

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
      street: locationData?.street || '',
      number: '',
      complement: '',
      neighborhood: locationData?.neighborhood || '',
      city: locationData?.city || '',
      state: locationData?.state || '',
      zipCode: locationData?.zipCode || '',
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

  // Pre-fill from AI chat customerData (may have partial data like name/phone only)
  useEffect(() => {
    if (customerData) {
      // Preenche campos que vieram do chat AI
      if (customerData.name) setValue('name', customerData.name)
      if (customerData.email) setValue('email', customerData.email)
      if (customerData.phone) setValue('phone', formatPhone(customerData.phone))
      if (customerData.cpfCnpj) setValue('cpfCnpj', formatCPFOrCNPJ(customerData.cpfCnpj))
      if (customerData.street) setValue('street', customerData.street)
      if (customerData.number) setValue('number', customerData.number)
      if (customerData.complement) setValue('complement', customerData.complement)
      if (customerData.neighborhood) setValue('neighborhood', customerData.neighborhood)
      if (customerData.city) setValue('city', customerData.city)
      if (customerData.state) setValue('state', customerData.state)
      if (customerData.zipCode) setValue('zipCode', customerData.zipCode)

      logger.debug('[StepCustomer] Pre-filled from AI chat:', customerData)
    }
  }, [customerData, setValue])

  // Pre-fill from locationData (Step 0)
  useEffect(() => {
    if (locationData && !customerData) {
      if (locationData.zipCode) setValue('zipCode', locationData.zipCode)
      if (locationData.street) setValue('street', locationData.street)
      if (locationData.neighborhood) setValue('neighborhood', locationData.neighborhood)
      if (locationData.city) setValue('city', locationData.city)
      if (locationData.state) setValue('state', locationData.state)
    }
  }, [locationData, customerData, setValue])

  const zipCode = watch('zipCode')

  // Auto-fill address from CEP (only if not pre-filled from locationData)
  // Uses ViaCEP as primary, BrasilAPI as fallback
  useEffect(() => {
    // Skip if we already have location data and CEP matches
    if (locationData?.zipCode === zipCode?.replace(/\D/g, '')) return

    const fetchAddress = async () => {
      const cleanCep = zipCode?.replace(/\D/g, '')
      if (cleanCep?.length === 8) {
        // Try ViaCEP first
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
            signal: AbortSignal.timeout(5000),
          })

          if (response.ok) {
            const data = await response.json()
            if (!data.erro) {
              setValue('street', data.logradouro || '')
              setValue('neighborhood', data.bairro || '')
              setValue('city', data.localidade || '')
              setValue('state', data.uf || '')
              return
            }
          }
        } catch {
          // ViaCEP failed, try fallback
        }

        // Fallback: BrasilAPI
        try {
          const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanCep}`, {
            signal: AbortSignal.timeout(5000),
          })

          if (response.ok) {
            const data = await response.json()
            setValue('street', data.street || '')
            setValue('neighborhood', data.neighborhood || '')
            setValue('city', data.city || '')
            setValue('state', data.state || '')
          }
        } catch (error) {
          const errorMsg = getErrorMessage(error)
          logger.error('[CUSTOMER] Error fetching address:', {
            error: errorMsg,
            zipCode,
          })
        }
      }
    }

    fetchAddress()
  }, [zipCode, setValue, locationData])

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

  // Handle login redirect
  const handleLogin = () => {
    // Save current URL to return after login
    signIn(undefined, { callbackUrl: '/orcamento' })
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">Seus dados</h2>
        <p className="text-theme-muted mt-2">
          Preencha seus dados de contato e endereco para instalacao
        </p>
      </div>

      {/* Login/Register Prompt for non-logged users */}
      {status !== 'loading' && !session?.user && (
        <Card className="border-accent-500/30 bg-accent-500/5 mb-6 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500" />
              <div>
                <p className="text-sm font-medium text-white">Ja tem conta?</p>
                <p className="text-theme-muted text-xs">
                  Entre para preencher automaticamente e acompanhar seus orcamentos
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="flex-1 sm:flex-none"
              >
                <LogIn className="mr-1.5 h-4 w-4" />
                Entrar
              </Button>
              <Link href="/registro?redirect=/orcamento" className="flex-1 sm:flex-none">
                <Button type="button" size="sm" className="w-full">
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Criar conta
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      {/* Logged in indicator */}
      {session?.user && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-green-400">Logado como {session.user.name}</p>
            <p className="text-theme-muted text-xs">Seus dados foram preenchidos automaticamente</p>
          </div>
        </div>
      )}

      {/* Location info from Step 0 */}
      {locationData && (
        <div className="bg-accent-500/10 mb-6 flex items-center gap-3 rounded-lg p-4">
          <MapPin className="h-5 w-5 text-accent-500" />
          <div>
            <p className="text-sm font-medium text-accent-400">Regiao: {locationData.regionName}</p>
            <p className="text-theme-muted text-xs">
              Endereco pre-preenchido do CEP {locationData.zipCode}
              {locationData.priceMultiplier > 1 && (
                <span className="ml-1 text-yellow-400">
                  (+{Math.round((locationData.priceMultiplier - 1) * 100)}% ajuste regional)
                </span>
              )}
            </p>
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

      {/* Info about account creation */}
      {!session?.user && (
        <p className="text-theme-subtle mt-4 text-center text-xs">
          Ao continuar, uma conta sera criada automaticamente para voce acompanhar seu orcamento.
          Voce recebera um email com os dados de acesso.
        </p>
      )}
    </div>
  )
}
