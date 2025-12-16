# 📦 VERSATI GLASS - COMPONENT LIBRARY

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Sincronizado com:** Design System v1.0.0

---

## VISÃO GERAL

Biblioteca de componentes React reutilizáveis para a plataforma Versati Glass. Todos os componentes seguem o Design System e são construídos com TypeScript, Tailwind CSS e Radix UI.

---

## 1. COMPONENTES UI (PRIMITIVOS)

### 1.1 Button

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gold-500 text-neutral-0 hover:bg-gold-600 hover:shadow-glow-gold active:scale-[0.98]",
        secondary:
          "border-2 border-gold-500 text-gold-500 bg-transparent hover:bg-gold-500/10 hover:shadow-glow-gold",
        ghost:
          "text-white/80 hover:bg-white/5 hover:text-white",
        danger:
          "bg-error text-white hover:bg-error-dark",
        link:
          "text-gold-500 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-13 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

**Uso:**
```tsx
<Button>Confirmar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost" size="sm">Ver mais</Button>
<Button loading>Processando...</Button>
<Button disabled>Indisponível</Button>
```

---

### 1.2 Input

```tsx
// components/ui/input.tsx
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-2"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "w-full bg-neutral-250 border rounded-md px-4 py-3 text-white",
            "placeholder:text-neutral-500",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-gold-500/20",
            error
              ? "border-error focus:border-error"
              : "border-neutral-300 focus:border-gold-500",
            "disabled:bg-neutral-300 disabled:text-neutral-500 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-error mt-1">{error}</p>
        )}
        {hint && !error && (
          <p className="text-sm text-neutral-500 mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
```

**Uso:**
```tsx
<Input label="Email" type="email" placeholder="seu@email.com" />
<Input label="Senha" type="password" error="Senha inválida" />
<Input hint="Mínimo 8 caracteres" />
```

---

### 1.3 Card

```tsx
// components/ui/card.tsx
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "hover" | "premium" | "glass";
}

export function Card({
  className,
  variant = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300",
        {
          default: "bg-neutral-150 border-neutral-300",
          hover:
            "bg-neutral-150 border-neutral-300 hover:border-gold-500/30 hover:shadow-card-hover cursor-pointer",
          premium:
            "bg-gradient-to-br from-neutral-150 to-neutral-100 border-gold-500/20 shadow-card",
          glass:
            "bg-neutral-150/80 backdrop-blur-lg border-gold-500/10",
        }[variant],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-0", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-xl font-semibold text-white", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-neutral-500 mt-1", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 pt-0 flex items-center gap-4", className)}
      {...props}
    />
  );
}
```

**Uso:**
```tsx
<Card variant="hover">
  <CardHeader>
    <CardTitle>Box Elegance</CardTitle>
    <CardDescription>O mais vendido</CardDescription>
  </CardHeader>
  <CardContent>
    <img src="/box.jpg" alt="Box" />
  </CardContent>
  <CardFooter>
    <Button>Ver detalhes</Button>
  </CardFooter>
</Card>
```

---

### 1.4 Badge

```tsx
// components/ui/badge.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-neutral-200 text-neutral-700",
        gold: "bg-gold-500/10 text-gold-500 border border-gold-500/20",
        success: "bg-success/10 text-success border border-success/20",
        warning: "bg-warning/10 text-warning border border-warning/20",
        error: "bg-error/10 text-error border border-error/20",
        info: "bg-info/10 text-info border border-info/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

**Uso:**
```tsx
<Badge>Padrão</Badge>
<Badge variant="gold">Destaque</Badge>
<Badge variant="success">Aprovado</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="error">Cancelado</Badge>
```

---

### 1.5 Modal (Dialog)

```tsx
// components/ui/modal.tsx
"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 w-full p-6",
                  "bg-neutral-100 border border-neutral-300 rounded-2xl shadow-2xl",
                  sizeClasses[size]
                )}
                initial={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
                transition={{ duration: 0.2 }}
              >
                {title && (
                  <Dialog.Title className="text-xl font-semibold text-white mb-2">
                    {title}
                  </Dialog.Title>
                )}
                {description && (
                  <Dialog.Description className="text-neutral-500 mb-4">
                    {description}
                  </Dialog.Description>
                )}
                {children}
                <Dialog.Close asChild>
                  <button
                    className="absolute right-4 top-4 text-neutral-500 hover:text-white transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

**Uso:**
```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Abrir Modal</Button>

<Modal
  open={open}
  onOpenChange={setOpen}
  title="Confirmar ação"
  description="Tem certeza que deseja continuar?"
>
  <div className="flex gap-4 justify-end mt-6">
    <Button variant="ghost" onClick={() => setOpen(false)}>
      Cancelar
    </Button>
    <Button>Confirmar</Button>
  </div>
</Modal>
```

---

### 1.6 Select

```tsx
// components/ui/select.tsx
"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Selecione...",
  label,
  error,
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "w-full flex items-center justify-between",
            "bg-neutral-250 border rounded-md px-4 py-3 text-white",
            "focus:outline-none focus:ring-2 focus:ring-gold-500/20",
            error ? "border-error" : "border-neutral-300 focus:border-gold-500",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "bg-neutral-100 border border-neutral-300 rounded-lg shadow-xl",
              "overflow-hidden z-50"
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1">
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md",
                    "text-white cursor-pointer outline-none",
                    "hover:bg-neutral-200 focus:bg-neutral-200",
                    "data-[state=checked]:text-gold-500"
                  )}
                >
                  <SelectPrimitive.ItemText>
                    {option.label}
                  </SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="text-sm text-error mt-1">{error}</p>}
    </div>
  );
}
```

---

### 1.7 Toast (Notificações)

```tsx
// components/ui/toast.tsx
"use client";

import { Toaster as Sonner, toast } from "sonner";

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-neutral-100 border border-neutral-300 rounded-lg p-4 shadow-xl flex items-center gap-3",
          title: "text-white font-medium",
          description: "text-neutral-500 text-sm",
          actionButton: "bg-gold-500 text-neutral-0 px-3 py-1 rounded text-sm",
          cancelButton: "text-neutral-500 text-sm",
          success: "border-success/30",
          error: "border-error/30",
        },
      }}
    />
  );
}

export { toast };
```

**Uso:**
```tsx
import { toast } from "@/components/ui/toast";

toast.success("Orçamento enviado com sucesso!");
toast.error("Erro ao processar pagamento");
toast("Mensagem padrão");
```

---

## 2. COMPONENTES DE LAYOUT

### 2.1 Header

```tsx
// components/layout/header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

const navigation = [
  { name: "Início", href: "/" },
  { name: "Produtos", href: "/produtos" },
  { name: "Serviços", href: "/servicos" },
  { name: "Portfólio", href: "/portfolio" },
  { name: "Contato", href: "/contato" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-50/80 backdrop-blur-lg border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-gold-500"
                    : "text-neutral-700 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="tel:+5521982536229"
              className="flex items-center gap-2 text-neutral-700 hover:text-white transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm">(21) 98253-6229</span>
            </a>
            <Button asChild>
              <Link href="/orcamento">Orçamento</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-neutral-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-100 border-t border-neutral-300">
          <nav className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "block px-4 py-2 rounded-lg text-base transition-colors",
                  pathname === item.href
                    ? "bg-gold-500/10 text-gold-500"
                    : "text-neutral-700 hover:bg-neutral-200"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-neutral-300">
              <Button className="w-full" asChild>
                <Link href="/orcamento">Solicitar Orçamento</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
```

---

### 2.2 Footer

```tsx
// components/layout/footer.tsx
import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  return (
    <footer className="bg-neutral-100 border-t border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-neutral-500 max-w-sm">
              Transparência que transforma espaços. Soluções em vidro com
              qualidade premium e atendimento 24h.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://instagram.com/versatiglass"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-gold-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com/versatiglass"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-gold-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Produtos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/produtos/box"
                  className="text-neutral-500 hover:text-gold-500 transition-colors"
                >
                  Box para Banheiro
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos/espelhos"
                  className="text-neutral-500 hover:text-gold-500 transition-colors"
                >
                  Espelhos
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos/vidros"
                  className="text-neutral-500 hover:text-gold-500 transition-colors"
                >
                  Vidros Temperados
                </Link>
              </li>
              <li>
                <Link
                  href="/produtos/fechamentos"
                  className="text-neutral-500 hover:text-gold-500 transition-colors"
                >
                  Fechamentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-neutral-500">
                <MapPin className="h-5 w-5 flex-shrink-0 text-gold-500" />
                <span>
                  Estrada Três Rios, 1156
                  <br />
                  Freguesia, Rio de Janeiro - RJ
                </span>
              </li>
              <li>
                <a
                  href="tel:+5521982536229"
                  className="flex items-center gap-3 text-neutral-500 hover:text-gold-500 transition-colors"
                >
                  <Phone className="h-5 w-5 text-gold-500" />
                  (21) 98253-6229
                </a>
              </li>
              <li>
                <a
                  href="mailto:versatiglass@gmail.com"
                  className="flex items-center gap-3 text-neutral-500 hover:text-gold-500 transition-colors"
                >
                  <Mail className="h-5 w-5 text-gold-500" />
                  versatiglass@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-300 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Versati Glass. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/politica-privacidade"
              className="text-neutral-500 hover:text-gold-500 transition-colors"
            >
              Política de Privacidade
            </Link>
            <Link
              href="/termos-uso"
              className="text-neutral-500 hover:text-gold-500 transition-colors"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

---

### 2.3 Sidebar (Portal/Admin)

```tsx
// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Calendar,
  Folder,
  CreditCard,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const portalNavigation = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { name: "Minhas Ordens", href: "/portal/ordens", icon: ClipboardList },
  { name: "Orçamentos", href: "/portal/orcamentos", icon: FileText },
  { name: "Agendamentos", href: "/portal/agenda", icon: Calendar },
  { name: "Documentos", href: "/portal/documentos", icon: Folder },
  { name: "Pagamentos", href: "/portal/pagamentos", icon: CreditCard },
  { name: "Meu Perfil", href: "/portal/perfil", icon: User },
];

interface SidebarProps {
  type: "portal" | "admin";
}

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname();
  const navigation = type === "portal" ? portalNavigation : adminNavigation;

  return (
    <aside className="w-64 bg-neutral-100 border-r border-neutral-300 min-h-screen p-4">
      {/* Logo */}
      <div className="mb-8">
        <Link href="/">
          <span className="text-xl font-display text-gold-500">
            Versati Glass
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/portal" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-gold-500/10 text-gold-500"
                  : "text-neutral-500 hover:bg-neutral-200 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-neutral-500 hover:bg-neutral-200 hover:text-white transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
```

---

## 3. COMPONENTES DE FEATURE

### 3.1 ProductCard

```tsx
// components/features/product-card.tsx
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    category: string;
    thumbnail: string;
    shortDescription?: string;
    priceRangeMin?: number;
    priceRangeMax?: number;
    isFeatured?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card variant="hover" className="group overflow-hidden">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.thumbnail || "/placeholder.jpg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isFeatured && (
          <Badge variant="gold" className="absolute top-4 left-4">
            Destaque
          </Badge>
        )}
      </div>

      <CardContent className="pt-4">
        <p className="text-xs text-gold-500 uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="text-lg font-semibold text-white mb-2">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-neutral-500 line-clamp-2">
            {product.shortDescription}
          </p>
        )}
        {product.priceRangeMin && (
          <p className="text-gold-500 font-medium mt-3">
            A partir de {formatCurrency(product.priceRangeMin)}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="secondary" className="w-full" asChild>
          <Link href={`/produtos/${product.category}/${product.slug}`}>
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

### 3.2 OrderTimeline

```tsx
// components/features/order-timeline.tsx
import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface TimelineEntry {
  id: string;
  status: string;
  description: string;
  createdAt: Date;
}

interface OrderTimelineProps {
  timeline: TimelineEntry[];
  currentStatus: string;
}

const statusOrder = [
  "orcamento_enviado",
  "aguardando_pagamento",
  "aprovado",
  "em_producao",
  "pronto_entrega",
  "instalacao_agendada",
  "instalando",
  "concluido",
];

const statusLabels: Record<string, string> = {
  orcamento_enviado: "Orçamento enviado",
  aguardando_pagamento: "Aguardando pagamento",
  aprovado: "Aprovado",
  em_producao: "Em produção",
  pronto_entrega: "Pronto para entrega",
  instalacao_agendada: "Instalação agendada",
  instalando: "Instalando",
  concluido: "Concluído",
};

export function OrderTimeline({ timeline, currentStatus }: OrderTimelineProps) {
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="space-y-0">
      {statusOrder.map((status, index) => {
        const entry = timeline.find((t) => t.status === status);
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={status} className="flex gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isPast && "bg-success text-white",
                  isCurrent && "bg-gold-500 text-neutral-0",
                  isFuture && "bg-neutral-300 text-neutral-500"
                )}
              >
                {isPast ? (
                  <Check className="w-4 h-4" />
                ) : isCurrent ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
              </div>
              {index < statusOrder.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 h-12",
                    isPast ? "bg-success" : "bg-neutral-300"
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className="pb-8">
              <p
                className={cn(
                  "font-medium",
                  isPast && "text-success",
                  isCurrent && "text-gold-500",
                  isFuture && "text-neutral-500"
                )}
              >
                {statusLabels[status]}
              </p>
              {entry && (
                <>
                  <p className="text-sm text-neutral-500 mt-1">
                    {entry.description}
                  </p>
                  <p className="text-xs text-neutral-600 mt-1">
                    {formatDate(entry.createdAt)}
                  </p>
                </>
              )}
              {isFuture && (
                <p className="text-sm text-neutral-600 mt-1">Aguardando</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

### 3.3 WhatsAppButton (Floating)

```tsx
// components/features/whatsapp-button.tsx
"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "5521982536229";
const DEFAULT_MESSAGE = "Olá! Gostaria de fazer um orçamento.";

interface WhatsAppButtonProps {
  message?: string;
}

export function WhatsAppButton({
  message = DEFAULT_MESSAGE,
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#20bd5a] transition-colors"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="font-medium hidden sm:inline">Fale conosco</span>
    </motion.a>
  );
}
```

---

### 3.4 QuoteWizard

```tsx
// components/features/quote-wizard/index.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuoteStore } from "@/stores/quote.store";
import { StepIndicator } from "./step-indicator";
import { CategoryStep } from "./steps/category-step";
import { ProductStep } from "./steps/product-step";
import { MeasuresStep } from "./steps/measures-step";
import { ContactStep } from "./steps/contact-step";
import { SummaryStep } from "./steps/summary-step";
import { ScheduleStep } from "./steps/schedule-step";

const steps = [
  { id: 1, name: "Categoria" },
  { id: 2, name: "Produto" },
  { id: 3, name: "Medidas" },
  { id: 4, name: "Dados" },
  { id: 5, name: "Resumo" },
  { id: 6, name: "Agendar" },
];

export function QuoteWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const { reset } = useQuoteStore();

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <CategoryStep onNext={nextStep} />;
      case 2:
        return <ProductStep onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <MeasuresStep onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <ContactStep onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <SummaryStep onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <ScheduleStep onBack={prevStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

---

## 4. COMPONENTES COMPARTILHADOS

### 4.1 Logo

```tsx
// components/shared/logo.tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 40 },
    md: { width: 150, height: 60 },
    lg: { width: 200, height: 80 },
  };

  return (
    <Image
      src="/logo.svg"
      alt="Versati Glass"
      width={sizes[size].width}
      height={sizes[size].height}
      className={cn("h-auto w-auto", className)}
      priority
    />
  );
}
```

---

### 4.2 EmptyState

```tsx
// components/shared/empty-state.tsx
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-200 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-neutral-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-neutral-500 max-w-sm mb-6">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}
```

---

### 4.3 LoadingSpinner

```tsx
// components/shared/loading-spinner.tsx
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <svg
      className={cn("animate-spin text-gold-500", sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
```

---

### 4.4 PageHeader

```tsx
// components/shared/page-header.tsx
interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode; // Actions
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-neutral-500 mt-1">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-4">{children}</div>}
    </div>
  );
}
```

---

## 5. HOOKS PERSONALIZADOS

### 5.1 useAuth

```tsx
// hooks/use-auth.ts
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const user = session?.user;

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Credenciais inválidas");
    }

    router.push("/portal");
  };

  const loginWithGoogle = () => signIn("google", { callbackUrl: "/portal" });

  const logout = () => signOut({ callbackUrl: "/" });

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
  };
}
```

---

### 5.2 useProducts

```tsx
// hooks/use-products.ts
import { useQuery } from "@tanstack/react-query";
import { ProductCategory } from "@prisma/client";

interface UseProductsOptions {
  category?: ProductCategory;
  featured?: boolean;
}

async function fetchProducts(options: UseProductsOptions) {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);
  if (options.featured) params.set("featured", "true");

  const res = await fetch(`/api/products?${params}`);
  if (!res.ok) throw new Error("Erro ao carregar produtos");
  return res.json();
}

export function useProducts(options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ["products", options],
    queryFn: () => fetchProducts(options),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const res = await fetch(`/api/products/${slug}`);
      if (!res.ok) throw new Error("Produto não encontrado");
      return res.json();
    },
    enabled: !!slug,
  });
}
```

---

## 6. STORES (ZUSTAND)

### 6.1 Quote Store

```tsx
// stores/quote.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface QuoteItem {
  productId?: string;
  productName: string;
  category: string;
  color?: string;
  width?: number;
  height?: number;
  quantity: number;
  images: string[];
}

interface QuoteStore {
  // State
  items: QuoteItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes: string;

  // Actions
  addItem: (item: QuoteItem) => void;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: Partial<QuoteItem>) => void;
  setCustomerInfo: (info: Partial<QuoteStore>) => void;
  setAddress: (address: Partial<QuoteStore["address"]>) => void;
  setNotes: (notes: string) => void;
  reset: () => void;
}

const initialState = {
  items: [],
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  notes: "",
};

export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set) => ({
      ...initialState,

      addItem: (item) =>
        set((state) => ({ items: [...state.items, item] })),

      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),

      updateItem: (index, item) =>
        set((state) => ({
          items: state.items.map((existing, i) =>
            i === index ? { ...existing, ...item } : existing
          ),
        })),

      setCustomerInfo: (info) => set(info),

      setAddress: (address) =>
        set((state) => ({
          address: { ...state.address, ...address },
        })),

      setNotes: (notes) => set({ notes }),

      reset: () => set(initialState),
    }),
    {
      name: "versati-quote",
    }
  )
);
```

---

*Versati Glass Component Library v1.0 - Dezembro 2024*
