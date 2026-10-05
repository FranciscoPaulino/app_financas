"use client"

import { useState } from "react"
import { Download, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/categories"
import { brl, currentMonth, downloadCSV, formatDate, type Transaction } from "@/lib/transactions"
import { useTransactions } from "@/lib/use-transactions"
import { TransactionDialog } from "@/components/transaction-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

export default function TransacoesPage() {
  const [month, setMonth] = useState(currentMonth())
  const [category, setCategory] = useState("")
  const [search, setSearch] = useState("")
  const { data, loading, error, reload } = useTransactions({ month, category, search })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)

  function openNew() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(t: Transaction) {
    setEditing(t)
    setDialogOpen(true)
  }
  async function remove(t: Transaction) {
    if (!confirm(`Excluir "${t.description}"?`)) return
    await createClient().from("transactions").delete().eq("id", t.id)
    reload()
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Transações</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={data.length === 0}
            onClick={() => downloadCSV(data, `transacoes-${month || "todas"}.csv`)}
          >
            <Download className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> Nova
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar descrição..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Input type="month" aria-label="Mês" value={month} onChange={(e) => setMonth(e.target.value)} />
        <Select aria-label="Categoria" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todas as categorias</option>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      <Card className="overflow-hidden">
        {error ? (
          <p className="p-6 text-center text-sm text-destructive">{error}</p>
        ) : loading ? (
          <p className="p-6 text-center text-sm text-muted-foreground">Carregando...</p>
        ) : data.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Nenhuma transação encontrada.</p>
        ) : (
          <ul className="divide-y">
            {data.map((t) => (
              <li key={t.id} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(t.date)}</span>
                    <Badge style={{ borderColor: CATEGORY_COLORS[t.category], color: CATEGORY_COLORS[t.category] }}>
                      {t.category}
                    </Badge>
                  </div>
                </div>
                <span className={`whitespace-nowrap font-semibold ${t.type === "receita" ? "text-income" : "text-expense"}`}>
                  {t.type === "receita" ? "+" : "-"} {brl(t.amount)}
                </span>
                <div className="flex">
                  <Button variant="ghost" size="icon" aria-label="Editar" onClick={() => openEdit(t)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Excluir" onClick={() => remove(t)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} transaction={editing} onSaved={reload} />
    </>
  )
}
