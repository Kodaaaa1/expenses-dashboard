// ===============================
// 📦 DADOS
// ===============================
let lista = JSON.parse(localStorage.getItem("gastos")) || [];

const listaHTML = document.getElementById("lista");
const totalHTML = document.getElementById("total");

let chart;

// ===============================
// 💰 FORMATAR MOEDA
// ===============================
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

// ===============================
// 💾 SALVAR NO LOCALSTORAGE
// ===============================
function salvarDados() {
  localStorage.setItem("gastos", JSON.stringify(lista));
}

// ===============================
// ➕ ADICIONAR GASTO
// ===============================
function adicionarGasto() {
  const nome = document.getElementById("nome").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const categoria = document.getElementById("categoria").value;

  if (!nome || !valor) {
    alert("Preencha todos os campos!");
    return;
  }

  lista.push({ nome, valor, categoria });

  salvarDados();
  atualizarTela();
  limparCampos();
}

// ===============================
// 🧹 LIMPAR CAMPOS
// ===============================
function limparCampos() {
  document.getElementById("nome").value = "";
  document.getElementById("valor").value = "";
}

// ===============================
// ❌ REMOVER GASTO
// ===============================
function removerGasto(index) {
  lista.splice(index, 1);

  salvarDados();
  atualizarTela();
}

// ===============================
// 🔄 ATUALIZAR TELA
// ===============================
function atualizarTela() {
  listaHTML.innerHTML = "";

  let total = 0;
  let categorias = {};

  lista.forEach((gasto, index) => {
    total += gasto.valor;

    // Criar item da lista
    const li = document.createElement("li");
    li.innerHTML = `
      <span>
        ${gasto.nome}<br>
        <small>${gasto.categoria}</small>
      </span>
      <span>
        ${formatarMoeda(gasto.valor)}
        <button onclick="removerGasto(${index})">X</button>
      </span>
    `;

    listaHTML.appendChild(li);

    // Somar categorias
    categorias[gasto.categoria] =
      (categorias[gasto.categoria] || 0) + gasto.valor;
  });

  // Atualizar total
  totalHTML.innerText = formatarMoeda(total);

  // Atualizar gráfico
  atualizarGrafico(categorias);
}

// ===============================
// 📊 GRÁFICO
// ===============================
function atualizarGrafico(categorias) {
  const ctx = document.getElementById("grafico").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
        backgroundColor: [
          "#22c55e",
          "#3b82f6",
          "#f59e0b",
          "#ef4444"
        ]
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0"
          }
        }
      }
    }
  });
}

// ===============================
// 🚀 INICIAR APP
// ===============================
atualizarTela();
