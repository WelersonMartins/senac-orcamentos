'use client'

import { useActionState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import { login } from './actions'

export default function Login() {
  const [state, formAction] = useActionState(login, undefined)

  return (
    <Card className="shadow border-0 rounded-4">
      <Card.Body className="p-4">
        <Card.Title as="h2" className="text-center mb-4">
          Login
        </Card.Title>
        {state?.error && (
          <Alert variant="danger" role="alert" className="mb-3">
            {state.error}
          </Alert>
        )}

        <Form action={formAction}>
          <Form.Group className="mb-3" controlId="loginEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Form.Group>
          <Button type="submit" variant="primary" className="w-100">
            Entrar
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}
