'use server'

import { apiServerFetch } from '@/lib/api-server'
import type { Cliente } from '@/types/clientes'

/**
 * GET /clientes
 * @returns Lista de clientes
 */
export async function getClientes(): Promise<Cliente[]> {
  const res = await apiServerFetch('/clientes')
  return res.json()
}

export async function getCliente(id: number): Promise<Cliente> {
  const res = await apiServerFetch(`/clientes/${id}`)
  return res.json()
}

export async function criarCliente(cliente: Cliente): Promise<Cliente> {
  const res = await apiServerFetch('/clientes', {
    method: 'POST',
    body: JSON.stringify(cliente),
  })
  return res.json()
}

export async function atualizarCliente(
  id: number,
  cliente: Partial<Cliente> & { nome: string },
): Promise<Cliente> {
  const res = await apiServerFetch(`/clientes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(cliente),
  })
  return res.json()
}

export async function excluirCliente(id: number | undefined): Promise<void> {
  if (!id) {
    throw new Error('ID do cliente não informado')
  }
  await apiServerFetch(`/clientes/${id}`, {
    method: 'DELETE',
  })
}