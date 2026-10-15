# 🚀 Fullstack Application Template (Go API + Next.js Web)

Este repositório é um **template base** para desenvolvimento acelerado de aplicações fullstack. A estrutura é organizada no diretório `apps/`, separando a **API em Go (Backend)** da aplicação **Web em Next.js (Frontend)**.

---

## 📁 Estrutura de Diretórios

```text
teamplete-app/
└── apps/
    ├── api/                          # Backend em Go
    │   ├── cmd/                      # Ponto de entrada da aplicação (main.go)
    │   ├── configs/                  # Configurações de env, ORM e conexões de DB
    │   ├── db/                       # Migrations, scripts SQL e queries auxiliares
    │   └── internal/
    │       └── api/                  # Regras de negócio e módulos internos
    │           ├── domain/           # Entidades, structs, DTOs e testes de domínio
    │           │   └── test/         # Suíte de testes unitários do domínio
    │           ├── handler/          # Handlers HTTP (Controllers)
    │           ├── repository/       # Camada de persistência/banco de dados (GORM)
    │           ├── service/          # Regras de negócio e casos de uso
    │           └── utils/            # Middlewares, bootstraps e utilitários da API
    │
    └── web/                          # Frontend Web
        └── INIT-NEXT.md              # Instruções para inicializar a aplicação Next.js
```

## 💡 Entendimento da Organização

### 🛠️ Backend (`apps/api`)

A API segue uma arquitetura em camadas bem delimitada para garantir desacoplamento e testabilidade:

- **`cmd/`**: Ponto de entrada da aplicação Go. Contém a função `main()` para subir o servidor HTTP.
- **`configs/`**: Gerencia o carregamento de variáveis de ambiente (`.env`) e a inicialização das conexões de banco de dados (Oracle e PostgreSQL utilizando GORM).
- **`db/`**: Scripts e queries SQL puras reutilizáveis.
- **`internal/api/`**:
  - **`domain/`**: Define os modelos de dados (structs), entidades do sistema e contratos. A subpasta `domain/test/` é reservada para testes das entidades e regras essenciais do modelo.
  - **`service/`**: Contém a lógica de negócio principal. Intermedia a comunicação entre os `handlers` e o `repository`.
  - **`repository/`**: Responsável pela comunicação direta com o banco de dados usando GORM.
  - **`handler/`**: Controladores que tratam as requisições HTTP, efetuam validações de entrada e retornam as respostas JSON.
  - **`utils/`**: Utilitários gerais da API (rotas, bootstraps, middlewares e registros).

### 🌐 Frontend (`apps/web`)

A pasta `apps/web` está preparada para abrigar o frontend da aplicação.

Para inicializar o projeto Next.js dentro do diretório `apps/web`, siga as instruções abaixo ou consulte o arquivo `apps/web/INIT-NEXT.md`:

```bash
# Acesse o diretório da aplicação web
cd apps/web

# Execute o comando de criação do Next.js no diretório atual
npx create-next-app@latest .
```

## ⚙️ Como Usar este Template

1. Clique no botão **`Use this template`** no topo da página deste repositório no GitHub.
2. Crie o seu novo repositório a partir deste modelo.
3. Clone o projeto para o seu ambiente local:

   ```bash
   git clone https://github.com/SEU-USUARIO/SEU-PROJETO.git
   ```

4. Configure as variáveis de ambiente em `apps/api/.env`.
5. Inicialize o frontend com `npx create-next-app@latest .` dentro de `apps/web`.
