'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

const LINKS = [
  { href: '/produtos', label: 'Produtos' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/orcamentos', label: 'Orçamentos' },
  { href: '/usuario', label: 'Meu Perfil' },
] as const

function isNavActive(pathname: string, href: string) {
  if (href === '/usuario') {
    return pathname === '/usuario' || pathname.startsWith('/usuarios/')
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function Navegacao() {
  const pathname = usePathname()

  return (
    <Navbar
      bg="dark"
      variant="dark"
      className="flex-column align-items-stretch flex-shrink-0 p-3"
      style={{ width: 280, height: '100vh' }}
    >
      <Navbar.Brand
        as={Link}
        href="/"
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <span className="fs-4">SENAC ORÇAMENTOS</span>
      </Navbar.Brand>
      <hr className="border-secondary w-100 my-2" />
      <Nav variant="pills" className="flex-column mb-auto w-100">
        {LINKS.map(({ href, label }) => (
          <Nav.Link
            key={href}
            as={Link}
            href={href}
            active={isNavActive(pathname, href)}
            className="text-white"
          >
            {label}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  )
}
