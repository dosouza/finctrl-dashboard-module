# PROJECT.md - Guia para Desenvolvimento com IA

Este arquivo descreve a arquitetura e como usar IA (Copilot, ChatGPT, etc.) para acelerar desenvolvimento.

## Estrutura do Projeto

```
finctrl-dashboard-module/
├── docs/
│   ├── onboarding_develop.md      # Guia para devs iniciantes
│   └── PROJECT.md                 # Este arquivo
├── src/
│   ├── dashboard.module.js        # Controlador principal
│   ├── dashboard.view.html        # Template HTML
│   └── dashboard.styles.css       # Estilos locais
├── manifest.json                  # Metadados do modulo
├── version.json                   # Versao semantica
├── README.md                      # Documentacao principal
└── .gitignore                     # Arquivos ignorados
```

## Filosofia de Arquitetura

### Principio 1: Isolamento Completo
O modulo nao conhece o host. Toda dependencia vem por injecao:
- Contexto (ctx) no mount()
- API acessada via ctx.api(endpoint)
- Navegacao disparada por callback ctx.onNavigate()

### Principio 2: Sem Variaveis Globais
Nao use window.App, window.state, etc. Trabalhe sempre dentro do escopo do modulo.

### Principio 3: Contracts Explicitos
Documente:
- Que dados espera (totais, ultimas, historico, categorias)
- Como o host deve chamar mount(ctx)
- Que callbacks dispara (onNavigate, onError, etc.)

## Como Usar IA para Desenvolver Aqui

### Quando Adicionar Feature Nova

**1. Descreva o escopo**
```
Prompt: "Quero adicionar grafico de tendencia de saldos dos ultimos 6 meses no dashboard.
O host pode fornecer dados de historico por mes via API. Como faço isso sem
quebrar compatibilidade com hosts que nao tem esse endpoint?"
```

**2. Peça validacao de design**
```
Prompt: "Vou adicionar um novo metodo renderTrendChart(root, historico). 
Ele deve:
- Ignorar silenciosamente se Chart.js nao estiver no window
- Fallback para lista de texto se grafico falhar
- Usar as cores do tema escuro existente

Isso faz sentido? Que mais devo considerar?"
```

**3. Peça revisao de codigo**
```
Prompt: "Revise meu novo metodo renderTrendChart() no modulo. Procure por:
- Memory leaks se o chart for destruido e recriado
- XSS na renderizacao de dados
- Compatibilidade com edge cases (dados vazios, valores negativos, etc)"
```

### Quando Refatorar

**1. Estrutura é pesada?**
```
Prompt: "Meu DashboardModule agora tem 10+ metodos. Como devo organizar?
Devo dividir em submodulos? Usar classes? Manter como IIFE?"
```

**2. Precisa testar?**
```
Prompt: "Gere testes unitarios para o metodo money() do meu modulo.
Use framework basico (sem dependencias externas) e cubra edge cases
como NaN, valores muito altos, valores negativos."
```

### Quando Integrar com Host

**1. Faça contrato**
```
Prompt: "Vou integrar este modulo no FinCtrl. O host chama meu mount(ctx).
Liste especificamente:
- Que propriedades ctx deve ter
- Que formato espera do /api/transacoes.php?action=dashboard
- Que callbacks eu vou disparar e quando
Faca disso um checklist de integracao."
```

## Padroes de Coding Neste Projeto

### 1. Sem Arrow Functions
Por compatibilidade com browsers antigos, use function declarations:

```javascript
// ✅ Bom
const obj = {
  metodo: function() { return 42; }
};

// ❌ Evitar
const obj = {
  metodo: () => 42
};
```

### 2. Sem Async/Await em Cascata
Use .then() quando possivel para melhor controle:

```javascript
// ✅ Bom
async load(ctx) {
  const raw = await ctx.api(endpoint);
  const payload = this.unwrap(raw);
  this.render(payload);
}

// Especialmente ruim:
async load(ctx) {
  const raw = await ctx.api(endpoint1);
  const extra = await ctx.api(endpoint2);
  const third = await ctx.api(endpoint3);
  // Use Promise.all() em casos assim
}
```

### 3. Sempre Validar Dados
```javascript
// ✅ Bom
const totais = payload.totais || {};
const receitas = Number(totais.receitas || 0);

// ❌ Ruim
const receitas = payload.totais.receitas;
```

### 4. String Concatenation Over Template Literals
Por compatibilidade ES5:

```javascript
// ✅ Bom
'<div class="' + cls + '">' + content + '</div>'

// ❌ Evitar (ES6+)
`<div class="${cls}">${content}</div>`
```

## Roadmap de Desenvolvimento

### v0.1.1 ✅
- Metricas basicas (saldo, receitas, despesas)
- Ultimas transacoes
- Insights simples

### v0.1.2 (proxima)
- Support opcional a Chart.js se disponivel no host
- Grafico de historico de receitas vs despesas
- Melhor deteccao de dados vazios

### v0.2.0 (futuro)
- Adapter para hosts legados (ex: sistemas que nao seguem padrao)
- Temas customizaveis via CSS variables
- Suporte a i18n (multiplos idiomas)

## Como Contribuir

1. **Fork este repositorio**
2. **Crie branch**: git checkout -b feature/seu-feature
3. **Edite src/** mantenha manifest.json atualizado
4. **Teste integracoes** rodando exemplo local
5. **Commit versionado**: git commit -m "v0.1.x - feat: descricao"
6. **Submeta PR** com descricao clara

## Testing Checklist

Antes de submeter, valide:

- [ ] Renders sem erro quando dados estao vazios
- [ ] Nao quebra host se ctx.api falhar
- [ ] Callbacks onNavigate disparam corretamente
- [ ] Estilos nao conflitam com host (prefixo .dashboard-module)
- [ ] Compativel com desktop (980px+) e mobile (<768px)
- [ ] Sem console.error, console.warn (exceto erros reais)
- [ ] version.json atualizado

## Links Uteis

- [manifest.json spec](../README.md#contrato-do-host)
- [onboarding_develop.md](./onboarding_develop.md)
- [README.md](../README.md)
