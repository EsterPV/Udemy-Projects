document.addEventListener("keydown", function(event) {

  makeSound(event.key);
  buttonAnimation(event.key);


});


var numberDrumButton =document.querySelectorAll(".drum").length;

for(var i=0; i<=numberDrumButton; i++){
document.querySelectorAll(".drum")[i].addEventListener("click",function(){
    var buttonInnerHTML = this.innerHTML;
    makeSound(buttonInnerHTML);

    buttonAnimation(buttonInnerHTML);
});

}


function buttonAnimation(currentKey){

var activeButoon = document.querySelector("." + currentKey);
activeButoon.classList.add("pressed");

setTimeout(function(){
  activeButoon.classList.remove("pressed");

}, 100);
}

function makeSound(key){

  switch (key) {
    case "w":
          var audioTom1 = new Audio('sounds/tom-1.mp3');
          audioTom1.play();
          break;

      case "a":
          var audioTom2 = new Audio('sounds/tom-2.mp3');
          audioTom2.play();
          break;

      case "s":
            var audioTom3 = new Audio('sounds/tom-3.mp3');
            audioTom3.play();
            break;

        case "d":
              var audioTom4 = new Audio('sounds/tom-4.mp3');
              audioTom4.play();
              break;

          case "j":
            var audioSnare = new Audio('sounds/snare.mp3') ;
            audioSnare.play();
            break;

            case "k":
                  var audioCrash = new Audio('sounds/crash.mp3') ;
                  audioCrash.play();
              break;

              case "l":
              var audioKick = new Audio('sounds/kick-bass.mp3') ;
              audioKick.play();
              break;

    default: console.log(buttonInnerHTML);
}
}
