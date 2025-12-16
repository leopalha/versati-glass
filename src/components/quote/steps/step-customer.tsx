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
import { formatPhone, formatCEP } from '@/lib/utils'
import { ArrowLeft, User } from 'lucide-react'

const customerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no minimo 2 caracteres'),
  email: z.string().email('Email invalido'),
  phone: z.string().min(14, 'Telefone invalido'),
  cpfCnpj: z.string().optional(),
  street: z.string().min(1, 'Endereco obrigatorio'),
  number: z.string().min(1, 'Numero obrigatorio'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro obrigatorio'),
  city: z.string().min(1, 'Cidade obrigatoria'),
  state: z.string().min(2, 'Estado obrigatorio'),
  zipCode: z.string().min(9, 'CEP invalido'),
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
          const response = await fetch(
            `https://viacep.com.br/ws/${cleanCep}/json/`
          )
          const data = await response.json()

          if (!data.erro) {
            setValue('street', data.logradouro || '')
            setValue('neighborhood', data.bairro || '')
            setValue('city', data.localidade || '')
            setValue('state', data.uf || '')
          }
        } catch {
          console.error('Error fetching address')
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

  const onSubmit = (data: CustomerFormData) => {
    setCustomerData(data)
    nextStep()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-white">
          Seus dados
        </h2>
        <p className="mt-2 text-neutral-400">
          Preencha seus dados de contato e endereco para instalacao
        </p>
      </div>

      {session?.user && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-gold-500/10 p-4">
          <User className="h-5 w-5 text-gold-400" />
          <div>
            <p className="text-sm text-gold-400">
              Logado como {session.user.name}
            </p>
            <p className="text-xs text-neutral-400">
              Seus dados foram preenchidos automaticamente
            </p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Dados pessoais
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Nome completo *
                </label>
                <Input {...register('name')} placeholder="Seu nome" />
                {errors.name && (
                  <p className="mt-1 text-sm text-error">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  CPF/CNPJ
                </label>
                <Input {...register('cpfCnpj')} placeholder="Opcional" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Email *
                </label>
                <Input
                  type="email"
                  {...register('email')}
                  placeholder="seu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Telefone *
                </label>
                <Input
                  {...register('phone')}
                  onChange={handlePhoneChange}
                  placeholder="(21) 98765-4321"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-error">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Endereco para instalacao
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  CEP *
                </label>
                <Input
                  {...register('zipCode')}
                  onChange={handleCepChange}
                  placeholder="00000-000"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-error">{errors.zipCode.message}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm text-neutral-400">
                  Rua *
                </label>
                <Input {...register('street')} placeholder="Nome da rua" />
                {errors.street && (
                  <p className="mt-1 text-sm text-error">{errors.street.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Numero *
                </label>
                <Input {...register('number')} placeholder="123" />
                {errors.number && (
                  <p className="mt-1 text-sm text-error">{errors.number.message}</p>
                )}
              </div>

              <div className="sm:col-span-3">
                <label className="mb-1 block text-sm text-neutral-400">
                  Complemento
                </label>
                <Input {...register('complement')} placeholder="Apto, bloco..." />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Bairro *
                </label>
                <Input {...register('neighborhood')} placeholder="Bairro" />
                {errors.neighborhood && (
                  <p className="mt-1 text-sm text-error">
                    {errors.neighborhood.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Cidade *
                </label>
                <Input {...register('city')} placeholder="Cidade" />
                {errors.city && (
                  <p className="mt-1 text-sm text-error">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm text-neutral-400">
                  Estado *
                </label>
                <Input {...register('state')} placeholder="UF" maxLength={2} />
                {errors.state && (
                  <p className="mt-1 text-sm text-error">{errors.state.message}</p>
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
