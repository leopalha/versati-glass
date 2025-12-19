'use client'

/**
 * Step 0: Location (CEP)
 *
 * First step of the quote wizard - collects customer CEP
 * to determine region and pricing multiplier.
 *
 * This step:
 * 1. Asks for CEP first
 * 2. Auto-fills address from ViaCEP API
 * 3. Shows region info and pricing impact
 * 4. Stores location data in quote store
 */

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useQuoteStore } from '@/store/quote-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCEP } from '@/lib/utils'
import { getRegionFromCEP, formatRegionDisplay, type RegionInfo } from '@/lib/region-pricing'
import { getWindZoneByCEP, getWindZoneDescription } from '@/lib/wind-zone-mapping'
import {
  MapPin,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Truck,
  DollarSign,
  Info,
  Wind,
} from 'lucide-react'

export function StepLocation() {
  const { locationData, setLocationData, nextStep } = useQuoteStore()

  const [cep, setCep] = useState(locationData?.zipCode || '')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addressData, setAddressData] = useState<{
    street: string
    neighborhood: string
    city: string
    state: string
  } | null>(
    locationData
      ? {
          street: locationData.street || '',
          neighborhood: locationData.neighborhood || '',
          city: locationData.city || '',
          state: locationData.state || '',
        }
      : null
  )
  const [regionInfo, setRegionInfo] = useState<RegionInfo | null>(
    locationData?.zipCode ? getRegionFromCEP(locationData.zipCode) : null
  )

  // Fetch address when CEP is complete
  const fetchAddress = useCallback(async (cleanCep: string) => {
    if (cleanCep.length !== 8) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError('CEP nao encontrado. Verifique e tente novamente.')
        setAddressData(null)
        setRegionInfo(null)
        return
      }

      // Set address data
      setAddressData({
        street: data.logradouro || '',
        neighborhood: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      })

      // Calculate region info
      const region = getRegionFromCEP(cleanCep)
      setRegionInfo(region)
    } catch (err) {
      setError('Erro ao buscar CEP. Tente novamente.')
      setAddressData(null)
      setRegionInfo(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle CEP change
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value)
    setCep(formatted)

    // Auto-fetch when CEP is complete
    const clean = formatted.replace(/\D/g, '')
    if (clean.length === 8) {
      fetchAddress(clean)
    } else {
      setAddressData(null)
      setRegionInfo(null)
      setError(null)
    }
  }

  // Handle continue
  const handleContinue = () => {
    if (!addressData || !regionInfo) return

    // Save to store
    setLocationData({
      zipCode: cep,
      street: addressData.street,
      neighborhood: addressData.neighborhood,
      city: addressData.city,
      state: addressData.state,
      region: regionInfo.zone,
      regionName: regionInfo.zoneName,
      priceMultiplier: regionInfo.priceMultiplier,
      windZone: getWindZoneByCEP(cep), // NEW LINE - Phase 3
    })

    nextStep()
  }

  const canContinue = addressData && regionInfo && !error && !isLoading

  return (
    <div className="mx-auto max-w-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <div className="bg-accent-500/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <MapPin className="h-8 w-8 text-accent-500" />
        </div>
        <h2 className="text-theme-primary font-display text-3xl font-bold">Onde voce esta?</h2>
        <p className="text-theme-muted mt-2">
          Informe seu CEP para calcularmos o orcamento correto para sua regiao
        </p>
      </motion.div>

      <Card className="p-6">
        {/* CEP Input */}
        <div className="mb-6">
          <label htmlFor="cep" className="text-theme-muted mb-2 block text-sm font-medium">
            Digite seu CEP
          </label>
          <div className="relative">
            <Input
              id="cep"
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              className="text-center text-2xl font-bold tracking-wider"
              autoFocus
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-5 w-5 animate-spin text-accent-500" />
              </div>
            )}
          </div>
          <p className="text-theme-subtle mt-2 text-center text-xs">
            Nao sabe o CEP? Consulte em{' '}
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-500 hover:underline"
            >
              buscacep.correios.com.br
            </a>
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        {/* Address Preview */}
        {addressData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 space-y-4"
          >
            {/* Address */}
            <div className="rounded-lg bg-green-500/10 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-400">Endereco identificado</span>
              </div>
              <p className="text-theme-primary text-sm">
                {addressData.street && `${addressData.street}, `}
                {addressData.neighborhood}
              </p>
              <p className="text-theme-muted text-sm">
                {addressData.city} - {addressData.state}
              </p>
            </div>

            {/* Region Info */}
            {regionInfo && (
              <div
                className={`rounded-lg p-4 ${
                  regionInfo.isServiceArea ? 'bg-accent-500/10' : 'bg-yellow-500/10'
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Info className="h-4 w-4 text-accent-500" />
                  <span className="text-sm font-medium text-accent-400">
                    Informacoes da sua regiao
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Zone */}
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-400">Regiao</p>
                      <p className="text-sm font-medium text-white">{regionInfo.zoneName}</p>
                    </div>
                  </div>

                  {/* Price Impact */}
                  <div className="flex items-start gap-2">
                    <DollarSign className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-400">Ajuste de preco</p>
                      <p
                        className={`text-sm font-medium ${
                          regionInfo.priceMultiplier > 1 ? 'text-yellow-400' : 'text-green-400'
                        }`}
                      >
                        {regionInfo.priceMultiplier === 1
                          ? 'Sem acrescimo'
                          : `+${Math.round((regionInfo.priceMultiplier - 1) * 100)}%`}
                      </p>
                    </div>
                  </div>

                  {/* Delivery Time */}
                  <div className="flex items-start gap-2">
                    <Truck className="h-4 w-4 flex-shrink-0 text-neutral-400" />
                    <div>
                      <p className="text-xs text-neutral-400">Prazo estimado</p>
                      <p className="text-sm font-medium text-white">
                        {regionInfo.deliveryDays} dias uteis
                      </p>
                    </div>
                  </div>

                  {/* Service Area */}
                  <div className="flex items-start gap-2">
                    <CheckCircle2
                      className={`h-4 w-4 flex-shrink-0 ${
                        regionInfo.isServiceArea ? 'text-green-500' : 'text-yellow-500'
                      }`}
                    />
                    <div>
                      <p className="text-xs text-neutral-400">Atendimento</p>
                      <p
                        className={`text-sm font-medium ${
                          regionInfo.isServiceArea ? 'text-green-400' : 'text-yellow-400'
                        }`}
                      >
                        {regionInfo.isServiceArea ? 'Area atendida' : 'Sob consulta'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Wind Zone (Phase 3) */}
                <div className="col-span-2 mt-3 flex items-start gap-2 border-t border-neutral-700 pt-3">
                  <Wind className="h-4 w-4 flex-shrink-0 text-blue-400" />
                  <div>
                    <p className="text-xs text-neutral-400">Zona de Vento (NBR)</p>
                    <p className="text-sm font-medium text-blue-400">
                      {getWindZoneDescription(getWindZoneByCEP(cep))}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Usado para cálculo de espessura do vidro
                    </p>
                  </div>
                </div>

                {/* Warning message if outside service area */}
                {regionInfo.message && (
                  <p className="mt-3 text-xs text-yellow-400">{regionInfo.message}</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Continue Button */}
        <Button onClick={handleContinue} disabled={!canContinue} className="w-full" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Buscando...
            </>
          ) : (
            <>
              Continuar
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        {/* Info text */}
        <p className="text-theme-subtle mt-4 text-center text-xs">
          O CEP e usado apenas para calcular o valor do orcamento. Voce podera alterar o endereco de
          instalacao depois.
        </p>
      </Card>
    </div>
  )
}
