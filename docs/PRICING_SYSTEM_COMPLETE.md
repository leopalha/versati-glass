# 💰 SISTEMA COMPLETO DE PRECIFICAÇÃO - VERSATI GLASS

**Versão**: 2.0 Completa
**Data**: 18 Dezembro 2024
**Status**: ✅ Sistema Sofisticado Implementado

---

## 📊 RESUMO EXECUTIVO

O sistema de precificação da Versati Glass é **multifatorial** e considera:

1. **Localização (CEP)** → Zona nobre/periferia/interior
2. **Tipo de Área** → Praia, comercial, residencial, corporativo
3. **Nível de Risco** → Segurança da região
4. **Acesso** → Facilidade de instalação
5. **Logística** → Distância, trânsito, estacionamento
6. **Perfil do Cliente** → Residencial, comercial, corporativo
7. **Complexidade** → Tipo de produto e instalação

**Resultado**: Preço justo e rentável que reflete o real custo operacional.

---

## 🗺️ TABELA 1: MULTIPLICADORES POR ZONA (CEP)

### Zona Sul Premium (+30% a +40%)

| Bairro         | CEP         | Multiplicador    | Prazo  | Justificativa                                  |
| -------------- | ----------- | ---------------- | ------ | ---------------------------------------------- |
| **Leblon**     | 22410-22470 | **1.40x** (+40%) | 3 dias | Zona nobre, padrão altíssimo, cliente exigente |
| **Ipanema**    | 22420-22430 | **1.35x** (+35%) | 3 dias | Zona nobre, alto padrão, localização premium   |
| **Lagoa**      | 22440-22450 | **1.35x** (+35%) | 3 dias | Condomínios de luxo, acesso controlado         |
| **Copacabana** | 22070-22080 | **1.30x** (+30%) | 3 dias | Misto comercial/residencial, alta demanda      |

### Zona Sul (+20% a +25%)

| Bairro              | CEP         | Multiplicador    | Prazo  | Justificativa                             |
| ------------------- | ----------- | ---------------- | ------ | ----------------------------------------- |
| **Botafogo**        | 22210-22299 | **1.20x** (+20%) | 3 dias | Bom padrão, misto residencial/comercial   |
| **Flamengo**        | 22250-22299 | **1.20x** (+20%) | 3 dias | Residencial médio-alto padrão             |
| **Jardim Botânico** | 22460-22470 | **1.30x** (+30%) | 3 dias | Alto padrão, casas e apartamentos de luxo |

### Zona Oeste Premium (+20% a +25%)

| Bairro           | CEP         | Multiplicador    | Prazo  | Justificativa                      |
| ---------------- | ----------- | ---------------- | ------ | ---------------------------------- |
| **Barra (Orla)** | 22620-22649 | **1.25x** (+25%) | 4 dias | Condomínios de luxo, distância     |
| **Recreio**      | 22790-22799 | **1.20x** (+20%) | 5 dias | Residencial médio, distância maior |

### Zona Oeste (+5% a +10%)

| Bairro          | CEP         | Multiplicador    | Prazo  | Justificativa                          |
| --------------- | ----------- | ---------------- | ------ | -------------------------------------- |
| **Jacarepaguá** | 22710-22789 | **1.10x** (+10%) | 4 dias | Residencial padrão, distância moderada |
| **Freguesia**   | 22730-22750 | **1.05x** (+5%)  | 4 dias | Residencial médio, boa acessibilidade  |

### Centro (Base)

| Bairro     | CEP         | Multiplicador  | Prazo  | Justificativa                           |
| ---------- | ----------- | -------------- | ------ | --------------------------------------- |
| **Centro** | 20010-20099 | **1.00x** (0%) | 2 dias | Comercial, preço base, horário restrito |

### Zona Norte (Base a +5%)

| Bairro          | CEP         | Multiplicador   | Prazo  | Justificativa                          |
| --------------- | ----------- | --------------- | ------ | -------------------------------------- |
| **Tijuca**      | 20510-20560 | **1.00x** (0%)  | 3 dias | Residencial padrão, boa infraestrutura |
| **Vila Isabel** | 20530-20541 | **1.00x** (0%)  | 3 dias | Residencial médio, fácil acesso        |
| **Penha**       | 21010-21099 | **1.05x** (+5%) | 4 dias | Subúrbio, acessibilidade moderada      |

### Baixada Fluminense (+15% a +20%)

| Cidade              | CEP         | Multiplicador    | Prazo  | Justificativa                |
| ------------------- | ----------- | ---------------- | ------ | ---------------------------- |
| **Duque de Caxias** | 25000-25999 | **1.15x** (+15%) | 5 dias | Distância, seguro, logística |
| **Nova Iguaçu**     | 26000-26999 | **1.20x** (+20%) | 5 dias | Distância maior, seguro      |

### Niterói / São Gonçalo (+15% a +18%)

| Cidade          | CEP         | Multiplicador    | Prazo  | Justificativa                    |
| --------------- | ----------- | ---------------- | ------ | -------------------------------- |
| **Niterói**     | 24000-24799 | **1.15x** (+15%) | 4 dias | Ponte, pedágio, distância        |
| **São Gonçalo** | 24800-24999 | **1.18x** (+18%) | 5 dias | Ponte, distância, acessibilidade |

### Interior RJ (+30% a +40%)

| Região                | CEP         | Multiplicador    | Prazo   | Justificativa                        |
| --------------------- | ----------- | ---------------- | ------- | ------------------------------------ |
| **Região dos Lagos**  | 27000-27999 | **1.30x** (+30%) | 7 dias  | Distância ~150km, logística especial |
| **Interior Distante** | 28000-28999 | **1.40x** (+40%) | 10 dias | Distância >200km, deslocamento longo |

### Fora do RJ (+82%)

| Região             | Multiplicador    | Prazo   | Status          |
| ------------------ | ---------------- | ------- | --------------- |
| **Outros Estados** | **1.82x** (+82%) | 15 dias | ⚠️ Sob consulta |

---

## 🏢 TABELA 2: MULTIPLICADORES POR TIPO DE ÁREA

| Tipo de Área                | Multiplicador    | Justificativa                                       |
| --------------------------- | ---------------- | --------------------------------------------------- |
| **Frente para Mar**         | **1.40x** (+40%) | Corrosão salina acelerada, manutenção especial      |
| **Próximo à Praia**         | **1.25x** (+25%) | Ambiente salino, cuidados extras                    |
| **Shopping Center**         | **1.30x** (+30%) | Horário restrito, logística complexa, padrão alto   |
| **Comercial Centro**        | **1.20x** (+20%) | Horário comercial, estacionamento difícil           |
| **Corporativo AAA**         | **1.35x** (+35%) | Padrão premium, normas rígidas, segurança           |
| **Corporativo Padrão**      | **1.15x** (+15%) | Normas e procedimentos, horário comercial           |
| **Residencial Alto Padrão** | **1.25x** (+25%) | Acabamento premium, cuidado extra, cliente exigente |
| **Residencial Médio**       | **1.00x** (BASE) | Padrão normal, referência de preço                  |
| **Residencial Simples**     | **0.95x** (-5%)  | Menor complexidade, acabamento padrão               |
| **Industrial**              | **1.10x** (+10%) | Logística especial, equipamentos                    |
| **Rural**                   | **1.20x** (+20%) | Distância, acesso difícil                           |
| **Misto**                   | **1.05x** (+5%)  | Características combinadas                          |

---

## ⚠️ TABELA 3: MULTIPLICADORES POR NÍVEL DE RISCO

| Nível de Risco    | Multiplicador    | Medidas Necessárias                                                                     |
| ----------------- | ---------------- | --------------------------------------------------------------------------------------- |
| **Zona Segura**   | **1.00x** (0%)   | Nenhuma medida especial                                                                 |
| **Risco Baixo**   | **1.00x** (0%)   | Precauções normais                                                                      |
| **Risco Médio**   | **1.15x** (+15%) | ✅ Seguro adicional                                                                     |
| **Risco Alto**    | **1.35x** (+35%) | ✅ Escolta<br>✅ Seguro especial<br>✅ Equipe treinada                                  |
| **Risco Crítico** | **1.60x** (+60%) | ⚠️ **Sob consulta**<br>✅ Escolta armada<br>✅ Seguro especial<br>✅ Autorização prévia |

**Nota**: Áreas de risco crítico são avaliadas caso a caso.

---

## 🚗 TABELA 4: MULTIPLICADORES POR ACESSO

| Nível de Acesso   | Multiplicador    | Características                                                                  |
| ----------------- | ---------------- | -------------------------------------------------------------------------------- |
| **Fácil**         | **1.00x** (0%)   | ✅ Elevador de serviço<br>✅ Estacionamento garantido<br>✅ Acesso amplo         |
| **Moderado**      | **1.05x** (+5%)  | ⚠️ Sem elevador OU sem estacionamento<br>✅ Acesso razoável                      |
| **Difícil**       | **1.15x** (+15%) | ❌ Sem elevador E sem estacionamento<br>⚠️ Ruas estreitas<br>⚠️ Tráfego intenso  |
| **Muito Difícil** | **1.30x** (+30%) | ❌ Morro/Escadaria<br>❌ Acesso muito restrito<br>❌ Requer equipamento especial |

---

## 🚚 TABELA 5: MULTIPLICADORES DE LOGÍSTICA

| Zona                   | Multiplicador    | Fatores                                       |
| ---------------------- | ---------------- | --------------------------------------------- |
| **Zona Sul Premium**   | **1.05x** (+5%)  | Trânsito intenso, estacionamento caro         |
| **Zona Sul**           | **1.02x** (+2%)  | Trânsito moderado                             |
| **Zona Oeste Premium** | **1.05x** (+5%)  | Distância, pedágios                           |
| **Zona Oeste**         | **1.03x** (+3%)  | Distância moderada                            |
| **Centro**             | **1.10x** (+10%) | Trânsito crítico, estacionamento difícil, ZRA |
| **Zona Norte**         | **1.00x** (BASE) | Referência logística                          |
| **Zona Norte Baixa**   | **1.05x** (+5%)  | Distância, trânsito                           |
| **Baixada Fluminense** | **1.15x** (+15%) | Distância, pedágios, rodovias                 |
| **Niterói/SG**         | **1.12x** (+12%) | Ponte Rio-Niterói, pedágios                   |
| **Interior Próximo**   | **1.20x** (+20%) | Rodovias, distância >100km                    |
| **Interior Distante**  | **1.25x** (+25%) | Rodovias, distância >200km                    |
| **Fora do RJ**         | **1.30x** (+30%) | Transporte interestadual                      |

---

## 📐 TABELA 6: CUSTOS DE INSTALAÇÃO POR CATEGORIA

| Categoria              | % do Material | R$ Base Hardware  | Justificativa                               |
| ---------------------- | ------------- | ----------------- | ------------------------------------------- |
| **Box**                | **45%**       | R$ 300 - R$ 800   | Instalação complexa, vedação, alinhamento   |
| **Portas**             | **50%**       | R$ 400 - R$ 1.200 | Alinhamento crítico, dobradiças, fechaduras |
| **Janelas**            | **40%**       | R$ 250 - R$ 600   | Vedação, caixilho, acabamento               |
| **Guarda-Corpo**       | **55%**       | R$ 200 - R$ 500   | Segurança crítica, fixação estrutural       |
| **Espelhos**           | **30%**       | R$ 50 - R$ 150    | Instalação simples, colagem                 |
| **Tampos/Prateleiras** | **25%**       | R$ 80 - R$ 200    | Suportes, nivelamento                       |
| **Divisórias**         | **35%**       | R$ 150 - R$ 400   | Perfis, vedação, acabamento                 |
| **Vidros**             | **20%**       | R$ 30 - R$ 100    | Instalação básica                           |
| **Fechamentos**        | **40%**       | R$ 500 - R$ 1.500 | Sistema complexo, vedação                   |
| **Pergolados**         | **60%**       | R$ 800 - R$ 2.000 | Estrutural, complexo, alto risco            |

---

## 💎 TABELA 7: PREÇOS BASE POR CATEGORIA

### Por Metro Quadrado (m²)

| Tipo de Vidro | Espessura | R$/m²  |
| ------------- | --------- | ------ |
| **Temperado** | 8mm       | R$ 250 |
| **Temperado** | 10mm      | R$ 320 |
| **Temperado** | 12mm      | R$ 380 |
| **Laminado**  | 8mm       | R$ 350 |
| **Laminado**  | 10mm      | R$ 420 |
| **Espelho**   | 4mm       | R$ 180 |
| **Espelho**   | 6mm       | R$ 220 |

### Por Unidade

| Categoria                          | Mín      | Máx      | Média    |
| ---------------------------------- | -------- | -------- | -------- |
| **Box**                            | R$ 1.200 | R$ 2.800 | R$ 2.000 |
| **Portas**                         | R$ 1.500 | R$ 4.000 | R$ 2.750 |
| **Janelas**                        | R$ 800   | R$ 2.500 | R$ 1.650 |
| **Guarda-Corpo** (p/ metro linear) | R$ 450   | R$ 800   | R$ 625   |
| **Espelhos** (p/ m²)               | R$ 150   | R$ 400   | R$ 275   |
| **Tampos** (p/ m²)                 | R$ 200   | R$ 500   | R$ 350   |
| **Divisórias** (p/ m²)             | R$ 300   | R$ 600   | R$ 450   |

---

## 🎨 TABELA 8: MULTIPLICADORES DE ACABAMENTO

| Acabamento       | Multiplicador    | Descrição               |
| ---------------- | ---------------- | ----------------------- |
| **Bisotê 10mm**  | **1.25x** (+25%) | Borda chanfrada 10mm    |
| **Bisotê 20mm**  | **1.35x** (+35%) | Borda chanfrada 20mm    |
| **Lapidado**     | **1.15x** (+15%) | Borda polida reta       |
| **Jateado**      | **1.20x** (+20%) | Vidro fosco/texturizado |
| **Serigrafado**  | **1.30x** (+30%) | Impressão em vidro      |
| **Antirreflexo** | **1.40x** (+40%) | Coating especial        |

---

## 🎨 TABELA 9: MULTIPLICADORES DE COR

| Cor                   | Multiplicador    | Observações |
| --------------------- | ---------------- | ----------- |
| **Incolor (Cristal)** | **1.00x** (BASE) | Padrão      |
| **Fumê (Cinza)**      | **1.10x** (+10%) | Popular     |
| **Bronze**            | **1.12x** (+12%) | Elegante    |
| **Verde**             | **1.12x** (+12%) | Clássico    |
| **Azul**              | **1.15x** (+15%) | Decorativo  |
| **Preto**             | **1.20x** (+20%) | Premium     |

---

## 📊 EXEMPLO PRÁTICO DE CÁLCULO

### Cenário: Box Elegance em Leblon

**Produto:**

- Box para Banheiro Elegance
- 2.0m x 2.0m = 4m²
- Vidro temperado 10mm
- Acabamento bisotê
- Cor cristal

**Cliente:**

- CEP: 22430-000 (Ipanema)
- Residencial alto padrão
- Cobertura (fácil acesso - elevador)
- Zona segura

**CÁLCULO:**

```
1. PREÇO BASE
   Material: R$ 320/m² × 4m² = R$ 1.280
   Instalação: R$ 1.280 × 45% = R$ 576
   Hardware: R$ 550 (médio)
   Acabamento bisotê: R$ 1.280 × 25% = R$ 320
   ---
   SUBTOTAL BASE: R$ 2.726

2. MULTIPLICADORES REGIONAIS
   Zona (Ipanema): 1.35x
   Tipo de área (Residencial Alto Padrão): 1.25x
   Risco (Seguro): 1.00x
   Acesso (Fácil): 1.00x
   Logística: 1.05x
   ---
   MULTIPLICADOR FINAL: 1.35 × 1.25 × 1.05 = 1.77x

3. PREÇO FINAL
   R$ 2.726 × 1.77 = R$ 4.825

4. AJUSTE (+77%)
   Preço Base: R$ 2.726
   Preço Ajustado: R$ 4.825
   Diferença: +R$ 2.099 (+77%)
```

**RESULTADO FINAL: R$ 4.825,00**

**Prazo de Entrega:** 3 dias úteis

**Justificativa ao Cliente:**

- "Zona nobre Ipanema (+35%)"
- "Residencial alto padrão, acabamento premium (+25%)"
- "Logística Zona Sul (+5%)"
- "Total: +77% devido à localização e padrão"

---

## 🎯 ESTRATÉGIAS DE PRECIFICAÇÃO

### 1. Descontos por Volume

- **2 unidades**: -5%
- **3+ unidades**: -10%
- **5+ unidades**: -15% (negociar)

### 2. Descontos por Timing

- **Pagamento à vista**: -5%
- **Baixa temporada**: -10%
- **Cliente recorrente**: -5% a -15%

### 3. Ajustes Comerciais

- **Condomínios** (múltiplas unidades): -10% a -20%
- **Construtoras** (parceria): -15% a -25%
- **Projetos corporativos**: Sob medida

### 4. Premium Add-ons

- **LED integrado** (espelhos): +R$ 300
- **Instalação expressa** (24h): +30%
- **Garantia estendida** (5 anos): +15%
- **Manutenção preventiva** (anual): +R$ 200/ano

---

## 🔄 INTEGRAÇÃO COM O SISTEMA

### Quando Aplicar Pricing Regional?

1. **Na criação do orçamento** (wizard step 2 - dados do cliente)
   - Sistema detecta CEP automaticamente
   - Calcula multiplicadores
   - Exibe ajuste ao cliente

2. **No cálculo de valores** (wizard step 5 - resumo)
   - Aplica multiplicadores acumulativos
   - Mostra breakdown detalhado
   - Justifica ajustes

3. **Na aprovação admin** (backend)
   - Admin pode ajustar manualmente
   - Histórico de ajustes
   - Margem de lucro calculada

### Campos Necessários no Formulário

```typescript
// Campos atuais do wizard
customerData: {
  cep: string // JÁ EXISTE ✅
  // ... outros campos
}

// Campos adicionais opcionais
additionalInfo: {
  isBeachfront?: boolean // "Frente para o mar?"
  isCorporate?: boolean // "Instalação corporativa?"
  isHighEnd?: boolean // "Alto padrão?"
  accessDifficulty?: AccessLevel // "Nível de acesso?"
  riskLevel?: RiskLevel // "Área de risco?" (admin apenas)
}
```

---

## 📱 EXEMPLO DE EXIBIÇÃO AO CLIENTE

### Tela de Resumo do Orçamento

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 ANÁLISE DE LOCALIZAÇÃO

📮 CEP: 22430-120
🏙️ Região: Ipanema, Rio de Janeiro
🏠 Tipo: Residencial Alto Padrão
⚠️ Risco: Zona Segura
🚗 Acesso: Fácil (elevador)

💰 Ajuste de Preço: +77%
📦 Prazo de Entrega: 3 dias úteis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💵 DETALHAMENTO

Preço Base:          R$ 2.726,00

Ajustes Regionais:
  • Zona Ipanema:    +35%  (R$ 954)
  • Alto Padrão:     +25%  (R$ 681)
  • Logística ZS:    +5%   (R$ 136)

Preço Final:         R$ 4.825,00

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 FATORES DE PREÇO

✓ Zona nobre com padrão elevado
✓ Acabamento premium com bisotê
✓ Instalação em alto padrão
✓ Logística Zona Sul

💡 SUGESTÕES
• Considere agrupar pedidos para otimizar custos
```

---

## 🚀 PRÓXIMOS PASSOS

### Fase 1: Implementação (AGORA)

- [x] Criar sistema completo de precificação regional
- [x] Documentar todas as tabelas e multiplicadores
- [ ] Integrar com wizard de orçamento (step 2)
- [ ] Integrar com cálculo de valores (step 5)
- [ ] Testar com dados reais

### Fase 2: Refinamento

- [ ] Adicionar mais bairros/CEPs
- [ ] Ajustar multiplicadores baseado em histórico
- [ ] Implementar ML para otimização de preços
- [ ] Dashboard de análise de pricing

### Fase 3: Automação

- [ ] API de consulta de CEP (ViaCEP)
- [ ] Detecção automática de tipo de área
- [ ] Sugestão inteligente de descontos
- [ ] Alertas de margem de lucro

---

## 📞 SUPORTE

**Dúvidas sobre precificação?**

- Consulte: `src/lib/regional-pricing-complete.ts`
- Função principal: `analyzeLocation(cep, additionalInfo)`
- Aplicar preço: `applyRegionalPricing(basePrice, analysis)`

**Ajustar multiplicadores?**

- Edite as constantes em `regional-pricing-complete.ts`
- Teste com `diagnose-pricing.mjs`
- Deploy e monitore resultados

---

**Versão:** 2.0 Completa
**Mantido por:** Equipe Versati Glass
**Última Atualização:** 18 Dezembro 2024
