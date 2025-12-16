'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import { User, Mail, Phone, MapPin, Lock, Loader2, Save } from 'lucide-react'

export default function PerfilPage() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: session?.user?.phone || '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error('Failed to update profile')

      await update()

      toast({
        variant: 'success',
        title: 'Perfil atualizado',
        description: 'Suas informacoes foram salvas',
      })
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Nao foi possivel atualizar o perfil',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'As senhas nao coincidem',
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'A nova senha deve ter pelo menos 8 caracteres',
      })
      return
    }

    setIsChangingPassword(true)

    try {
      const res = await fetch('/api/users/me/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to change password')
      }

      toast({
        variant: 'success',
        title: 'Senha alterada',
        description: 'Sua senha foi atualizada com sucesso',
      })

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Nao foi possivel alterar a senha',
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div>
      <PortalHeader title="Meu Perfil" subtitle="Gerencie suas informacoes" />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Info */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-lg font-semibold text-white">
                Informacoes Pessoais
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-400">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  O email nao pode ser alterado
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(21) 99999-9999"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Alteracoes
              </Button>
            </form>
          </Card>

          {/* Address */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-lg font-semibold text-white">
                Endereco
              </h2>
            </div>

            <form className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-400">CEP</label>
                <Input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="mb-2 block text-sm text-neutral-400">Rua</label>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">Numero</label>
                  <Input
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">
                  Complemento
                </label>
                <Input
                  name="complement"
                  value={formData.complement}
                  onChange={handleChange}
                  placeholder="Apto, bloco, etc."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">Bairro</label>
                <Input
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">Cidade</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">Estado</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="RJ"
                  />
                </div>
              </div>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-6 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-lg font-semibold text-white">
                Alterar Senha
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Senha Atual
                  </label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Nova Senha
                  </label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>

              <Button type="submit" variant="outline" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Alterar Senha
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
