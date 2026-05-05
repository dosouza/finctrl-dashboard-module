(function () {
  const DashboardModule = {
    id: "dashboard",

    mount(ctx) {
      this.validateContext(ctx);
      this.ensureStyles(ctx);
      ctx.root.innerHTML = ctx.templates.view;
      this.bindActions(ctx);
      return this.load(ctx);
    },

    async load(ctx) {
      const mes = ctx.month || this.currentMonth();
      this.setText(ctx.root, "[data-kpi=mes]", this.formatMonth(mes));

      const endpoint = "/api/transacoes.php?action=dashboard&mes=" + encodeURIComponent(mes);
      const raw = await ctx.api(endpoint);
      const payload = this.unwrapDashboardPayload(raw);

      const totais = payload.totais || {};
      const ultimas = Array.isArray(payload.ultimas) ? payload.ultimas : [];

      this.renderMetrics(ctx.root, totais);
      this.renderUltimasTransacoes(ctx.root, ultimas);
      this.renderInsights(ctx.root, totais);
      this.renderMetasPlaceholder(ctx.root);
    },

    validateContext(ctx) {
      if (!ctx || !ctx.root) {
        throw new Error("DashboardModule: root nao informado");
      }
      if (!ctx.templates || !ctx.templates.view || !ctx.templates.styles) {
        throw new Error("DashboardModule: templates.view/styles sao obrigatorios");
      }
      if (typeof ctx.api !== "function") {
        throw new Error("DashboardModule: ctx.api(endpoint) deve ser funcao");
      }
    },

    bindActions(ctx) {
      const navButtons = ctx.root.querySelectorAll("[data-nav]");
      navButtons.forEach(function (btn) {
        const handler = function () {
          if (typeof ctx.onNavigate === "function") {
            ctx.onNavigate(btn.getAttribute("data-nav"));
          }
        };
        btn._dashboardHandler = handler;
        btn.addEventListener("click", handler);
      });
    },

    unmount(root) {
      const navButtons = root.querySelectorAll("[data-nav]");
      navButtons.forEach(function (btn) {
        if (btn._dashboardHandler) {
          btn.removeEventListener("click", btn._dashboardHandler);
          delete btn._dashboardHandler;
        }
      });
      const style = document.getElementById("dashboard-module-styles");
      if (style) {
        style.remove();
      }
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

    unwrapDashboardPayload(raw) {
      if (!raw || typeof raw !== "object") {
        return {};
      }
      if (raw.totais || raw.ultimas || raw.historico || raw.categorias) {
        return raw;
      }
      if (raw.data && (raw.data.totais || raw.data.ultimas || raw.data.historico || raw.data.categorias)) {
        return raw.data;
      }
      return raw.data || raw;
    },

    renderMetrics(root, totais) {
      this.setText(root, "#metric-saldo", this.money(this.calcSaldo(totais)));
      this.setText(root, "#metric-receitas", this.money(totais.receitas || 0));
      this.setText(root, "#metric-despesas", this.money(totais.despesas || 0));
      this.setText(root, "#metric-invest", this.money(totais.investimentos || 0));
    },

    renderUltimasTransacoes(root, txs) {
      const el = root.querySelector("#ultimas-transacoes");
      if (!el) {
        return;
      }

      if (!txs.length) {
        el.innerHTML = '<div class="muted">Sem transacoes recentes para o periodo.</div>';
        return;
      }

      el.innerHTML = txs.slice(0, 5).map((t) => {
        const valor = Number(t.valor || 0);
        const positivo = valor > 0;
        return (
          '<div class="tx-item">' +
            '<div class="tx-main">' +
              '<div class="tx-desc">' + this.escapeHtml(t.descricao || "Sem descricao") + '</div>' +
              '<div class="tx-cat">' + this.escapeHtml(t.categoria_nome || "Sem categoria") + '</div>' +
            '</div>' +
            '<div class="tx-value ' + (positivo ? "pos" : "neg") + '">' +
              (positivo ? "+" : "-") + this.money(Math.abs(valor)) +
            '</div>' +
          '</div>'
        );
      }).join("");
    },

    renderInsights(root, totais) {
      const el = root.querySelector("#insights-ia");
      if (!el) {
        return;
      }

      const receitas = Number(totais.receitas || 0);
      const despesas = Number(totais.despesas || 0);
      const pendentes = Number(totais.pendentes || 0);
      const cards = [];

      if (receitas > 0 && despesas > receitas * 0.8) {
        cards.push({
          cls: "warn",
          title: "Despesas elevadas",
          desc: "Despesas acima de 80% das receitas no mes."
        });
      }
      if (pendentes > 0) {
        cards.push({
          cls: "alert",
          title: pendentes + " transacao(oes) pendente(s)",
          desc: "Classifique os lancamentos para melhorar os insights."
        });
      }
      cards.push({
        cls: "tip",
        title: "Disciplina financeira",
        desc: "Registrar tudo regularmente melhora as decisoes."
      });

      el.innerHTML = cards.map((c) => {
        return (
          '<div class="insight ' + c.cls + '">' +
            '<div class="insight-title">' + this.escapeHtml(c.title) + '</div>' +
            '<div class="insight-desc">' + this.escapeHtml(c.desc) + '</div>' +
          '</div>'
        );
      }).join("");
    },

    renderMetasPlaceholder(root) {
      const el = root.querySelector("#metas-dashboard");
      if (!el) {
        return;
      }
      el.innerHTML = '<div class="muted">Metas ficam no modulo de metas. Aqui exibimos somente atalhos.</div>';
    },

    setText(root, selector, value) {
      const el = root.querySelector(selector);
      if (el) {
        el.textContent = value;
      }
    },

    calcSaldo(totais) {
      const saldoInicial = Number(totais.saldo_inicial || 0);
      return saldoInicial + Number(totais.receitas || 0) - Number(totais.despesas || 0);
    },

    currentMonth() {
      return new Date().toISOString().slice(0, 7);
    },

    formatMonth(yyyyMM) {
      const parts = String(yyyyMM || "").split("-");
      if (parts.length !== 2) {
        return "Mes atual";
      }
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const date = new Date(year, month, 1);
      return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    },

    money(value) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
      }).format(Number(value) || 0);
    },

    escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  };

  if (typeof window !== "undefined") {
    window.DashboardModule = DashboardModule;
  }
})();
