# LegalControl - Sistema de Gestão de Processos Jurídicos

> **Sistema web moderno para substituir planilhas no controle de processos jurídicos, oferecendo segurança, organização e acesso controlado para advogados, funcionários e clientes.**

## 🎯 Objetivo do Projeto

Desenvolver um sistema web seguro, responsivo e prático para **substituir o uso de planilhas** no controle de processos jurídicos, permitindo à advogada e à equipe um gerenciamento mais eficiente das informações.

### 📋 Contexto do Negócio

**Situação Atual:**
- ❌ Uso de planilhas Excel para cadastro de clientes e controle de processos
- ❌ Falta de organização e segurança
- ❌ Acesso remoto limitado
- ❌ Alto risco de erro humano

**Solução Proposta:**
- ✅ Sistema centralizado e online
- ✅ Acesso segmentado por perfil
- ✅ Maior segurança e usabilidade
- ✅ Interface responsiva para todos os dispositivos

## 🚀 Tecnologias

- **React 18** com **TypeScript** - Interface moderna e tipada
- **Vite** - Build tool otimizada para desenvolvimento
- **Tailwind CSS** + **Shadcn/UI** - Design system consistente
- **Supabase** - Backend completo (autenticação, banco de dados)
- **React Router** - Navegação entre páginas
- **TanStack Query** - Gerenciamento de estado e cache
- **React Hook Form** + **Zod** - Formulários e validação
- **Export Excel** - Relatórios e exportação de dados

## 👥 Tipos de Usuários

| Tipo de Usuário | Permissões | Acesso |
|------------------|------------|--------|
| **Administrador** | Acesso total (cadastro, edição, exclusão) | Sistema completo |
| **Funcionário** | Cadastro e edição, sem permissão para excluir | Sistema administrativo |


## 📋 Funcionalidades Principais

### 🔐 Área Administrativa (Advogada e Funcionários)
- ✅ Login seguro com email e senha individual
- ✅ Cadastro e edição completa de clientes
- ✅ Gestão de processos jurídicos com status
- ✅ Histórico de atualizações processuais
- ✅ Filtros avançados (nome, CPF, status, etc.)
- ✅ Exportação de relatórios em Excel
- ✅ Controle de permissões por perfil
- ✅ Dashboard com estatísticas


### 🔧 Gerenciamento de Entidades
- ✅ Tipos de crime
- ✅ Comarcas e varas
- ✅ Situações prisionais
- ✅ Sistema CRUD completo para configurações

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
│   
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
- Sincronização com Banco de Dados
- Atualizações automáticas
- Estado consistente

## 🔒 Segurança e Conformidade

### Regras de Negócio
- ✅ **Acesso restrito**: Cada cliente acessa apenas suas informações
- ✅ **Controle de permissões**: Funcionários não podem excluir registros
- ✅ **Gestão administrativa**: A advogada gerencia todo o sistema
- ✅ **Privacidade**: Dados não indexados por mecanismos de busca

### Segurança Implementada
- 🔐 **Autenticação segura**: Login por CPF + chave (clientes) e email/senha (admin)
- 🛡️ **Proteção de dados**: Conformidade com LGPD
- 🚫 **Anti-indexação**: Sistema protegido contra motores de busca
- 💾 **Backup automático**: Proteção contra perda de dados via Banco de dados.

## 💰 Estimativa de Custos

Com base em planos pay-as-you-go (cobrança por uso):

| Item | Plano | Custo (USD) | Custo Estimado (BRL)* |
|------|-------|-------------|----------------------|
| **Frontend** | Render Gratuito | $0 | R$ 0 |
| **Backend/DB** | Supabase Free | $0 | R$ 0 |
| **Produção** | Render + Supabase Pro | $7-12 | R$ 36-62/mês |

> *Valores sujeitos à variação cambial. Como projeto acadêmico com tráfego leve, mantém-se na faixa mínima.

## 📅 Cronograma do Projeto

| Etapa | Período | Status |
|-------|---------|--------|
| **Planejamento e protótipos** | Maio 2025 | ✅ Concluído |
| **Desenvolvimento inicial** | Junho-Julho 2025 | 🔄 Em andamento |
| **Testes e ajustes finais** | Agosto 2025 | ⏳ Planejado |
| **Entrega do MVP** | Final de Agosto 2025 | 🎯 Meta |

## ⚠️ Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Instabilidade em planos gratuitos | Plano de upgrade disponível |
| Dificuldade de acesso dos clientes | Interface simplificada + tutoriais |
| Perda de dados | Backups automáticos do Supabase |
| Problemas de performance | Otimização contínua e monitoramento |

## 🧪 Viabilidade do Projeto

- ✅ **Técnica**: Viável (tecnologias dominadas pela equipe)
- ✅ **Econômica**: Baixo custo com potencial de escalabilidade
- ✅ **Operacional**: Equipe jurídica demonstrou interesse e capacidade
- ✅ **Legal**: Conforme LGPD; sem exposição de dados
- ✅ **Cronograma**: Realizável em 3 meses com entregas parciais

## 🚨 Status Atual

### ⚠️ Problemas Conhecidos
O projeto possui inconsistências entre `camelCase` e `snake_case` que estão sendo tratadas:
- Propriedades do banco de dados em `snake_case`
- Interface TypeScript em `camelCase`
- Funções de conversão sendo implementadas

### 🎯 Próximos Passos
- [ ] Implementar portal do cliente
- [ ] Melhorar sistema de notificações
- [ ] Adicionar mais filtros de busca
- [ ] Otimizar performance mobile

## 🤝 Equipe e Contribuição

**Desenvolvido por:** Avantech

**Cliente:** Escritório Jurídico Legal Control

### Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

> **LegalControl** - Transformando o controle jurídico através da tecnologia 🚀