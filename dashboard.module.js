(function () {
  const DashboardModule = {
    id: "dashboard",

    mount(ctx) {
      if (!ctx || !ctx.root) {
        throw new Error("DashboardModule: contexto invalido");
      }

      // Injeta estilos do modulo uma unica vez
      this.ensureStyles(ctx);

      // Renderiza template inicial
      ctx.root.innerHTML = ctx.templates.view;

      // Carrega KPIs
      return this.load(ctx);
    },

    async load(ctx) {
      const data = await ctx.api("dados.php?resumo=1");
      const resumo = data && data.data ? data.data : {};

      this.setText(ctx.root, "[data-kpi=saldo]", this.money(resumo.saldo || 0));
      this.setText(ctx.root, "[data-kpi=receitas]", this.money(resumo.receitas || 0));
      this.setText(ctx.root, "[data-kpi=despesas]", this.money(resumo.despesas || 0));
      this.setText(ctx.root, "[data-kpi=resumo]", this.buildResumo(resumo));
    },

    ensureStyles(ctx) {
      if (document.getElementById("dashboard-module-styles")) {
        return;
      }
      const style = document.createElement("style");
      style.id = "dashboard-module-styles";
      style.textContent = ctx.templates.styles;
      document.head.appendChild(style);
    },

    setText(root, selector, value) {
      const el = root.querySelector(selector);
      if (el) {
        el.textContent = value;
      }
    },

    buildResumo(resumo) {
      const transacoes = Number(resumo.total_transacoes || 0);
      if (!transacoes) {
        return "Sem movimentacoes no periodo.";
      }
      return "Total de " + transacoes + " transacoes no periodo selecionado.";
    },

    money(value) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(Number(value) || 0);
    }
  };

  if (typeof window !== "undefined") {
    window.DashboardModule = DashboardModule;
  }
})();
