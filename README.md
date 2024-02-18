## ignite-nodejs-02-api-rest-challenge

Desafio 02 Ignite - Node.js 

Contrução da Daily Diet API utlizando Node.js, Fastify, typescript, knex.js 
e conceitos de API Rest, migrations e testes automatizados com vitest

### Regras da aplicação

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
    
    *As refeições devem ser relacionadas a um usuário.*
    
    - Nome
    - Descrição
    - Data e Hora
    - Está dentro ou não da dieta



- [x] Deve ser possível editar uma refeição
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário
    - [x] Quantidade total de refeições registradas
    - [x] Quantidade total de refeições dentro da dieta
    - [x] Quantidade total de refeições fora da dieta
    - [x] Melhor sequência de refeições dentro da dieta

- [x] O usuário só pode visualizar, editar e apagar as refeições o qual ele criou 

### scripts
```
npm install

npm run knex -- migrate:latest

npm run dev
```

### Contexto da aplicação
[Link para o layout da aplicação que utilizaria essa API.](https://www.figma.com/community/file/1218573349379609244)
