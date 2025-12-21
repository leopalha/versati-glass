# Mapeamento Completo: Produtos x Campos do Orcamento

## Resumo Executivo

Este documento mapeia TODOS os produtos do catalogo Versati Glass, detalhando:

- Quais precisam de ferragem/kit
- Quais campos sao obrigatorios/opcionais
- Como devem ser apresentados no orcamento
- Logica de exibicao condicional

---

## 1. CATEGORIAS E SEUS REQUISITOS

### Legenda

- **DIM**: Precisa de dimensoes (largura x altura)
- **FER**: Precisa de ferragem
- **VID**: Precisa selecionar tipo de vidro
- **COR**: Precisa selecionar cor do vidro
- **ESP**: Precisa selecionar espessura
- **MOD**: Precisa selecionar modelo/tipo

---

## 2. BOX DE BANHEIRO

| Campo               | Obrigatorio | Observacao                                                      |
| ------------------- | ----------- | --------------------------------------------------------------- |
| Modelo              | SIM         | FRONTAL, CANTO, ABRIR, ARTICULADO, PIVOTANTE, WALK_IN, BANHEIRA |
| Largura             | SIM         | Em metros                                                       |
| Altura              | SIM         | Em metros                                                       |
| Tipo de Vidro       | SIM         | Temperado (padrao)                                              |
| Cor do Vidro        | SIM         | INCOLOR, FUME, BRONZE, VERDE, CINZA                             |
| Espessura           | SIM         | 8mm ou 10mm (NBR valida)                                        |
| Cor da Ferragem     | SIM         | CROMADO, PRETO, DOURADO, BRONZE, INOX                           |
| Kit/Modelo Ferragem | SIM         | ELEGANCE, STANDARD, PREMIUM, SOFT_CLOSE                         |

### Modelos de Box e suas particularidades:

```
BOX_FRONTAL_SIMPLES    → 1 folha fixa + 1 de correr
BOX_FRONTAL_DUPLO      → 2 folhas de correr
BOX_CANTO              → Box em L (2 lados)
BOX_CANTO_INOX         → Box em L com perfil inox
BOX_DE_ABRIR           → Com dobradicas
BOX_ARTICULADO_2       → 2 folhas articuladas
BOX_ARTICULADO_4       → 4 folhas articuladas (sanfonado)
BOX_PIVOTANTE          → Porta pivotante
BOX_WALK_IN            → Sem porta (aberto)
BOX_BANHEIRA           → Para banheira
BOX_ELEGANCE           → Linha premium
BOX_CRISTAL            → Vidro cristal especial
```

**FERRAGEM OBRIGATORIA**: SIM para todos os modelos

---

## 3. ESPELHOS

| Campo           | Obrigatorio | Observacao                                                      |
| --------------- | ----------- | --------------------------------------------------------------- |
| Tipo            | SIM         | LAPIDADO, BISOTADO, LED, CAMARIM, COLORIDO, DECORATIVO, JATEADO |
| Largura         | SIM         | Em metros                                                       |
| Altura          | SIM         | Em metros                                                       |
| Cor do Espelho  | CONDICIONAL | Se COLORIDO: BRONZE, FUME, CINZA                                |
| Temperatura LED | CONDICIONAL | Se LED: QUENTE, NEUTRO, FRIO                                    |
| Largura Bisote  | CONDICIONAL | Se BISOTADO: 1cm a 5cm                                          |
| Forma           | OPCIONAL    | RETANGULAR, REDONDO, OVAL, ORGANICO                             |

### Tipos de Espelho e seus campos:

```
ESPELHO_LAPIDADO       → Borda lapidada simples
ESPELHO_BISOTADO       → Borda chanfrada (bisote)
                         Campos extras: bisoteWidth (1cm-5cm)
ESPELHO_LED            → Com iluminacao LED
                         Campos extras: ledTemp (QUENTE/NEUTRO/FRIO)
ESPELHO_CAMARIM        → Com lampadas ao redor
ESPELHO_COLORIDO       → Bronze, fume, cinza
                         Campos extras: glassColor
ESPELHO_DECORATIVO     → Veneziano, artistico
ESPELHO_JATEADO        → Com areas jateadas
```

**FERRAGEM OBRIGATORIA**: NAO

- Espelhos sao instalados com cola especial ou suportes simples
- NAO exibir campo "Cor da Ferragem" para espelhos

---

## 4. VIDROS TEMPERADOS E ESPECIAIS

| Campo        | Obrigatorio | Observacao                                                                                      |
| ------------ | ----------- | ----------------------------------------------------------------------------------------------- |
| Tipo         | SIM         | TEMPERADO, LAMINADO, LAMINADO_TEMPERADO, JATEADO, ACIDATO, SERIGRAFADO, EXTRA_CLEAR, REFLECTIVO |
| Largura      | SIM         | Em metros                                                                                       |
| Altura       | SIM         | Em metros                                                                                       |
| Cor do Vidro | SIM         | INCOLOR, FUME, BRONZE, VERDE, CINZA                                                             |
| Espessura    | SIM         | 6mm, 8mm, 10mm, 12mm                                                                            |
| Furos        | OPCIONAL    | Quantidade de furos                                                                             |
| Recortes     | OPCIONAL    | Descricao de recortes                                                                           |

### Tipos de Vidro e aplicacoes:

```
VIDRO_TEMPERADO_8MM    → Uso geral (mesas, divisorias)
VIDRO_TEMPERADO_10MM   → Portas, guarda-corpos
VIDRO_LAMINADO_8MM     → Seguranca (coberturas)
VIDRO_LAMINADO_TEMP    → Maxima seguranca
VIDRO_JATEADO          → Privacidade
VIDRO_ACIDATO          → Fosco uniforme
VIDRO_SERIGRAFADO      → Estampado/colorido
VIDRO_EXTRA_CLEAR      → Alta transparencia
VIDRO_REFLECTIVO       → Controle solar
```

**FERRAGEM OBRIGATORIA**: DEPENDE DA APLICACAO

- Vidro avulso para mesa: NAO precisa de ferragem
- Vidro para porta/janela: SIM precisa de ferragem
- **ADICIONAR OPCAO**: "Apenas o vidro (sem ferragem)"

---

## 5. PORTAS DE VIDRO

| Campo             | Obrigatorio | Observacao                                    |
| ----------------- | ----------- | --------------------------------------------- |
| Tipo              | SIM         | CORRER, ABRIR, PIVOTANTE, CAMARAO, AUTOMATICA |
| Largura           | SIM         | Em metros                                     |
| Altura            | SIM         | Em metros                                     |
| Tipo de Vidro     | SIM         | Temperado (padrao)                            |
| Cor do Vidro      | SIM         | INCOLOR, FUME, BRONZE                         |
| Espessura         | SIM         | 8mm, 10mm, 12mm                               |
| Cor da Ferragem   | SIM         | CROMADO, PRETO, DOURADO, INOX                 |
| Tipo de Fechadura | SIM         | ELETRICA, MECANICA, DIGITAL                   |
| Puxador           | OPCIONAL    | TUBULAR, ALCA, EMBUTIDO                       |

### Tipos de Porta:

```
PORTA_CORRER           → Trilho superior/inferior
PORTA_ABRIR            → Com dobradicas
PORTA_PIVOTANTE        → Eixo central
PORTA_PIVOTANTE_PREM   → Mola piso embutida
PORTA_CAMARAO          → Articulada sanfonada
PORTA_AUTOMATICA       → Sensor de presenca
```

**FERRAGEM OBRIGATORIA**: SIM para todos os tipos

---

## 6. JANELAS DE VIDRO

| Campo           | Obrigatorio | Observacao                                          |
| --------------- | ----------- | --------------------------------------------------- |
| Tipo            | SIM         | CORRER, MAXIM_AR, BASCULANTE, GUILHOTINA, PIVOTANTE |
| Largura         | SIM         | Em metros                                           |
| Altura          | SIM         | Em metros                                           |
| Tipo de Vidro   | SIM         | Temperado ou Laminado                               |
| Cor do Vidro    | SIM         | INCOLOR, FUME, BRONZE, VERDE                        |
| Espessura       | SIM         | 6mm, 8mm, 10mm                                      |
| Cor da Ferragem | SIM         | BRANCO, PRETO, NATURAL                              |
| Qtd de Folhas   | OPCIONAL    | 2, 3, 4 folhas                                      |

### Tipos de Janela:

```
JANELA_CORRER          → Folhas deslizantes
JANELA_MAXIM_AR        → Abre para fora (inclinada)
JANELA_BASCULANTE      → Eixo horizontal
JANELA_GUILHOTINA      → Sobe e desce
JANELA_PIVOTANTE       → Eixo central vertical
```

**FERRAGEM OBRIGATORIA**: SIM para todos os tipos

---

## 7. GUARDA-CORPOS

| Campo           | Obrigatorio | Observacao                                         |
| --------------- | ----------- | -------------------------------------------------- |
| Tipo            | SIM         | AUTOPORTANTE, TORRES, BOTTONS, SPIDER, GRADIL_INOX |
| Comprimento     | SIM         | Em metros lineares                                 |
| Altura          | SIM         | Geralmente 1.10m (NBR)                             |
| Tipo de Vidro   | CONDICIONAL | NAO para GRADIL_INOX                               |
| Cor do Vidro    | CONDICIONAL | NAO para GRADIL_INOX                               |
| Espessura       | CONDICIONAL | 10mm minimo (NBR)                                  |
| Cor da Ferragem | SIM         | INOX, PRETO, DOURADO                               |

### Tipos de Guarda-Corpo:

```
GC_AUTOPORTANTE        → Vidro fixo no piso (sem montantes)
GC_AUTOPORTANTE_INOX   → Com acabamento inox
GC_TORRES              → Montantes verticais
GC_BOTTONS             → Fixacao por bottons
GC_SPIDER              → Fixacao tipo aranha
GC_GRADIL_INOX         → Apenas barras inox (SEM VIDRO!)
```

**FERRAGEM OBRIGATORIA**: SIM
**VIDRO OBRIGATORIO**: NAO para GRADIL_INOX (apenas barras metalicas)

---

## 8. CORTINAS DE VIDRO

| Campo           | Obrigatorio | Observacao                                      |
| --------------- | ----------- | ----------------------------------------------- |
| Tipo            | SIM         | EUROPEU, EUROPEU_PREMIUM, STANLEY, AUTOMATIZADA |
| Largura         | SIM         | Vao total em metros                             |
| Altura          | SIM         | Altura do vao                                   |
| Tipo de Vidro   | SIM         | Temperado                                       |
| Cor do Vidro    | SIM         | INCOLOR, FUME                                   |
| Espessura       | SIM         | 8mm, 10mm                                       |
| Cor da Ferragem | SIM         | BRANCO, PRETO, INOX                             |
| Qtd de Folhas   | CALCULADO   | Baseado na largura                              |

### Tipos de Cortina:

```
CORTINA_EUROPEU        → Sistema dobravel standard
CORTINA_EUROPEU_PREM   → Com trilho embutido
CORTINA_STANLEY        → Sistema americano
CORTINA_AUTOMATIZADA   → Com motor eletrico
```

**FERRAGEM OBRIGATORIA**: SIM (sistema de trilhos e roldanas)

---

## 9. PERGOLADOS E COBERTURAS

| Campo              | Obrigatorio | Observacao                                     |
| ------------------ | ----------- | ---------------------------------------------- |
| Tipo               | SIM         | ALUMINIO, INOX, VIDRO_LAMINADO, CONTROLE_SOLAR |
| Largura            | SIM         | Em metros                                      |
| Profundidade       | SIM         | Em metros                                      |
| Material Cobertura | SIM         | VIDRO, POLICARBONATO, ACRILICO                 |
| Espessura          | CONDICIONAL | Se vidro                                       |
| Cor                | SIM         | INCOLOR, FUME, BRONZE, VERDE                   |

### Tipos de Pergolado:

```
PERGOLADO_ALUMINIO     → Estrutura em aluminio
PERGOLADO_INOX         → Estrutura em inox
COBERTURA_LAMINADO     → Vidro laminado
COBERTURA_SOLAR        → Vidro controle solar
```

**FERRAGEM OBRIGATORIA**: Estrutura metalica inclusa
**OPCAO SEM ESTRUTURA**: Adicionar para cliente que ja tem estrutura

---

## 10. TAMPOS E PRATELEIRAS

| Campo         | Obrigatorio | Observacao                    |
| ------------- | ----------- | ----------------------------- |
| Tipo          | SIM         | MESA, EXTRA_CLEAR, PRATELEIRA |
| Largura       | SIM         | Em metros                     |
| Profundidade  | SIM         | Em metros (para mesa)         |
| Altura        | SIM         | Em metros (para prateleira)   |
| Tipo de Vidro | SIM         | Temperado                     |
| Cor do Vidro  | OPCIONAL    | INCOLOR, FUME, PRETO          |
| Espessura     | SIM         | 8mm, 10mm, 12mm               |
| Borda         | SIM         | LAPIDADA, BISOTADA, POLIDA    |

### Tipos de Tampo:

```
TAMPO_MESA             → Para mesas de jantar/escritorio
TAMPO_EXTRA_CLEAR      → Alta transparencia
PRATELEIRA             → Para nichos/estantes
```

**FERRAGEM OBRIGATORIA**: NAO

- Tampos apoiam diretamente na base
- Prateleiras usam suportes simples (vendidos separadamente)
- **OPCAO**: "Incluir suportes de prateleira"

---

## 11. DIVISORIAS

| Campo           | Obrigatorio | Observacao                   |
| --------------- | ----------- | ---------------------------- |
| Tipo            | SIM         | ESCRITORIO, ACUSTICA, PORTA  |
| Largura         | SIM         | Em metros                    |
| Altura          | SIM         | Em metros                    |
| Tipo de Vidro   | SIM         | Temperado, Laminado          |
| Cor do Vidro    | SIM         | INCOLOR, FUME, JATEADO       |
| Espessura       | SIM         | 8mm, 10mm, 12mm              |
| Cor da Ferragem | SIM         | PRETO, BRANCO, INOX          |
| Com Porta       | OPCIONAL    | Se inclui porta na divisoria |

### Tipos de Divisoria:

```
DIVISORIA_ESCRITORIO   → Paineis fixos
DIVISORIA_ACUSTICA     → Vidro duplo/laminado
DIVISORIA_PORTA        → Com porta integrada
```

**FERRAGEM OBRIGATORIA**: SIM (perfis de fixacao)

---

## 12. FECHAMENTOS DE AREA

| Campo           | Obrigatorio | Observacao                        |
| --------------- | ----------- | --------------------------------- |
| Tipo            | SIM         | SACADA, GOURMET, PISCINA, SERVICO |
| Largura         | SIM         | Perimetro total                   |
| Altura          | SIM         | Em metros                         |
| Tipo de Vidro   | SIM         | Temperado                         |
| Cor do Vidro    | SIM         | INCOLOR, FUME, VERDE              |
| Espessura       | SIM         | 8mm, 10mm                         |
| Cor da Ferragem | SIM         | BRANCO, PRETO, INOX               |
| Sistema         | SIM         | FIXO, CORRER, RECOLHIVEL          |

### Tipos de Fechamento:

```
FECHAMENTO_SACADA      → Para varandas/sacadas
FECHAMENTO_GOURMET     → Area gourmet
FECHAMENTO_PISCINA     → Cerca de piscina
FECHAMENTO_SERVICO     → Area de servico
```

**FERRAGEM OBRIGATORIA**: SIM (sistema de trilhos/perfis)

---

## 13. FERRAGENS (Avulsas)

| Campo      | Obrigatorio | Observacao                               |
| ---------- | ----------- | ---------------------------------------- |
| Tipo       | SIM         | PUXADOR, MOLA_PISO, DOBRADICA, FECHADURA |
| Modelo     | SIM         | Depende do tipo                          |
| Cor        | SIM         | CROMADO, PRETO, DOURADO, INOX            |
| Quantidade | SIM         | Unidades                                 |

### Ferragens Avulsas:

```
PUXADOR_TUBULAR        → 40cm, 60cm, 80cm, 100cm
MOLA_PISO              → Marca/modelo
DOBRADICA_90           → Para porta 90 graus
DOBRADICA_180          → Para porta 180 graus
FECHADURA_ELETRICA     → Com controle
FECHADURA_DIGITAL      → Biometrica/senha
```

**NAO PRECISA DE DIMENSOES**: Apenas selecionar modelo e quantidade
**NAO PRECISA DE VIDRO**: E a propria ferragem

---

## 14. KITS (Prontos)

| Campo      | Obrigatorio | Observacao                                   |
| ---------- | ----------- | -------------------------------------------- |
| Tipo       | SIM         | BOX_FRONTAL, BASCULANTE, ELEGANCE, PIVOTANTE |
| Cor        | SIM         | CROMADO, PRETO, BRANCO                       |
| Quantidade | SIM         | Geralmente 1                                 |

### Kits Disponiveis:

```
KIT_BOX_FRONTAL        → Ferragens para box frontal
KIT_BASCULANTE         → Para janela basculante
KIT_ELEGANCE           → Linha premium box
KIT_PIVOTANTE          → Para porta pivotante
```

**NAO PRECISA DE DIMENSOES**: Kit pronto
**NAO PRECISA DE VIDRO**: Apenas as ferragens

---

## 15. SERVICOS

| Campo     | Obrigatorio | Observacao                                               |
| --------- | ----------- | -------------------------------------------------------- |
| Tipo      | SIM         | INSTALACAO, MANUTENCAO, MEDICAO, EMERGENCIA, TROCA_VIDRO |
| Endereco  | SIM         | Local do servico                                         |
| Descricao | OPCIONAL    | Detalhes do servico                                      |
| Vidro     | CONDICIONAL | Apenas para TROCA_VIDRO                                  |

### Servicos:

```
INSTALACAO             → Instalacao de produtos
MANUTENCAO_PREVENTIVA  → Revisao periodica
MANUTENCAO_CORRETIVA   → Conserto
MEDICAO_TECNICA        → Visita para medicao
EMERGENCIA             → Atendimento urgente
TROCA_VIDRO            → Substituicao de vidro quebrado
                         Campos extras: dimensoes, tipo, cor
```

**NAO PRECISA DE DIMENSOES**: Exceto TROCA_VIDRO
**NAO PRECISA DE FERRAGEM**: E um servico

---

## RESUMO: PRECISA DE FERRAGEM?

| Categoria      | Precisa Ferragem? | Observacao                     |
| -------------- | ----------------- | ------------------------------ |
| BOX            | SIM               | Sempre                         |
| ESPELHOS       | NAO               | Cola/suporte simples           |
| VIDROS         | OPCIONAL          | Adicionar opcao "sem ferragem" |
| PORTAS         | SIM               | Sempre                         |
| JANELAS        | SIM               | Sempre                         |
| GUARDA_CORPO   | SIM               | Exceto montantes existentes    |
| CORTINAS_VIDRO | SIM               | Sistema de trilhos             |
| PERGOLADOS     | INCLUSO           | Estrutura metalica             |
| TAMPOS         | NAO               | Apoio direto                   |
| PRATELEIRAS    | OPCIONAL          | Suportes vendidos a parte      |
| DIVISORIAS     | SIM               | Perfis de fixacao              |
| FECHAMENTOS    | SIM               | Sistema de trilhos             |
| FERRAGENS      | N/A               | E a propria ferragem           |
| KITS           | N/A               | E o proprio kit                |
| SERVICOS       | NAO               | Servico de mao de obra         |

---

## ACOES NECESSARIAS

### 1. Adicionar opcao "Sem Ferragem" para:

- [ ] VIDROS (categoria inteira)
- [ ] PRATELEIRAS (suportes opcionais)
- [ ] PERGOLADOS (cliente tem estrutura)
- [ ] GUARDA_CORPO (montantes existentes)

### 2. Remover campo "Cor da Ferragem" de:

- [x] ESPELHOS (ja implementado)
- [ ] TAMPOS
- [ ] SERVICOS

### 3. Campos condicionais a implementar:

- [ ] GUARDA_CORPO.GRADIL_INOX → Esconder campos de vidro
- [ ] SERVICOS.TROCA_VIDRO → Mostrar campos de vidro
- [ ] VIDROS → Mostrar opcao "apenas vidro/com ferragem"

### 4. Validacoes NBR:

- [x] Espessura minima por area (ThicknessCalculator)
- [x] Guarda-corpo altura minima 1.10m
- [ ] Validar espessura minima para cada aplicacao

---

## FLUXO RECOMENDADO NO CHAT AI

```
1. Cliente escolhe categoria (BOX, ESPELHOS, VIDROS, etc.)
   ↓
2. AI mostra produtos da categoria
   ↓
3. Cliente seleciona produto especifico
   ↓
4. AI pergunta dimensoes (se aplicavel)
   ↓
5. AI pergunta tipo de vidro (se aplicavel)
   ↓
6. AI pergunta cor do vidro (se aplicavel)
   ↓
7. SE categoria precisa de ferragem:
   - AI pergunta cor da ferragem
   - AI pergunta modelo do kit (se aplicavel)
   ↓
   SE categoria NAO precisa (ESPELHOS, TAMPOS):
   - Pula direto para quantidade
   ↓
   SE categoria OPCIONAL (VIDROS, PRATELEIRAS):
   - AI pergunta: "Deseja incluir ferragem/suportes?"
   ↓
8. AI pergunta quantidade
   ↓
9. AI confirma item e oferece adicionar mais
```

---

## EXEMPLO DE PROMPTS PARA O AGENTE

### Para ESPELHOS:

```
"Qual o tamanho do espelho? (largura x altura em metros)"
"Qual o tipo de borda? Lapidado, Bisotado ou outro?"
"Se bisotado, qual a largura do bisote?"
"Alguma forma especial? Retangular, redondo, oval?"
```

**NAO PERGUNTAR**: Cor da ferragem, kit, etc.

### Para VIDROS:

```
"Qual o tamanho do vidro? (largura x altura)"
"Qual a aplicacao? Mesa, divisoria, porta..."
"O vidro sera instalado em ferragem existente ou precisa de ferragem nova?"
```

### Para BOX:

```
"Qual o modelo do box? Frontal, canto, pivotante..."
"Qual o tamanho do vao? (largura x altura)"
"Qual a cor do vidro? Incolor, fume, bronze..."
"Qual a cor da ferragem? Cromado, preto, dourado..."
```

---

Documento criado em: 2025-01-XX
Versao: 1.0
