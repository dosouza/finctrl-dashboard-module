# Onboarding do Estagiario - Dashboard Module

## Objetivo

Entender como um modulo externo conversa com o host FinCtrl sem acoplamento direto.

## Conceitos-chave

- O modulo nao sabe nada sobre login, sessao e roteamento interno do host.
- O host entrega dependencias por contexto (ctx) no mount.
- O modulo so sabe renderizar, buscar dados e disparar callbacks de navegacao.

## Ordem de leitura sugerida

1. manifest.json
2. dashboard.view.html
3. dashboard.styles.css
4. dashboard.module.js
5. README.md

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

## Tarefa pratica 2

Criar metodo opcional unmount() para limpar listeners e timers.

## Tarefa pratica 3

Implementar adapter que converte endpoint do host legado para o formato esperado do modulo.

## Checklist de entrega

- Mantem compatibilidade com retorno direto e envelopado.
- Nao usa variaveis globais do host.
- Nao quebra quando nao houver dados.
- Funciona em desktop e mobile.
