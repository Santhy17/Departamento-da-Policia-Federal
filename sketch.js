let gotas = [];
let solo;
let tipoSolo = "vegetacao"; // valor inicial
let arvores = []; // Array para armazenar as árvores
let predios = []; // Array para armazenar os prédios
let aviao; // Variável para armazenar o objeto avião
let alphaArvores = 255; // Opacidade inicial das árvores
let alphaPredios = 255; // Opacidade inicial dos prédios
let taxaDesaparecimento = 1; // Velocidade do desaparecimento
let escalaArvores = 1; // Escala inicial das árvores
let escalaPredios = 1; // Escala inicial dos prédios
let taxaEncolhimento = 0.01; // Velocidade do encolhimento

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent("canvas-holder");
  solo = new Solo(tipoSolo);

  // Criando elementos iniciais com base no tipo de solo
  if (tipoSolo === "vegetacao") {
    criarArvores();
  } else if (tipoSolo === "urbanizado") {
    criarPredios();
  }

  // Criando o avião
  aviao = new Aviao();
}

function draw() {
  background(200, 220, 255); // céu

  for (let i = gotas.length - 1; i >= 0; i--) {
    gotas[i].cair();
    gotas[i].mostrar();

    if (gotas[i].atingeSolo(solo.altura)) {
      solo.aumentarErosao();
      gotas.splice(i, 1);
    }
  }

  solo.mostrar();

  // Mostrando as árvores com opacidade e escala gradual
  for (let arvore of arvores) {
    arvore.mostrar(alphaArvores, escalaArvores);
  }

  // Mostrando os prédios com opacidade e escala gradual
  for (let predio of predios) {
    predio.mostrar(alphaPredios, escalaPredios);
  }

  // Movendo e mostrando o avião
  if (tipoSolo === "urbanizado") {
    aviao.voar();
    aviao.mostrar();
  }

  if (frameCount % 5 === 0) {
    gotas.push(new Gota());
  }

  // Reduzir a opacidade e a escala das árvores e prédios gradualmente
  alphaArvores -= taxaDesaparecimento;
  alphaPredios -= taxaDesaparecimento;
  escalaArvores -= taxaEncolhimento;
  escalaPredios -= taxaEncolhimento;

  // Manter a opacidade e a escala dentro dos limites
  alphaArvores = constrain(alphaArvores, 0, 255);
  alphaPredios = constrain(alphaPredios, 0, 255);
  escalaArvores = constrain(escalaArvores, 0, 1);
  escalaPredios = constrain(escalaPredios, 0, 1);

  // Se a opacidade ou a escala chegar a zero, podemos parar de desenhar (opcional)
  /*
  if (alphaArvores <= 0) {
    arvores = [];
  }
  if (alphaPredios <= 0) {
    predios = [];
  }
  if (escalaArvores <= 0) {
    arvores = [];
  }
  if (escalaPredios <= 0) {
    predios = [];
  }
  */
}

function setSoilType(tipo) {
  tipoSolo = tipo;
  solo = new Solo(tipoSolo);
  arvores = []; // Limpa as árvores existentes
  predios = []; // Limpa os prédios existentes
  alphaArvores = 255; // Reinicia a opacidade
  alphaPredios = 255;
  escalaArvores = 1; // Reinicia a escala
  escalaPredios = 1;

  if (tipoSolo === "vegetacao") {
    criarArvores();
  } else if (tipoSolo === "urbanizado") {
    criarPredios();
  }

  // Reinicia o avião quando muda para o tipo urbanizado
  if (tipoSolo === "urbanizado") {
    aviao = new Aviao();
  }
}

function criarArvores() {
  arvores.push(new Arvore(80, solo.altura));
  arvores.push(new Arvore(250, solo.altura));
  arvores.push(new Arvore(420, solo.altura));
  arvores.push(new Arvore(550, solo.altura));
}

function criarPredios() {
  predios.push(new Predio(150, solo.altura));
  predios.push(new Predio(400, solo.altura));
}

class Gota {
  constructor() {
    this.x = random(width);
    this.y = 0;
    this.vel = random(4, 6);
  }

  cair() {
    this.y += this.vel;
  }

  mostrar() {
    stroke(0, 0, 200);
    line(this.x, this.y, this.x, this.y + 10);
  }

  atingeSolo(ySolo) {
    return this.y > ySolo;
  }
}

class Solo {
  constructor(tipo) {
    this.tipo = tipo;
    this.altura = height - 80;
    this.erosao = 0;
  }

  aumentarErosao() {
    let taxa;
    if (this.tipo === "vegetacao") taxa = 0.1;
    else if (this.tipo === "exposto") taxa = 0.5;
    else if (this.tipo === "urbanizado") taxa = 0.3;

    this.erosao += taxa;
    this.altura += taxa;
  }

  mostrar() {
    noStroke();
    if (this.tipo === "vegetacao") fill(60, 150, 60);
    else if (this.tipo === "exposto") fill(139, 69, 19);
    else if (this.tipo === "urbanizado") fill(120);

    rect(0, this.altura, width, height - this.altura);

    fill(0);
    textSize(14);
    textAlign(LEFT);
    text(`Erosão: ${this.erosao.toFixed(1)}`, 10, 20);
    text(`Tipo de solo: ${this.tipo}`, 10, 40);
  }
}

class Arvore {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alturaTronco = random(20, 50);
    this.larguraTronco = 10;
    this.corTronco = color(139, 69, 19); // Marrom
    this.corFolhas = color(34, 139, 34); // Verde escuro
    this.diametroFolhas = random(20, 40);
  }

  mostrar(alpha, escala) {
    push(); // Salva o estado de transformação atual
    translate(this.x, this.y); // Move a origem para a posição da árvore
    scale(escala); // Aplica a escala

    // Desenhar o tronco com opacidade
    fill(red(this.corTronco), green(this.corTronco), blue(this.corTronco), alpha);
    rect(-this.larguraTronco / 2, -this.alturaTronco, this.larguraTronco, this.alturaTronco);

    // Desenhar as folhas com opacidade
    fill(red(this.corFolhas), green(this.corFolhas), blue(this.corFolhas), alpha);
    ellipse(0, -this.alturaTronco - this.diametroFolhas / 2, this.diametroFolhas, this.diametroFolhas);

    pop(); // Restaura o estado de transformação anterior
  }
}

class Predio {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.largura = random(30, 60);
    this.altura = random(50, 120);
    this.cor = color(100); // Cinza mais escuro
  }

  mostrar(alpha, escala) {
    push(); // Salva o estado de transformação atual
    translate(this.x, this.y); // Move a origem para a posição do prédio
    scale(escala); // Aplica a escala

    // Desenhar o prédio com opacidade
    fill(red(this.cor), green(this.cor), blue(this.cor), alpha);
    rect(-this.largura / 2, -this.altura, this.largura, this.altura);

    pop(); // Restaura o estado de transformação anterior
  }
}

class Aviao {
  constructor() {
    this.x = -50; // Começa fora da tela à esquerda
    this.y = 50; // Altura inicial
    this.velocidade = 2;
    this.cor = color(255, 0, 0); // Vermelho
    this.tamanho = 20;
  }

  voar() {
    this.x += this.velocidade;
    // Verifica se o avião atingiu a borda direita
    if (this.x > width + 50) {
      this.x = -50; // Volta para o início da esquerda
    }
  }

  mostrar() {
    fill(this.cor);
    let larguraAsa = this.tamanho * 1.5;
    let comprimentoCorpo = this.tamanho * 2;
    let alturaCorpo = this.tamanho / 3;

    // Corpo
    rect(this.x - comprimentoCorpo / 2, this.y - alturaCorpo / 2, comprimentoCorpo, alturaCorpo);

    // Asa
    triangle(this.x - larguraAsa / 2, this.y, this.x, this.y - alturaCorpo * 1.5, this.x + larguraAsa / 2, this.y);

    // Cauda (vertical)
    rect(this.x - comprimentoCorpo / 2 - 5, this.y - alturaCorpo * 1.5 / 2, 5, alturaCorpo * 1.5);

    // Cauda (horizontal)
    rect(this.x - comprimentoCorpo / 2 - 8, this.y - alturaCorpo / 2 - 3, 8, alturaCorpo * 1 / 3);
  }
}
