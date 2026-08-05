# API do Yearbook — Documentação de Endpoints

## CORS

Esta API tem CORS habilitado para qualquer origem. Você pode consumi-la
de qualquer domínio (localhost, Vercel, etc.) sem configuração adicional
no cliente.

    Base URL (produção): `https://yearbook-backend.vercel.app`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }`

    ## Auth

    ### POST /auth/register

    Cria uma nova conta de aluno.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "senha": "minhasenha123",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG"
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG",
      "fotoUrl": null,
      "role": "USER",
      "criadoEm": "2026-04-03T10:30:00.000Z"
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `409` — Email já cadastrado

      ### POST /auth/login

    Autentica um aluno e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "email": "maria@email.com",
      "senha": "minhasenha123"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

    - **Erros:**
      - `401` — Credenciais inválidas (email não existe ou senha incorreta)

##Aluno

### GET /alunos

Lista todos os alunos.

- Autenticação: Não
- Body: Nenhum

- Resposta de sucesso: `200 OK`

```json
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cidade": "Salinas",
    "frase": "Aqui começa o futuro.",
    "planosFuturos": "Cursar Ciência da Computação na UFMG",
    "fotoUrl": null,
    "role": "USER",
    "criadoEm": "2026-04-03T10:30:00.000Z"
  }
]
```

- Erros:
  - `404` — Aluno não encontrado

### GET /alunos/:id

Busca um aluno pelo ID.

- Autenticação: Não
- Body: Nenhum

- Resposta de sucesso: `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- Erros:
  - `404` — Aluno não encontrado

### PUT /alunos/:id

Atualiza o próprio perfil.

- Autenticação: Bearer token
- Body:

```json
{
  "nome": "Maria Silva",
  "cidade": "Belo Horizonte",
  "frase": "Nunca pare de aprender.",
  "planosFuturos": "Fazer faculdade de TI",
  "fotoUrl": "https://site.com/foto.png"
}
```

- Resposta de sucesso: `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Belo Horizonte",
  "frase": "Nunca pare de aprender.",
  "planosFuturos": "Fazer faculdade de TI",
  "fotoUrl": "https://site.com/foto.png",
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- Erros:
  - `401` — Usuário não autenticado
  - `403` — Tentativa de atualizar o perfil de outro usuário

### DELETE /alunos/:id

Remove um aluno.

- Autenticação: Bearer token (admin)
- Body: Nenhum

- Resposta de sucesso: `204 No Content`

- Erros:
  - `401` — Usuário não autenticado
  - `403` — Apenas administradores podem remover alunos

## Mensagens

### GET /mensagens

Lista todas as mensagens do mural.

- Autenticação: Não
- Body: Nenhum

- Resposta de sucesso: `200 OK`

```json
[
  {
    "id": 1,
    "texto": "Vou sentir saudades dessa turma!",
    "imagemUrl": null,
    "autorId": 1,
    "criadoEm": "2026-04-03T10:30:00.000Z",
    "autor": {
      "id": 1,
      "nome": "Maria Silva",
      "fotoUrl": null
    }
  }
]
```

### POST /mensagens

Cria uma nova mensagem.

- Autenticação: Bearer token
- Body:

```json
{
  "texto": "Vou sentir saudades dessa turma!",
  "imagemUrl": "https://site.com/imagem.png"
}
```

- Resposta de sucesso: `201 Created`

```json
{
  "id": 1,
  "texto": "Vou sentir saudades dessa turma!",
  "imagemUrl": "https://site.com/imagem.png",
  "autorId": 1,
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- Erros:
  - `400` — Campo texto é obrigatório
  - `401` — Usuário não autenticado

### DELETE /mensagens/:id

Exclui uma mensagem.

- Autenticação: Bearer token
- Body: Nenhum

- Resposta de sucesso: `204 No Content`

- Erros:
  - `401` — Usuário não autenticado
  - `403` — Apenas o dono da mensagem ou um administrador pode excluí-la