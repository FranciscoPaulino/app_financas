"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { CATEGORIES } from "@/lib/categories"
import { formatInputBRL, parseBRL, type Transaction, type TransactionType } from "@/lib/transactions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const today = () => new Date().toISOString().slice(0, 10)

export function TransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSaved,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
  onSaved: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{transaction ? "Editar transação" : "Nova transação"}</DialogTitle>
        <DialogDescription>Preencha os dados da receita ou despesa.</DialogDescription>
        <TransactionForm transaction={transaction} onDone={() => { onOpenChange(false); onSaved() }} />
      </DialogContent>
    </Dialog>
  )
}

function TransactionForm({ transaction, onDone }: { transaction: Transaction | null; onDone: () => void }) {
  const [description, setDescription] = useState(transaction?.description ?? "")
  const [amount, setAmount] = useState(transaction ? formatInputBRL(transaction.amount) : "")
  const [date, setDate] = useState(transaction?.date ?? today())
  const [type, setType] = useState<TransactionType>(transaction?.type ?? "despesa")
  const [category, setCategory] = useState<string>(transaction?.category ?? "Outros")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseBRL(amount)
    if (!description.trim() || !(value > 0)) {
      setError("Informe uma descrição e um valor maior que zero.")
      return
    }
    setSaving(true)
    const payload = { description: description.trim(), amount: value, date, type, category }
    const supabase = createClient()
    const { error } = transaction
      ? await supabase.from("transactions").update(payload).eq("id", transaction.id)
      : await supabase.from("transactions").insert(payload)
    setSaving(false)
    if (error) {
      setError("Não foi possível salvar. Tente novamente.")
      return
    }
    onDone()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(["despesa", "receita"] as const).map((t) => (
          <Button
            key={t}
            type="button"
            variant={type === t ? "default" : "outline"}
            className={type === t ? (t === "receita" ? "bg-income hover:bg-income/90" : "bg-expense hover:bg-expense/90") : ""}
            onClick={() => setType(t)}
          >
            {t === "receita" ? "Receita" : "Despesa"}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input id="amount" inputMode="decimal" placeholder="0,00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? "Salvando..." : "Salvar"}
      </Button>
    </form>
  )
}
