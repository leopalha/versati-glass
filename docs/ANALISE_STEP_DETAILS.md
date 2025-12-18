# ANÁLISE COMPLETA - STEP DETAILS (Etapa 3 Orçamento)

## OBJETIVO
Garantir que TODOS os produtos tenham os campos específicos corretos conforme o catálogo oficial (15_CATALOGO_PRODUTOS_SERVICOS.md)

---

## MAPEAMENTO POR CATEGORIA

### 1. BOX (Box para Banheiro)
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade
- ✅ Modelo do Box (FRONTAL, CANTO, ABRIR, ARTICULADO, PIVOTANTE, WALK_IN, BANHEIRA)
- ✅ Linha de Acabamento (TRADICIONAL, ELEGANCE, PREMIUM, CRISTAL)
- ✅ Tipo de Vidro (TEMPERADO, JATEADO, ACIDATO, SERIGRAFADO)
- ✅ Cor do Vidro (INCOLOR, VERDE, FUME, BRONZE, EXTRA_CLEAR)
- ✅ Espessura (8mm, 10mm)
- ✅ Acabamento de Borda (LAPIDADO, LAPIDADO_OG, CANTO_CHANFRADO, CANTO_MOEDA)
- ✅ Cor da Ferragem (BRANCO, PRETO, FOSCO, CROMADO, BRONZE, DOURADO, CHAMPANHE, INOX_POLIDO, INOX_ESCOVADO)

**Campos Opcionais:**
- Observações adicionais
- Fotos do local (até 5 imagens)

**Validações Específicas:**
- Box Walk-In: largura mínima 1.20m
- Espessura 10mm recomendada para vãos > 1.50m

---

### 2. ESPELHOS
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade
- ✅ Tipo de Espelho (LAPIDADO, BISOTADO, LED, DECORATIVO, JATEADO, CAMARIM)
- ✅ Formato (RETANGULAR, QUADRADO, REDONDO, OVAL, ORGANICO, ESPECIAL)
- ✅ Cor do Espelho (CRISTAL, FUME, BRONZE, ROSA, AZUL)
- ✅ Espessura (3mm, 4mm, 5mm, 6mm)
- ✅ Acabamento de Borda (LAPIDADO, BISOTE)

**Campos Condicionais:**
- ❌ **FALTANDO**: Se tipo = LED → Temperatura do LED (3000K, 4000K, 6000K)
- ✅ Se acabamento = BISOTE → Largura do Bisotê (0.5cm, 1cm, 2cm, 3cm, 4cm)
- ❌ **FALTANDO**: Método de Instalação (COLA, BOTOES, PERFIL, PARAFUSOS, PENDURADOR)

**Obs:** Espelhos NÃO usam tipo de vidro, NÃO usam cor de ferragem

---

### 3. VIDROS
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade
- ✅ Tipo de Vidro (TODOS os 14 tipos disponíveis)
- ✅ Cor do Vidro
- ✅ Espessura (conforme tipo)
- ✅ Acabamento de Borda (TODOS disponíveis)

**Campos Opcionais:**
- Cor da Ferragem (NÃO se aplica para vidros soltos)

---

### 4. PORTAS DE VIDRO
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade
- ✅ Tipo de Porta (PIVOTANTE, ABRIR, CORRER, CAMARAO, AUTOMATICA)
- ✅ Tipo de Vidro (TEMPERADO, JATEADO, ACIDATO, SERIGRAFADO)
- ✅ Cor do Vidro
- ✅ Espessura (8mm, 10mm, 12mm)
- ✅ Acabamento de Borda
- ✅ Cor da Ferragem

**Campos Condicionais:**
- ❌ **FALTANDO**: Se tipo = PIVOTANTE → Posição do Pivô (CENTRAL, DESLOCADO)
- ❌ **FALTANDO**: Se tipo = AUTOMATICA → Sensor (SIM/NAO)
- ❌ **FALTANDO**: Puxador (tipo e tamanho)
- ❌ **FALTANDO**: Fechadura (CENTRAL, LIVRE_OCUPADO, SEM_FECHADURA)

---

### 5. JANELAS DE VIDRO
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade
- ✅ Tipo de Janela (MAXIM_AR, BASCULANTE, CORRER, GUILHOTINA, PIVOTANTE, PROJETANTE)
- ✅ Tipo de Vidro (TEMPERADO, IMPRESSO)
- ✅ Cor do Vidro
- ✅ Espessura (6mm, 8mm)
- ✅ Acabamento de Borda
- ✅ Cor da Ferragem

**Campos Específicos:**
- ❌ **FALTANDO**: Se tipo = MAXIM_AR → Tamanho da Haste (30cm, 40cm, 50cm)
- ❌ **FALTANDO**: Se tipo = IMPRESSO → Textura (MINI_BOREAL, CANELADO, PONTILHADO, MARTELADO, QUADRATO, ESTRIADO)

---

### 6. GUARDA-CORPO
**Campos Obrigatórios:**
- ✅ Largura (comprimento linear, metros)
- ✅ Altura (metros) - padrão 1.10m
- ✅ Quantidade (seções)
- ✅ Sistema de Fixação (AUTOPORTANTE, TORRES, BOTTONS, SPIDER, MONTANTES, GRADIL)
- ✅ Tipo de Vidro (LAMINADO, LAMINADO_TEMPERADO, TEMPERADO)
- ✅ Cor do Vidro
- ✅ Espessura (10mm, 12mm, 16mm, 19mm) - conforme norma NBR 14718
- ✅ Acabamento de Borda
- ✅ Cor da Ferragem (Apenas INOX ou PVD)

**Campos Condicionais:**
- ❌ **FALTANDO**: Corrimão (SIM/NAO, tipo de corrimão)
- ❌ **FALTANDO**: Se sistema = AUTOPORTANTE → Material do Perfil (ALUMINIO, INOX)
- ❌ **FALTANDO**: Se sistema = TORRES → Quantidade de Pinças por Torre (2, 3, 4)

---

### 7. CORTINAS_VIDRO (Cortinas de Vidro / Envidraçamento)
**Campos Obrigatórios:**
- ✅ Largura total (metros)
- ✅ Altura (metros)
- ✅ Quantidade (folhas ou seções)
- ✅ Sistema de Abertura (EUROPEU, STANLEY, VERSATIK, TETO)
- ✅ Tipo de Vidro (TEMPERADO obrigatório - NBR 16259)
- ✅ Cor do Vidro (INCOLOR, VERDE, FUME, BRONZE, REFLECTA_PRATA, REFLECTA_BRONZE, JATEADO)
- ✅ Espessura (8mm, 10mm)
- ✅ Cor dos Perfis/Trilhos (BRANCO, PRETO, BRONZE, AMADEIRADO, ANODIZADO, CHAMPANHE)

**Validações Específicas:**
- NBR 16259: Sistema Europeu é o único permitido em varandas
- Altura máxima folha: 3.00m
- Largura máxima folha: 1.00m

---

### 8. PERGOLADOS (Pergolados e Coberturas)
**Campos Obrigatórios:**
- ✅ Largura e Comprimento (área em m²)
- ✅ Quantidade (seções)
- ✅ Tipo de Vidro (LAMINADO, LAMINADO_TEMPERADO, CONTROLE_SOLAR, AUTOLIMPANTE) - **LAMINADO OBRIGATÓRIO NBR 7199**
- ✅ Cor do Vidro
- ✅ Espessura (conforme vão: 8mm até 1m, 10mm até 1.5m, 12mm até 2m)
- ❌ **FALTANDO**: Tipo de Estrutura (MADEIRA, ALUMINIO, ACO, INOX)
- ❌ **FALTANDO**: Sistema de Fixação (APOIADO, ENGASTADO, SPIDER, PERFIL_ESTRUTURAL)
- ❌ **FALTANDO**: Inclinação (5%, 10%, 15%+)

**Validações:**
- Vidro LAMINADO obrigatório para coberturas (NBR 7199)
- Inclinação mínima 5% para escoamento

---

### 9. TAMPOS_PRATELEIRAS
**Campos Obrigatórios:**
- ✅ Largura e Comprimento/Diâmetro (metros)
- ✅ Quantidade
- ✅ Formato (RETANGULAR, QUADRADO, REDONDO, OVAL, ORGANICO, ESPECIAL)
- ✅ Tipo de Vidro (COMUM, TEMPERADO, EXTRA_CLEAR, SERIGRAFADO, LAMINADO)
- ✅ Cor do Vidro
- ✅ Espessura (conforme tabela NBR 14488)
- ✅ Acabamento de Borda (TODOS disponíveis)

**Campos Específicos:**
- ❌ **FALTANDO**: Tipo de Produto (TAMPO_MESA, PRATELEIRA)
- ❌ **FALTANDO**: Se PRATELEIRA → Tipo de Suporte (CANTO, PELICANO, INVISIVEL, DECORATIVO)
- ❌ **FALTANDO**: Se PRATELEIRA → Material Suporte (INOX, ALUMINIO, CROMADO)

**Validação Espessura (NBR 14488):**
- Até 60cm → 8mm comum / 6mm temperado
- 60-90cm → 10mm comum / 8mm temperado
- 90-120cm → 12mm comum / 8mm temperado
- 120-150cm → 15mm comum / 10mm temperado
- >150cm → 19mm comum / 12mm temperado

---

### 10. DIVISORIAS (Divisórias e Painéis)
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade (painéis)
- ✅ Tipo de Vidro (TEMPERADO, JATEADO, SERIGRAFADO, LAMINADO, INSULADO)
- ✅ Cor do Vidro
- ✅ Espessura (8mm, 10mm, 12mm)
- ❌ **FALTANDO**: Sistema (PISO_TETO, MEIA_ALTURA, AUTOPORTANTE, COM_PORTA)
- ❌ **FALTANDO**: Se COM_PORTA → Tipo de Porta (PIVOTANTE, CORRER, ABRIR)

**Aplicações:**
- Escritório
- Residencial
- Acústica (laminado especial)

---

### 11. FECHAMENTOS
**Campos Obrigatórios:**
- ✅ Largura e Altura (metros)
- ✅ Quantidade
- ✅ Tipo de Vidro (TEMPERADO, LAMINADO)
- ✅ Cor do Vidro
- ✅ Espessura (8mm, 10mm)
- ✅ Cor da Ferragem
- ❌ **FALTANDO**: Tipo de Fechamento (VARANDA, AREA_GOURMET, PISCINA, FACHADA)
- ❌ **FALTANDO**: Sistema (CORTINA_VIDRO, CAIXILHO_FIXO, JANELA_INTEGRADA, PORTAS_CORRER, PORTAS_CAMARAO)

**Especial Piscina:**
- Ferragens INOX 316 obrigatório (resistente a cloro)

---

### 12. FERRAGENS (Ferragens e Acessórios)
**Campos Obrigatórios:**
- ❌ **FALTANDO**: Tipo de Ferragem (DOBRADICA, PIVO, FECHADURA, TRINCO, ROLDANA, PUXADOR, PERFIL, BORRACHA)
- ❌ **FALTANDO**: Código (1101, 1103, 1013, 1201, etc.)
- ✅ Quantidade
- ✅ Cor/Acabamento
- ❌ **FALTANDO**: Capacidade (para roldanas: 30kg, 50kg, 60kg)

**Obs:** Esta categoria NÃO usa medidas de largura/altura

---

### 13. KITS (Kits Completos)
**Campos Obrigatórios:**
- ✅ Quantidade
- ❌ **FALTANDO**: Tipo de Kit (KIT_PIVOTANTE_VA, KIT_PIVOTANTE_VV, KIT_ABRIR, KIT_CORRER, KIT_CAMARAO)
- ✅ Cor/Acabamento
- ❌ **FALTANDO**: Conteúdo do Kit (listagem dos itens incluídos)

**Obs:** Kits NÃO usam medidas de largura/altura

---

### 14. SERVICOS (Serviços)
**Campos Obrigatórios:**
- ✅ Quantidade (horas ou unidades)
- ✅ Tipo de Serviço (MEDICAO, PROJETO, INSTALACAO, MANUTENCAO_PREVENTIVA, MANUTENCAO_CORRETIVA, REPOSICAO, EMERGENCIA)
- ❌ **FALTANDO**: Urgência (NORMAL, URGENTE, EMERGENCIAL_24H)
- ❌ **FALTANDO**: Agendamento Preferido (data/hora)

**Obs:** Serviços NÃO usam medidas de largura/altura, espessura, vidro, ferragem

---

## CAMPOS FALTANDO NO STEP-DETAILS ATUAL

### Críticos (Afetam Precificação):
1. **ESPELHOS**: Método de Instalação
2. **PORTAS**: Posição do Pivô, Tipo de Puxador, Tipo de Fechadura
3. **JANELAS**: Tamanho da Haste (Maxim-Ar), Textura (Impresso)
4. **GUARDA_CORPO**: Corrimão (SIM/NAO + tipo), Material Perfil, Quantidade Pinças
5. **PERGOLADOS**: Tipo de Estrutura, Sistema de Fixação, Inclinação
6. **TAMPOS_PRATELEIRAS**: Tipo (Tampo/Prateleira), Tipo e Material de Suporte
7. **DIVISORIAS**: Sistema, Porta Integrada
8. **FECHAMENTOS**: Tipo de Fechamento, Sistema
9. **FERRAGENS**: Tipo, Código, Capacidade
10. **KITS**: Tipo de Kit, Conteúdo

### Importantes (Afetam Usabilidade):
11. **ESPELHOS**: Temperatura LED já existe mas só mostra se modelo = LED ✅
12. **SERVICOS**: Urgência, Agendamento Preferido

---

## VALIDAÇÕES NORMATIVAS FALTANDO

1. **BOX**:
   - Walk-In mínimo 1.20m largura
   - Vidro temperado 8mm obrigatório

2. **GUARDA_CORPO** (NBR 14718):
   - Altura mínima 1.10m
   - Vidro laminado comercial
   - Carga horizontal 80kgf/m

3. **CORTINAS_VIDRO** (NBR 16259):
   - Sistema Europeu único permitido em varandas
   - Vidro temperado obrigatório
   - Altura máx folha 3.00m
   - Largura máx folha 1.00m

4. **PERGOLADOS** (NBR 7199):
   - Vidro laminado obrigatório em coberturas
   - Inclinação mínima 5%

5. **TAMPOS** (NBR 14488):
   - Tabela espessura x dimensão

---

## PLANO DE AÇÃO

### Prioridade 1 - CRÍTICO (Próxima Ação):
- [ ] Adicionar campo Método de Instalação para ESPELHOS
- [ ] Adicionar campos Pivô/Puxador/Fechadura para PORTAS
- [ ] Adicionar campo Haste para JANELAS Maxim-Ar
- [ ] Adicionar campos Corrimão/Material/Pinças para GUARDA_CORPO
- [ ] Adicionar campos Estrutura/Fixação/Inclinação para PERGOLADOS
- [ ] Adicionar campo Tipo e Suporte para TAMPOS_PRATELEIRAS
- [ ] Adicionar campo Sistema para DIVISORIAS
- [ ] Adicionar campos Tipo/Sistema para FECHAMENTOS

### Prioridade 2 - IMPORTANTE:
- [ ] Criar formulário específico para FERRAGENS (sem medidas)
- [ ] Criar formulário específico para KITS (sem medidas)
- [ ] Adicionar campos Urgência/Agendamento para SERVICOS
- [ ] Adicionar validações normativas com mensagens educativas

### Prioridade 3 - MELHORIAS:
- [ ] Tooltips explicativos em cada campo
- [ ] Imagens de referência dos modelos
- [ ] Calculadora de espessura automática baseada em dimensões
- [ ] Sugestões inteligentes baseadas na categoria

---

## CONCLUSÃO

O componente atual (`step-details.tsx`) cobre aproximadamente **60-70%** dos campos necessários. Os principais gaps são:

1. **Campos condicionais** que aparecem baseados em seleções anteriores
2. **Campos específicos de instalação** (métodos, estruturas, sistemas)
3. **Validações normativas** educativas
4. **Formulários específicos** para FERRAGENS e KITS que não usam medidas

A arquitetura atual está boa, mas precisa ser expandida significativamente para cobrir TODOS os produtos do catálogo corretamente.
