'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { PortalHeader } from '@/components/portal/portal-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Loader2,
  Save,
  Trash2,
  AlertTriangle,
  FileText,
} from 'lucide-react'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string | null
  cpfCnpj: string | null
  street: string | null
  number: string | null
  complement: string | null
  neighborhood: string | null
  city: string | null
  state: string | null
  zipCode: string | null
}

export default function PerfilPage() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deletePassword, setDeletePassword] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpfCnpj: '',
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

  // Load user profile from API
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/users/me')
        if (res.ok) {
          const data: UserProfile = await res.json()
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            cpfCnpj: data.cpfCnpj || '',
            street: data.street || '',
            number: data.number || '',
            complement: data.complement || '',
            neighborhood: data.neighborhood || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zipCode || '',
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    if (session?.user) {
      loadProfile()
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Format CPF/CNPJ
    if (name === 'cpfCnpj') {
      const numbers = value.replace(/\D/g, '')
      let formatted = numbers
      if (numbers.length <= 11) {
        // CPF: 000.000.000-00
        formatted = numbers
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      } else {
        // CNPJ: 00.000.000/0000-00
        formatted = numbers
          .replace(/(\d{2})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1/$2')
          .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
      }
      setFormData((prev) => ({ ...prev, cpfCnpj: formatted }))
      return
    }

    // Format phone
    if (name === 'phone') {
      const numbers = value.replace(/\D/g, '')
      let formatted = numbers
      if (numbers.length <= 10) {
        formatted = numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
      } else {
        formatted = numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
      }
      setFormData((prev) => ({ ...prev, phone: formatted }))
      return
    }

    // Format CEP
    if (name === 'zipCode') {
      const numbers = value.replace(/\D/g, '')
      const formatted = numbers.replace(/(\d{5})(\d{3})/, '$1-$2')
      setFormData((prev) => ({ ...prev, zipCode: formatted }))
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
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
        description: 'Suas informações foram salvas',
      })
    } catch {
      toast({
        variant: 'error',
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil',
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
        description: 'As senhas não coincidem',
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
        description: error instanceof Error ? error.message : 'Não foi possível alterar a senha',
      })
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'EXCLUIR MINHA CONTA') {
      toast({
        variant: 'error',
        title: 'Confirmação inválida',
        description: 'Digite "EXCLUIR MINHA CONTA" para confirmar',
      })
      return
    }

    setIsDeleting(true)

    try {
      const res = await fetch('/api/users/me/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: deletePassword,
          confirmation: deleteConfirmation,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir conta')
      }

      toast({
        variant: 'success',
        title: 'Conta excluída',
        description: data.message,
      })

      // Sign out and redirect
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Não foi possível excluir a conta',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div>
        <PortalHeader title="Meu Perfil" subtitle="Gerencie suas informações" />
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </div>
    )
  }

  return (
    <div>
      <PortalHeader title="Meu Perfil" subtitle="Gerencie suas informações" />

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Info */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-lg font-semibold text-white">
                Informações Pessoais
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-400">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    placeholder="Seu nome completo"
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
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="mt-1 text-xs text-neutral-500">O email não pode ser alterado</p>
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">CPF ou CNPJ</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    className="pl-10"
                    maxLength={18}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">Telefone / WhatsApp</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(21) 98253-6229"
                    className="pl-10"
                    maxLength={15}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Alterações
              </Button>
            </form>
          </Card>

          {/* Address */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-lg font-semibold text-white">Endereço</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-400">CEP</label>
                <Input
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="00000-000"
                  maxLength={9}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="mb-2 block text-sm text-neutral-400">Rua</label>
                  <Input
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Nome da rua"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">Número</label>
                  <Input
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="123"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-neutral-400">Complemento</label>
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
                  placeholder="Nome do bairro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">Cidade</label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-neutral-400">Estado</label>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="RJ"
                    maxLength={2}
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Salvar Endereço
              </Button>
            </form>
          </Card>

          {/* Change Password */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-gold-500" />
              <h2 className="font-display text-lg font-semibold text-white">Alterar Senha</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-neutral-400">Senha Atual</label>
                <Input
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Digite sua senha atual"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-neutral-400">Nova Senha</label>
                <Input
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-neutral-400">Confirmar Nova Senha</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Repita a nova senha"
                />
              </div>

              <Button
                type="submit"
                variant="outline"
                disabled={isChangingPassword}
                className="w-full"
              >
                {isChangingPassword ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Alterar Senha
              </Button>
            </form>
          </Card>

          {/* Delete Account */}
          <Card className="border-red-500/20 p-6">
            <div className="mb-6 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              <h2 className="font-display text-lg font-semibold text-white">Excluir Conta</h2>
            </div>

            {!showDeleteConfirm ? (
              <div>
                <p className="mb-4 text-sm text-neutral-400">
                  Ao excluir sua conta, todos os seus dados pessoais serão removidos. Se você tiver
                  pedidos em andamento, sua conta será desativada mas o histórico será mantido para
                  fins legais.
                </p>
                <Button
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Minha Conta
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
                  <div>
                    <p className="font-medium text-red-400">Atenção: Esta ação é irreversível!</p>
                    <p className="mt-1 text-sm text-neutral-400">
                      Todos os seus dados serão excluídos permanentemente. Esta ação não pode ser
                      desfeita.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Digite sua senha para confirmar
                  </label>
                  <Input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Sua senha"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-neutral-400">
                    Digite <span className="font-mono text-red-400">EXCLUIR MINHA CONTA</span> para
                    confirmar
                  </label>
                  <Input
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())}
                    placeholder="EXCLUIR MINHA CONTA"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirm(false)
                      setDeleteConfirmation('')
                      setDeletePassword('')
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting || deleteConfirmation !== 'EXCLUIR MINHA CONTA'}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Excluir Permanentemente
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
