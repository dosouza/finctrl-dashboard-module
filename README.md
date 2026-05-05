# Dashboard Module POC

Este pacote contem um recorte isolado do Dashboard para validar o modelo de modulo em repositorio separado.

## Estrutura

- manifest.json: metadados e nav item do modulo
- dashboard.module.js: controlador do modulo
- dashboard.view.html: template da pagina
- dashboard.styles.css: estilos locais do modulo

## Contrato esperado no host

O sistema host deve fornecer um contexto com:

- root: elemento DOM onde a pagina sera montada
- api(endpoint): funcao de chamada HTTP para a API
- templates.view: string HTML da view
- templates.styles: string CSS dos estilos

## Exemplo de bootstrap rapido

```html
<div id="sandbox"></div>
<script src="dashboard.module.js"></script>
<script>
  (async function () {
    const root = document.getElementById("sandbox");
    const view = await fetch("dashboard.view.html").then(r => r.text());
    const styles = await fetch("dashboard.styles.css").then(r => r.text());

    await window.DashboardModule.mount({
      root,
      templates: { view, styles },
      api: async function () {
        return {
          data: {
            saldo: 1200.5,
            receitas: 3500,
            despesas: 2299.5,
            total_transacoes: 18
          }
        };
      }
    });
  })();
</script>
```

## Proximo passo

Subir esta pasta como repositorio separado e conectar no FinCtrl por meio do module loader na Fase 2.
