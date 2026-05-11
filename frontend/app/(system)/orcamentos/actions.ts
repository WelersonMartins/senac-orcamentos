'use server'

import { apiServerFetch } from '@/lib/api-server'
import type {
  AtualizarOrcamentoPayload,
  CriarOrcamentoPayload,
  Orcamento,
} from '@/types/orcamentos'

export async function getOrcamentos(): Promise<Orcamento[]> {
  const response = await apiServerFetch('/orcamentos')
  return response.json()
}

export async function getOrcamento(id: number): Promise<Orcamento> {
  const response = await apiServerFetch(`/orcamentos/${id}`)
  return response.json()
}

export async function criarOrcamento(
  payload: CriarOrcamentoPayload,
): Promise<Orcamento> {
  const response = await apiServerFetch('/orcamentos', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.json()
}

export async function atualizarOrcamento(
  id: number,
  payload: AtualizarOrcamentoPayload,
): Promise<Orcamento> {
  const response = await apiServerFetch(`/orcamentos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return response.json()
}
