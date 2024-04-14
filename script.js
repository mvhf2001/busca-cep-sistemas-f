/**
 * Função que realiza uma busca de CEP utilizando a API externa.
 * Obtém o valor do campo de entrada 'cep' do HTML, realiza uma solicitação fetch
 * para a API e exibe os resultados na div com o id 'result'.
 */
function buscaCep() {
  cep = document.getElementById("cep").value
  result = document.getElementById("result")
  fetch(`https://busca-cep-sistemas-b.onrender.com/cep/${cep}`)
    .then((res) => { return res.json() })
    .then((cep) => { result.innerHTML = mountList(cep) })
}

/**
 * Função que busca e preenche os estados (UFs) disponíveis.
 * Realiza uma solicitação fetch para a API de estados, preenche uma lista de opções
 * e as insere no elemento select com o id 'ufs'.
 */
function buscaUF() {
  fetch(`https://busca-cep-sistemas-b.onrender.com/ufs`)
    .then((res) => { return res.json() })
    .then((ufs) => {
      console.log('estados', ufs)
      listuf = "<option selected>Selecione o estado</option>"
      for (let uf of ufs) {
        listuf += `<option value="${uf.id}-${uf.sigla}">${uf.nome}</option>`
      }
      $("#ufs").html(listuf)
    })
}

// Chama a função de busca de UFs ao carregar a página
buscaUF();

/**
 * Função chamada quando ocorre uma mudança no campo de seleção de UF.
 * Obtém o valor selecionado, extrai o ID do estado e realiza uma solicitação
 * fetch para obter as cidades correspondentes à UF selecionada.
 * Preenche o elemento select de cidades com as opções disponíveis.
 * @param {Event} e O evento de mudança que acionou a função.
 */
function mudarUF(e) {
  console.log(e.target.value)
  uf = e.target.value.split("-")[0]
  fetch(`https://busca-cep-sistemas-b.onrender.com/municipios/${uf}`)
    .then((res) => { return res.json() })
    .then((cidades) => {
      console.log(cidades)
      listcidade = "<option selected>Selecione a cidade</option>"
      for (let cidade of cidades) {
        listcidade += `<option value="${cidade.nome}">${cidade.nome}</option>`
      }
      $("#cidades").html(listcidade)
    })
}

/**
 * Função que limpa o conteúdo da div 'result'.
 */
function limparResultado() {
  result = document.getElementById("result")
  result.innerHTML = ""
}

/**
 * Função que remove os três primeiros caracteres de uma string.
 * @param {string} sigla A sigla a ser processada.
 * @returns {string} A sigla sem os três primeiros caracteres.
 */
function removerPrimeirosCaracteres(sigla) {
  if (sigla.length >= 3) {
    return sigla.substring(3);
  } else {
    return sigla;
  }
}

/**
 * Função que realiza uma busca de rua utilizando os valores selecionados
 * para UF, cidade e rua.
 * Obtém os valores dos campos de seleção e entrada, realiza uma solicitação
 * fetch para a API e exibe os resultados na div 'result'.
 */
function buscaRua() {
  let uf = document.getElementById("ufs").value;
  let cidade = document.getElementById("cidades").value;
  let rua = document.getElementById("rua").value;
  let ufAbreviada = removerPrimeirosCaracteres(uf);

  console.log("UF selecionado:", uf);
  console.log("Cidade selecionada:", cidade);
  console.log("Rua digitada:", rua);

  result = document.getElementById("result")
  fetch(`https://busca-cep-sistemas-b.onrender.com/rua/${ufAbreviada}/${cidade}/${rua}`)
    .then((res) => { return res.json() })
    .then((ceps) => { result.innerHTML = mountListRuas(ceps) })
}

/**
 * Função auxiliar para montar a lista de resultados de CEPs.
 * @param {object} cep O objeto contendo informações do CEP.
 * @returns {string} O HTML da lista de resultados de CEP.
 */
function mountList(cep) {
  list = ""
  list = `
      <div class="card" style="width: 100%;">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${cep.logradouro}</li>
          <li class="list-group-item">${cep.localidade}</li>
          <li class="list-group-item">${cep.bairro}</li>
          <li class="list-group-item">${cep.uf}</li>
        </ul>
      </div>
    `
  return list
}

/**
 * Função auxiliar para montar a lista de resultados de ruas.
 * @param {Array} ceps Um array de objetos contendo informações de CEPs.
 * @returns {string} O HTML da lista de resultados de ruas.
 */
function mountListRuas(ceps) {
  list = []
  for (let cep of ceps) {
    list.push(`
      <div class="card" style="width: 100%;">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${cep.logradouro}</li>
          <li class="list-group-item">${cep.localidade}</li>
          <li class="list-group-item">${cep.bairro}</li>
          <li class="list-group-item">${cep.uf}</li>
        </ul>
      </div><br>
    `)
  }
  return list.toString().replaceAll(",", "")
}
