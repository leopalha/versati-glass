'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Loader2, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { logger } from '@/lib/logger'

const quoteItemSchema = z.object({
  productId: z.string().optional(),
  description: z.string().min(3, 'Descrição muito curta'),
  quantity: z.number().min(1, 'Quantidade mínima é 1'),
  unitPrice: z.number().min(0, 'Preço deve ser positivo'),
  width: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  notes: z.string().optional(),
})

const createQuoteSchema = z.object({
  customerEmail: z.string().email('Email inválido'),
  items: z.array(quoteItemSchema).min(1, 'Adicione pelo menos 1 item'),
  validityDays: z.number().min(1).max(90).default(15),
  notes: z.string().optional(),
  discount: z.number().min(0).max(100).default(0),
})

type CreateQuoteInput = z.infer<typeof createQuoteSchema>
type QuoteItem = z.infer<typeof quoteItemSchema>

export function CreateQuoteDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchingCustomer, setSearchingCustomer] = useState(false)
  const [customerFound, setCustomerFound] = useState<{
    id: string
    name: string
    email: string
  } | null>(null)
  const [items, setItems] = useState<QuoteItem[]>([
    {
      description: '',
      quantity: 1,
      unitPrice: 0,
    },
  ])

  const form = useForm<CreateQuoteInput>({
    resolver: zodResolver(createQuoteSchema),
    defaultValues: {
      customerEmail: '',
      items: [],
      validityDays: 15,
      discount: 0,
      notes: '',
    },
  })

  const searchCustomer = async (email: string) => {
    if (!email || !email.includes('@')) return

    setSearchingCustomer(true)
    try {
      const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (data.user) {
        setCustomerFound(data.user)
      } else {
        setCustomerFound(null)
      }
    } catch (error) {
      logger.error('Erro ao buscar cliente:', error)
      setCustomerFound(null)
    } finally {
      setSearchingCustomer(false)
    }
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  // ARCH-P1-3: Replace 'any' with proper type (allow undefined for optional fields)
  const updateItem = (
    index: number,
    field: keyof QuoteItem,
    value: string | number | undefined
  ) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    const subtotal = items.reduce((sum, item) => {
      return sum + item.quantity * item.unitPrice
    }, 0)
    const discount = form.watch('discount') || 0
    return subtotal * (1 - discount / 100)
  }

  const onSubmit = async (data: CreateQuoteInput) => {
    if (!customerFound) {
      form.setError('customerEmail', {
        message: 'Cliente não encontrado. Verifique o email.',
      })
      return
    }

    if (items.length === 0 || items.some((item) => !item.description || item.unitPrice === 0)) {
      alert('Preencha todos os itens corretamente')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: customerFound.id,
          items: items,
          validityDays: data.validityDays,
          notes: data.notes,
          discount: data.discount,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar orçamento')
      }

      const result = await response.json()

      setOpen(false)
      form.reset()
      setItems([{ description: '', quantity: 1, unitPrice: 0 }])
      setCustomerFound(null)
      router.push(`/admin/orcamentos/${result.quote.id}`)
      router.refresh()
    } catch (error) {
      logger.error('Erro:', error)
      alert('Erro ao criar orçamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Orçamento</DialogTitle>
          <DialogDescription>Crie um orçamento manual para um cliente existente</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Cliente */}
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Cliente</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="cliente@email.com"
                        {...field}
                        onBlur={(e) => searchCustomer(e.target.value)}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => searchCustomer(field.value || '')}
                      disabled={searchingCustomer}
                    >
                      {searchingCustomer ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {customerFound && (
                    <p className="text-sm text-green-400">
                      ✓ Cliente encontrado: {customerFound.name}
                    </p>
                  )}
                  {field.value && !customerFound && !searchingCustomer && (
                    <p className="text-sm text-error">Cliente não encontrado</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Itens */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Itens do Orçamento</FormLabel>
                <Button type="button" size="sm" variant="outline" onClick={addItem}>
                  <Plus className="mr-1 h-3 w-3" />
                  Adicionar Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="border-theme-default bg-theme-elevated space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-theme-primary text-sm font-medium">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Input
                        placeholder="Descrição do item"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        placeholder="Quantidade"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Preço unitário"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Largura (m)"
                        value={item.width || ''}
                        onChange={(e) =>
                          updateItem(index, 'width', Number(e.target.value) || undefined)
                        }
                      />
                    </div>

                    <div>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Altura (m)"
                        value={item.height || ''}
                        onChange={(e) =>
                          updateItem(index, 'height', Number(e.target.value) || undefined)
                        }
                      />
                    </div>

                    <div className="col-span-2">
                      <p className="text-theme-secondary text-sm">
                        Subtotal:{' '}
                        <span className="font-semibold text-accent-500">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.quantity * item.unitPrice)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Configurações */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validityDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações adicionais..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Total */}
            <div className="bg-theme-elevated border-accent-500/30 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-theme-primary text-lg font-semibold">Valor Total:</span>
                <span className="text-2xl font-bold text-accent-500">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(calculateTotal())}
                </span>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !customerFound}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Orçamento'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
