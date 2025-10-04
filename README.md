# Sistema de Gestão de Carros, Modelos e Marcas

Este é o front-end de um sistema de gestão de carros, modelos e marcas desenvolvido com **React** e **TypeScript**, consumindo uma API REST. O projeto implementa funcionalidades de CRUD completo, filtros, validações, modal de cadastro e tratamento de autenticação via token JWT.

---

## Tecnologias Utilizadas

- React 18 + TypeScript
- Axios para requisições HTTP
- Tailwind CSS para estilização
- Zod para validação de formulários
- LocalStorage para armazenamento do token de autenticação

---

## Estrutura do Projeto
```
src/
│
├── services/
│ └── api.ts # Configuração do Axios e interceptor para JWT
│
├── context/
│ └── AuthContext.tsx # Contexto de autenticação e gerenciamento de usuário logado
│
├── dtos/
│ └── User.d.ts # Tipagem do usuário e dados relacionados
│
├── hooks/
│ └── useAuth.tsx # Hook personalizado para acessar o AuthContext
│
├── routes/
│ ├── AppRoutes.tsx # Rotas principais da aplicação
│ ├── AuthRoutes.tsx # Rotas públicas de autenticação
│ ├── AuthenticationRoute.tsx # Componente de proteção de rotas privadas
│ └── index.tsx # Exportação central de rotas
│
└── pages/ ├── Dashboard.tsx # Página inicial do sistema
  ├── Login.tsx # Página de login
  ├── CarListPage.tsx # Listagem de carros consumindo endpoint externo
  ├── CarroPage.tsx # CRUD de carros com filtros e modal
  ├── ModeloPage.tsx # CRUD de modelos com filtros e modal
  └── MarcaPage.tsx # CRUD de marcas com filtros e modal
```


---

## Configuração do Ambiente

1. **Clone o repositório**
   ```bash
   git clone git@github.com:andersensilva/api_veiculos_frontend.git
   cd api_veiculos_frontend
   ```
2. **Instale as dependências**
    ```bash
    npm install
   ```
3. **Configure a variável de ambiente**
  ```properties
    VITE_API_URL=http://localhost:8080/api
  ```
4. **Execute o projeto**
   ```bash
    npm run dev
    ```
O front estará disponível em http://localhost:5173 (ou outra porta definida pelo Vite).

## 🚀 Frontend em Docker + Proxy Nginx (CORS)
  - Dentro da pasta do frontend:
    ```bash
    # Build da imagem
      docker build -t api_veiculos_frontend .

    # Subir container
      docker run -d --name api_veiculos_frontend -p 5000:5000 api_veiculos_frontend
    ```

## Proxy para contornar CORS
  - Para consumir arquivos JSON externos (https://wswork.com.br/cars_by_brand.json e https://wswork.com.br/cars.json) sem erro de CORS, configuramos o Nginx dentro do container:
    ```bash
        server {
        listen 5000;
        server_name _;

        location /api/cars_by_brand.json {
            proxy_pass https://wswork.com.br/cars_by_brand.json;
            proxy_set_header Host wswork.com.br;
            proxy_ssl_server_name on;

            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "*";
        }

        location /api/cars.json {
            proxy_pass https://wswork.com.br/cars.json;
            proxy_set_header Host wswork.com.br;
            proxy_ssl_server_name on;

            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, OPTIONS";
            add_header Access-Control-Allow-Headers "*";
        }

        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri /index.html;
        }
    }
    ```
## Rodando localmente com proxy
  - Se for rodar o frontend localmente, é necessário descomentar a configuração de proxy no vite.config.ts para contornar o CORS
    ```bash
      // server: {
      //   proxy: {
      //     "/api/cars_by_brand": {
      //       target: "https://wswork.com.br/cars_by_brand.json",
      //       changeOrigin: true,
      //       rewrite: () => "" 
      //     },
      //     "/api/cars": {
      //       target: "https://wswork.com.br/cars.json",
      //       changeOrigin: true,
      //       rewrite: () => "" 
      //     }
      //   }
      // }
    ````
  - Depois, basta executar:
    ```` bash
    npm run dev
    ````
  
  - O frontend ficará disponível em http://localhost:5173 (ou outra porta definida pelo Vite).




## Funcionalidades
1. **CRUD de Carros**
  - Listagem de carros com filtro por modelo, ano e cor.

  - Modal para adicionar ou editar carro.

  - Validações usando Zod:

    - Modelo obrigatório

    - Ano >= 1900

    - Combustível obrigatório

    - Número de portas >= 1

    - Cor obrigatória

  - Botões de ação: Editar e Excluir.

2. **CRUD de Modelos**

  - Listagem de modelos com filtro por nome e marca.

  - Modal para adicionar modelo com seleção de marca.

  - Coluna "Ação" com Editar e Excluir.

  - Exclusão com verificação de FK:

    - Se houver carros vinculados, é exibida opção de excluir todos os carros vinculados (cascade).

3. **CRUD de Marcas**

  - Listagem de marcas com filtro por nome.

  - Modal para adicionar marca.

  - Coluna "Ação" com Editar e Excluir.

  - Exclusão com verificação de FK:

    - Se houver modelos vinculados (e carros), exibe opção de excluir todos os modelos e carros vinculados.

## Funcionalidades Adicionais
1. Rota Pública
  - /listcarros: permite que qualquer usuário acesse a listagem de carros sem precisar de login.

  - Essa rota consome dados de uma API externa.
2. CRUD com Login
  - Para utilizar as funcionalidades de CRUD (Marca, Modelo, Carro) é necessário rodar o backend.

  - Backend disponível em: https://github.com/andersensilva/apiVeiculos

   - Após iniciar o backend, o frontend irá autenticar o usuário via JWT e permitir acesso às rotas protegidas

## Validações 
  - Todos os formulários possuem validações básicas com Zod.

## Autenticação e Token JWT
  - O front utiliza Axios interceptor para enviar o token JWT em cada requisição:
    ```bash
    api.interceptors.request.use((config) => {
    const token = localStorage.getItem('tokenApi');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });
    ```
  - Se o token expirar ou for inválido, o front redireciona automaticamente para a página de login.

## Estrutura dos Modais
  - Adicionar/Editar Carro:

    - Modelo (select)

    - Marca (select)

    - Ano (number)

    - Combustível (text)

    - Número de portas (number)

    - Cor (text)

  - Adicionar/Editar Modelo:

    - Nome (text)

    - Valor FIPE (number)

    - Marca (select)

  - Adicionar/Editar Marca:

    - Nome da marca (text)

## Filtros e Pesquisa
  - Todos os módulos possuem campos de filtro na tabela:

    - Carros: modelo, ano, cor

    - Modelos: nome, marca

    - Marcas: nome

  - Os filtros atualizam a tabela em tempo real sem precisar recarregar a página.

  ## Notas Finais
  - Todos os deletes são tratados com cascade opcional no backend, prevenindo erros de integridade referencial.

  - Todas as ações críticas (exclusão de dados vinculados) possuem confirmação antes de executar.

  - Layout responsivo com Tailwind CSS.

  - Estrutura modular, facilitando manutenção e adição de novas funcionalidades.

    
