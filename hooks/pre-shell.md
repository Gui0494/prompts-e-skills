# Hook: pre-shell

## Evento
`pre-shell` — dispara antes de executar qualquer comando shell.

## Ação
`block` | `warn` — bloqueia comandos destrutivos, alerta sobre comandos suspeitos.

## Objetivo
Impedir que comandos destrutivos sejam executados sem aprovação explícita. Bloquear comandos que possam causar dano irreversível.

## Implementação

```typescript
interface PreShellHook {
  event: 'pre-shell';
  handler(context: { command: string; cwd: string; mode: Mode }): HookResult;
}

interface HookResult {
  action: 'allow' | 'block' | 'warn';
  reason?: string;
  suggestion?: string;
}

// Comandos BLOQUEADOS (deny — nunca executar)
const BLOCKED_PATTERNS: RegExp[] = [
  // Deleção destrutiva
  /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?-[a-zA-Z]*r[a-zA-Z]*\s+\//,   // rm -rf /
  /rm\s+(-[a-zA-Z]*r[a-zA-Z]*\s+)?-[a-zA-Z]*f[a-zA-Z]*\s+\//,   // rm -fr /
  /rm\s+(-[a-zA-Z]*f[a-zA-Z]*\s+)?-[a-zA-Z]*r[a-zA-Z]*\s+~/,    // rm -rf ~
  /del\s+\/[fF]\s+\/[qQ]/,                                         // del /f /q (Windows)

  // Formatação de disco
  /mkfs\./,
  /dd\s+if=.*of=\/dev/,

  // Fork bomb e derivados
  /:\(\)\s*\{\s*:\|:&\s*\}\s*;:/,
  /\.\(\)\s*\{\s*\.\|\.&\s*\}\s*;\./,

  // Permissões perigosas
  /chmod\s+(-[a-zA-Z]*\s+)?777\s+\//,
  /chown\s+(-[a-zA-Z]*\s+)?root\s+\//,

  // Escrita em devices
  />\s*\/dev\/sd[a-z]/,
  />\s*\/dev\/nvme/,

  // Rede destrutiva
  /iptables\s+-F/,                                                  // flush firewall
  /ufw\s+disable/,                                                  // desabilitar firewall

  // Shutdown/reboot
  /shutdown/,
  /reboot/,
  /init\s+[06]/,
];

// Comandos que geram WARNING (ask — pedir confirmação)
const WARN_PATTERNS: RegExp[] = [
  /rm\s+-[a-zA-Z]*r/,          // rm recursivo (qualquer, não só /)
  /git\s+push\s+.*--force/,    // force push
  /git\s+reset\s+--hard/,      // reset hard
  /git\s+clean\s+-[a-zA-Z]*f/, // git clean force
  /npm\s+publish/,              // publicar pacote
  /docker\s+system\s+prune/,   // limpar docker
  /drop\s+table/i,             // SQL drop
  /drop\s+database/i,          // SQL drop database
  /truncate\s+table/i,         // SQL truncate
  /sudo\s+/,                   // qualquer comando com sudo
  /curl.*\|\s*(ba)?sh/,        // curl pipe to bash
];

function preShellHook(context: { command: string; cwd: string; mode: Mode }): HookResult {
  const { command } = context;

  // Verificar blocklist
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(command)) {
      return {
        action: 'block',
        reason: `Comando bloqueado por segurança: "${command}" corresponde a padrão destrutivo.`,
        suggestion: 'Este tipo de comando não pode ser executado pelo agent.',
      };
    }
  }

  // Verificar warn list
  for (const pattern of WARN_PATTERNS) {
    if (pattern.test(command)) {
      return {
        action: 'warn',
        reason: `Comando potencialmente perigoso: "${command}".`,
        suggestion: 'Confirme antes de executar.',
      };
    }
  }

  return { action: 'allow' };
}
```

## Comportamento

### Quando BLOCK:
```
[⊘ BLOQUEADO] Comando: rm -rf /home
Motivo: Comando corresponde a padrão destrutivo (rm recursivo em diretório raiz).
Este comando não pode ser executado pelo agent por segurança.
```

### Quando WARN:
```
[⚠ ATENÇÃO] Comando: git push --force origin main
Motivo: Force push pode sobrescrever histórico no remote.
Deseja continuar? [s/N]
```

### Quando ALLOW:
Execução silenciosa, sem mensagem extra.

## Configuração

O usuário pode customizar a blocklist e warn list via `.agent/hooks.json`:

```json
{
  "pre-shell": {
    "additionalBlocked": [
      "custom-dangerous-command"
    ],
    "additionalWarn": [
      "npm run deploy"
    ],
    "whitelist": [
      "rm -rf node_modules",
      "rm -rf dist"
    ]
  }
}
```
