<<<<<<< main

# Sistema de Gestão Jurídica

Um sistema web para gestão de processos jurídicos desenvolvido com React + TypeScript + Vite.

## 🚀 Tecnologias

- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes UI
- **React Router** - Roteamento
- **TanStack Query** - Gerenciamento de estado

## 🛠️ Como executar

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento (com TypeScript automático)
npm run dev

# Build para produção (com verificação TypeScript)
npm run build

# Verificar tipos TypeScript manualmente
npm run type-check
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React (.tsx)
│   ├── ui/             # Componentes base do Shadcn/UI
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── LoginForm.tsx   # Formulário de login
│   └── ...
├── contexts/           # Contextos React (.tsx)
│   └── AuthContext.tsx
├── hooks/              # Custom hooks (.ts/.tsx)
├── lib/                # Utilitários (.ts)
├── pages/              # Páginas (.tsx)
├── types/              # Definições de tipos (.d.ts)
└── main.tsx           # Ponto de entrada
```

## 📝 Como adicionar novos arquivos TypeScript

### 1. Componentes React
```typescript
// src/components/MeuComponente.tsx
import React from 'react';

interface MeuComponenteProps {
  titulo: string;
  opcoes?: string[];
}

export function MeuComponente({ titulo, opcoes = [] }: MeuComponenteProps) {
  return (
    <div>
      <h1>{titulo}</h1>
      {opcoes.map((opcao, index) => (
        <p key={index}>{opcao}</p>
      ))}
    </div>
  );
}
```

### 2. Hooks customizados
```typescript
// src/hooks/useMeuHook.ts
import { useState, useEffect } from 'react';

interface MeuHookReturn {
  dados: string[];
  carregando: boolean;
  erro: string | null;
}

export function useMeuHook(): MeuHookReturn {
  const [dados, setDados] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    // Lógica do hook
  }, []);

  return { dados, carregando, erro };
}
```

### 3. Utilitários e funções
```typescript
// src/lib/utils.ts
export interface FormatarDataOptions {
  formato?: 'DD/MM/YYYY' | 'MM/DD/YYYY';
  incluirHora?: boolean;
}

export function formatarData(data: Date, options: FormatarDataOptions = {}): string {
  // Implementação
  return data.toLocaleDateString('pt-BR');
}
```

### 4. Tipos e interfaces
```typescript
// src/types/cliente.d.ts
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone?: string;
  endereco: {
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  criadoEm: Date;
  chaveAcesso: string;
}

export type StatusProcesso = 'ativo' | 'pendente' | 'concluido' | 'cancelado';
```

## 🔧 Configuração TypeScript

O projeto usa as seguintes configurações:

- **tsconfig.json** - Configuração principal do TypeScript
- **tsconfig.app.json** - Configuração específica da aplicação
- **tsconfig.node.json** - Configuração para scripts Node.js

### Principais recursos habilitados:
- Strict mode (verificação rigorosa)
- JSX com React 18
- Resolução de módulos ESNext
- Aliases de caminho (`@/` aponta para `src/`)

## ✅ Boas práticas TypeScript

1. **Sempre defina tipos para props de componentes**
2. **Use interfaces para objetos complexos**
3. **Prefira `type` para unions e primitivos**
4. **Evite `any` - use `unknown` quando necessário**
5. **Use genéricos para funções reutilizáveis**

## 🚨 Verificação de tipos

O TypeScript é verificado automaticamente durante:
- `npm run dev` (modo desenvolvimento)
- `npm run build` (build de produção)
- No editor com extensão TypeScript

### Comandos úteis:
```bash
# Verificar tipos sem executar
npx tsc --noEmit

# Verificar tipos com watch mode
npx tsc --noEmit --watch
```

## 📚 Recursos adicionais

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React + TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite TypeScript Guide](https://vitejs.dev/guide/features.html#typescript)
=======
# Criação da branch conectar_bd para a modelação do banco de dados.
>>>>>>> Conectar_BD
