export type TransactionType = "receita" | "despesa"

export type Transaction = {
  id: string
  description: string
  amount: number
  date: string // YYYY-MM-DD
  type: TransactionType
  category: string
}

export const brl = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

/** Converte texto pt-BR ("1.234,56") em número. Retorna NaN se inválido. */
export function parseBRL(text: string) {
  const clean = text.trim().replace(/\./g, "").replace(",", ".")
  return /^\d+(\.\d{1,2})?$/.test(clean) ? Number(clean) : NaN
}

export const formatInputBRL = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

export const currentMonth = () => new Date().toISOString().slice(0, 7) // YYYY-MM

/** Intervalo [início, fim) de um mês YYYY-MM, para filtro no banco. */
export function monthRange(month: string) {
  const [y, m] = month.split("-").map(Number)
  const next = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`
  return { start: `${month}-01`, end: `${next}-01` }
}

export function toCSV(rows: Transaction[]) {
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const header = ["Data", "Descrição", "Tipo", "Categoria", "Valor"]
  const lines = rows.map((t) =>
    [
      formatDate(t.date),
      esc(t.description),
      t.type,
      t.category,
      (t.type === "despesa" ? -t.amount : t.amount).toFixed(2).replace(".", ","),
    ].join(";")
  )
  return "﻿" + [header.join(";"), ...lines].join("\r\n")
}

export function downloadCSV(rows: Transaction[], filename: string) {
  const blob = new Blob([toCSV(rows)], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
