# FinCtrl Dashboard Module

Modulo externo do Dashboard do FinCtrl, desacoplado para ser desenvolvido por equipes diferentes.

## Versao atual

- 0.1.5

## Estrutura

```
finctrl-dashboard-module/
├── docs/
│   ├── onboarding_develop.md      # Guia para devs iniciantes
│   └── PROJECT.md                 # Guia para desenvolvimento com IA
├── src/
│   ├── dashboard.module.js        # Controlador principal
│   ├── dashboard.view.html        # Template da pagina
│   └── dashboard.styles.css       # Estilos locais
├── manifest.json                  # Metadados e nav item do modulo
├── version.json                   # Controle de versao semantica
└── README.md                      # Este arquivo
```

## Contrato do host

O host precisa passar um contexto para mount(ctx):

- root: elemento DOM onde a pagina sera renderizada
- api(endpoint): funcao async para chamar API autenticada
- templates.view: string HTML
- templates.styles: string CSS
- month (opcional): formato YYYY-MM
- onNavigate(pageId) (opcional): callback para navegar no host

## Endpoint esperado

Por padrao, o modulo chama:

- /api/transacoes.php?action=dashboard&mes=YYYY-MM

Ele aceita retorno em dois formatos:

- formato direto: { totais, ultimas, historico, categorias }
- formato envelopado: { data: { totais, ultimas, historico, categorias } }

## Exemplo de integracao

```html
<div id="sandbox"></div>
<script src="src/dashboard.module.js"></script>
<script>
  (async function () {
    const root = document.getElementById("sandbox");
    const view = await fetch("src/dashboard.view.html").then(function (r) { return r.text(); });
    const styles = await fetch("src/dashboard.styles.css").then(function (r) { return r.text(); });

    function api(endpoint) {
      return fetch(endpoint, { credentials: "include" }).then(function (res) {
        if (!res.ok) {
          throw new Error("Falha HTTP: " + res.status);
        }
        return res.json();
      });
    }

    await window.DashboardModule.mount({
      root: root,
      templates: { view: view, styles: styles },
      month: "2026-05",
      api: api,
      onNavigate: function (pageId) {
        console.log("navegar para", pageId);
      }
    });
  })();
</script>
```

## Roadmap curto

- 0.1.2: adicionar suporte opcional a graficos quando Chart.js estiver disponivel no host
- 0.1.3: adapter oficial para FinCtrl Core

## Documentacao Adicional

- [docs/onboarding_develop.md](docs/onboarding_develop.md) - Guia pratico para devs iniciantes
- [docs/PROJECT.md](docs/PROJECT.md) - Arquitetura e como usar IA para desenvolvimento

