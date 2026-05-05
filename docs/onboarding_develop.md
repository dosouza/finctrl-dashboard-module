# Onboarding do Desenvolvedor - Dashboard Module

## Objetivo

Entender como um modulo externo conversa com o host FinCtrl sem acoplamento direto.

## Conceitos-chave

- O modulo nao sabe nada sobre login, sessao e roteamento interno do host.
- O host entrega dependencias por contexto (ctx) no mount.
- O modulo so sabe renderizar, buscar dados e disparar callbacks de navegacao.

## Ordem de leitura sugerida

1. manifest.json
2. src/dashboard.view.html
3. src/dashboard.styles.css
4. src/dashboard.module.js
5. README.md
6. docs/PROJECT.md

## Fluxo de execucao

1. Host baixa view + css + js do modulo.
2. Host chama DashboardModule.mount(ctx).
3. Modulo injeta estilo local.
4. Modulo renderiza HTML no root.
5. Modulo chama API de dashboard no mes selecionado.
6. Modulo exibe metricas, insights e ultimas transacoes.
7. Clique em botoes data-nav chama onNavigate(pageId).

## Tarefa pratica 1

Adicionar no card de metrica um campo de variacao percentual mensal.

**Como fazer com IA:**
```
Prompt: Estou em um modulo JavaScript isolado chamado DashboardModule. Quero adicionar um campo de variacao percentual mensaldos KPIs saldo/receitas/despesas. O modulo faz render em HTML via renderMetrics(). Faz um enhancement que:
1. Busque dados do mes anterior na API
2. Calcule a variacao em porcentagem
3. Atualize a view com <span class="delta">+5%</span> ou <span class="delta">-3%</span>

Onde devo fazer as alteracoes no codigo?
```

## Tarefa pratica 2

Criar metodo opcional unmount() para limpar listeners e timers.

## Tarefa pratica 3

Implementar adapter que converte endpoint do host legado para o formato esperado do modulo.

## Checklist de entrega

- Mantem compatibilidade com retorno direto e envelopado.
- Nao usa variaveis globais do host.
- Nao quebra quando nao houver dados.
- Funciona em desktop e mobile.
