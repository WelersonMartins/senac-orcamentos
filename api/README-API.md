# Documentação da API (protótipo)

REST JSON em **camelCase**. Prefixo global: **`/api`**. Sem paginação nas listagens. Identificadores (`id`, `clienteId`, `produtoId`, etc.) são **números inteiros** (SERIAL no PostgreSQL).

## Versão do Node.js

O `@nestjs/cli` (e dependências como `@angular-devkit/core`) declara suporte apenas a **Node 18.19+**, **20.11+** ou **22+**. O recomendado é usar **Node 20 LTS** ou **Node 22 LTS** (ex.: com [nvm](https://github.com/nvm-sh/nvm): na pasta `api`, `nvm install` / `nvm use` lê o arquivo [`.nvmrc`](./.nvmrc)).

## Como executar

1. Crie o banco e aplique o schema: [`../banco.sql`](../banco.sql).
2. (Opcional) Dados de demonstração: a partir da raiz do repositório, `psql ... -f seed.sql` ([arquivo na raiz](../seed.sql)).
3. Copie `.env.example` para `.env` e ajuste credenciais PostgreSQL e `JWT_SECRET`.
4. Na pasta `api`: `npm install` e `npm run start:dev`.
5. Swagger UI: **http://localhost:3000/api/docs** (porta conforme `PORT` no `.env`).

### Login de demonstração (após `seed.sql`)

- **E-mail:** `demo@sistema.local`
- **Senha:** `senha123`

### Login retorna “Credenciais inválidas”

1. Confirme que o **mesmo banco** configurado em `api/.env` (`DATABASE_*`) é o onde você rodou `banco.sql` e `seed.sql`.
2. Rode de novo o seed na raiz do repositório: `psql … -f seed.sql` — o script atualiza o hash da senha do demo mesmo se o e-mail já existir (não usa mais só `DO NOTHING` no usuário demo).
3. No PostgreSQL, verifique se o usuário existe:  
   `SELECT id, email, ativo FROM usuarios WHERE email = 'demo@sistema.local';`

---

## Rotas por módulo

As rotas abaixo refletem os módulos NestJS (`autenticacao`, `usuarios`, `clientes`, `produtos`, `orcamentos`). Na documentação, agrupamos assim:

| Módulo na doc | Pastas / responsabilidade no código |
|----------------|-------------------------------------|
| **Login** | `autenticacao/login` + perfil do usuário autenticado (`usuarios/atual`) |
| **Clientes** | `clientes` |
| **Produtos** | `produtos` |
| **Orçamentos** | `orcamentos` |

---

## Login

Inclui **entrada no sistema** e **perfil do usuário autenticado** (JWT).

### `POST /api/autenticacao/login`

Corpo:

```json
{
  "email": "demo@sistema.local",
  "senha": "senha123"
}
```

Resposta inclui `accessToken` (JWT).

| Método | Caminho | Auth |
|--------|---------|------|
| POST | `/api/autenticacao/login` | Não |

### Rotas protegidas (Bearer)

Depois do login, nas demais rotas envie:

```http
Authorization: Bearer <accessToken>
```

#### Perfil do usuário atual (`/api/usuarios/...`)

| Método | Caminho | Auth |
|--------|---------|------|
| GET | `/api/usuarios/atual` | Sim |
| PATCH | `/api/usuarios/atual` | Sim |
| PATCH | `/api/usuarios/atual/senha` | Sim |

**Redefinir senha**

`PATCH /api/usuarios/atual/senha`

```json
{
  "senhaAtual": "senha123",
  "novaSenha": "outraSenhaSegura"
}
```

---

## Clientes

| Método | Caminho | Auth |
|--------|---------|------|
| GET | `/api/clientes` | Sim |
| POST | `/api/clientes` | Sim |
| GET | `/api/clientes/:id` | Sim |
| PATCH | `/api/clientes/:id` | Sim |
| DELETE | `/api/clientes/:id` | Sim |

### Filtros opcionais

`GET /api/clientes?nome=...&documento=...`

---

## Produtos

| Método | Caminho | Auth |
|--------|---------|------|
| GET | `/api/produtos` | Sim |
| POST | `/api/produtos` | Sim |
| GET | `/api/produtos/:id` | Sim |
| PATCH | `/api/produtos/:id` | Sim |
| DELETE | `/api/produtos/:id` | Sim |

### Filtros opcionais

`GET /api/produtos?nome=...&ativo=true`

---

## Orçamentos

| Método | Caminho | Auth |
|--------|---------|------|
| GET | `/api/orcamentos` | Sim |
| GET | `/api/orcamentos/:id` | Sim |
| POST | `/api/orcamentos` | Sim |
| PATCH | `/api/orcamentos/:id` | Sim |

### Filtros opcionais

`GET /api/orcamentos?mes=5&ano=2026&situacao=rascunho`

### Criar orçamento (payload composto)

`POST /api/orcamentos`

```json
{
  "clienteId": 1,
  "valorDesconto": 10,
  "validoAte": "2026-12-31",
  "observacoes": "Entrega em 15 dias",
  "situacao": "rascunho",
  "itens": [
    {
      "produtoId": 1,
      "quantidade": 2,
      "precoUnitario": 189.9
    },
    {
      "produtoId": 2,
      "quantidade": 1
    }
  ]
}
```

- `precoUnitario` em cada item é **opcional**; se omitido, usa o preço atual do produto.
- O servidor recalcula `subtotal`, aplica `valorDesconto` e persiste cabeçalho + linhas em transação.

### Atualizar orçamento

`PATCH /api/orcamentos/:id` — campos opcionais. Se enviar `itens`, **todas as linhas antigas são substituídas** pelas novas.

---

## Erros

Corpo típico:

```json
{
  "mensagem": "Texto em português",
  "codigo": "VALIDACAO",
  "detalhes": []
}
```

HTTP usuais: `400`, `401`, `404`, `409`, `422`.

## Datas

Respostas usam ISO 8601 (`timestamptz` no PostgreSQL).
