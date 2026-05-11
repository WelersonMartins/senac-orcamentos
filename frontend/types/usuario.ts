/** Alinhado ao enum `tipo_perfil_usuario` / API Nest. */
export type PerfilUsuario = 'administrador' | 'operador'

/** Resposta de GET /usuarios/atual e PATCH /usuarios/atual (JSON). */
export type UsuarioPerfil = {
  id: number
  email: string
  nomeCompleto: string
  perfil: PerfilUsuario
  ativo: boolean
  criadoEm: string
  atualizadoEm: string
}

export type AtualizarUsuarioPerfilPayload = {
  nomeCompleto?: string
  email?: string
}

export type RedefinirSenhaPayload = {
  senhaAtual: string
  novaSenha: string
}
