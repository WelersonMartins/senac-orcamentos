/** Alinhado ao enum `tipo_situacao_orcamento` / API Nest. */
export type SituacaoOrcamento =
  | 'rascunho'
  | 'enviado'
  | 'aprovado'
  | 'rejeitado'
  | 'cancelado'

/** Linha retornada em GET (serialização da API). */
export type ItemOrcamentoLinha = {
  id: number
  produtoId: number
  nomeProdutoRegistro: string
  precoUnitarioRegistro: number
  quantidade: number
  totalLinha: number
}

/** Payload de linha para POST/PATCH (CriarOrcamentoDto.itens). */
export type ItemOrcamentoInput = {
  produtoId: number
  quantidade: number
  precoUnitario?: number
}

export type OrcamentoClienteResumo = {
  id: number
  nome: string
  documento?: string | null
  email?: string | null
  telefone?: string | null
}

export type OrcamentoUsuarioAutorResumo = {
  id: number
  nomeCompleto: string
  email: string
}

/** Resposta GET lista/detalhe (camelCase). Datas vêm como string ISO do JSON. */
export type Orcamento = {
  id: number
  clienteId: number
  cliente?: OrcamentoClienteResumo
  usuarioAutorId: number
  usuarioAutor?: OrcamentoUsuarioAutorResumo
  situacao: SituacaoOrcamento
  subtotal: number
  valorDesconto: number
  total: number
  validoAte?: string | Date | null
  observacoes?: string | null
  criadoEm?: string | Date
  atualizadoEm?: string | Date
  itens: ItemOrcamentoLinha[]
}

export type CriarOrcamentoPayload = {
  clienteId: number
  itens: ItemOrcamentoInput[]
  valorDesconto?: number
  validoAte?: string
  observacoes?: string
  situacao?: SituacaoOrcamento
}

export type AtualizarOrcamentoPayload = {
  clienteId?: number
  itens?: ItemOrcamentoInput[]
  valorDesconto?: number
  validoAte?: string | null
  observacoes?: string | null
  situacao?: SituacaoOrcamento
}
