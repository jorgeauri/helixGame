function start() { // inicio da função start

  $("#inicio").hide();

  $("#fundoGame").append("<div id='jogador' class='anima1'></div>"); //cria uma div nova com o id jogador, dentro da div fundo game e adiciona a animação com a classe anima1
  $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
  $("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

  // variaveis do jogo

  var podeAtirar = true;
  var fimdeJogo = false;
  var pontos=0;
  var salvos=0;
  var perdidos=0;
  var energiaAtual=3;
  var jogo = { };
  var velocidade = 5;
  var posicaoY = parseInt(Math.random() * 334); //cria o inimigo em locais aleatorios
  var TECLA = {
    UP: 38,
    DOWN: 40,
    RIGHT: 39
  }

  jogo.pressionou = []; //vefica se alguma tecla foi pressionada

  var somDisparo = document.getElementById("somDisparo");
  var somExplosao = document.getElementById("somExplosao");
  var musica = document.getElementById("musica");
  var somGameover = document.getElementById("somGameover");
  var somPerdido = document.getElementById("somPerdido");
  var somResgate = document.getElementById("somResgate"); 
  
  //Música em loop
  musica.addEventListener("ended", function(){ musica.currentTime = 0; musica.play(); }, false);
  musica.play();

  $(document).keydown(function(e){
    jogo.pressionou[e.which] = true;
  });

  $(document).keyup(function(e){
    jogo.pressionou[e.which] = false;
  });
  
  //loop do jogo

  jogo.timer = setInterval(loop,30);

  function loop(){

    moveFundo();
    moveJogador();
    moveInimigo1();
    moveInimigo2();
    moveamigo();
    colisao();
    placar();
    energia();

  } // fim da função loop

  function moveFundo(){

    esquerda = parseInt($("#fundoGame").css("background-position")); //parseInt converte uma string em um inteiro
    $("#fundoGame").css("background-position",esquerda-1); //esquerda-1 altera o valor da velocidade de movimento do cenario
  }//fim da função moveFundo()

  function moveJogador(){

    if(jogo.pressionou[TECLA.UP]){
      var topo = parseInt($("#jogador").css("top")); //pega o valor da div jogador
      $("#jogador").css("top",topo-10); //atualiza o valor da div jogador(com o valor top) com -10(nesse caso faz andar para cima)
      
      if (topo <= 0) { //impede o jogador de ultrapassar o tamanho da tela

        $("#jogador").css("top",topo+10);
      }
    }

    
    if(jogo.pressionou[TECLA.DOWN]){
      var topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top",topo+10);

      if (topo >= 434) {
        $("#jogador").css("top",topo-10);
      }
    }

    if(jogo.pressionou[TECLA.RIGHT]){

      //chama função disparo
      disparo();
    }
  } //fim da função moveJogador

  function moveInimigo1() {
    posicaoX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left",posicaoX-velocidade);
    $("#inimigo1").css("top",posicaoY);

    if (posicaoX <= 0) {
      posicaoY = parseInt(Math.random() * 334);
      $("#inimigo1").css("left",694);
      $("#inimigo1").css("top",posicaoY);
    }
  } // fim da função moveInimigo1

  function moveInimigo2() {
    posicaoX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left",posicaoX-3);

    if(posicaoX <= 0){
      $("#inimigo2").css("left",775);
    }
  } // fim da função moveinimigo2

  function moveamigo(){
    posicaoX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left",posicaoX+1);

    if (posicaoX > 906) {
      $("#amigo").css("left",0);
    }
  }// fim da função moveamigo

  function disparo() {
    if (podeAtirar == true){

      somDisparo.play();
      podeAtirar = false;

      topo = parseInt($("#jogador").css("top"))
      posicaoX = parseInt($("#jogador").css("left"))
      tiroX = posicaoX + 190;
      topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div>");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    } // fecha podeAtirar

    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left", posicaoX+15);

      if (posicaoX > 900) {
        window.clearInterval(tempoDisparo);
        tempoDisparo = null;
        $("#disparo").remove();
        podeAtirar = true;
      }
    } // fecha executaDispar
  } // fecha disparo

  function colisao() {
    var colisao1 = ($("#jogador").collision($("#inimigo1")));
    var colisao2 = ($("#jogador").collision($("#inimigo2")));
    var colisao3 = ($("#disparo").collision($("#inimigo1")));
    var colisao4 = ($("#disparo").collision($("#inimigo2")));
    var colisao5 = ($("#jogador").collision($("#amigo")));
    var colisao6 = ($("#inimigo2").collision($("#amigo")));
    
    // jogador com inimigo1

    if (colisao1.length > 0) { //se o tamanho da variavel for maior que zero houve colisao
     
      energiaAtual--;
      inimigo1X = parseInt($("#inimigo1").css("left")); //pega a posiçao atual do inimigo
      inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X,inimigo1Y); //cria a explosao na posião do inimigo

      posicaoY = parseInt(Math.random() * 334); //reposiciona o inimigo
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top",posicaoY);
    }

    //jogador com o inimigo2 
    if (colisao2.length>0) {
      
      energiaAtual--;
	    inimigo2X = parseInt($("#inimigo2").css("left"));
	    inimigo2Y = parseInt($("#inimigo2").css("top"));
	    explosao2(inimigo2X,inimigo2Y);
			
	    $("#inimigo2").remove();
		
	    reposicionaInimigo2();
		
    }
    
    
    // Disparo com o inimigo1
		
	if (colisao3.length>0) {
    
    velocidade= velocidade + 0.3;
		pontos=pontos+100;
    inimigo1X = parseInt($("#inimigo1").css("left"));
    inimigo1Y = parseInt($("#inimigo1").css("top"));
      
    explosao1(inimigo1X,inimigo1Y);
    $("#disparo").css("left",950);
      
    posicaoY = parseInt(Math.random() * 334);
    $("#inimigo1").css("left",694);
    $("#inimigo1").css("top",posicaoY);
      
    }

    // Disparo com o inimigo2
		
	if (colisao4.length>0) {
    
    pontos=pontos+50;
    inimigo2X = parseInt($("#inimigo2").css("left"));
    inimigo2Y = parseInt($("#inimigo2").css("top"));
    $("#inimigo2").remove();
  
    explosao2(inimigo2X,inimigo2Y);
    $("#disparo").css("left",950);
    
    reposicionaInimigo2();
      
    }

    // jogador com o amigo
		
	if (colisao5.length>0) {
    
    salvos++;
    somResgate.play();
    reposicionaAmigo();
    $("#amigo").remove();
    }

    //inimigo2 com amigo

    if (colisao6.length>0) {
      
      perdidos++;
      amigoX = parseInt($("#amigo").css("left"));
      amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX,amigoY);
      $("#amigo").remove();
          
      reposicionaAmigo();
          
      }

  } // fim da função colisao

  function explosao1(inimigo1X, inimigo1Y) {

    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div>");
    $("#explosao1").css("background-image", "url(imgs/explosao.png)");
    var div = $("#explosao1");
    div.css("top",inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({width:200, opacity:0}, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 1000);

    function removeExplosao() {
      div.remove();
      window.clearInterval(tempoExplosao);
      tempoExplosao = null;
    }
  } //fim da função explosao1

  //Reposiciona Inimigo2
	
	function reposicionaInimigo2() {
	
    var tempoColisao4=window.setInterval(reposiciona4, 5000);
      
      function reposiciona4() {
      window.clearInterval(tempoColisao4);
      tempoColisao4=null;
        
        if (fimdeJogo==false) {
        
        $("#fundoGame").append("<div id=inimigo2></div");
        
        }
        
      }	
    }	

    //Explosão2
	
	function explosao2(inimigo2X,inimigo2Y) {
  
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div");
    $("#explosao2").css("background-image", "url(imgs/explosao.png)");
    var div2=$("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({width:200, opacity:0}, "slow");
    
    var tempoExplosao2=window.setInterval(removeExplosao2, 1000);
    
      function removeExplosao2() {
        
        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2=null;
        
      }
      
      
    } // Fim da função explosao2()

    //Reposiciona Amigo
	
	function reposicionaAmigo() {
	
    var tempoAmigo=window.setInterval(reposiciona6, 6000);
    
      function reposiciona6() {
      window.clearInterval(tempoAmigo);
      tempoAmigo=null;
      
      if (fimdeJogo==false) {
      
      $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      
      }
      
    }
    
  } // Fim da função reposicionaAmigo()

  //Explosão3
	
  function explosao3(amigoX,amigoY) {

    somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div");
    $("#explosao3").css("top",amigoY);
    $("#explosao3").css("left",amigoX);
    var tempoExplosao3=window.setInterval(resetaExplosao3, 1000);
    function resetaExplosao3() {
    $("#explosao3").remove();
    window.clearInterval(tempoExplosao3);
    tempoExplosao3=null;
      
    }
  
  } // Fim da função explosao3

  function placar() {
	
    $("#placar").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
    
  } //fim da função placar()

  //Barra de energia

function energia() {
	
  if (energiaAtual==3) {
    
    $("#energia").css("background-image", "url(imgs/energia3.png)");
  }

  if (energiaAtual==2) {
    
    $("#energia").css("background-image", "url(imgs/energia2.png)");
  }

  if (energiaAtual==1) {
    
    $("#energia").css("background-image", "url(imgs/energia1.png)");
  }

  if (energiaAtual==0) {
    
    $("#energia").css("background-image", "url(imgs/energia0.png)");
    
    //Game Over
    gameOver();
  }

} // Fim da função energia()

//Função GAME OVER
function gameOver() {
	fimdejogo=true;
	musica.pause();
	somGameover.play();
	
	window.clearInterval(jogo.timer);
	jogo.timer=null;
	
	$("#jogador").remove();
	$("#inimigo1").remove();
	$("#inimigo2").remove();
	$("#amigo").remove();
	
	$("#fundoGame").append("<div id='fim'></div>");
	
	$("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	} // Fim da função gameOver();

  
} // fim da função start 

//Reinicia o Jogo
		
function reiniciaJogo() {
	somGameover.pause();
	$("#fim").remove();
	start();
	
} //Fim da função reiniciaJogo

