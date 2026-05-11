/** Formata valor em Real (pt-BR). */
export function formatarMoeda(n: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(n)
}

/** Data/hora curta (pt-BR); retorna em dash se inválido ou ausente. */
export function formatarData(val: string | Date | undefined): string {
  if (val === undefined) return '—'
  const d = typeof val === 'string' ? new Date(val) : val
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

/** Texto truncado para tabelas; vazio vira em dash. */
export function truncarObs(
  texto: string | null | undefined,
  max = 48,
): string {
  if (!texto) return '—'
  if (texto.length <= max) return texto
  return `${texto.slice(0, max)}…`
}
