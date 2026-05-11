import Link from 'next/link';

export default function Home() {
  return <div>Bem vindo ao sistema de gestão de orçamentos. Faça login para continuar.
    <Link href="/login">Login</Link>
  </div>;
}