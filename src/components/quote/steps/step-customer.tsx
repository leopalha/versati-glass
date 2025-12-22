'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatPhone, formatCEP, formatCPFOrCNPJ, validateCPFOrCNPJ } from '@/lib/utils'
import {
  ArrowLeft,
  User,
  LogIn,
  UserPlus,
  CheckCircle2,
  MapPin,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { logger, getErrorMessage } from '@/lib/logger'
import { BUSINESS_RULES } from '@/lib/constants'
import { useToast } from '@/components/ui/toast/use-toast'

// Schema de validação para dados do cliente
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
      if (!val || val.length === 0) return true
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

// Estados do fluxo de autenticação
type AuthState =
  | 'idle' // Usuário não preencheu email ainda
  | 'checking' // Verificando se email existe
  | 'existing_user_needs_login' // Usuário existe, precisa logar
  | 'existing_google_user' // Usuário existe via Google
  | 'new_user_needs_register' // Usuário novo, mostrar campos de senha
  | 'registering' // Criando conta
  | 'logging_in' // Fazendo login
  | 'authenticated' // Já logado

export function StepCustomer() {
  const { data: session, status } = useSession()
  const { customerData, locationData, setCustomerData, nextStep, prevStep } = useQuoteStore()
  const { toast } = useToast()

  // Estado de autenticação
  const [authState, setAuthState] = useState<AuthState>('idle')
  const [emailChecked, setEmailChecked] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
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

  const email = watch('email')
  const zipCode = watch('zipCode')

  // Verifica se usuário já está logado
  useEffect(() => {
    if (session?.user) {
      setAuthState('authenticated')
      // Preencher dados do usuário logado
      setValue('name', session.user.name || '')
      setValue('email', session.user.email || '')
      if (session.user.phone) {
        setValue('phone', formatPhone(session.user.phone))
      }
    }
  }, [session, setValue])

  // Pre-fill from AI chat customerData
  useEffect(() => {
    if (customerData) {
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

  // Auto-fill address from CEP
  useEffect(() => {
    if (locationData?.zipCode === zipCode?.replace(/\D/g, '')) return

    const fetchAddress = async () => {
      const cleanCep = zipCode?.replace(/\D/g, '')
      if (cleanCep?.length === 8) {
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
            logger.error('[CUSTOMER] Error fetching address:', { error: getErrorMessage(error) })
          }
        }
      }
    }

    fetchAddress()
  }, [zipCode, setValue, locationData])

  // Verificar email quando usuário sair do campo
  const checkEmail = useCallback(async () => {
    if (!email || emailChecked === email || authState === 'authenticated') return

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return

    setAuthState('checking')
    setEmailChecked(email)

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.exists) {
        if (data.isGoogleUser && !data.hasPassword) {
          setAuthState('existing_google_user')
        } else {
          setAuthState('existing_user_needs_login')
        }

        // Auto-fill user data if available
        if (data.user) {
          if (data.user.name) setValue('name', data.user.name)
          if (data.user.phone) setValue('phone', formatPhone(data.user.phone))
          if (data.user.cpfCnpj) setValue('cpfCnpj', formatCPFOrCNPJ(data.user.cpfCnpj))
          if (data.user.street) setValue('street', data.user.street)
          if (data.user.number) setValue('number', data.user.number)
          if (data.user.complement) setValue('complement', data.user.complement || '')
          if (data.user.neighborhood) setValue('neighborhood', data.user.neighborhood)
          if (data.user.city) setValue('city', data.user.city)
          if (data.user.state) setValue('state', data.user.state)
          if (data.user.zipCode) setValue('zipCode', formatCEP(data.user.zipCode))
        }
      } else {
        setAuthState('new_user_needs_register')
      }
    } catch (error) {
      logger.error('[CUSTOMER] Error checking email:', { error: getErrorMessage(error) })
      setAuthState('new_user_needs_register')
    }
  }, [email, emailChecked, authState, setValue])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('phone', formatPhone(e.target.value))
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('zipCode', formatCEP(e.target.value))
  }

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('cpfCnpj', formatCPFOrCNPJ(e.target.value))
  }

  // Validar senha
  const validatePassword = (): boolean => {
    if (password.length < 6) {
      setPasswordError('Senha deve ter no minimo 6 caracteres')
      return false
    }
    if (password !== confirmPassword) {
      setPasswordError('As senhas não conferem')
      return false
    }
    setPasswordError(null)
    return true
  }

  // Handler para login com credenciais
  const handleLogin = async () => {
    if (!password) {
      setPasswordError('Digite sua senha')
      return
    }

    setIsSubmitting(true)
    setAuthState('logging_in')

    try {
      const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      })

      if (result?.error) {
        setPasswordError('Senha incorreta')
        setAuthState('existing_user_needs_login')
      } else if (result?.ok) {
        setAuthState('authenticated')
        toast({
          variant: 'success',
          title: 'Login realizado!',
          description: 'Seus dados foram carregados automaticamente.',
        })
      }
    } catch (error) {
      logger.error('[CUSTOMER] Login error:', { error: getErrorMessage(error) })
      setPasswordError('Erro ao fazer login')
      setAuthState('existing_user_needs_login')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para cadastro rápido
  const handleRegister = async (formData: CustomerFormData) => {
    if (!validatePassword()) return

    setIsSubmitting(true)
    setAuthState('registering')

    try {
      // Criar conta via quick-register
      const registerResponse = await fetch('/api/auth/quick-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password,
        }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        toast({
          variant: 'error',
          title: 'Erro ao criar conta',
          description: registerData.error || 'Tente novamente',
        })
        setAuthState('new_user_needs_register')
        setIsSubmitting(false)
        return
      }

      // Auto-login após cadastro
      const loginResult = await signIn('credentials', {
        email: formData.email,
        password: password,
        redirect: false,
      })

      if (loginResult?.ok) {
        setAuthState('authenticated')
        toast({
          variant: 'success',
          title: 'Conta criada!',
          description: 'Agora você pode acompanhar seu orçamento no portal.',
        })

        // Salvar dados e avançar
        setCustomerData(formData)
        nextStep()
      } else {
        // Se login falhar, ainda assim avançar (conta foi criada)
        toast({
          variant: 'success',
          title: 'Conta criada!',
          description: 'Faça login para acompanhar seu orçamento.',
        })
        setCustomerData(formData)
        nextStep()
      }
    } catch (error) {
      logger.error('[CUSTOMER] Register error:', { error: getErrorMessage(error) })
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Erro ao criar conta. Tente novamente.',
      })
      setAuthState('new_user_needs_register')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handler para login via Google
  const handleGoogleLogin = () => {
    // Salvar dados do formulário antes de redirecionar
    const formData = getValues()
    localStorage.setItem('pendingQuoteCustomerData', JSON.stringify(formData))
    signIn('google', { callbackUrl: '/orcamento' })
  }

  // Recuperar dados após login Google
  useEffect(() => {
    if (session?.user && authState !== 'authenticated') {
      const savedData = localStorage.getItem('pendingQuoteCustomerData')
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData) as CustomerFormData
          localStorage.removeItem('pendingQuoteCustomerData')
          setCustomerData(parsedData)
          nextStep()
        } catch (e) {
          logger.error('[StepCustomer] Error parsing saved data:', e)
          localStorage.removeItem('pendingQuoteCustomerData')
        }
      }
    }
  }, [session, authState, setCustomerData, nextStep])

  const onSubmit = (data: CustomerFormData) => {
    // Se já está autenticado, só avançar
    if (authState === 'authenticated' || session?.user) {
      setCustomerData(data)
      nextStep()
      return
    }

    // Se é novo usuário, criar conta
    if (authState === 'new_user_needs_register') {
      handleRegister(data)
      return
    }

    // Se usuário existe mas não está logado, precisa logar primeiro
    if (authState === 'existing_user_needs_login' || authState === 'existing_google_user') {
      // Se tem senha, mostrar campo
      if (!password && authState === 'existing_user_needs_login') {
        setPasswordError('Digite sua senha para continuar')
        return
      }

      // Se é usuário Google, redirecionar para login Google
      if (authState === 'existing_google_user') {
        handleGoogleLogin()
        return
      }

      handleLogin()
      return
    }

    // Verificar email se ainda não foi verificado
    if (authState === 'idle') {
      checkEmail()
      return
    }
  }

  const isLoading = status === 'loading' || isSubmitting

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-theme-primary font-display text-3xl font-bold">Seus dados</h2>
        <p className="text-theme-muted mt-2">
          Preencha seus dados de contato e endereco para instalacao
        </p>
      </div>

      {/* Status de autenticação */}
      {authState === 'authenticated' && session?.user && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-500/10 p-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-sm font-medium text-green-400">Logado como {session.user.name}</p>
            <p className="text-theme-muted text-xs">Seus dados foram preenchidos automaticamente</p>
          </div>
        </div>
      )}

      {/* Aviso para usuário existente */}
      {authState === 'existing_user_needs_login' && (
        <Card className="border-accent-500/30 bg-accent-500/5 mb-6 p-4">
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Bem-vindo de volta!</p>
              <p className="text-theme-muted text-xs">
                Este email já está cadastrado. Digite sua senha para continuar e acessar seu
                histórico.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Aviso para usuário Google */}
      {authState === 'existing_google_user' && (
        <Card className="border-accent-500/30 bg-accent-500/5 mb-6 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <User className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500" />
              <div>
                <p className="text-sm font-medium text-white">Conta Google encontrada!</p>
                <p className="text-theme-muted text-xs">
                  Este email está vinculado a uma conta Google. Clique para entrar.
                </p>
              </div>
            </div>
            <Button type="button" size="sm" onClick={handleGoogleLogin}>
              <svg className="mr-1.5 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </Button>
          </div>
        </Card>
      )}

      {/* Aviso para novo usuário */}
      {authState === 'new_user_needs_register' && (
        <Card className="mb-6 border-blue-500/30 bg-blue-500/5 p-4">
          <div className="flex items-start gap-3">
            <UserPlus className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-white">Crie sua conta</p>
              <p className="text-theme-muted text-xs">
                Cadastre uma senha para acompanhar o status do seu orçamento pelo portal.
              </p>
            </div>
          </div>
        </Card>
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
                  onBlur={checkEmail}
                  disabled={authState === 'authenticated'}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error" role="alert">
                    {errors.email.message}
                  </p>
                )}
                {authState === 'checking' && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-accent-400">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Verificando email...
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

            {/* Campos de senha - apenas se necessário */}
            {(authState === 'existing_user_needs_login' ||
              authState === 'new_user_needs_register') && (
              <div className="space-y-4 rounded-lg border border-neutral-700 bg-neutral-800/50 p-4">
                <h4 className="flex items-center gap-2 text-sm font-medium text-white">
                  {authState === 'existing_user_needs_login' ? (
                    <>
                      <LogIn className="h-4 w-4 text-accent-500" />
                      Digite sua senha
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 text-blue-400" />
                      Crie uma senha
                    </>
                  )}
                </h4>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <label htmlFor="password" className="text-theme-muted mb-1 block text-sm">
                      Senha *
                    </label>
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordError(null)
                      }}
                      placeholder={
                        authState === 'existing_user_needs_login'
                          ? 'Sua senha'
                          : 'Mínimo 6 caracteres'
                      }
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="hover:text-theme-primary absolute right-3 top-[38px] -translate-y-1/2 text-neutral-600"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {authState === 'new_user_needs_register' && (
                    <div className="relative">
                      <label
                        htmlFor="confirmPassword"
                        className="text-theme-muted mb-1 block text-sm"
                      >
                        Confirmar senha *
                      </label>
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setPasswordError(null)
                        }}
                        placeholder="Repita a senha"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="hover:text-theme-primary absolute right-3 top-[38px] -translate-y-1/2 text-neutral-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {passwordError && (
                  <p className="flex items-center gap-1 text-sm text-error">
                    <AlertCircle className="h-4 w-4" />
                    {passwordError}
                  </p>
                )}

                {authState === 'existing_user_needs_login' && (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-xs text-accent-400 hover:text-accent-300"
                      onClick={() => (window.location.href = '/recuperar-senha')}
                    >
                      Esqueceu a senha?
                    </button>
                    <button
                      type="button"
                      className="text-xs text-neutral-400 hover:text-neutral-300"
                      onClick={handleGoogleLogin}
                    >
                      Ou entre com Google
                    </button>
                  </div>
                )}
              </div>
            )}
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
            <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {authState === 'registering'
                    ? 'Criando conta...'
                    : authState === 'logging_in'
                      ? 'Entrando...'
                      : 'Aguarde...'}
                </>
              ) : authState === 'new_user_needs_register' ? (
                'Criar conta e continuar'
              ) : authState === 'existing_user_needs_login' ? (
                'Entrar e continuar'
              ) : (
                'Continuar'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
