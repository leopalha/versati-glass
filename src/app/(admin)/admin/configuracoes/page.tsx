'use client'

import { useState } from 'react'
import { AdminHeader } from '@/components/admin/admin-header'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Settings,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  CreditCard,
  Bell,
  Globe,
  Palette,
  Save,
  Loader2,
} from 'lucide-react'
import { useToast } from '@/components/ui/toast/use-toast'

interface SettingsSection {
  id: string
  title: string
  icon: typeof Settings
  description: string
}

const sections: SettingsSection[] = [
  {
    id: 'empresa',
    title: 'Dados da Empresa',
    icon: Building,
    description: 'Nome, CNPJ, endereco e informacoes gerais',
  },
  {
    id: 'contato',
    title: 'Contato',
    icon: Phone,
    description: 'Telefones, email e WhatsApp',
  },
  {
    id: 'horarios',
    title: 'Horarios de Funcionamento',
    icon: Clock,
    description: 'Configure os horarios de atendimento',
  },
  {
    id: 'notificacoes',
    title: 'Notificacoes',
    icon: Bell,
    description: 'Configuracoes de email e alertas',
  },
  {
    id: 'pagamentos',
    title: 'Pagamentos',
    icon: CreditCard,
    description: 'Integracoes de pagamento',
  },
  {
    id: 'aparencia',
    title: 'Aparencia',
    icon: Palette,
    description: 'Logo, cores e tema',
  },
]

export default function AdminConfiguracoesPage() {
  const { toast } = useToast()
  const [activeSection, setActiveSection] = useState('empresa')
  const [isSaving, setIsSaving] = useState(false)

  // Dados da empresa
  const [companyData, setCompanyData] = useState({
    name: 'Versati Glass',
    legalName: 'Versati Glass Vidracaria LTDA',
    cnpj: '00.000.000/0001-00',
    ie: '',
    street: 'Rua das Flores',
    number: '123',
    complement: 'Sala 1',
    neighborhood: 'Centro',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zipCode: '20000-000',
    phone: '(21) 98253-6229',
    whatsapp: '5521982536229',
    email: 'contato@versatiglass.com.br',
    website: 'https://versatiglass.com.br',
  })

  // Horarios
  const [schedule, setSchedule] = useState({
    weekdayOpen: '08:00',
    weekdayClose: '18:00',
    saturdayOpen: '08:00',
    saturdayClose: '12:00',
    sundayOpen: '',
    sundayClose: '',
  })

  // Notificacoes
  const [notifications, setNotifications] = useState({
    emailNewQuote: true,
    emailNewOrder: true,
    emailPaymentReceived: true,
    whatsappNewQuote: true,
    whatsappNewOrder: true,
    adminEmails: 'admin@versatiglass.com.br',
  })

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: 'Configuracoes salvas',
        description: 'As alteracoes foram salvas com sucesso.',
      })
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Erro ao salvar',
        description: 'Nao foi possivel salvar as configuracoes.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <AdminHeader
        title="Configuracoes"
        subtitle="Gerencie as configuracoes do sistema"
        actions={
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar Alteracoes
          </Button>
        }
      />

      <div className="flex gap-6 p-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors ${
                    isActive
                      ? 'bg-accent-500/10 text-accent-500'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <p className="font-medium">{section.title}</p>
                    <p className="text-xs text-neutral-500">{section.description}</p>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'empresa' && (
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Building className="h-5 w-5 text-accent-500" />
                Dados da Empresa
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Nome Fantasia</Label>
                  <Input
                    id="name"
                    value={companyData.name}
                    onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="legalName">Razao Social</Label>
                  <Input
                    id="legalName"
                    value={companyData.legalName}
                    onChange={(e) => setCompanyData({ ...companyData, legalName: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={companyData.cnpj}
                    onChange={(e) => setCompanyData({ ...companyData, cnpj: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="ie">Inscricao Estadual</Label>
                  <Input
                    id="ie"
                    value={companyData.ie}
                    onChange={(e) => setCompanyData({ ...companyData, ie: e.target.value })}
                    className="mt-1"
                    placeholder="Opcional"
                  />
                </div>
              </div>

              <h4 className="mb-4 mt-8 flex items-center gap-2 text-sm font-medium text-neutral-400">
                <MapPin className="h-4 w-4" />
                Endereco
              </h4>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={companyData.street}
                    onChange={(e) => setCompanyData({ ...companyData, street: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Numero</Label>
                  <Input
                    id="number"
                    value={companyData.number}
                    onChange={(e) => setCompanyData({ ...companyData, number: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={companyData.complement}
                    onChange={(e) => setCompanyData({ ...companyData, complement: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={companyData.neighborhood}
                    onChange={(e) =>
                      setCompanyData({ ...companyData, neighborhood: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={companyData.city}
                    onChange={(e) => setCompanyData({ ...companyData, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={companyData.state}
                    onChange={(e) => setCompanyData({ ...companyData, state: e.target.value })}
                    className="mt-1"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={companyData.zipCode}
                    onChange={(e) => setCompanyData({ ...companyData, zipCode: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'contato' && (
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Phone className="h-5 w-5 text-accent-500" />
                Informacoes de Contato
              </h3>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Telefone Principal</Label>
                  <Input
                    id="phone"
                    value={companyData.phone}
                    onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp (somente numeros)</Label>
                  <Input
                    id="whatsapp"
                    value={companyData.whatsapp}
                    onChange={(e) => setCompanyData({ ...companyData, whatsapp: e.target.value })}
                    className="mt-1"
                    placeholder="5521982536229"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Principal</Label>
                  <Input
                    id="email"
                    type="email"
                    value={companyData.email}
                    onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={companyData.website}
                    onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'horarios' && (
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Clock className="h-5 w-5 text-accent-500" />
                Horarios de Funcionamento
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-neutral-400">Segunda a Sexta</h4>
                  <div className="flex items-center gap-4">
                    <div>
                      <Label htmlFor="weekdayOpen">Abertura</Label>
                      <Input
                        id="weekdayOpen"
                        type="time"
                        value={schedule.weekdayOpen}
                        onChange={(e) => setSchedule({ ...schedule, weekdayOpen: e.target.value })}
                        className="mt-1 w-32"
                      />
                    </div>
                    <span className="mt-6 text-neutral-500">ate</span>
                    <div>
                      <Label htmlFor="weekdayClose">Fechamento</Label>
                      <Input
                        id="weekdayClose"
                        type="time"
                        value={schedule.weekdayClose}
                        onChange={(e) => setSchedule({ ...schedule, weekdayClose: e.target.value })}
                        className="mt-1 w-32"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-neutral-400">Sabado</h4>
                  <div className="flex items-center gap-4">
                    <div>
                      <Label htmlFor="saturdayOpen">Abertura</Label>
                      <Input
                        id="saturdayOpen"
                        type="time"
                        value={schedule.saturdayOpen}
                        onChange={(e) => setSchedule({ ...schedule, saturdayOpen: e.target.value })}
                        className="mt-1 w-32"
                      />
                    </div>
                    <span className="mt-6 text-neutral-500">ate</span>
                    <div>
                      <Label htmlFor="saturdayClose">Fechamento</Label>
                      <Input
                        id="saturdayClose"
                        type="time"
                        value={schedule.saturdayClose}
                        onChange={(e) =>
                          setSchedule({ ...schedule, saturdayClose: e.target.value })
                        }
                        className="mt-1 w-32"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-neutral-400">Domingo</h4>
                  <div className="flex items-center gap-4">
                    <div>
                      <Label htmlFor="sundayOpen">Abertura</Label>
                      <Input
                        id="sundayOpen"
                        type="time"
                        value={schedule.sundayOpen}
                        onChange={(e) => setSchedule({ ...schedule, sundayOpen: e.target.value })}
                        className="mt-1 w-32"
                        placeholder="Fechado"
                      />
                    </div>
                    <span className="mt-6 text-neutral-500">ate</span>
                    <div>
                      <Label htmlFor="sundayClose">Fechamento</Label>
                      <Input
                        id="sundayClose"
                        type="time"
                        value={schedule.sundayClose}
                        onChange={(e) => setSchedule({ ...schedule, sundayClose: e.target.value })}
                        className="mt-1 w-32"
                        placeholder="Fechado"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Deixe em branco para indicar fechado
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'notificacoes' && (
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Bell className="h-5 w-5 text-accent-500" />
                Configuracoes de Notificacoes
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 text-sm font-medium text-neutral-400">
                    Notificacoes por Email
                  </h4>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifications.emailNewQuote}
                        onChange={(e) =>
                          setNotifications({ ...notifications, emailNewQuote: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-accent-500"
                      />
                      <span className="text-sm text-neutral-300">Novo orcamento recebido</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifications.emailNewOrder}
                        onChange={(e) =>
                          setNotifications({ ...notifications, emailNewOrder: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-accent-500"
                      />
                      <span className="text-sm text-neutral-300">Novo pedido confirmado</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifications.emailPaymentReceived}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            emailPaymentReceived: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-accent-500"
                      />
                      <span className="text-sm text-neutral-300">Pagamento recebido</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-medium text-neutral-400">
                    Notificacoes WhatsApp
                  </h4>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifications.whatsappNewQuote}
                        onChange={(e) =>
                          setNotifications({ ...notifications, whatsappNewQuote: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-accent-500"
                      />
                      <span className="text-sm text-neutral-300">Novo orcamento (WhatsApp)</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={notifications.whatsappNewOrder}
                        onChange={(e) =>
                          setNotifications({ ...notifications, whatsappNewOrder: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-neutral-600 bg-neutral-700 text-accent-500"
                      />
                      <span className="text-sm text-neutral-300">Novo pedido (WhatsApp)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="adminEmails">Emails dos Administradores</Label>
                  <Textarea
                    id="adminEmails"
                    value={notifications.adminEmails}
                    onChange={(e) =>
                      setNotifications({ ...notifications, adminEmails: e.target.value })
                    }
                    className="mt-1"
                    rows={3}
                    placeholder="Um email por linha"
                  />
                  <p className="mt-1 text-xs text-neutral-500">Separe multiplos emails por linha</p>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'pagamentos' && (
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <CreditCard className="h-5 w-5 text-accent-500" />
                Integracoes de Pagamento
              </h3>

              <div className="space-y-6">
                <div className="rounded-lg border border-neutral-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#635BFF]/10">
                        <span className="text-lg font-bold text-[#635BFF]">S</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">Stripe</p>
                        <p className="text-sm text-neutral-400">Pagamentos com cartao de credito</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                      Conectado
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border border-neutral-700 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#00B8A3]/10">
                        <span className="text-lg font-bold text-[#00B8A3]">P</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">PIX</p>
                        <p className="text-sm text-neutral-400">Pagamentos instantaneos</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Configurar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSection === 'aparencia' && (
            <Card className="p-6">
              <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
                <Palette className="h-5 w-5 text-accent-500" />
                Aparencia e Tema
              </h3>

              <div className="space-y-6">
                <div>
                  <Label>Logo da Empresa</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-dashed border-neutral-600 bg-neutral-800">
                      <span className="text-2xl font-bold text-accent-500">VG</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar Logo
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Cor Principal</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-accent-500" />
                    <Input
                      type="color"
                      defaultValue="#C9A961"
                      className="h-10 w-20 cursor-pointer"
                    />
                    <span className="text-sm text-neutral-400">#C9A961</span>
                  </div>
                </div>

                <div>
                  <Label>Tema Padrao</Label>
                  <div className="mt-2 grid grid-cols-4 gap-3">
                    {['gold', 'blue', 'green', 'gray'].map((theme) => (
                      <button
                        key={theme}
                        className={`rounded-lg border p-4 text-center transition-colors ${
                          theme === 'gold'
                            ? 'bg-accent-500/10 border-accent-500'
                            : 'border-neutral-700 hover:border-neutral-500'
                        }`}
                      >
                        <div
                          className={`mx-auto mb-2 h-8 w-8 rounded-full ${
                            theme === 'gold'
                              ? 'bg-amber-500'
                              : theme === 'blue'
                                ? 'bg-blue-500'
                                : theme === 'green'
                                  ? 'bg-green-500'
                                  : 'bg-gray-500'
                          }`}
                        />
                        <span className="text-xs capitalize text-neutral-300">{theme}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
