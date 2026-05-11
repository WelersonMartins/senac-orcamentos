'use client'

import {
  getOrcamentos,
} from '@/app/(system)/orcamentos/actions'
import type { Orcamento as OrcamentoType } from '@/types/orcamentos'
import { formatarData, formatarMoeda, truncarObs } from '@/libs/format'
import PopUpInclusaoEdicaoOrcamentos from './PopUpInclusaoEdicaoOrcamentos'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import { useCallback, useEffect, useState } from 'react'

export default function TabelaOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<OrcamentoType[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [showModal, setShowModal] = useState(false)
  const [idOrcamento, setIdOrcamento] = useState<number | null | undefined>(null)

  const loadOrcamentos = useCallback(async () => {
    setLoadError(null)
    try {
      const data = await getOrcamentos()
      setOrcamentos(data)
    } catch {
      setLoadError('Não foi possível carregar os orçamentos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadOrcamentos()
  }, [loadOrcamentos])

  const fecharModal = () => {
    setShowModal(false)
  }

  const handleSaveSuccess = useCallback(() => {
    void loadOrcamentos()
    setShowModal(false)
  }, [loadOrcamentos])

  const handleEditar = (id: number | undefined) => {
    if (id === undefined) return
    setIdOrcamento(id)
    setShowModal(true)
  }

  const handleIncluir = () => {
    setIdOrcamento(null)
    setShowModal(true)
  }

  const validoAteCelula = (v: OrcamentoType['validoAte']) => {
    if (v === null || v === undefined) return '—'
    const d = typeof v === 'string' ? new Date(v) : v
    if (Number.isNaN(d.getTime())) return '—'
    return d.toLocaleDateString('pt-BR')
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Orçamentos</h3>
      <div className="d-flex gap-2 mb-3 justify-content-end">
        <Button variant="primary" size="sm" onClick={handleIncluir}>
          Incluir novo orçamento
        </Button>
      </div>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!loading && loadError && <p className="text-danger">{loadError}</p>}

      {!loading && !loadError && (
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle app-data-table"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Autor</th>
                <th>Situação</th>
                <th>Subtotal</th>
                <th>Desconto</th>
                <th>Total</th>
                <th>Válido até</th>
                <th>Observações</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {orcamentos.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.cliente?.nome ?? item.clienteId}</td>
                  <td>
                    {item.usuarioAutor?.nomeCompleto ?? item.usuarioAutorId}
                  </td>
                  <td>{item.situacao}</td>
                  <td>{formatarMoeda(item.subtotal)}</td>
                  <td>{formatarMoeda(item.valorDesconto)}</td>
                  <td>{formatarMoeda(item.total)}</td>
                  <td>{validoAteCelula(item.validoAte)}</td>
                  <td>{truncarObs(item.observacoes)}</td>
                  <td>{formatarData(item.criadoEm)}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEditar(item.id)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <PopUpInclusaoEdicaoOrcamentos
        visible={showModal}
        idOrcamento={idOrcamento}
        onHide={fecharModal}
        onSaveSuccess={handleSaveSuccess}
      />
    </Container>
  )
}
