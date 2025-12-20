# ⚡ TRANSFERIR DOMÍNIO - 3 MINUTOS

## 🎯 OBJETIVO
Transferir `www.versatiglass.com.br` do projeto antigo para o novo projeto `versati-glass`

---

## 📋 EXECUTE ESTES PASSOS:

### PASSO 1: Encontrar Projeto Antigo (1 minuto)

1. **Abra:** https://vercel.com/leopalha

2. **Procure** por um projeto que tenha o domínio `versatiglass.com.br`
   - Pode ser um projeto chamado "versatiglass", "versati", "vidracaria", etc.
   - Clique em cada projeto e vá em **Settings** → **Domains**
   - Procure até encontrar o que tem `www.versatiglass.com.br`

3. **Anote o nome** do projeto encontrado

---

### PASSO 2: Remover Domínio do Projeto Antigo (30 segundos)

1. **No projeto antigo** que encontrou:
   - Vá em **Settings** → **Domains**

2. **Encontre os domínios:**
   - `versatiglass.com.br`
   - `www.versatiglass.com.br`

3. **Para cada domínio:**
   - Clique nos **3 pontinhos** (⋮) à direita
   - Clique em **"Remove"**
   - Confirme a remoção

---

### PASSO 3: Adicionar ao Projeto Novo (1 minuto)

1. **Abra o projeto versati-glass:**
   https://vercel.com/leopalhas-projects/versati-glass

2. **Vá em:** Settings → Domains

3. **Adicione os domínios:**

   **Primeiro domínio:**
   - Digite: `versatiglass.com.br`
   - Clique em **"Add"**

   **Segundo domínio:**
   - Digite: `www.versatiglass.com.br`
   - Clique em **"Add"**

4. **Marque www.versatiglass.com.br como primário** (opcional)

---

### PASSO 4: Configurar DNS (se necessário)

Se a Vercel pedir para configurar DNS, adicione estes registros no seu provedor DNS:

#### Para versatiglass.com.br (root):
```
Type: A
Name: @
Value: 76.76.21.21
```

#### Para www.versatiglass.com.br:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## ✅ VERIFICAR

Após adicionar, aguarde ~1 minuto e acesse:

```
https://www.versatiglass.com.br
```

Deve mostrar o **novo sistema** Versati Glass!

---

## 🆘 SE DER ERRO

### "Domain is already assigned"
- Você não removeu do projeto antigo ainda
- Volte ao Passo 2

### "Invalid configuration"
- Verifique as configurações DNS no seu provedor
- Pode levar até 24h para propagar (geralmente 5-10 min)

### SSL não ativa
- A Vercel gera SSL automaticamente
- Aguarde 1-2 minutos após adicionar o domínio

---

## 🚀 ALTERNATIVA VIA CLI

Se preferir fazer via CLI depois de remover do dashboard:

```powershell
# Adicionar domínios
vercel domains add versatiglass.com.br
vercel domains add www.versatiglass.com.br

# Verificar
vercel domains ls
```

---

## 📊 STATUS ESPERADO

Após concluir, você terá:

```
✅ www.versatiglass.com.br → versati-glass (novo)
✅ versati-glass.vercel.app → versati-glass (novo)
✅ SSL automático ativado
✅ Sistema atualizado no ar
```

---

**COMECE AGORA:** https://vercel.com/leopalha

Procure o projeto antigo com o domínio!
