'use client'

import { Modal, Button } from 'react-bootstrap'

type Props = {
  visible: boolean
  titulo: string
  mensagem: string
  aoConfirmar: () => void | Promise<void>
  onHide: () => void
}

export function ConfirmDialog({
  visible,
  titulo,
  mensagem,
  aoConfirmar,
  onHide,
}: Props) {
  const handleConfirmar = () => {
    void Promise.resolve(aoConfirmar())
  }

  return (
    <Modal show={visible} onHide={onHide} size="sm" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="h5">{titulo || 'Confirmar'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensagem || 'Tem certeza que deseja prosseguir?'}
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="link"
          className="text-decoration-none text-muted"
          onClick={onHide}
        >
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirmar}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
