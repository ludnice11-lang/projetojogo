// Lista dos animais do jogo. Cada { } guarda os dados de um animal.
let animais = [
    { emoji: "🐒", nome: "MACACO", letra: "M", opcoes: ["M", "L", "C"] },
    { emoji: "🦁", nome: "LEÃO", letra: "L", opcoes: ["V", "L", "O"] },
    { emoji: "🐴", nome: "CAVALO", letra: "C", opcoes: ["M", "O", "C"] },
    { emoji: "🐄", nome: "VACA", letra: "V", opcoes: ["V", "C", "L"] },
    { emoji: "🐑", nome: "OVELHA", letra: "O", opcoes: ["L", "O", "M"] },
    { emoji: "🐘", nome: "ELEFANTE", letra: "E", opcoes: ["E", "A", "P"] },
    { emoji: "🐱", nome: "GATO", letra: "G", opcoes: ["C", "G", "S"] },
    { emoji: "🦆", nome: "PATO", letra: "P", opcoes: ["B", "T", "P"] },
    { emoji: "🐝", nome: "ABELHA", letra: "A", opcoes: ["A", "E", "V"] },
    { emoji: "🐸", nome: "SAPO", letra: "S", opcoes: ["F", "S", "M"] },
    { emoji: "🐻", nome: "URSO", letra: "U", opcoes: ["O", "G", "U"] }
];

// Guarda a posição do animal atual na lista (o primeiro é 0)
let indice = 0;

// Guarda quantos pontos a criança fez
let pontos = 0;

// Guarda quantos erros a criança fez
let erros = 0;

// Controla se a criança pode clicar nas letras agora
let podeResponder = true;

// Tempo que a criança tem para responder, em segundos
let tempoLimite = 10;

// Quantos segundos ainda faltam
let tempoRestante = 0;

// Guarda o cronômetro, para podermos parar ele depois
let cronometro;

// Guarda a espera entre uma pergunta e outra, para podermos cancelar
let esperaProximo;

// Diz se a partida está acontecendo
let jogando = false;

// Diz se o jogo está pausado
let emPausa = false;

// Mostra na tela o animal atual
function mostrarPergunta() {
    // Pega o animal que está nessa posição da lista
    let animal = animais[indice];

    // Escreve o desenho e a pergunta, e limpa a mensagem
    document.getElementById("animal").textContent = animal.emoji;
    document.getElementById("pergunta").textContent = "Com que letra começa o nome deste animal?";
    document.getElementById("mensagem").textContent = "";

    // Encontra a caixa dos botões e tira os botões antigos
    let caixa = document.getElementById("opcoes");
    caixa.textContent = "";

    // Repete este bloco para cada letra do animal
    for (let letra of animal.opcoes) {
        // Cria um botão novo
        let botao = document.createElement("button");
        // Escreve a letra dentro do botão
        botao.textContent = letra;
        // Diz o que fazer quando clicarem nele
        botao.onclick = function () {
            verificar(letra);
        };
        // Coloca o botão dentro da caixa
        caixa.appendChild(botao);
    }

    // Libera os cliques para a nova pergunta
    podeResponder = true;

    // Começa a contar o tempo
    iniciarTempo();
}

// Começa a contagem da pergunta atual
function iniciarTempo() {
    // Volta para o tempo total
    tempoRestante = tempoLimite;
    // Mostra o tempo na tela
    document.getElementById("tempo").textContent = "Tempo: " + tempoRestante;
    // Roda contarTempo a cada 1 segundo (1000 milissegundos)
    cronometro = setInterval(contarTempo, 1000);
}

// Tira 1 segundo do tempo
function contarTempo() {
    tempoRestante = tempoRestante - 1;
    document.getElementById("tempo").textContent = "Tempo: " + tempoRestante;

    // Se o tempo acabou
    if (tempoRestante === 0) {
        // Para o cronômetro e bloqueia os cliques
        clearInterval(cronometro);
        podeResponder = false;

        // O tempo acabou, então conta como erro
        erros = erros + 1;
        atualizarPlacar();
        document.getElementById("mensagem").textContent = "O tempo acabou! Era a letra " + animais[indice].letra + " de " + animais[indice].nome;

        // Espera 3 segundos e segue para o próximo
        esperaProximo = setTimeout(proximaPergunta, 2000);
    }}

// Confere a letra escolhida
function verificar(letra) {
    // Se ainda não pode responder, para aqui
    if (podeResponder === false || emPausa === true) {        return;
    }

    // A criança só tem uma chance: bloqueia cliques e para o tempo
    podeResponder = false;
    clearInterval(cronometro);

    // Pega o animal atual
    let animal = animais[indice];

    if (letra === animal.letra) {
        // Se acertou, soma 1 ponto
        pontos = pontos + 1;
        document.getElementById("mensagem").textContent = animal.nome + " - Muito bem! 🎉";
    } else {
        // Se errou, soma 1 erro e mostra a resposta
        erros = erros + 1;
        document.getElementById("mensagem").textContent = "Era a letra " + animal.letra + " de " + animal.nome;
    }

    // Atualiza o placar e espera 3 segundos para seguir
    atualizarPlacar();
    esperaProximo = setTimeout(proximaPergunta, 2000);
}
// Passa para o próximo animal ou termina o jogo
function proximaPergunta() {
    // Avança uma posição na lista
    indice = indice + 1;

    // Se ainda houver animais, mostra o próximo
    if (indice < animais.length) {
        mostrarPergunta();
    } else {
        terminarJogo();
    }
}

// Mostra a tela final
function terminarJogo() {
    // A partida acabou: esconde o botão de pausar
    jogando = false;    document.getElementById("botao-pausar").hidden = true;

    // Limpa o cronômetro da tela
    document.getElementById("tempo").textContent = "";

    // Mostra o resultado
        // Escolhe a mensagem final de acordo com o resultado
    if (pontos > erros) {
        // Mais acertos do que erros
        document.getElementById("animal").textContent = "🏆";
        document.getElementById("pergunta").textContent = "Parabéns, você conseguiu! Vamos tentar novamente?";
    } else {
        // Mais erros do que acertos, ou o mesmo número
        document.getElementById("animal").textContent = "💪";
        document.getElementById("pergunta").textContent = "Você está quase lá! Vamos tentar de novo?";
    }
    document.getElementById("mensagem").textContent = "Pontos: " + pontos + " | Erros: " + erros;

    // Cria o botão para jogar outra vez
    let caixa = document.getElementById("opcoes");
    caixa.textContent = "";
    let botao = document.createElement("button");
    botao.textContent = "Tentar de novo";
    botao.className = "botao-recomecar";
    botao.onclick = recomecar;
    caixa.appendChild(botao);
    
    // Mostra o ranking
    mostrarRanking();

    // Quem acertou mais do que errou pode salvar o nome
    if (pontos > erros) {
        mostrarCaixaNome();
    }
}

// Volta o jogo para o início
function recomecar() {
        // Limpa a caixinha e o ranking
    document.getElementById("caixa-nome").textContent = "";
    document.getElementById("ranking").textContent = "";
    indice = 0;
    pontos = 0;
    erros = 0;
    atualizarPlacar();
    iniciarJogo();
}
// Mostra a tela inicial e espera o comando para começar
function telaInicial() {
    // Para o cronômetro e a espera entre as perguntas
    clearInterval(cronometro);
    clearTimeout(esperaProximo);

    // Zera tudo
    jogando = false;
    emPausa = false;
    indice = 0;
    pontos = 0;
    erros = 0;
    atualizarPlacar();

    // Limpa os textos e esconde o botão de pausar
    document.getElementById("tempo").textContent = "";
    document.getElementById("mensagem").textContent = "";
    document.getElementById("caixa-nome").textContent = "";
    document.getElementById("ranking").textContent = "";
    document.getElementById("botao-pausar").hidden = true;

    // Mostra o convite para jogar
    document.getElementById("animal").textContent = "🔤";
    document.getElementById("pergunta").textContent = "Vamos jogar? Clique em Iniciar!";

    // Cria o botão de iniciar
    let caixa = document.getElementById("opcoes");
    caixa.textContent = "";
    let botao = document.createElement("button");
    botao.textContent = "Iniciar";
    botao.className = "botao-recomecar";
    botao.onclick = iniciarJogo;
    caixa.appendChild(botao);
}

// Começa a partida
function iniciarJogo() {
    jogando = true;

    // Mostra o botão de pausar
    let botao = document.getElementById("botao-pausar");
    botao.textContent = "Pausar";
    botao.hidden = false;

    mostrarPergunta();
}

// Pausa o jogo ou continua de onde parou
function alternarPausa() {
    let botao = document.getElementById("botao-pausar");

    if (emPausa === false) {
        // Pausa: para o cronômetro e a espera entre as perguntas
        emPausa = true;
        clearInterval(cronometro);
        clearTimeout(esperaProximo);
        document.getElementById("tempo").textContent = "Jogo pausado";
        botao.textContent = "Continuar";
    } else {
        // Continua: mostra o tempo que tinha ficado guardado
        emPausa = false;
        document.getElementById("tempo").textContent = "Tempo: " + tempoRestante;
        botao.textContent = "Pausar";

        // Se a pergunta estava aberta, volta a contar o tempo.
        // Se a criança já tinha respondido, segue para o próximo animal.
        if (podeResponder === true) {
            cronometro = setInterval(contarTempo, 1000);
        } else {
            esperaProximo = setTimeout(proximaPergunta, 2000);
        }
    }
}

// Se a pessoa sair durante a partida, volta para o início
function sairDaJanela() {
    if (jogando === true) {
        telaInicial();
    }
}

// Escreve os pontos e os erros na tela
function atualizarPlacar() {
    document.getElementById("pontos").textContent = "Pontos: " + pontos + " | Erros: " + erros;
}

// Liga o botão de pausar à sua função
document.getElementById("botao-pausar").onclick = alternarPausa;

// Mostra a tela inicial quando a página abre
telaInicial();

// Todas as letras do alfabeto
let alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Cores das bolinhas
let cores = ["#e74c3c", "#f39c12", "#2ecc71", "#3498db", "#9b59b6", "#ec407a"];

// Tamanho de cada bolinha, igual ao do CSS
let tamanho = 30;

// Cria uma bolinha em um ponto da tela
function criarBolinha(x, y, numero) {
    let bolinha = document.createElement("span");
    bolinha.className = "bolinha";

    // O % faz as letras e as cores recomeçarem quando acabam
    bolinha.textContent = alfabeto[numero % alfabeto.length];
    bolinha.style.backgroundColor = cores[numero % cores.length];

    // Coloca a bolinha na posição, em pixels
    bolinha.style.left = x + "px";
    bolinha.style.top = y + "px";

    // Coloca a bolinha na página
    document.body.appendChild(bolinha);
}

// Cria as bolinhas em volta da tela
function criarCentopeia() {
    // Apaga as bolinhas antigas
    for (let antiga of document.querySelectorAll(".bolinha")) {
        antiga.remove();
    }

    // Mede o tamanho da tela
    let largura = document.documentElement.clientWidth;
    let altura = document.documentElement.clientHeight;

    // Calcula quantas bolinhas cabem na largura e na altura
    let colunas = Math.floor(largura / tamanho);
    let linhas = Math.floor(altura / tamanho);

    // Calcula a distância entre as bolinhas
    let espacoX = (largura - tamanho) / (colunas - 1);
    let espacoY = (altura - tamanho) / (linhas - 1);

    // Conta as bolinhas, para seguir o alfabeto
    let numero = 0;

    // Lado de cima: da esquerda para a direita
    for (let c = 0; c < colunas; c++) {
        criarBolinha(c * espacoX, 0, numero);
        numero = numero + 1;
    }

    // Lado direito: de cima para baixo
    for (let l = 1; l < linhas - 1; l++) {
        criarBolinha(largura - tamanho, l * espacoY, numero);
        numero = numero + 1;
    }

    // Lado de baixo: da direita para a esquerda
    for (let c = colunas - 1; c >= 0; c--) {
        criarBolinha(c * espacoX, altura - tamanho, numero);
        numero = numero + 1;
    }

    // Lado esquerdo: de baixo para cima
    for (let l = linhas - 2; l >= 1; l--) {
        criarBolinha(0, l * espacoY, numero);
        numero = numero + 1;
    }
}

// Refaz a centopeia quando o tamanho da janela muda
window.addEventListener("resize", criarCentopeia);

// Cria a centopeia quando a página abre
criarCentopeia();

// Busca o ranking guardado no navegador
function pegarRanking() {
    let dados = localStorage.getItem("rankingJogoDasLetras");

    // Se ainda não existe ranking, devolve uma lista vazia
    if (dados === null) {
        return [];
    }

    // Transforma o texto guardado de volta em lista
    return JSON.parse(dados);
}

// Mostra a caixinha para escrever o nome
function mostrarCaixaNome() {
    let caixa = document.getElementById("caixa-nome");

    // Cria o campo de texto
    let entrada = document.createElement("input");
    entrada.id = "nome-jogador";
    entrada.placeholder = "Escreva seu nome";
    entrada.maxLength = 15;

    // Cria o botão de salvar
    let botao = document.createElement("button");
    botao.textContent = "Salvar no ranking";
    botao.className = "botao-recomecar";
    botao.onclick = function () {
        salvarNoRanking(entrada.value);
    };

    // Coloca os dois na página
    caixa.appendChild(entrada);
    caixa.appendChild(botao);
}

// Guarda o nome e os pontos no ranking
function salvarNoRanking(nome) {
    // Tira espaços do começo e do fim
    nome = nome.trim();

    // Se o nome estiver vazio, pede para escrever
    if (nome === "") {
        document.getElementById("mensagem").textContent = "Escreva seu nome primeiro 😊";
        return;
    }

    // Cria o novo resultado e coloca na lista
    let novo = { nome: nome, pontos: pontos };
    let ranking = pegarRanking();
    ranking.push(novo);

    // Coloca quem fez mais pontos primeiro
    ranking.sort(function (a, b) {
        return b.pontos - a.pontos;
    });

    // Descobre a colocação do novo resultado
    let lugar = ranking.indexOf(novo) + 1;

    // Guarda só os 5 melhores
    ranking = ranking.slice(0, 5);
    localStorage.setItem("rankingJogoDasLetras", JSON.stringify(ranking));

    // Tira a caixinha e mostra o resultado
    document.getElementById("caixa-nome").textContent = "";
    document.getElementById("mensagem").textContent = nome + ", você ficou em " + lugar + "º lugar! 🎉";
    mostrarRanking();
}

// Mostra o ranking na tela
function mostrarRanking() {
    let ranking = pegarRanking();
    let area = document.getElementById("ranking");
    area.textContent = "";

    // Se o ranking estiver vazio, não mostra nada
    if (ranking.length === 0) {
        return;
    }

    // Cria o título
    let titulo = document.createElement("h2");
    titulo.textContent = "🏆 Ranking";
    area.appendChild(titulo);

    // Cria uma linha para cada pessoa
    for (let i = 0; i < ranking.length; i++) {
        let linha = document.createElement("p");
        linha.textContent = (i + 1) + "º lugar: " + ranking[i].nome + " - " + ranking[i].pontos + " pontos";
        area.appendChild(linha);
    }
    
    // Cria o botão para zerar o ranking
    let botaoZerar = document.createElement("button");
    botaoZerar.textContent = "Zerar ranking";
    botaoZerar.className = "botao-recomecar";
    botaoZerar.onclick = zerarRanking;
    area.appendChild(botaoZerar);
}

// Apaga o ranking guardado no navegador
function zerarRanking() {
    // Pergunta antes de apagar
    let confirmou = confirm("Tem certeza que quer zerar o ranking?");

    // Só apaga se a pessoa clicar em OK
    if (confirmou === true) {
        localStorage.removeItem("rankingJogoDasLetras");
        document.getElementById("ranking").textContent = "";
    }
}

// Quando a pessoa sai da janela, o jogo volta para o início
window.addEventListener("blur", sairDaJanela);