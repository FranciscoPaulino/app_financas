"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { CATEGORY_COLORS } from "@/lib/categories"
import { brl, currentMonth, formatDate } from "@/lib/transactions"
import { summarize, useTransactions } from "@/lib/use-transactions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function DashboardPage() {
  const [month, setMonth] = useState(currentMonth())
  const { data, loading, error } = useTransactions({ month, category: "", search: "" })

  const { income, expense, balance } = useMemo(() => summarize(data), [data])

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    data
      .filter((t) => t.type === "despesa")
      .forEach((t) => map.set(t.category, (map.get(t.category) ?? 0) + t.amount))
    return [...map].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
  }, [data])

  const cards = [
    { title: "Receitas", value: income, icon: ArrowUpCircle, color: "text-income" },
    { title: "Despesas", value: expense, icon: ArrowDownCircle, color: "text-expense" },
    { title: "Saldo", value: balance, icon: Wallet, color: balance >= 0 ? "text-primary" : "text-expense" },
  ]

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Input type="month" aria-label="Mês" className="w-44" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{title}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${color}`}>{loading ? "—" : brl(value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Despesas por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {byCategory.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Sem despesas neste mês.</p>
            ) : (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                        {byCategory.map((c) => (
                          <Cell key={c.name} fill={CATEGORY_COLORS[c.name] ?? "#64748b"} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => brl(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="mt-2 space-y-1 text-sm">
                  {byCategory.map((c) => (
                    <li key={c.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: CATEGORY_COLORS[c.name] ?? "#64748b" }} />
                        {c.name}
                      </span>
                      <span className="text-muted-foreground">{brl(c.value)}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Últimas transações</CardTitle>
            <Link href="/transacoes" className="text-sm font-medium text-primary hover:underline">
              Ver todas
            </Link>
          </CardHeader>
          <CardContent>
            {data.length === 0 ? (
              <p className="py-16 text-center text-sm text-muted-foreground">Nenhuma transação neste mês.</p>
            ) : (
              <ul className="divide-y">
                {data.slice(0, 6).map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{t.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(t.date)} · {t.category}
                      </p>
                    </div>
                    <span className={`whitespace-nowrap text-sm font-semibold ${t.type === "receita" ? "text-income" : "text-expense"}`}>
                      {t.type === "receita" ? "+" : "-"} {brl(t.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
