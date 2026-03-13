# Hook: post-task

## Evento
`post-task` — dispara ao finalizar uma tarefa completa.

## Ação
`run` — gera resumo da tarefa e diff das mudanças.

## Objetivo
Registrar o que foi feito, quais arquivos mudaram e qual o diff resultante. Isso cria um log auditável de cada tarefa.

## Implementação

```typescript
interface PostTaskHook {
  event: 'post-task';
  handler(context: {
    task: Task;
    workspacePath: string;
    session: SessionMemory;
  }): Promise<HookResult>;
}

async function postTaskHook(context: {
  task: Task;
  workspacePath: string;
  session: SessionMemory;
}): Promise<HookResult> {
  const { task, workspacePath } = context;

  // 1. Gerar diff de todas as mudanças
  const diff = await shell('git diff');
  const stagedDiff = await shell('git diff --cached');
  const untrackedFiles = await shell('git ls-files --others --exclude-standard');

  // 2. Listar arquivos modificados
  const modifiedFiles = await shell('git diff --name-only');
  const addedFiles = await shell('git diff --cached --name-only --diff-filter=A');

  // 3. Gerar resumo
  const summary = generateSummary(task, {
    modifiedFiles: modifiedFiles.split('\n').filter(Boolean),
    addedFiles: addedFiles.split('\n').filter(Boolean),
    diff: diff,
    duration: Date.now() - task.startedAt,
    toolCalls: task.toolCallCount,
    autoCorrections: task.autoCorrections,
  });

  // 4. Salvar em .agent/history/
  const today = new Date().toISOString().split('T')[0];
  const historyFile = `.agent/history/${today}.json`;
  await appendToHistory(historyFile, {
    timestamp: new Date().toISOString(),
    task: task.description,
    summary,
    filesModified: modifiedFiles.split('\n').filter(Boolean),
    filesAdded: addedFiles.split('\n').filter(Boolean),
  });

  // 5. Exibir ao usuário
  return {
    action: 'log',
    details: summary,
  };
}

function generateSummary(task: Task, data: TaskData): string {
  return [
    `## Resumo da Tarefa`,
    ``,
    `**Tarefa:** ${task.description}`,
    `**Modo:** ${task.mode}`,
    `**Duração:** ${formatDuration(data.duration)}`,
    `**Tool calls:** ${data.toolCalls}`,
    `**Autocorreções:** ${data.autoCorrections}`,
    ``,
    `### Arquivos Modificados`,
    ...data.modifiedFiles.map(f => `- \`${f}\``),
    ``,
    `### Arquivos Adicionados`,
    ...data.addedFiles.map(f => `- \`${f}\``),
    ``,
    `### Diff`,
    '```diff',
    data.diff.slice(0, 2000),  // truncar se muito longo
    data.diff.length > 2000 ? '\n... (truncado, use git diff para ver completo)' : '',
    '```',
  ].join('\n');
}
```

## Comportamento

### Ao finalizar tarefa:
```
────────────────────────────────────────
## Resumo da Tarefa

**Tarefa:** Adicionar dark mode ao header
**Modo:** ACT
**Duração:** 2m 34s
**Tool calls:** 12
**Autocorreções:** 1

### Arquivos Modificados
- `src/components/Header.tsx`
- `src/styles/theme.ts`

### Arquivos Adicionados
- `src/context/ThemeContext.tsx`

### Diff
  (diff resumido das mudanças)
────────────────────────────────────────
```

## Configuração

```json
{
  "post-task": {
    "showDiff": true,
    "saveToDisk": true,
    "maxDiffLines": 100,
    "historyDir": ".agent/history"
  }
}
```
