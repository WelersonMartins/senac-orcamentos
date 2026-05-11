'use client'

import { getClientes } from '@/app/(system)/clientes/actions'
import { getProdutos } from '@/app/(system)/produtos/actions'
import {
  criarOrcamento,
  atualizarOrcamento,
  getOrcamento,
} from '@/app/(system)/orcamentos/actions'
import { notify } from '@/components/Notify'
import type { Cliente } from '@/types/clientes'
import type { Produto } from '@/types/produtos'
import type {
  AtualizarOrcamentoPayload,
  ItemOrcamentoInput,
  SituacaoOrcamento,
} from '@/types/orcamentos'
import { useCallback, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

const SITUACOES: SituacaoOrcamento[] = [
  'rascunho',
  'enviado',
  'aprovado',
  'rejeitado',
  'cancelado',
]

type LinhaForm = {
  produtoId: number
  quantidade: number
  precoStr: string
}

type Props = {
  visible: boolean
  idOrcamento: number | null | undefined
  onHide: () => void
  onSaveSuccess?: () => void
}

function linhaVazia(): LinhaForm {
  return { produtoId: 0, quantidade: 1, precoStr: '' }
}

function montarItens(linhas: LinhaForm[]): ItemOrcamentoInput[] {
  return linhas
    .filter((l) => l.produtoId > 0 && l.quantidade > 0)
    .map((l) => {
      const t = l.precoStr.trim()
      const preco = t === '' ? undefined : Number(t)
      const item: ItemOrcamentoInput = {
        produtoId: l.produtoId,
        quantidade: l.quantidade,
      }
      if (preco !== undefined && !Number.isNaN(preco)) {
        item.precoUnitario = preco
      }
      return item
    })
}

function validoAteParaInput(val: string | Date | null | undefined): string {
  if (val === null || val === undefined) return ''
  const s = typeof val === 'string' ? val : val.toISOString()
  return s.length >= 10 ? s.slice(0, 10) : ''
}

export default function PopUpInclusaoEdicaoOrcamentos({
  visible,
  idOrcamento,
  onHide,
  onSaveSuccess,
}: Props) {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])

  const [clienteId, setClienteId] = useState(0)
  const [situacao, setSituacao] = useState<SituacaoOrcamento>('rascunho')
  const [valorDesconto, setValorDesconto] = useState(0)
  const [validoAte, setValidoAte] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const [autorLabel, setAutorLabel] = useState('')
  const [subtotalExibicao, setSubtotalExibicao] = useState<number | null>(null)
  const [totalExibicao, setTotalExibicao] = useState<number | null>(null)

  const [linhas, setLinhas] = useState<LinhaForm[]>([linhaVazia()])
  const [itensDirty, setItensDirty] = useState(false)

  const carregarListas = useCallback(async () => {
    try {
      const [c, p] = await Promise.all([getClientes(), getProdutos()])
      setClientes(c)
      setProdutos(p)
    } catch {
      notify('Não foi possível carregar clientes ou produtos.', 'danger')
    }
  }, [])

  useEffect(() => {
    if (!visible) return
    void carregarListas()
  }, [visible, carregarListas])

  useEffect(() => {
    if (!visible) return

    if (idOrcamento) {
      void getOrcamento(idOrcamento)
        .then((dados) => {
          setClienteId(dados.clienteId)
          setSituacao(dados.situacao)
          setValorDesconto(dados.valorDesconto ?? 0)
          setValidoAte(validoAteParaInput(dados.validoAte))
          setObservacoes(dados.observacoes ?? '')
          const autor =
            dados.usuarioAutor?.nomeCompleto ??
            String(dados.usuarioAutorId ?? '')
          setAutorLabel(autor)
          setSubtotalExibicao(dados.subtotal)
          setTotalExibicao(dados.total)
          if (dados.itens?.length) {
            setLinhas(
              dados.itens.map((i) => ({
                produtoId: i.produtoId,
                quantidade: i.quantidade,
                precoStr:
                  i.precoUnitarioRegistro !== undefined &&
                  i.precoUnitarioRegistro !== null
                    ? String(i.precoUnitarioRegistro)
                    : '',
              })),
            )
          } else {
            setLinhas([linhaVazia()])
          }
          setItensDirty(false)
        })
        .catch(() => {
          notify('Não foi possível carregar o orçamento.', 'danger')
        })
    } else {
      setClienteId(0)
      setSituacao('rascunho')
      setValorDesconto(0)
      setValidoAte('')
      setObservacoes('')
      setAutorLabel('')
      setSubtotalExibicao(null)
      setTotalExibicao(null)
      setLinhas([linhaVazia()])
      setItensDirty(true)
    }
  }, [visible, idOrcamento])

  const handleSave = async () => {
    const itens = montarItens(linhas)

    if (!clienteId) {
      notify('Selecione um cliente.', 'danger')
      return
    }

    if (!idOrcamento) {
      if (itens.length === 0) {
        notify('Informe ao menos um item com produto e quantidade.', 'danger')
        return
      }
      try {
        await criarOrcamento({
          clienteId,
          itens,
          valorDesconto,
          validoAte: validoAte || undefined,
          observacoes: observacoes || undefined,
          situacao,
        })
        notify('Orçamento cadastrado com sucesso.', 'success')
        onSaveSuccess?.()
      } catch (e) {
        const msg =
          e instanceof Error
            ? e.message
            : 'Não foi possível cadastrar o orçamento.'
        notify(msg, 'danger')
      }
      return
    }

    if (itensDirty && itens.length === 0) {
      notify('Informe ao menos um item válido ou desfaça as alterações nas linhas.', 'danger')
      return
    }

    const payload: AtualizarOrcamentoPayload = {
      clienteId,
      situacao,
      valorDesconto,
      validoAte: validoAte || null,
      observacoes: observacoes || null,
    }
    if (itensDirty) {
      payload.itens = itens
    }

    try {
      await atualizarOrcamento(idOrcamento, payload)
      notify('Orçamento atualizado com sucesso.', 'success')
      onSaveSuccess?.()
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : 'Não foi possível atualizar o orçamento.'
      notify(msg, 'danger')
    }
  }

  const atualizarLinha = (index: number, patch: Partial<LinhaForm>) => {
    setLinhas((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], ...patch }
      return next
    })
    setItensDirty(true)
  }

  const adicionarLinha = () => {
    setLinhas((prev) => [...prev, linhaVazia()])
    setItensDirty(true)
  }

  const removerLinha = (index: number) => {
    setLinhas((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
    setItensDirty(true)
  }

  return (
    <Modal show={visible} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {idOrcamento ? 'Edição de orçamento' : 'Inclusão de orçamento'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              value={clienteId}
              onChange={(e) => setClienteId(Number(e.target.value))}
            >
              <option value={0}>Selecione…</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id ?? 0}>
                  {c.nome}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {idOrcamento ? (
            <Form.Group className="mb-3">
              <Form.Label>Autor</Form.Label>
              <Form.Control plaintext readOnly type="text" value={autorLabel} />
            </Form.Group>
          ) : null}

          {idOrcamento && subtotalExibicao !== null && totalExibicao !== null ? (
            <div className="row mb-3">
              <div className="col-md-6">
                <Form.Label>Subtotal (atual)</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={subtotalExibicao.toFixed(2)}
                />
              </div>
              <div className="col-md-6">
                <Form.Label>Total (atual)</Form.Label>
                <Form.Control
                  type="text"
                  readOnly
                  value={totalExibicao.toFixed(2)}
                />
              </div>
            </div>
          ) : null}

          <Form.Group className="mb-3">
            <Form.Label>Situação</Form.Label>
            <Form.Select
              value={situacao}
              onChange={(e) =>
                setSituacao(e.target.value as SituacaoOrcamento)
              }
            >
              {SITUACOES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Valor desconto</Form.Label>
            <Form.Control
              type="number"
              min={0}
              step="0.01"
              value={valorDesconto}
              onChange={(e) => setValorDesconto(Number(e.target.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Válido até</Form.Label>
            <Form.Control
              type="date"
              value={validoAte}
              onChange={(e) => setValidoAte(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Observações</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </Form.Group>

          <hr />
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="mb-0">Itens</Form.Label>
            <Button variant="outline-primary" size="sm" onClick={adicionarLinha}>
              Adicionar linha
            </Button>
          </div>
          <p className="text-muted small">
            Preço unitário vazio usa o preço cadastrado do produto.
          </p>

          {linhas.map((linha, index) => (
            <div
              key={index}
              className="border rounded p-2 mb-2 d-flex flex-wrap gap-2 align-items-end"
            >
              <Form.Group className="flex-grow-1" style={{ minWidth: '12rem' }}>
                <Form.Label className="small">Produto</Form.Label>
                <Form.Select
                  value={linha.produtoId}
                  onChange={(e) =>
                    atualizarLinha(index, {
                      produtoId: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>Selecione…</option>
                  {produtos.map((p, pi) => (
                    <option key={p.id ?? `prod-${pi}`} value={p.id ?? 0}>
                      {p.nome}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group style={{ width: '7rem' }}>
                <Form.Label className="small">Qtd.</Form.Label>
                <Form.Control
                  type="number"
                  min={0.0001}
                  step="any"
                  value={linha.quantidade}
                  onChange={(e) =>
                    atualizarLinha(index, {
                      quantidade: Number(e.target.value),
                    })
                  }
                />
              </Form.Group>
              <Form.Group style={{ width: '9rem' }}>
                <Form.Label className="small">Preço unit. (opc.)</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  placeholder="Catálogo"
                  value={linha.precoStr}
                  onChange={(e) =>
                    atualizarLinha(index, { precoStr: e.target.value })
                  }
                />
              </Form.Group>
              <Button
                variant="outline-danger"
                size="sm"
                disabled={linhas.length <= 1}
                onClick={() => removerLinha(index)}
              >
                Remover
              </Button>
            </div>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" type="button" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" type="button" onClick={() => void handleSave()}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
