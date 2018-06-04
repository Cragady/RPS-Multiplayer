//use Firebase to keep track of wins/losses
//maybe use Firebase to keep track of chat log too
//set player 1 & 2 with firebase
//make a chat-box that operates very similarly to the battle-log from the rpg-game
//set timers to keep round moving; auto-select for player if timer runs out
//have a results page
//have player Choose their handle
//have page update when the player/opponent made choice
//play again option
//manage sessions to make sure there are only two connected at once
//have it so multiple people can have matches
//have option to face automatic process

var userScore = "";
var opponentScore = "";
var playerOne = "Player 1";
var playerTwo = "Player 2";
var move1 = false;
var move2 = false;
var pOneSet = false;
var pOneCook;
var pTwoSet = false;
var pTwoCook;

var config = {
    apiKey: "AIzaSyASnKUFaSBLwrLIJd4R5dNgYbNHf2jCJMk",
    authDomain: "rps-handler.firebaseapp.com",
    databaseURL: "https://rps-handler.firebaseio.com",
    projectId: "rps-handler",
    storageBucket: "rps-handler.appspot.com",
    messagingSenderId: "458167033258"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// function readCookie(name) {
//   var nameEQ = name + "=";
//   var ca = document.cookie.split(";");
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) === " ") c = c.substring(1, c.length);
//     if (c.indexOf(nameEQ) === 0) {
//       return c.substring(nameEQ.length, c.length);
//     }
//   }
//   return null;
// };

function readCookie(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

$("#p1-set").click(function(event){
  event.preventDefault();
  if(pOneSet === true){
    return;
  };
  document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "player=1";
  pOneCook = readCookie("player");
  database.ref().set({
    pOneCook: pOneCook
  });
  console.log(document.cookie);
});

$("#p2-set").click(function(){
  event.preventDefault();
  if(pTwoSet === true){
    return;
  };
  document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = "player=" + 2;
  pTwoCook = readCookie("player");
  database.ref().set({
    pTwoCook: pTwoCook
  })
})

// database.ref().on("value", function(snapshot){

//   if (snapshot.child("move1").exists() && snapshot.child("move2").exists()){

//   };

// });

// document.onkeyup = function(event){
//   var pOneGuess = event.key;
//   var pTwoGuess = event.key;
// }

// database.ref().set({
//   currentUser: userId
// });

// database.ref(currentUser).push({
//   userScore: userScore
// });

// $("#score-keeper").text(userScore);