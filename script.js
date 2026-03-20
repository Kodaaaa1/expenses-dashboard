let lista = JSON.parse(localStorage.getItem("gastos")) || [];

const listaHTML = document.getElementById("lista");
const totalHTML = document.getElementById("total");

function salvar() {
  localStorage.setItem("gastos", JSON.stringify(lista));
}

function atualizarTela() {
  listaHTML.innerHTML = "";
  let total = 0;

  let categorias = {};

  lista.forEach((gasto, index) => {
    total += gasto.valor;

    // lista
    let li = document.createElement("li");
    li.innerHTML = `
      ${gasto.nome} - R$ ${gasto.valor}
      <button onclick="remover(${index})">X</button>
    `;
    listaHTML.appendChild(li);

    // gráfico
    categorias[gasto.categoria] =
      (categorias[gasto.categoria] || 0) + gasto.valor;
  });

  totalHTML.innerText = total.toFixed(2);

  criarGrafico(categorias);
}

function adicionarGasto() {
  let nome = document.getElementById("nome").value;
  let valor = parseFloat(document.getElementById("valor").value);
  let categoria = document.getElementById("categoria").value;

  if (!nome || !valor) {
    alert("Preencha tudo!");
    return;
  }

  lista.push({ nome, valor, categoria });

  salvar();
  atualizarTela();
}

function remover(index) {
  lista.splice(index, 1);
  salvar();
  atualizarTela();
}

let grafico;

function criarGrafico(categorias) {
  let ctx = document.getElementById("grafico").getContext("2d");

  if (grafico) {
    grafico.destroy();
  }

  grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categorias),
      datasets: [{
        data: Object.values(categorias),
      }]
    }
  });
}

atualizarTela();
