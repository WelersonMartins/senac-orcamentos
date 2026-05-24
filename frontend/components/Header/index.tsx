'use client'

import Image from 'next/image'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'

export default function Header() {
  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="app-header py-3"
    >
      <Container fluid className="justify-content-center">
        <Navbar.Brand className="d-flex align-items-center gap-2 gap-md-3 m-0 text-white">
          <Image
            src="/logo.svg"
            alt="Logo Orçamentos"
            width={40}
            height={40}
            priority
          />
          <span className="h4 mb-0 fw-semibold">SENAC Orçamentos</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  )
}
