//função para pegar o valor de um parâmetro da url
function getUrlParameter(parameterName) {
	return new URLSearchParams(location.search).get(parameterName);
}

//função para gerar pratos na pesquisa.html
function gerarPratos(prato) {
	fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + prato).then(resposta => {
		return resposta.json();
	})
	.then(tela => {
		const lista = document.querySelector(".js-table");
		for (let i = 0; i < tela.meals.length; i++) {
			let p = tela.meals[i];
			let descricao = p.strInstructions.substring(0, 300) + "...";
			lista.insertAdjacentHTML("beforeend", `
				<tr style="background-color: white;">
					<td>
						<a href="receita.html?prato=${p.idMeal}" class="receita_link">
							<div class="container mt-5">
								<div class="row">
									<div class="col-12 col-sm-4" style="text-align: center;">
										<img src="${p.strMealThumb}" width="100%" title="${p.strMeal}" alt="${p.strMeal}">
									</div>
									<div class="col-8 d-none d-sm-block">
										<p style="font-size: 1.5em;">${p.strMeal}</p>
										<p>Categoria: ${p.strCategory}</p>
										<p>${descricao}</p>
									</div>
									<div class="col-12 d-block d-sm-none" style="text-align: center;">
										<p style="font-size: 1.5em;">${p.strMeal}</p>
									</div>
									<div class="col-12 d-block d-sm-none" style="text-align: center;">
										<p>Categoria: ${p.strCategory}</p>
									</div>
									<div class="col-12 d-block d-sm-none" style="text-align: center;">
										<p>${descricao}</p>
									</div>
								</div>
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
		document.querySelector("#modo_de_preparo").innerHTML = "MODO DE PREPARO:";
		document.querySelector(".ingredientes").innerHTML = "Ingredientes:";
		
		const foto = document.querySelector("#img_prato");
		const nome = document.querySelector(".nome_prato");
		const ingredientes = document.querySelector("#ingredientes");
		const preparo = document.querySelector("#preparo");
		let p = tela.meals[0];
		foto.insertAdjacentHTML("beforeend", `
			<img style="width: 100%;" src="${p.strMealThumb}" title="${p.strMeal}" alt="${p.strMeal}">
		`);
		
		nome.innerHTML = p.strMeal;
		
		let quantidadeIngredientes = 0;
		let ingredientesArray = [p.strIngredient1, p.strIngredient2, p.strIngredient3, p.strIngredient4, p.strIngredient5,
								p.strIngredient6, p.strIngredient7, p.strIngredient8, p.strIngredient9, p.strIngredient10,
								p.strIngredient11, p.strIngredient12, p.strIngredient13, p.strIngredient14, p.strIngredient15,
								p.strIngredient16, p.strIngredient17, p.strIngredient18, p.strIngredient19, p.strIngredient20];
		let ingredientesMedidas = [p.strMeasure1, p.strMeasure2, p.strMeasure3, p.strMeasure4, p.strMeasure5,
								p.strMeasure6, p.strMeasure7, p.strMeasure8, p.strMeasure9, p.strMeasure10,
								p.strMeasure11, p.strMeasure12, p.strMeasure13, p.strMeasure14, p.strMeasure15,
								p.strMeasure16, p.strMeasure17, p.strMeasure18, p.strMeasure19, p.strMeasure20];
		while(ingredientesArray[quantidadeIngredientes] != null && ingredientesArray[quantidadeIngredientes] != "" && ingredientesMedidas[quantidadeIngredientes] != 0 && ingredientesMedidas[quantidadeIngredientes] != "") {
			ingredientes.insertAdjacentHTML("beforeend", `
				<li>${ingredientesMedidas[quantidadeIngredientes]} - ${ingredientesArray[quantidadeIngredientes]}</li>
			`);
			quantidadeIngredientes++;
		}
		
		let instrucoes = p.strInstructions.split("\r\n");
		for (let i = 0; i < instrucoes.length; i++) {
			preparo.insertAdjacentHTML("beforeend", `
				<li>${instrucoes[i]}</li>
			`);
		}
	});
}

//função para gerar 3 pratos aleatórios em index.html
function gerarPratosAleatorios() {
	for (let i = 1; i <= 3; i++) {
		fetch("https://www.themealdb.com/api/json/v1/1/random.php").then(resposta => {
			return resposta.json();
		}).then(tela => {
			let receita = document.querySelector(".js-receita" + i);
			let p = tela.meals[0];
			receita.insertAdjacentHTML("beforeend", `
				<a href="receita.html?prato=${p.idMeal}" class="receita_link">
					<div class=\"mt-3 mb-3\">
						<img style="width: 100%;" src="${p.strMealThumb}" title="${p.strMeal}" alt="${p.strMeal}">
					</div>
				</a>
			`);
		});
	}
}

//quando a janela carregar
window.addEventListener("load", evento => {
	let url = location.pathname;
	if (url.indexOf("index.html") > -1 || location == "https://temperosdecozinha.netlify.app/") { //se carregar index.html
		gerarPratosAleatorios();
	} else if (url.indexOf("pesquisa.html") > -1) { //se carregar pesquisa.html
		if (getUrlParameter("prato") != null && getUrlParameter("prato") != "")
			gerarPratos(getUrlParameter("prato"));
	} else if (url.indexOf("receita.html") > -1) { //se carregar receita.html
		if (getUrlParameter("prato") != null && getUrlParameter("prato") != "") {
			gerarReceita(getUrlParameter("prato"));
		} else {
			document.querySelector("main.container").insertAdjacentHTML("beforeend", '<div class="mb-5 text-center"><p>Receita não encontrada!</p></div>');
		}
	}
});

