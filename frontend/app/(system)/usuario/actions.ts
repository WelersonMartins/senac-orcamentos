'use server'

import { apiServerFetch } from '@/lib/api-server'
import type {
  AtualizarUsuarioPerfilPayload,
  RedefinirSenhaPayload,
  UsuarioPerfil,
} from '@/types/usuario'

async function throwIfNotOk(res: Response): Promise<void> {
  if (res.ok) return
  let msg = res.statusText || 'Erro na requisição'
  try {
    const body = (await res.json()) as { message?: string | string[] }
    if (body?.message !== undefined) {
      msg = Array.isArray(body.message) ? body.message.join(', ') : body.message
    }
  } catch {
    /* ignore */
  }
  throw new Error(msg)
}

export async function getUsuarioAtual(): Promise<UsuarioPerfil> {
  const res = await apiServerFetch('/usuarios/atual')
  await throwIfNotOk(res)
  return res.json()
}

export async function atualizarUsuarioAtual(
  payload: AtualizarUsuarioPerfilPayload,
): Promise<UsuarioPerfil> {
  const res = await apiServerFetch('/usuarios/atual', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  await throwIfNotOk(res)
  return res.json()
}

export async function redefinirSenhaUsuario(
  payload: RedefinirSenhaPayload,
): Promise<{ mensagem: string }> {
  const res = await apiServerFetch('/usuarios/atual/senha', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  await throwIfNotOk(res)
  return res.json()
}
