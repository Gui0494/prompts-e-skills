# Skill: bug-investigator

## Objetivo
Reproduz bug, coleta logs, encontra causa raiz e propõe correção com evidência.

## Quando Usar
- Quando o usuário reporta um bug.
- Quando um teste falha sem causa óbvia.
- Quando há erro em produção que precisa de investigação.

## Trigger
```yaml
manual: true        # /skill bug-investigator
auto: true
patterns:
  - "bug"
  - "erro"
  - "não funciona"
  - "quebrou"
  - "falha"
  - "crash"
```

## Entradas
| Input | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| description | string | sim | Descrição do bug |
| steps | string[] | não | Passos para reproduzir |
| errorMessage | string | não | Mensagem de erro se disponível |
| logFile | string | não | Caminho para arquivo de log |

## Saídas
| Output | Tipo | Descrição |
|---|---|---|
| rootCause | string | Causa raiz identificada |
| evidence | Evidence[] | Evidências que suportam a conclusão |
| fix | ProposedFix | Correção proposta com diff |
| confidence | number | Confiança na causa raiz (0-1) |

## Ferramentas Necessárias
- `fs_read` — ler código e logs
- `fs_grep` — buscar padrões relacionados ao erro
- `shell` — reproduzir o bug (se possível)
- `web_search` — pesquisar erros conhecidos (se disponível)

## Fluxo

```
1. COLETAR INFORMAÇÃO
   ├── Ler mensagem de erro
   ├── Ler logs se disponíveis
   ├── Ler stack trace se disponível
   └── Identificar arquivo(s) e linha(s) do erro

2. LOCALIZAR CÓDIGO RELEVANTE
   ├── fs_read nos arquivos indicados pelo stack trace
   ├── fs_grep para encontrar código relacionado
   └── Mapear fluxo de dados (de onde vem, para onde vai)

3. REPRODUZIR (se possível)
   ├── shell com comando que reproduz o bug
   ├── Capturar output real
   └── Confirmar que o erro ocorre

4. ANALISAR CAUSA RAIZ
   ├── Comparar comportamento esperado vs real
   ├── Identificar o ponto exato da falha
   ├── Verificar se é regressão (git log/blame)
   └── Verificar se há issue/CVE conhecida (web_search)

5. PROPOR CORREÇÃO
   ├── Gerar diff mínimo (via implement-minimal-diff)
   ├── Explicar por que a correção resolve
   └── Identificar riscos da correção

6. VERIFICAR CORREÇÃO
   ├── Aplicar correção
   ├── Reproduzir cenário original
   └── Confirmar que o erro não ocorre mais
```

## Formato de Saída

```markdown
## Investigação de Bug

### Descrição
[descrição do bug]

### Reprodução
\`\`\`
$ npm test -- --filter "checkout"
FAIL: Expected total to be 100, received NaN
\`\`\`

### Causa Raiz
**Arquivo:** src/utils/calculateTotal.ts:15
**Linha:** `const total = items.reduce((sum, item) => sum + item.price, 0)`
**Problema:** `item.price` é undefined quando item não tem preço definido.
Isso causa `NaN` que se propaga para o total.

**Confiança:** 0.95

### Evidência
1. Stack trace aponta para `calculateTotal.ts:15`
2. `fs_grep("price", "src/types/")` mostra que `price` é opcional no tipo Item
3. Teste falha consistentemente com item sem preço
4. `git log -1 src/utils/calculateTotal.ts` mostra que a última edição removeu o fallback

### Correção Proposta
\`\`\`diff
--- a/src/utils/calculateTotal.ts
+++ b/src/utils/calculateTotal.ts
@@ -15,1 +15,1 @@
-  const total = items.reduce((sum, item) => sum + item.price, 0)
+  const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0)
\`\`\`

### Verificação
Após correção, teste `checkout` passa: ✓
```

## Limites
- Não corrige automaticamente em modo PLAN (apenas propõe).
- Timeout de reprodução: 60s.
- Se não conseguir reproduzir, reporta com confiança menor.
- Máximo de 5 arquivos analisados por investigação.

## Falhas Comuns
| Falha | Causa | Solução |
|---|---|---|
| Não consegue reproduzir | Bug intermitente ou dependente de estado | Reportar com evidência parcial |
| Múltiplas causas possíveis | Bug complexo | Listar todas com confiança relativa |
| Erro em dependência | Bug não está no código do projeto | Pesquisar issue no repositório da dependência |
| Sem stack trace | Erro silencioso | Adicionar logs temporários para rastrear |
