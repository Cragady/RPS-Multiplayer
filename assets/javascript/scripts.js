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
var pOneSet;
var pOneCook = false;
var pTwoSet;
var pTwoCook = false;
var cookSet;
var move1 = 1;

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

// var connectCheck = database.child('player1');
// connectCheck.onDisconnect().remove();
// connectCheck.on('value', function(ss){
//   // if( ss.val() !== 'online'){
//   //   ss.ref().set('online');
//   // }
// });

function readCookie(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

// $(window).on("unload", function(){
//   //if(pOneCook === "1"){
//     pOneCook = undefined;
//   //};
// });

database.ref().on("value", function(snapshot){
  
  // if(snapshot.child("pOneCook").exists()){
  // pOneSet = snapshot.val().player1.pOneSet;
  // pOneCook = snapshot.val().player1.pOneCook;
  // }
  // if(snapshot.child("pTwoCook").exists()){
  // pTwoSet = snapshot.val().player2.pTwoSet;
  // };

  $(document).on("load", function(){
    if(snapshot.child("pOneCook").exists()){
      if(pOneCook === false){
        pOneCook = true;
      }
    };
  })
  

  if(pOneCook === "1"){
    $(window).on("unload", function(){
      database.ref("player1").set({});
    });
    $(window).on("beforeunload", function(){
      database.ref("player1").set({});
    });
  };
  
  $("#p1-set").click(function(event){
    event.preventDefault();
    if(cookSet || pOneSet){
      return;
    };
    document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "player=1";
    pOneCook = readCookie("player");
    database.ref("player1").set({
      pOneCook: true,
      pOneWins: 0,
      pOneSet: true
    });
    cookSet = true;
  });
  
  $("#p2-set").click(function(event){
    event.preventDefault();
    if(cookSet || pTwoSet){
      return;
    };
    document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "player=2";
    pTwoCook = readCookie("player");
    database.ref("player2").set({
      pTwoCook: true,
      pTwoWins: 0,
      pTwoSet: true
    });
    cookSet = true;
  })

});

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