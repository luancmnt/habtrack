# HabTrack API

API REST em JavaScript com Express.

## Requisitos funcionais atendidos

### Autenticacao

- Cadastro de usuario com `name`, `email` e `password`.
- Login com credenciais validas.
- Mensagem de erro para credenciais invalidas.
- Logout com invalidacao do token atual em memoria.

### Habitos

- Listagem apenas dos habitos do usuario autenticado.
- Estado vazio quando nao houver habitos cadastrados.
- Criacao, edicao e remocao de habitos.
- Validacao do campo obrigatorio `name`.
- Marcacao e desmarcacao diaria com persistencia em memoria durante a execucao da API.

## Estrutura do projeto

```text
.
|-- server.js
|-- src
|   |-- app.js
|   |-- controllers
|   |-- docs
|   |-- middlewares
|   |-- models
|   |-- routes
|   `-- services
`-- README.md
```

## Como configurar

### 1. Instalar dependencias

```bash
npm install express swagger-ui-express swagger-jsdoc jsonwebtoken
```

### 2. Opcional: configurar variaveis de ambiente

```bash
export PORT=3000
export JWT_SECRET=minha-chave-super-secreta
```

Se `JWT_SECRET` nao for informado, a API usa o valor padrao `habtrack-secret-dev`.

## Como executar

```bash
npm start
```

Servidor padrao:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

## Endpoints principais

### Publicos

- `POST /api/auth/register`
- `POST /api/auth/login`

### Protegidos por Bearer Token

- `POST /api/auth/logout`
- `GET /api/habits`
- `POST /api/habits`
- `PUT /api/habits/:id`
- `DELETE /api/habits/:id`
- `PATCH /api/habits/:id/today`

## Fluxo rapido de uso

### 1. Cadastrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Luana","email":"luana@email.com","password":"123456"}'
```

### 2. Fazer login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"luana@email.com","password":"123456"}'
```

### 3. Criar um habito com token

```bash
curl -X POST http://localhost:3000/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"name":"Beber agua","description":"Tomar 2 litros"}'
```

### 4. Marcar um habito como concluido no dia

```bash
curl -X PATCH http://localhost:3000/api/habits/1/today \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"completed":true}'
```

### 5. Desmarcar um habito por engano no mesmo dia

```bash
curl -X PATCH http://localhost:3000/api/habits/1/today \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"completed":false}'
```

## Observacoes

- Os dados ficam somente em memoria. Ao reiniciar a API, usuarios, habitos e tokens invalidados sao perdidos.
- O projeto foi preparado para futura cobertura com Supertest por meio da exportacao do `app` sem `listen()`.