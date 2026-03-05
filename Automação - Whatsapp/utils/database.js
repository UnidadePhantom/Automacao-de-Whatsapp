import estoque from "../estoque.json" assert { type: "json" };

// calcula preço de venda com base no custo + lucro
function calcularPrecoVenda(precoCusto, lucro) {
  return (precoCusto * (1 + lucro)).toFixed(2);
}

// busca produto específico
export function getProduto(fornecedor, produto) {
  const item = estoque[fornecedor]?.[produto];
  if (!item) return null;

  return {
    nome: produto,
    fornecedor,
    precoCusto: item.preco,
    precoVenda: calcularPrecoVenda(item.preco, item.lucro),
    lucroPercentual: item.lucro * 100
  };
}

// lista todos os produtos de um fornecedor
export function listarProdutosFornecedor(fornecedor) {
  const produtos = estoque[fornecedor];
  if (!produtos) return [];

  return Object.keys(produtos).map((nome) => {
    const item = produtos[nome];
    return {
      nome,
      fornecedor,
      precoCusto: item.preco,
      precoVenda: calcularPrecoVenda(item.preco, item.lucro),
      lucroPercentual: item.lucro * 100
    };
  });
}

// lista todos os produtos de todos os fornecedores
export function listarTodosProdutos() {
  const resultado = [];
  for (const fornecedor in estoque) {
    resultado.push(...listarProdutosFornecedor(fornecedor));
  }
  return resultado;
}
