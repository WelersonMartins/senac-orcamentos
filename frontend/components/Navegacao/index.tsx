'use client'

import Image from 'next/image'
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
      bg="primary"
      variant="dark"
      className="app-sidebar flex-column align-items-stretch flex-shrink-0 p-3"
      style={{ width: 280, height: '100vh' }}
    >
      <Navbar.Brand
        as={Link}
        href="/"
        className="d-flex align-items-center gap-2 mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
      >
        <Image src="/logo.svg" alt="" width={36} height={36} />
        <span className="fs-5 fw-semibold lh-sm">SENAC ORÇAMENTOS</span>
      </Navbar.Brand>
      <hr className="border-light border-opacity-25 w-100 my-2" />
      <Nav variant="pills" className="flex-column mb-auto w-100">
        {LINKS.map(({ href, label }) => (
          <Nav.Link
            key={href}
            as={Link}
            href={href}
            active={isNavActive(pathname, href)}
          >
            {label}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  )
}
