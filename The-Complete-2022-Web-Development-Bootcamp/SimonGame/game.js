var gamePattern = [];
var buttonColours = ["red", "blue", "green", "yellow" ]; //array donde almaceno los botones
var userClickedPattern = [];
var level = 0; //contador de nivel en el que está el jugador
var started = false; //boolean para condicionar si la partida está empezada

$(document).keypress(function(){ //si se pulsa cualquier tecla del teclado
  if(started===false){  //si no se ha empezado aun la partida (false)
    $("#level-title").text("Level "+ level); //cambias el titulo
    nextSequence(); //llamas a la funcion que muestra los botones aleatoriamente
    started=true; //la partida ha empezado
  }
});
//función donde se genera aleatoriamente un nuevo boton para encadenar a la secuencia a repetir
function nextSequence(){
   userClickedPattern = []; //reinicio el array de los botones pulsados por jugador
  var randomNumber =Math.floor( Math.random()*4); //genero un numero randoq entre 0 y 3
  var randomChosenColour = buttonColours[randomNumber]; //lo añado al array de los botonescolores para que escoja uno de los cuatro
  gamePattern.push(randomChosenColour); //añado ese color al array donde voy almacenando la secuencia a repetir
  level = level +1; //añado 1 al contador de nivel
  $("h1").text("Level "+ level); //muestro el nivel actual

  $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100); //hago que se resalte el color seleccionado en el boton

  playSound(randomChosenColour);


}

function checkAnswer(currentLevel){
  if(gamePattern[currentLevel]===userClickedPattern[currentLevel]){ //si se encuentra en el mismo nivel
    if(userClickedPattern.length===gamePattern.length){ //si el array de la maquina y el del jugador se corresponden
      setTimeout(function(){ //avanzo al siguiente nivel
        nextSequence();
      }, 1000);
    }

  }else{ //si no es correcto
    var audio = new Audio("sounds/wrong.mp3");
    audio.play();
    $("body").addClass("game-over");   //gameOver
      setTimeout (function(){
      $("body").removeClass("game-over");
      }, 200);
    $("h1").text("Game over, press any key to restart.")
    startOver(); //vuelvo a empezar
  }
}
//función que reinicia el juego desde el principio
  function startOver(){
    level = 0;
    gamePattern = [];
    started=false;
  }


$(".btn").click(function(){ //si un boton es pulsado
  var userChosenColour = this.id; //almaceno dicho boton en una variable
  userClickedPattern.push(userChosenColour); //esa variable la meto en el array
  playSound(userChosenColour); //segun el boton pulsado suena su sonido correspondiente
  animatePress(userChosenColour); //segun el boton pulsado llamo a la funcion que lo anima


    checkAnswer(userClickedPattern.length-1); //compruebo si el ultimo añadido es la respuesta correcta

});

function playSound(name){
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

//funcion que añade una animacion a los botones
function animatePress(currentColour){
$("#"+currentColour).addClass("pressed");

  setTimeout(function(){
    $("#"+currentColour).removeClass("pressed");
  }, 100);

}
