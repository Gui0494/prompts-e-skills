# Memory — Especificação

## 1. Visão Geral

O sistema de memória gerencia todo o estado que o agent precisa para operar de forma coerente durante uma sessão e entre sessões.

**Princípio:** Memória não é simulada. Toda informação armazenada vem de ações reais, leituras reais ou resultados reais de ferramentas.

## 2. Camadas de Memória

```
┌─────────────────────────────────────────┐
│           MEMÓRIA IMEDIATA              │
│  Contexto da chamada LLM atual          │
│  - system prompt                        │
│  - mensagens recentes                   │
│  - tool results pendentes               │
│  Duração: uma iteração do loop          │
├─────────────────────────────────────────┤
│           MEMÓRIA DE SESSÃO             │
│  Estado persistente durante a sessão    │
│  - modo atual                           │
│  - plano ativo                          │
│  - histórico de conversa               │
│  - cache de arquivos                    │
│  - project context                      │
│  Duração: uma sessão do agent           │
├─────────────────────────────────────────┤
│           MEMÓRIA DE PROJETO            │
│  Persistida em disco no workspace       │
│  - .agent/memory.json                   │
│  - .agent/conventions.json              │
│  - .agent/history/                      │
│  Duração: vida do projeto               │
├─────────────────────────────────────────┤
│           MEMÓRIA GLOBAL                │
│  Preferências do usuário                │
│  - ~/.config/cli-agent/preferences.json │
│  - ~/.config/cli-agent/trusted-mcps.json│
│  Duração: permanente                    │
└─────────────────────────────────────────┘
```

## 3. Memória Imediata

Montada a cada iteração do agent loop. É o contexto enviado ao LLM.

```typescript
interface ImmediateMemory {
  systemPrompt: string;
  messages: Message[];
  pendingToolResults: ToolResult[];
  availableTools: ToolDefinition[];
}
```

### Compressão de contexto

Quando o contexto se aproxima do limite de tokens:

```typescript
interface CompressionStrategy {
  // 1. Remove tool results antigos (mantém os 5 mais recentes)
  pruneOldToolResults(results: ToolResult[], keep: number): ToolResult[];

  // 2. Sumariza mensagens antigas
  summarizeOldMessages(messages: Message[], threshold: number): Message[];

  // 3. Remove file contents do cache (mantém paths)
  compressFileCache(cache: FileCache): FileCache;

  // 4. Último recurso: trunca conversa para N mensagens mais recentes
  truncateConversation(messages: Message[], keep: number): Message[];
}

const COMPRESSION_THRESHOLDS = {
  // Quando contexto atinge 70% do limite, comprime tool results
  toolResultPrune: 0.7,
  // Quando atinge 80%, sumariza mensagens antigas
  messageSummarize: 0.8,
  // Quando atinge 90%, comprime file cache
  fileCacheCompress: 0.9,
  // Quando atinge 95%, trunca conversa
  conversationTruncate: 0.95,
};
```

## 4. Memória de Sessão

Persiste durante toda a sessão do agent (enquanto o processo está rodando).

```typescript
interface SessionMemory {
  // Estado operacional
  mode: Mode;
  taskStack: Task[];           // pilha de tarefas (suporta subtarefas)

  // Plano ativo
  activePlan: Plan | null;
  planHistory: Plan[];         // planos anteriores da sessão

  // Conversa
  conversation: ConversationStore;

  // Cache
  fileCache: FileCache;
  toolResultCache: ToolResultCache;

  // Projeto
  projectContext: ProjectContext | null;

  // Métricas
  metrics: SessionMetrics;
}
```

### Conversation Store

```typescript
interface ConversationStore {
  messages: Message[];
  totalTokens: number;
  summaries: Summary[];        // sumarizações de trechos antigos

  add(message: Message): void;
  getRecent(n: number): Message[];
  getAll(): Message[];
  compress(): void;
}

interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: number;
  metadata: {
    mode: Mode;
    toolCalls?: ToolCall[];
    tokenCount: number;
  };
}
```

### File Cache

```typescript
interface FileCache {
  entries: Map<string, FileCacheEntry>;

  get(path: string): FileCacheEntry | null;
  set(path: string, content: string, mtime: number): void;
  invalidate(path: string): void;
  invalidateAll(): void;
}

interface FileCacheEntry {
  path: string;
  content: string;
  mtime: number;          // modification time — para invalidação
  readAt: number;         // quando foi lido
  tokenCount: number;     // tokens consumidos por este conteúdo
}
```

**Regras de invalidação:**
- Antes de usar cache, verifica se `mtime` do arquivo mudou.
- Se o agent editou o arquivo, invalida o cache imediatamente.
- Se um hook (formatter/lint) modificou o arquivo, invalida.
- Cache não sobrevive entre sessões.

### Plan State

```typescript
interface Plan {
  id: string;
  objective: string;
  steps: PlanStep[];
  affectedFiles: string[];
  risks: string[];
  status: 'draft' | 'approved' | 'in_progress' | 'completed' | 'failed';
  createdAt: number;
  completedAt: number | null;
}

interface PlanStep {
  id: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  toolsNeeded: string[];
  output: string | null;
  error: string | null;
}
```

## 5. Memória de Projeto

Persistida no diretório do projeto. Sobrevive entre sessões.

```
.agent/
├── memory.json          # Estado salvo da última sessão
├── conventions.json     # Convenções detectadas/configuradas
├── history/
│   ├── 2024-01-15.json  # Log de sessão por data
│   └── 2024-01-16.json
└── cache/
    └── repo-intel.json  # Cache do repo-intel (stack, estrutura)
```

### memory.json

```json
{
  "lastSession": {
    "date": "2024-01-15T14:30:00Z",
    "mode": "ACT",
    "lastTask": "Adicionar dark mode ao header",
    "openIssues": [
      "Testes de snapshot precisam atualizar"
    ]
  },
  "learnedFacts": [
    {
      "fact": "Projeto usa Tailwind para estilos",
      "source": "repo-intel",
      "confidence": 1.0
    },
    {
      "fact": "Testes rodam com vitest",
      "source": "repo-intel",
      "confidence": 1.0
    },
    {
      "fact": "Deploy via Vercel",
      "source": "user",
      "confidence": 1.0
    }
  ],
  "fileImportanceMap": {
    "src/components/Header.tsx": "high",
    "src/styles/theme.ts": "high",
    "package.json": "critical",
    "README.md": "low"
  }
}
```

### conventions.json

```json
{
  "codeStyle": {
    "formatter": "prettier",
    "linter": "eslint",
    "indentation": "spaces-2",
    "quotes": "single",
    "semicolons": false
  },
  "gitConventions": {
    "branchPattern": "feat|fix|chore|docs/<description>",
    "commitPattern": "conventional-commits",
    "prTemplate": true
  },
  "architecture": {
    "pattern": "feature-based",
    "stateManagement": "zustand",
    "testFramework": "vitest",
    "componentPattern": "functional + hooks"
  },
  "rules": [
    "Nunca usar any em TypeScript",
    "Testes obrigatórios para utils/",
    "Componentes devem ter prop types explícitos"
  ]
}
```

## 6. Memória Global

Preferências do usuário que se aplicam a todos os projetos.

```
~/.config/cli-agent/
├── preferences.json
├── trusted-mcps.json
└── permissions.json
```

### preferences.json

```json
{
  "defaultMode": "CHAT",
  "theme": "dark",
  "autoRetry": true,
  "maxRetries": 3,
  "confirmDestructive": true,
  "defaultLLM": "claude-sonnet",
  "locale": "pt-BR",
  "editor": "vim"
}
```

## 7. Fluxo de Memória no Agent Loop

```
INÍCIO DA SESSÃO
    │
    ├── Carrega memória global (~/.config/cli-agent/)
    ├── Carrega memória de projeto (.agent/)
    └── Inicializa memória de sessão (vazia)
         │
         ▼
CADA ITERAÇÃO DO LOOP
    │
    ├── Monta memória imediata:
    │   ├── System prompt (baseado no modo)
    │   ├── Conversation (com compressão se necessário)
    │   ├── Project context (do cache ou repo-intel)
    │   ├── Tool results recentes
    │   └── Available tools (filtrados pelo modo)
    │
    ├── Após execução:
    │   ├── Atualiza conversation com resposta
    │   ├── Atualiza file cache se leu/editou arquivo
    │   ├── Atualiza plan state se está em modo PLAN/AUTO
    │   └── Atualiza tool result cache
    │
    └── Periodicamente:
        ├── Persiste session state em .agent/memory.json
        └── Atualiza .agent/conventions.json se aprendeu algo novo
             │
             ▼
FIM DA SESSÃO
    │
    ├── Salva resumo da sessão em .agent/history/
    ├── Atualiza .agent/memory.json
    └── Limpa memória de sessão
```

## 8. Limites e Proteções

```typescript
const MEMORY_LIMITS = {
  // Memória imediata
  maxContextTokens: 128_000,      // depende do modelo
  maxToolResults: 20,              // resultados mantidos no contexto
  maxFilesCached: 50,              // arquivos no cache

  // Memória de sessão
  maxConversationMessages: 500,    // mensagens antes de forçar compressão
  maxPlanHistory: 10,              // planos mantidos
  maxSessionDuration: 8 * 3600,    // 8 horas

  // Memória de projeto
  maxMemoryFileSize: 1_048_576,    // 1MB para memory.json
  maxHistoryFiles: 30,             // últimos 30 dias
  maxLearnedFacts: 200,            // fatos aprendidos

  // Memória global
  maxTrustedMCPs: 50,
};
```

## 9. Estratégia de Recuperação

Se a memória de sessão corrompe (crash, OOM):

```typescript
async function recoverSession(): Promise<SessionMemory> {
  // 1. Tenta carregar último checkpoint de .agent/memory.json
  const checkpoint = await loadCheckpoint();
  if (checkpoint) {
    console.log('Sessão restaurada do último checkpoint.');
    return checkpoint;
  }

  // 2. Se não há checkpoint, inicia sessão limpa
  console.log('Nenhum checkpoint encontrado. Iniciando sessão limpa.');
  return createFreshSession();
}
```

## 10. Privacidade e Segurança

- Memória de projeto (`.agent/`) deve ser adicionada ao `.gitignore` por padrão.
- Nunca armazena tokens, senhas, API keys na memória.
- Se detecta conteúdo sensível, substitui por placeholder: `[REDACTED]`.
- Memória global usa permissões do filesystem do usuário.
- Ao desinstalar o agent, a memória global pode ser limpa com `cli-agent --purge`.
