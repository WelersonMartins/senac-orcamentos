'use client'

import {
  atualizarCliente,
  criarCliente,
  getCliente,
} from '@/app/(system)/clientes/actions'
import { notify } from '@/components/Notify'
import { Modal, Form, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'

type Props = {
  visible: boolean
  idCliente: number | null | undefined
  onHide: () => void
  onSaveSuccess?: () => void
}

export default function PopUpInclusaoEdicao({
  visible,
  idCliente,
  onHide,
  onSaveSuccess,
}: Props) {
  const [nome, setNome] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacoes, setObservacoes] = useState('')

  const handleSave = async () => {
    try {
      if (idCliente) {
        await atualizarCliente(idCliente, {
          nome,
          documento,
          email,
          telefone,
          observacoes,
        })
        notify('Cliente atualizado com sucesso.', 'success')
      } else {
        await criarCliente({ nome, documento, email, telefone, observacoes })
        notify('Cliente cadastrado com sucesso.', 'success')
      }
      onSaveSuccess?.()
    } catch (e) {
      const msg =
        e instanceof Error
          ? e.message
          : idCliente
            ? 'Não foi possível atualizar o cliente.'
            : 'Não foi possível cadastrar o cliente.'
      notify(msg, 'danger')
    }
  }

  useEffect(() => {
    if (!visible) return

    if (idCliente) {
      void getCliente(idCliente)
        .then((dados) => {
          setNome(dados.nome ?? '')
          setDocumento(dados.documento ?? '')
          setEmail(dados.email ?? '')
          setTelefone(dados.telefone ?? '')
          setObservacoes(dados.observacoes ?? '')
        })
        .catch(() => {
          notify('Não foi possível carregar os dados do cliente.', 'danger')
        })
    } else {
      setNome('')
      setDocumento('')
      setEmail('')
      setTelefone('')
      setObservacoes('')
    }
  }, [visible, idCliente])

  return (
    <Modal show={visible} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {idCliente ? 'Edição de cliente' : 'Inclusão de cliente'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Documento</Form.Label>
            <Form.Control
              type="text"
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Telefone</Form.Label>
            <Form.Control
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Observações</Form.Label>
            <Form.Control
              type="text"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </Form.Group>
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
