//função para pegar o valor de um parâmetro da url
function getUrlParameter(parameterName) {
	return new URLSearchParams(location.search).get(parameterName);
}

//função para gerar pratos na pesquisa.html
function gerarPratos(prato) {
	fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + prato).then(resposta => resposta.json())
	.then(tela => {
		const lista = document.querySelector(".js-table");
		for (let i = 0; i < tela.meals.length; i++) {
			let p = tela.meals[i];
			lista.insertAdjacentHTML("beforeend", `
				<tr>
					<td>
						<a href="receita.html?prato=${p.idMeal}" class="receita_link">
							<div class="container mt-5" style="border: 3px solid black;">
								<p>Nome: ${p.strMeal}</p>
								<p>Categoria: ${p.strCategory}</p>
							</div>
						</a>
					</td>
				</tr>
			`);
		}
	});
}

//função para gerar receita em receita.html
function gerarReceita(prato) {
	fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + prato).then(resposta => {
		return resposta.json();
	}).then(tela => {
		const receita = document.querySelector(".js-receita");
		let p = tela.meals[0];
		receita.insertAdjacentHTML("beforeend", `
			<div class="container mt-5" style="border: 3px solid black;">
				<p>Nome: ${p.strMeal}</p>
				<p>Categoria: ${p.strCategory}</p>
				<p>ID: ${p.idMeal}</p>
			</div>
		`);
	});
}

//função para gerar 4 pratos aleatórios em index.html
function gerarPratosAleatorios() {
	for (let i = 1; i <= 4; i++) {
		fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(resposta => {
			return resposta.json();
		}).then(tela => {
			let receita = document.querySelector(".js-receita" + i);
			let p = tela.meals[0];
			receita.insertAdjacentHTML("beforeend", `
				<a href="receita.html?prato=${p.idMeal}" class="receita_link">
					<div class=\"mt-3 mb-3\" style=\"border: 1px solid black;\">
					<img style="width: 50%;" src="${p.strMealThumb}" alt="prato foto" title="prato foto">
					<br />
					<p>Nome: ${p.strMeal}</p>
					<p>Categoria: ${p.strCategory}</p>
					</div>
				</a>
			`);
		});
	}
}

//quando a janela carregar
window.addEventListener("load", evento => {
	let url = location.pathname;
	if (url.indexOf("index.html") > -1) { //se carregar index.html
		gerarPratosAleatorios();
	} else if (url.indexOf("pesquisa.html") > -1) { //se carregar pesquisa.html
		gerarPratos(getUrlParameter("prato"));
	} else if (url.indexOf("receita.html") > -1) { //se carregar receita.html
		if (getUrlParameter("prato") != null && getUrlParameter("prato") != "") {
			gerarReceita(getUrlParameter("prato"));
		} else {
			document.querySelector(".js-receita").insertAdjacentHTML("beforeend", '<div class="mt-3 mb-3 text-center"><p>Receita não encontrada!</p></div>');
		}
	}
});

