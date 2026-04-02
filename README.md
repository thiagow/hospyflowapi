# Projeto HospyFlowApp
Este repositório contém as diretrizes e ferramentas para o desenvolvimento do ecossistema HospyFlowApp, integrando backend (API) e frontend (App).
## Estrutura do Projeto
- `PROJECT_MANUAL.md`: Contém as diretrizes de desenvolvimento e o processo de tratamento de incidentes.
- `hospyflow-api/`: Código-fonte da API backend Node.js com TypeScript e Prisma.
- `hospyflowapp/`: Código-fonte do frontend React com Vite e Shadcn UI.
## Como Contribuir
1. **Desenvolvimento de Workflows**: Ao criar ou modificar workflows, siga as convenções definidas em `PROJECT_MANUAL.md`.
2. **Logs e Observabilidade**: Sempre verifique se o tratamento de erro está configurado corretamente em cada nó.
3. **Padrões de Nomeação**: Use camelCase para variáveis e nomes de nós descritivos em português.
## Gerenciamento de Incidentes
Em caso de falhas críticas, siga o checklist de incidentes descrito no `PROJECT_MANUAL.md`.
---
## Uso com n8n-mcp
As ferramentas MCP para n8n permitem que este ambiente interaja diretamente com a instância do n8n para:
- Gerar workflows a partir de linguagem natural.
- Validar a estrutura de nós e conexões.
- Implantar templates.
- Gerenciar execuções e realizar debug de erros.
Para mais informações sobre as ferramentas disponíveis, use a ferramenta `tools_documentation` do MCP.
