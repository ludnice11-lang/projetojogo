// Lista dos animais. Cada { } é 1 animal
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

// Posição do animal atual (começa no 0)
let indice = 0;

// Pontos e erros
let pontos = 0;
let erros = 0;

// Se pode clicar nas letras agora
let podeResponder = true;

// Tempo p/ responder (seg)
let tempoLimite = 10;

// Qto tempo falta
let tempoRestante = 0;

// Guarda o cronômetro p/ parar dps
let cronometro;

// Guarda a espera entre as perguntas p/ cancelar
let esperaProximo;

// Se a partida tá rolando
let jogando = false;

// Se tá pausado
let emPausa = false;

// Mostra o animal atual
function mostrarPergunta() {
    let animal = animais[indice];

    // Escreve o desenho e a pergunta e limpa a msg
    document.getElementById("animal").textContent = animal.emoji;
    document.getElementById("pergunta").textContent = "Com que letra começa o nome deste animal?";
    document.getElementById("mensagem").textContent = "";

    // Tira os botões antigos
    let caixa = document.getElementById("opcoes");
    caixa.textContent = "";

    // Cria 1 botão p/ cada letra
    for (let letra of animal.opcoes) {
        let botao = document.createElement("button");
        botao.textContent = letra;
        botao.onclick = function () {
            verificar(letra);
        };
        caixa.appendChild(botao);
    }

    // Libera os cliques e começa o tempo
    podeResponder = true;
    iniciarTempo();
}

// Começa a contar o tempo
function iniciarTempo() {
    tempoRestante = tempoLimite;
    document.getElementById("tempo").textContent = "Tempo: " + tempoRestante;
    // Roda contarTempo a cada 1 seg (1000 ms)
    cronometro = setInterval(contarTempo, 1000);
}

// Tira 1 seg do tempo
function contarTempo() {
    tempoRestante = tempoRestante - 1;
    document.getElementById("tempo").textContent = "Tempo: " + tempoRestante;

    // Acabou o tempo: para td e conta como erro
    if (tempoRestante === 0) {
        clearInterval(cronometro);
        podeResponder = false;

        erros = erros + 1;
        atualizarPlacar();
        document.getElementById("mensagem").textContent = "O tempo acabou! Era a letra " + animais[indice].letra + " de " + animais[indice].nome;

        // Espera 2 seg e vai p/ o próximo
        esperaProximo = setTimeout(proximaPergunta, 2000);
    }
}

// Confere a letra q a criança escolheu
function verificar(letra) {
    // Se ñ pode responder, para aqui
    if (podeResponder === false || emPausa === true) {
        return;
    }

    // Só 1 chance: bloqueia os cliques e para o tempo
    podeResponder = false;
    clearInterval(cronometro);

    let animal = animais[indice];

    if (letra === animal.letra) {
        // Acertou: +1 ponto
        pontos = pontos + 1;
        document.getElementById("mensagem").textContent = animal.nome + " - Muito bem!";
    } else {
        // Errou: +1 erro e mostra a resposta
        erros = erros + 1;
        document.getElementById("mensagem").textContent = "Era a letra " + animal.letra + " de " + animal.nome;
    }

    // Atualiza o placar e espera 2 seg
    atualizarPlacar();
    esperaProximo = setTimeout(proximaPergunta, 2000);
}

// Vai p/ o próximo animal ou termina o jogo
function proximaPergunta() {
    indice = indice + 1;

    if (indice < animais.length) {
        mostrarPergunta();
    } else {
        terminarJogo();
    }
}

// Tela final
function terminarJogo() {
    // Acabou: esconde o botão de pausar e limpa o tempo
    jogando = false;
    document.getElementById("botao-pausar").hidden = true;
    document.getElementById("tempo").textContent = "";

    // Msg final de acordo c/ o resultado
    if (pontos > erros) {
        // + acertos q erros
        document.getElementById("animal").textContent = "🏆";
        document.getElementById("pergunta").textContent = "Parabéns, você conseguiu! Vamos tentar novamente?";
    } else {
        // + erros ou empate
        document.getElementById("animal").textContent = "💪";
        document.getElementById("pergunta").textContent = "Você está quase lá! Vamos tentar de novo?";
    }
    document.getElementById("mensagem").textContent = "Pontos: " + pontos + " | Erros: " + erros;

    // Botão p/ jogar de novo
    let caixa = document.getElementById("opcoes");
    caixa.textContent = "";
    let botao = document.createElement("button");
    botao.textContent = "Tentar de novo";
    botao.className = "botao-recomecar";
    botao.onclick = recomecar;
    caixa.appendChild(botao);

    mostrarRanking();

    // Quem acertou + q errou pode salvar o nome
    if (pontos > erros) {
        mostrarCaixaNome();
    }
}

// Volta o jogo p/ o início
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

// Tela inicial, espera clicar em Iniciar
function telaInicial() {
    // Para o cronômetro e a espera
    clearInterval(cronometro);
    clearTimeout(esperaProximo);

    // Zera td
    jogando = false;
    emPausa = false;
    indice = 0;
    pontos = 0;
    erros = 0;
    atualizarPlacar();

    // Limpa os textos e esconde o pausar
    document.getElementById("tempo").textContent = "";
    document.getElementById("mensagem").textContent = "";
    document.getElementById("caixa-nome").textContent = "";
    document.getElementById("ranking").textContent = "";
    document.getElementById("botao-pausar").hidden = true;

    // Convite p/ jogar
    document.getElementById("animal").textContent = "🔤";
    document.getElementById("pergunta").textContent = "Vamos jogar? Clique em Iniciar!";

    // Botão de iniciar
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

// Pausa ou continua de onde parou
function alternarPausa() {
    let botao = document.getElementById("botao-pausar");

    if (emPausa === false) {
        // Pausa: para o tempo e a espera
        emPausa = true;
        clearInterval(cronometro);
        clearTimeout(esperaProximo);
        document.getElementById("tempo").textContent = "Jogo pausado";
        botao.textContent = "Continuar";
    } else {
        // Continua c/ o tempo q tinha ficado
        emPausa = false;
        document.getElementById("tempo").textContent = "Tempo: " + tempoRestante;
        botao.textContent = "Pausar";

        // Pergunta aberta: volta o tempo. Já respondeu: vai p/ o próximo
        if (podeResponder === true) {
            cronometro = setInterval(contarTempo, 1000);
        } else {
            esperaProximo = setTimeout(proximaPergunta, 2000);
        }
    }
}

// Se sair no meio da partida, volta p/ o início
function sairDaJanela() {
    if (jogando === true) {
        telaInicial();
    }
}

// Escreve pontos e erros na tela
function atualizarPlacar() {
    document.getElementById("pontos").textContent = "Pontos: " + pontos + " | Erros: " + erros;
}

// Liga o botão de pausar
document.getElementById("botao-pausar").onclick = alternarPausa;

// Abre o st na tela inicial
telaInicial();

// Alfabeto
let alfabeto = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// Cores das bolinhas
let cores = ["#e74c3c", "#f39c12", "#2ecc71", "#3498db", "#9b59b6", "#ec407a"];

// Tamanho da bolinha (igual ao CSS)
let tamanho = 30;

// Cria 1 bolinha na tela
function criarBolinha(x, y, numero) {
    let bolinha = document.createElement("span");
    bolinha.className = "bolinha";

    // O % faz as letras e cores recomeçarem qdo acabam
    bolinha.textContent = alfabeto[numero % alfabeto.length];
    bolinha.style.backgroundColor = cores[numero % cores.length];

    // Posição em px
    bolinha.style.left = x + "px";
    bolinha.style.top = y + "px";

    document.body.appendChild(bolinha);
}

// Cria as bolinhas em volta da tela
function criarCentopeia() {
    // Apaga as antigas
    for (let antiga of document.querySelectorAll(".bolinha")) {
        antiga.remove();
    }

    // Tamanho da tela
    let largura = document.documentElement.clientWidth;
    let altura = document.documentElement.clientHeight;

    // Qtas bolinhas cabem
    let colunas = Math.floor(largura / tamanho);
    let linhas = Math.floor(altura / tamanho);

    // Espaço entre elas
    let espacoX = (largura - tamanho) / (colunas - 1);
    let espacoY = (altura - tamanho) / (linhas - 1);

    // Conta as bolinhas p/ seguir o alfabeto
    let numero = 0;

    // Em cima: esq -> dir
    for (let c = 0; c < colunas; c++) {
        criarBolinha(c * espacoX, 0, numero);
        numero = numero + 1;
    }

    // Direita: cima -> baixo
    for (let l = 1; l < linhas - 1; l++) {
        criarBolinha(largura - tamanho, l * espacoY, numero);
        numero = numero + 1;
    }

    // Embaixo: dir -> esq
    for (let c = colunas - 1; c >= 0; c--) {
        criarBolinha(c * espacoX, altura - tamanho, numero);
        numero = numero + 1;
    }

    // Esquerda: baixo -> cima
    for (let l = linhas - 2; l >= 1; l--) {
        criarBolinha(0, l * espacoY, numero);
        numero = numero + 1;
    }
}

// Refaz a centopeia qdo a janela muda de tamanho
window.addEventListener("resize", criarCentopeia);

// Cria a centopeia qdo abre o st
criarCentopeia();

// Pega o ranking salvo no navegador
function pegarRanking() {
    let dados = localStorage.getItem("rankingJogoDasLetras");

    // Ñ tem ranking: devolve lista vz
    if (dados === null) {
        return [];
    }

    // Texto -> lista
    return JSON.parse(dados);
}

// Caixinha p/ escrever o nome
function mostrarCaixaNome() {
    let caixa = document.getElementById("caixa-nome");

    // Campo de texto
    let entrada = document.createElement("input");
    entrada.id = "nome-jogador";
    entrada.placeholder = "Escreva seu nome";
    entrada.maxLength = 15;

    // Botão de salvar
    let botao = document.createElement("button");
    botao.textContent = "Salvar no ranking";
    botao.className = "botao-recomecar";
    botao.onclick = function () {
        salvarNoRanking(entrada.value);
    };

    caixa.appendChild(entrada);
    caixa.appendChild(botao);
}

// Salva nome e pontos no ranking
function salvarNoRanking(nome) {
    // Tira os espaços do começo e do fim
    nome = nome.trim();

    // Nome vz: pede p/ escrever
    if (nome === "") {
        document.getElementById("mensagem").textContent = "Escreva seu nome primeiro";
        return;
    }

    // Põe o novo resultado na lista
    let novo = { nome: nome, pontos: pontos };
    let ranking = pegarRanking();
    ranking.push(novo);

    // Quem fez + pontos fica primeiro
    ranking.sort(function (a, b) {
        return b.pontos - a.pontos;
    });

    // Lugar do novo resultado
    let lugar = ranking.indexOf(novo) + 1;

    // Guarda só os 5 melhores
    ranking = ranking.slice(0, 5);
    localStorage.setItem("rankingJogoDasLetras", JSON.stringify(ranking));

    // Tira a caixinha e mostra o resultado
    document.getElementById("caixa-nome").textContent = "";
    document.getElementById("mensagem").textContent = nome + ", você ficou em " + lugar + "º lugar!";
    mostrarRanking();
}

// Mostra o ranking
function mostrarRanking() {
    let ranking = pegarRanking();
    let area = document.getElementById("ranking");
    area.textContent = "";

    // Ranking vz: ñ mostra nd
    if (ranking.length === 0) {
        return;
    }

    // Título
    let titulo = document.createElement("h2");
    titulo.textContent = "Ranking";
    area.appendChild(titulo);

    // 1 linha p/ cada pessoa
    for (let i = 0; i < ranking.length; i++) {
        let linha = document.createElement("p");
        linha.textContent = (i + 1) + "º lugar: " + ranking[i].nome + " - " + ranking[i].pontos + " pontos";
        area.appendChild(linha);
    }

    // Botão p/ zerar
    let botaoZerar = document.createElement("button");
    botaoZerar.textContent = "Zerar ranking";
    botaoZerar.className = "botao-recomecar";
    botaoZerar.onclick = zerarRanking;
    area.appendChild(botaoZerar);
}

// Apaga o ranking do navegador
function zerarRanking() {
    // Pergunta antes e só apaga se clicar em OK
    let confirmou = confirm("Tem certeza que quer zerar o ranking?");

    if (confirmou === true) {
        localStorage.removeItem("rankingJogoDasLetras");
        document.getElementById("ranking").textContent = "";
    }
}

// Saiu da janela: volta p/ o início
window.addEventListener("blur", sairDaJanela);
