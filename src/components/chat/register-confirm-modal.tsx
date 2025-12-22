'use client'

/**
 * Register Confirmation Modal
 *
 * Displays a confirmation dialog when user tries to finalize quote
 * without being logged in. Offers to create an account using
 * the data collected during the chat conversation.
 */

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  UserPlus,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  X,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useToast } from '@/components/ui/toast/use-toast'

interface CustomerData {
  name?: string
  email?: string
  phone?: string
  cpfCnpj?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
  zipCode?: string
}

interface RegisterConfirmModalProps {
  isOpen: boolean
  customerData: CustomerData | null
  onConfirmRegister: (email: string, password: string) => Promise<void>
  onContinueAsGuest: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function RegisterConfirmModal({
  isOpen,
  customerData,
  onConfirmRegister,
  onContinueAsGuest,
  onCancel,
  isLoading = false,
}: RegisterConfirmModalProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState(customerData?.email || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({})

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string; confirmPassword?: string } = {}

    if (!email) {
      newErrors.email = 'Email e obrigatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email invalido'
    }

    if (!password) {
      newErrors.password = 'Senha e obrigatoria'
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter no minimo 6 caracteres'
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha'
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas nao conferem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    setIsRegistering(true)
    try {
      await onConfirmRegister(email, password)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Tente novamente'

      // Se for erro de email duplicado, mostra no campo de email
      if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('cadastrado')) {
        setErrors({ email: errorMessage })
      } else {
        toast({
          title: 'Erro ao criar conta',
          description: errorMessage,
          variant: 'error',
        })
      }
    } finally {
      setIsRegistering(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      // Salvar dados do cliente no localStorage para recuperar após login
      if (customerData) {
        localStorage.setItem('pendingQuoteCustomerData', JSON.stringify(customerData))
      }
      await signIn('google', { callbackUrl: window.location.href })
    } catch (error) {
      toast({
        title: 'Erro ao conectar com Google',
        description: 'Tente novamente',
        variant: 'error',
      })
      setIsGoogleLoading(false)
    }
  }

  const hasAddress =
    customerData?.street || customerData?.city || customerData?.state || customerData?.zipCode

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 mx-4 w-full max-w-md"
        >
          <Card className="bg-theme-secondary border-theme-default overflow-hidden">
            {/* Header */}
            <div className="border-theme-default from-accent-500/10 border-b bg-gradient-to-r to-purple-500/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <UserPlus className="h-6 w-6 text-accent-500" />
                    <h2 className="font-display text-xl font-bold text-white">Criar Conta?</h2>
                  </div>
                  <p className="text-theme-muted text-sm">
                    Crie uma conta para acompanhar seu orcamento e receber atualizacoes
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="text-theme-muted hover:text-theme-primary rounded-lg p-1 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-5 p-6">
              {/* Collected Data Summary */}
              {customerData && (customerData.name || customerData.phone) && (
                <div className="bg-theme-elevated border-theme-default rounded-lg border p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <CheckCircle2 className="h-4 w-4 text-accent-500" />
                    Dados coletados no chat
                  </h3>

                  <div className="space-y-2 text-sm">
                    {customerData.name && (
                      <div className="text-theme-muted flex items-center gap-2">
                        <User className="h-3.5 w-3.5" />
                        <span>{customerData.name}</span>
                      </div>
                    )}

                    {customerData.phone && (
                      <div className="text-theme-muted flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{customerData.phone}</span>
                      </div>
                    )}

                    {customerData.email && (
                      <div className="text-theme-muted flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{customerData.email}</span>
                      </div>
                    )}

                    {hasAddress && (
                      <div className="text-theme-muted flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                          {[
                            customerData.street,
                            customerData.number,
                            customerData.neighborhood,
                            customerData.city,
                            customerData.state,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Google Sign In - Opção rápida */}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isRegistering || isLoading}
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
                  )}
                  Continuar com Google
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="border-theme-default w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-theme-secondary text-theme-subtle px-2">ou crie uma conta</span>
                </div>
              </div>

              {/* Registration Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-white">
                    Email para login
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                      }}
                      placeholder="seu@email.com"
                      className="pl-10"
                      disabled={isRegistering || isLoading}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white">
                    Criar senha
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                      }}
                      placeholder="Minimo 6 caracteres"
                      className="pl-10 pr-10"
                      disabled={isRegistering || isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-white">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
                      }}
                      placeholder="Digite a senha novamente"
                      className="pl-10 pr-10"
                      disabled={isRegistering || isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-accent-500/10 rounded-lg p-3">
                <p className="text-xs text-accent-400">
                  <strong>Beneficios da conta:</strong> Acompanhe seus orcamentos, historico de
                  pedidos, e receba atualizacoes por email sobre o andamento do seu projeto.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-theme-default border-t p-6">
              <div className="flex flex-col gap-3">
                {/* Register Button */}
                <Button
                  onClick={handleRegister}
                  disabled={isRegistering || isLoading}
                  className="w-full bg-accent-500 font-medium text-neutral-900 hover:bg-accent-600"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar Conta e Continuar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Continue as Guest */}
                <Button
                  variant="outline"
                  onClick={onContinueAsGuest}
                  disabled={isRegistering || isLoading}
                  className="w-full"
                >
                  Continuar sem conta
                </Button>
              </div>

              <p className="text-theme-subtle mt-3 text-center text-xs">
                Ao criar uma conta, voce concorda com nossos termos de uso
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
