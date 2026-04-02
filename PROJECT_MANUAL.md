# Manual do Projeto - HospyFlowApp
Este documento contém as diretrizes e procedimentos padrão para a equipe de engenharia do HospyFlowApp.
## Diretrizes de Desenvolvimento
- **Arquitetura:** O projeto é dividido em `hospyflow-api` (backend) e `hospyflowapp` (frontend).
- **Backend:** Node.js com TypeScript, utiliza Prisma para acesso ao banco de dados e BullMQ para filas de processamento.
- **Frontend:** React com Vite, utiliza Shadcn UI e Lucide Icons para componentes visuais.
- **Nomenclatura:** Variáveis e nomes de pastas seguem camelCase no backend e PascalCase nos componentes do frontend. Os arquivos principais devem estar em português quando forem específicos de negócio.
- **Gestão de Dependências:** Sempre execute `npm install` após dar pull em alterações que afetem o `package.json`.
## Fluxo de Gerenciamento de Incidentes
Em caso de falha no sistema, siga os passos abaixo:
1. **Identificar o Impacto:** Determine se o sistema está fora do ar (Down), lento (Degradado) ou se uma funcionalidade específica falhou. É fundamental para a equipe de tecnologia saber se o ambiente de dev sumiu por causa de uma falha ou de uma migração planejada.
2. **Definir Prioridade (Sev1, Sev2, Sev3):**
   - **SEV1:** Problemas que afetam o produto em produção para todos os clientes, falhas em fluxos críticos de novos clientes ou falhas de segurança e perda de dados.
   - **SEV2:** Problemas que afetam fluxos de clientes em produção sem alternativas simples, falha em ferramentas internas críticas que impeçam o trabalho, ou degradação severa do sistema.
   - **SEV3:** Problemas de baixa prioridade, bugs no sistema de dev, ou problemas com impacto limitado.
3. **Criar uma War Room no Slack:** No Slack, crie um canal específico para o incidente (ex: `#inc-YYYY-MM-DD-nome-do-incidente`). Convide as pessoas essenciais e mantenha a comunicação centralizada lá.
4. **Investigar a Causa Raiz (Logs e Monitoramento):** Verifique Logs no CloudWatch, Datadog ou Sentry. Verifique commits recentes e deploys realizados no GitHub.
5. **Mitigação e Resolução:** Rollback, Hotfix ou comunicação externa via CX se necessário.
6. **Documentar o Post-Mortem:** Após resolver o incidente, registre o que aconteceu, o impacto, a causa raiz e as ações corretivas.
7. **Informar Stakeholders da Resolução.**
---
### Links Úteis:
- [Dashboards de Monitoramento](https://exemplo.com)
- [Documentação de Deploy](https://exemplo.com)
- [Template de Post-Mortem](https://exemplo.com)
- [Sistema de Status da n8n](https://status.n8n.io/)
