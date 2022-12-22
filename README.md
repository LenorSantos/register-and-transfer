
## Pacotes utilizados

```
express
sequelize
cors
bcrypt
jsonwebtoken
```

## Utilização

No terminal digite esses comandos:

**Instalar os pacotes**
```bash
  npm install
```

**Rodar a API**
```bash
  npm start
```

**TS para JS**
```bash
  npm run dev
```
Saída na pasta `/div/app.js`

## Configurar base de dados

É utilizado o Postgresql mas caso queira pode ser utilizado com o MySQL.

* Adicionar nome do banco, usuario e a senha.
|`Ln 14`|
|:-|

Na pasta `banco de dados` tem dois arquivos, um com o diagrama das tabelas e outro com backup das tabelas com dados. É necessário criar um novo banco antes de realizar a restauração.
# Documentação

### Cadastro

```http
  POST /cadastro
```

```
{
    "user": "user",
    "pass": "1234Pass"
}
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `req.body.user` | `string` | Recebe o nome do usuário |
| `req.body.pass` | `string` | Recebe a senha |

* Necessário a senha ter 8 caracteres, número e letra maiúscula.
* O nome do usuário não pode ter menos que 3 caracteres.

| `Caso tudo ocorra bem retorna status 201` |
| :-|

### Login

```http
  POST /login
```

```
{
    "user": "user",
    "pass": "1234Pass"
}
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `req.body.user` | `string` | Recebe o nome do usuário |
| `req.body.pass` | `string` | Recebe a senha |

* Necessário a senha ter 8 caracteres, número e letra maiúscula.
* O nome do usuário não pode ter menos que 3 caracteres.

**Retorno**

| Tipo | Descrição |
| :--- | :-------- |
| `object string` | Retorna o token de acesso do usuário |

* A validade do token pode ser modificada. (Atual: 15 minutos)
* Necessário salvar o token de forma local.

### Dados do usuário

* O token é enviado no cabeçalho dos metodos `GET` e é checado pelo middleware, e se validado segue com a execução.

**Cabeçalho**
```
headers: { "token": "token"}
```

**Requisições**

```http
  GET /areauser
```

| Tipo | Descrição |
| :--- | :-------- |
| `object array` | Retorna nome e saldo |

**Decidir não fazer a requisição completa dos dados e separar a requisição das transações e tornar um opcional**

```http
  GET /transactions
```

| Descrição |
| :-------- |
| Retorna as transações |

### Nova transação

```http
  POST /newtransctions
```

* Necessário o envio do token no cabeçalho.

```
{
  "user": "user",
  "value": "saldo"
}, {
  headers: { "token": "token" }
}
```

| Descrição |
| :-------- |
| Retorna status 200 |