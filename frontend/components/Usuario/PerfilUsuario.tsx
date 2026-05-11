'use client'

import {
  atualizarUsuarioAtual,
  getUsuarioAtual,
  redefinirSenhaUsuario,
} from '@/app/(system)/usuario/actions'
import { notify } from '@/components/Notify'
import type { UsuarioPerfil } from '@/types/usuario'
import { useCallback, useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap'

function formatarDataIso(iso: string | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

export default function PerfilUsuario() {
  const [usuario, setUsuario] = useState<UsuarioPerfil | null>(null)
  const [nomeCompleto, setNomeCompleto] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  const carregar = useCallback(async () => {
    setLoadError(null)
    setLoading(true)
    try {
      const u = await getUsuarioAtual()
      setUsuario(u)
      setNomeCompleto(u.nomeCompleto)
      setEmail(u.email)
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Não foi possível carregar o perfil.'
      setLoadError(msg)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void carregar()
  }, [carregar])

  const handleSalvarDados = async () => {
    try {
      const atualizado = await atualizarUsuarioAtual({
        nomeCompleto,
        email,
      })
      setUsuario(atualizado)
      setNomeCompleto(atualizado.nomeCompleto)
      setEmail(atualizado.email)
      notify('Dados atualizados com sucesso.', 'success')
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Não foi possível salvar os dados.'
      notify(msg, 'danger')
    }
  }

  const handleAlterarSenha = async () => {
    if (novaSenha.length < 6) {
      notify('A nova senha deve ter no mínimo 6 caracteres.', 'danger')
      return
    }
    if (novaSenha !== confirmarSenha) {
      notify('A confirmação da nova senha não confere.', 'danger')
      return
    }
    try {
      const res = await redefinirSenhaUsuario({
        senhaAtual,
        novaSenha,
      })
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmarSenha('')
      notify(res.mensagem ?? 'Senha alterada com sucesso.', 'success')
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Não foi possível alterar a senha.'
      notify(msg, 'danger')
    }
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-3">Meu perfil</h3>

      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {!loading && loadError && <p className="text-danger">{loadError}</p>}

      {!loading && !loadError && usuario && (
        <Row className="g-4">
          <Col lg={7}>
            <Card className="shadow-sm">
              <Card.Header className="fw-semibold">Dados do perfil</Card.Header>
              <Card.Body>
                <Row className="mb-3 g-2">
                  <Col sm={4} className="text-muted small">
                    ID
                  </Col>
                  <Col sm={8}>{usuario.id}</Col>
                  <Col sm={4} className="text-muted small">
                    Perfil
                  </Col>
                  <Col sm={8}>{usuario.perfil}</Col>
                  <Col sm={4} className="text-muted small">
                    Ativo
                  </Col>
                  <Col sm={8}>{usuario.ativo ? 'Sim' : 'Não'}</Col>
                  <Col sm={4} className="text-muted small">
                    Criado em
                  </Col>
                  <Col sm={8}>{formatarDataIso(usuario.criadoEm)}</Col>
                  <Col sm={4} className="text-muted small">
                    Atualizado em
                  </Col>
                  <Col sm={8}>{formatarDataIso(usuario.atualizadoEm)}</Col>
                </Row>
                <hr />
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome completo</Form.Label>
                    <Form.Control
                      type="text"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      maxLength={200}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() => void handleSalvarDados()}
                  >
                    Salvar dados
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={5}>
            <Card className="shadow-sm">
              <Card.Header className="fw-semibold">Alterar senha</Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Senha atual</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="current-password"
                      value={senhaAtual}
                      onChange={(e) => setSenhaAtual(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nova senha</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="new-password"
                      value={novaSenha}
                      onChange={(e) => setNovaSenha(e.target.value)}
                    />
                    <Form.Text muted>Mínimo de 6 caracteres.</Form.Text>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar nova senha</Form.Label>
                    <Form.Control
                      type="password"
                      autoComplete="new-password"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </Form.Group>
                  <Button
                    variant="outline-primary"
                    type="button"
                    onClick={() => void handleAlterarSenha()}
                  >
                    Alterar senha
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}
