'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { slugify } from '@/lib/utils'
import { createProductSchema, updateProductSchema } from '@/lib/validations/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/admin/image-upload'
import { logger } from '@/lib/logger'

type CreateProductFormData = z.infer<typeof createProductSchema>
type UpdateProductFormData = z.infer<typeof updateProductSchema>
type ProductFormData = CreateProductFormData | UpdateProductFormData

interface ProductFormProps {
  initialData?: Partial<CreateProductFormData> & { id?: string; slug?: string }
  mode: 'create' | 'edit'
}

export function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [generatedSlug, setGeneratedSlug] = useState(initialData?.slug || '')

  // Use schema apropriado para criar vs editar
  const schema = mode === 'create' ? createProductSchema : updateProductSchema

  const form = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      shortDescription: initialData?.shortDescription || '',
      category: initialData?.category || 'BOX',
      subcategory: initialData?.subcategory || '',
      priceType: initialData?.priceType || 'QUOTE_ONLY',
      basePrice: initialData?.basePrice || undefined,
      pricePerM2: initialData?.pricePerM2 || undefined,
      priceRangeMin: initialData?.priceRangeMin || undefined,
      priceRangeMax: initialData?.priceRangeMax || undefined,
      colors: initialData?.colors || [],
      finishes: initialData?.finishes || [],
      thicknesses: initialData?.thicknesses || [],
      images: initialData?.images || [],
      thumbnail: initialData?.thumbnail || '',
      isActive: initialData?.isActive ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      metaTitle: initialData?.metaTitle || '',
      metaDescription: initialData?.metaDescription || '',
    },
  })

  const watchName = form.watch('name')
  const watchPriceType = form.watch('priceType')

  // Auto-gerar slug quando nome muda
  useEffect(() => {
    if (watchName && mode === 'create') {
      setGeneratedSlug(slugify(watchName))
    }
  }, [watchName, mode])

  async function onSubmit(data: ProductFormData) {
    setIsLoading(true)

    try {
      const url = mode === 'create' ? '/api/products' : `/api/products/${initialData?.slug}`

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar produto')
      }

      const result = await response.json()

      // Redirect para lista de produtos
      router.push('/admin/produtos')
      router.refresh()
    } catch (error) {
      logger.error('Error saving product:', error)
      alert(error instanceof Error ? error.message : 'Erro ao salvar produto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Informações Básicas */}
        <Card className="border-neutral-700 bg-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Informações Básicas</CardTitle>
            <CardDescription className="text-neutral-400">
              Dados principais do produto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Grid para Nome e Categoria */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Box Elegance 8mm" {...field} />
                    </FormControl>
                    <FormDescription className="text-neutral-400">
                      Slug:{' '}
                      <code className="rounded bg-neutral-700 px-2 py-1 text-xs text-neutral-300">
                        {generatedSlug || 'produto-exemplo'}
                      </code>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="BOX">Box para Banheiro</SelectItem>
                        <SelectItem value="ESPELHOS">Espelhos</SelectItem>
                        <SelectItem value="VIDROS">Vidros</SelectItem>
                        <SelectItem value="PORTAS">Portas de Vidro</SelectItem>
                        <SelectItem value="JANELAS">Janelas de Vidro</SelectItem>
                        <SelectItem value="GUARDA_CORPO">Guarda-Corpo</SelectItem>
                        <SelectItem value="CORTINAS_VIDRO">Cortinas de Vidro</SelectItem>
                        <SelectItem value="PERGOLADOS">Pergolados e Coberturas</SelectItem>
                        <SelectItem value="TAMPOS_PRATELEIRAS">Tampos e Prateleiras</SelectItem>
                        <SelectItem value="DIVISORIAS">Divisorias e Paineis</SelectItem>
                        <SelectItem value="FECHAMENTOS">Fechamentos em Vidro</SelectItem>
                        <SelectItem value="FACHADAS">Fachadas de Vidro</SelectItem>
                        <SelectItem value="PAINEIS_DECORATIVOS">Paineis Decorativos</SelectItem>
                        <SelectItem value="FERRAGENS">Ferragens e Acessorios</SelectItem>
                        <SelectItem value="KITS">Kits Completos</SelectItem>
                        <SelectItem value="SERVICOS">Servicos</SelectItem>
                        <SelectItem value="OUTROS">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subcategory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subcategoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Box de correr" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Completa *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição detalhada do produto, características, benefícios..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Resumo para listagens" rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Imagens */}
        <Card className="border-neutral-700 bg-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Imagens do Produto</CardTitle>
            <CardDescription className="text-neutral-400">
              Adicione fotos de alta qualidade do produto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Galeria de Imagens</FormLabel>
                  <FormControl>
                    <ImageUpload
                      images={field.value || []}
                      onChange={(images) => {
                        field.onChange(images)
                        // Sempre atualizar thumbnail para a primeira imagem da galeria
                        if (images.length > 0) {
                          form.setValue('thumbnail', images[0])
                        } else {
                          form.setValue('thumbnail', '')
                        }
                      }}
                      maxImages={8}
                    />
                  </FormControl>{' '}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Preços */}
        <Card className="border-neutral-700 bg-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Preços</CardTitle>
            <CardDescription className="text-neutral-400">
              Configure o tipo de precificação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="priceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Preço *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FIXED">Preço Fixo</SelectItem>
                      <SelectItem value="PER_M2">Por m²</SelectItem>
                      <SelectItem value="QUOTE_ONLY">Apenas Orçamento</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchPriceType === 'FIXED' && (
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Base (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {watchPriceType === 'PER_M2' && (
              <FormField
                control={form.control}
                name="pricePerM2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço por m² (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceRangeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faixa Mínima (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Opcional: valor mínimo estimado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceRangeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Faixa Máxima (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Opcional: valor máximo estimado
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="border-neutral-700 bg-neutral-800">
          <CardHeader>
            <CardTitle className="text-white">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Produto Ativo</FormLabel>
                    <FormDescription>Produto visível para clientes</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Produto em Destaque</FormLabel>
                    <FormDescription>Aparecer em destaque na home</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ações */}
        <div className="flex items-center justify-end gap-4 border-t border-neutral-700 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gold-500 text-neutral-900 hover:bg-gold-600"
          >
            {isLoading ? 'Salvando...' : mode === 'create' ? 'Criar Produto' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
