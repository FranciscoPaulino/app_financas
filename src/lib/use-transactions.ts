"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { monthRange, type Transaction } from "@/lib/transactions"

export type Filters = { month: string; category: string; search: string }

export function useTransactions({ month, category, search }: Filters) {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    let q = createClient()
      .from("transactions")
      .select("id, description, amount, date, type, category")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false })

    if (month) {
      const { start, end } = monthRange(month)
      q = q.gte("date", start).lt("date", end)
    }
    if (category) q = q.eq("category", category)
    if (search.trim()) q = q.ilike("description", `%${search.trim()}%`)

    const { data, error } = await q
    if (error) setError("Não foi possível carregar as transações.")
    else {
      setError(null)
      setData((data ?? []).map((t) => ({ ...t, amount: Number(t.amount) })) as Transaction[])
    }
    setLoading(false)
  }, [month, category, search])

  useEffect(() => {
    const id = setTimeout(reload, 250) // debounce da busca
    return () => clearTimeout(id)
  }, [reload])

  return { data, loading, error, reload }
}

export function summarize(rows: Transaction[]) {
  const income = rows.filter((t) => t.type === "receita").reduce((s, t) => s + t.amount, 0)
  const expense = rows.filter((t) => t.type === "despesa").reduce((s, t) => s + t.amount, 0)
  return { income, expense, balance: income - expense }
}
