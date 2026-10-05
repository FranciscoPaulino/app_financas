import Link from "next/link"
import { BarChart3, Download, Filter, ShieldCheck, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  { icon: BarChart3, title: "Dashboard visual", text: "Receitas, despesas e saldo do mês, com gráfico por categoria." },
  { icon: Filter, title: "Filtros e busca", text: "Encontre transações por mês, categoria ou descrição." },
  { icon: Download, title: "Exportar CSV", text: "Leve suas transações filtradas para a planilha." },
  { icon: ShieldCheck, title: "Seus dados, só seus", text: "Autenticação segura e isolamento por usuário." },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <span className="flex items-center gap-2 font-semibold">
          <Wallet className="h-6 w-6 text-primary" /> Finanças
        </span>
        <div className="flex gap-2">
          <Button variant="ghost" asChild><Link href="/login">Entrar</Link></Button>
          <Button asChild><Link href="/cadastro">Começar</Link></Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Suas finanças, <span className="text-primary">simples e visuais</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Registre receitas e despesas, categorize e veja para onde seu dinheiro vai — em um só lugar.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" asChild><Link href="/cadastro">Criar conta grátis</Link></Button>
          <Button size="lg" variant="outline" asChild><Link href="/login">Já tenho conta</Link></Button>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-lg border bg-card p-5 shadow-sm">
            <Icon className="mb-3 h-6 w-6 text-primary" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
