"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wallet } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AuthForm({ mode }: { mode: "login" | "cadastro" }) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const isLogin = mode === "login"

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setLoading(true)
    const supabase = createClient()

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError("E-mail ou senha inválidos.")
      else {
        router.push("/dashboard")
        router.refresh()
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else if (data.session) {
        router.push("/dashboard")
        router.refresh()
      } else setInfo("Conta criada! Confirme seu e-mail para entrar.")
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <Link href="/" className="flex items-center justify-center gap-2 text-lg font-semibold">
          <Wallet className="h-6 w-6 text-primary" /> Finanças
        </Link>
        <Card>
          <CardContent className="p-6">
            <h1 className="mb-1 text-xl font-semibold">{isLogin ? "Entrar" : "Criar conta"}</h1>
            <p className="mb-5 text-sm text-muted-foreground">
              {isLogin ? "Acesse suas finanças." : "Comece a organizar suas finanças."}
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {info && <p className="text-sm text-income">{info}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Aguarde..." : isLogin ? "Entrar" : "Cadastrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? "Não tem conta? " : "Já tem conta? "}
          <Link href={isLogin ? "/cadastro" : "/login"} className="font-medium text-primary hover:underline">
            {isLogin ? "Cadastre-se" : "Entrar"}
          </Link>
        </p>
      </div>
    </main>
  )
}
