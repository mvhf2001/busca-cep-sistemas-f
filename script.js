function buscaCep() {
    cep = document.getElementById("cep").value
    result = document.getElementById("result")
    fetch(`https://busca-cep-sistemas-b.onrender.com/cep/${cep}`)
      .then((res) => { return res.json() })
      .then((cep) => { result.innerHTML = mountList(cep) })
  }
  
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
  buscaUF()
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
  
  function limparResultado() {
    result = document.getElementById("result")
    result.innerHTML = ""
  }
  
  function removerPrimeirosCaracteres(sigla) {
      // Verificar se a sigla tem pelo menos 3 caracteres
      if (sigla.length >= 3) {
          // Remover os três primeiros caracteres
          return sigla.substring(3);
      } else {
          // Caso contrário, retornar a própria sigla
          return sigla;
      }
  }
  
  function buscaRua() {
      // Obter os valores selecionados dos selects
      let uf = document.getElementById("ufs").value;
      let cidade = document.getElementById("cidades").value;
      let rua = document.getElementById("rua").value;
      let ufAbreviada = removerPrimeirosCaracteres(uf);
  
      // Armazenar os valores selecionados ou fazer o que for necessário com eles
      console.log("UF selecionado:", uf);
      console.log("Cidade selecionada:", cidade);
      console.log("Rua digitada:", rua);
  
      // Restante do seu código de buscaRua()
      result = document.getElementById("result")
      fetch(`https://busca-cep-sistemas-b.onrender.com/rua/${ufAbreviada}/${cidade}/${rua}`)
        .then((res) => { return res.json() })
        .then((ceps) => { result.innerHTML = mountListRuas(ceps) })
  }
  
  
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
  