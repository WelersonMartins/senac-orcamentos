'use client'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'

export default function Header() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container fluid className="justify-content-center">
        <Navbar.Brand as="h1" className="m-0 h4 text-white">
          Orçamentos
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}
