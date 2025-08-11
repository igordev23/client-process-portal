# Sistema de Gestão Jurídica Legal Control

Um sistema web completo para gestão de processos jurídicos, clientes e atualizações processuais desenvolvido com React + TypeScript + Vite.

## 🚀 Tecnologias

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes UI
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado
- **Supabase** - Backend como serviço (autenticação e banco de dados)
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📋 Funcionalidades

### 🔐 Autenticação
- Sistema de login com email e senha
- Controle de acesso baseado em roles (admin/user)
- Persistência de sessão

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Geração automática de chave de acesso
- Edição e exclusão (apenas admin)
- Listagem com busca e filtros

### ⚖️ Gestão de Processos
- Cadastro de processos jurídicos
- Vinculação com clientes
- Controle de status e datas
- Histórico de atualizações
- Exportação para Excel

### 📊 Dashboard
- Visão geral dos dados
- Estatísticas de processos
- Acesso rápido às funcionalidades principais

### 🔧 Gerenciamento de Entidades
- Tipos de crime
- Comarcas e varas
- Situações prisionais
- Sistema CRUD para todas as entidades

## 🛠️ Como executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clonar o repositório
git clone [url-do-repositorio]

# Entrar no diretório
cd client-process-portal

# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Verificar tipos TypeScript
npm run type-check
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_STORAGE_MODE=api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Estrutura do Projeto

```
src/
├── components/              # Componentes React
│   ├── ui/                 # Componentes base do Shadcn/UI
│   ├── process/            # Componentes específicos de processos
│   ├── storage_service/    # Serviços de armazenamento
│   ├── ClientManagement.tsx
│   ├── Dashboard.tsx
│   ├── LoginForm.tsx
│   ├── ManageEntities.tsx
│   └── ProcessManagement.tsx
├── contexts/               # Contextos React
│   └── AuthContext.tsx    # Contexto de autenticação
├── hooks/                 # Custom hooks
│   ├── useAuth.ts
│   ├── useClients.ts
│   ├── useProcesses.ts
│   ├── useEntities.ts
│   └── useProcessUpdates.ts
├── lib/                   # Utilitários e bibliotecas
│   ├── export/           # Funcionalidades de exportação
│   └── utils.ts
├── pages/                # Páginas da aplicação
│   ├── Index.tsx
│   └── NotFound.tsx
├── types/                # Definições de tipos TypeScript
│   └── auth.types.ts
├── utils/                # Funções utilitárias
└── data/                 # Dados iniciais
    └── initialData.ts
```

## 🔄 Arquitetura de Dados

### Modelos Principais

#### Cliente
```typescript
interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone?: string;
  address: string;
  accessKey: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
```

#### Processo
```typescript
interface Process {
  id: string;
  processNumber: string;
  clientId: string;
  tipoCrime: string;
  comarcaVara: string;
  situacaoPrisional: string;
  startDate: string;
  lastUpdate: string;
  updates: ProcessUpdate[];
}
```

#### Usuário
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  isActive: boolean;
}
```

## 🎨 Sistema de Design

O projeto utiliza um sistema de design baseado em:

- **Tokens semânticos** no `index.css`
- **Configuração personalizada** no `tailwind.config.ts`
- **Componentes Shadcn/UI** customizados
- **Modo escuro/claro** automático
- **Design responsivo** para todas as telas

### Cores principais
```css
:root {
  --primary: [cor principal do sistema]
  --secondary: [cor secundária]
  --accent: [cor de destaque]
  --background: [cor de fundo]
  --foreground: [cor do texto]
}
```

## 🔧 Configurações

### TypeScript
- Strict mode habilitado
- Configuração modular (app, node)
- Aliases de caminho (`@/` → `src/`)
- Verificação rigorosa de tipos

### Tailwind CSS
- Configuração personalizada
- Sistema de tokens semânticos
- Componentes base customizáveis
- Suporte a dark mode

## 📊 Funcionalidades Avançadas

### Exportação de Dados
- Exportação de processos para Excel
- Formatação automática de dados
- Filtros customizáveis

### Busca e Filtros
- Busca em tempo real
- Filtros múltiplos
- Ordenação customizável

### Atualizações em Tempo Real
- Sincronização com Supabase
- Atualizações automáticas
- Estado consistente

## 🚨 Problemas Conhecidos

### Inconsistência de Nomenclatura
O projeto possui inconsistências entre `camelCase` e `snake_case` que estão sendo tratadas:
- Propriedades do banco de dados em `snake_case`
- Interface TypeScript em `camelCase`
- Funções de conversão sendo implementadas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença [especificar licença].

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através de [informações de contato].

---

**Desenvolvido por Avantech** 🚀