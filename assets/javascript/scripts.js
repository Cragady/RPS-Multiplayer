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

var userScore = 0;
var scoreTracker;
var opponentScore = 0;
var opponentGuess;
var playerOne = "Player 1";
var playerTwo = "Player 2";
var pOneMove;
var pTwoMove;
var pOneCook = false;
var pTwoCook = false;
var cookSet;
var gameStart = false;
var victoryStatus = "";
var playerNum;
var otherNum;
var guessed = false;
var pOneWins;
var pTwoWins;

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

database.ref('player1').on('value', function(snapshot){
    if(snapshot.child("pOneCook").exists() && (pOneCook === false)){
        pOneCook = snapshot.val().pOneCook;
    };
    if((!snapshot.child("pOneCook").exists()) && (pOneCook === true)){
      pOneCook = false;
    };
});

database.ref('player2').on('value', function(snapshot){
  
  if(snapshot.child("pTwoCook").exists() && (pTwoCook === false)){
    pTwoCook = snapshot.val().pTwoCook;
  };
  if((!snapshot.child("pTwoCook").exists()) && (pTwoCook === true)){
    pTwoCook = false;
  };
});

database.ref().on("value", function(snapshot){

  gameStart = snapshot.child('gameStatus').val().gameStart;
  
  
  if(pOneCook === "1"){
    opponentGuess = snapshot.child("player2").val().pTwoMove;
  };

  if(pTwoCook === "2"){
    opponentGuess = snapshot.child("player1").val().pOneMove;
  };

  if(snapshot.child('player1').exists() && snapshot.child('player2').exists()){
    gameStart = true;
    database.ref('gameStatus').set({
      gameStart: true
    });
  };
  if(snapshot.child('gameStatus').exists()){
    if(!snapshot.child('player1').exists() || !snapshot.child('player2').exists()){
      if(snapshot.child('gameStatus').val().gameStart === true){
        $(window).on("unload", function(){
          gameStart = false;
          database.ref('gameStatus').set({
            gameStart: false
          });
        });
        $(window).on("beforeunload", function(){
          gameStart = false;
          database.ref('gameStatus').set({
            gameStart: false
          });
        });
      };
    };
    
  };
    

  if(pOneCook === "1"){
    $(window).on("unload", function(){
      database.ref("player1").set({});
    });
    $(window).on("beforeunload", function(){
      database.ref("player1").set({});
    });
  };
  
  if(pTwoCook === "2"){
    $(window).on("unload", function(){
      database.ref("player2").set({});
    });
    $(window).on("beforeunload", function(){
      database.ref("player2").set({});
    });
  };

  $("#p1-set").click(function(event){
    event.preventDefault();
    if(cookSet || pOneCook){
      return;
    };
    console.log("clicked");
    document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "player=1";
    pOneCook = readCookie("player");
    database.ref("player1").set({
      pOneCook: true,
      pOneWins: 0,
      pOneMove: "",
      victoryStatus: victoryStatus
    });
    cookSet = true;
    playerNum = "player1";
    otherNum = "player2";
    scoreTracker = [pOneWins];
  });
  
  $("#p2-set").click(function(event){
    event.preventDefault();
    if(cookSet || pTwoCook){
      return;
    };
    console.log("clicked");
    document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "player=2";
    pTwoCook = readCookie("player");
    database.ref("player2").set({
      pTwoCook: true,
      pTwoWins: 0,
      pTwoMove: "",
      victoryStatus: victoryStatus
    });
    cookSet = true;
    playerNum = "player2";
    otherNum = "player1";
    scoreTracker = [pTwoWins];
  });

  if(snapshot.child(playerNum).exists()){
    victoryStatus = snapshot.child(playerNum).val().victoryStatus;
  };


});

vicStatusChecker = function(){
  if (victoryStatus === "victory"){
    console.log("hooray!");
    userScore++;
    database.ref(playerNum).update({scoreTracker: userScore});
    database.ref(playerNum).update({victoryStatus: ""});
    guessed = false;
    victoryStatus ="";
  } else if (victoryStatus === "defeat"){
    console.log("boo");
  } else if (victoryStatus === "same"){
    console.log("ehh");
  };
}

document.onkeyup = function(event){
   
    userGuess = event.key;
    if(guessed === false){
      if((userGuess === "r") || (userGuess === "p") || (userGuess === "s")){
        guessed = true;
        if (pOneCook === "1"){
          pOneMove = userGuess;
          database.ref("player1").update({pOneMove: userGuess});
        }
        if(pTwoCook === "2"){
          pTwoMove = userGuess;
          database.ref("player2").update({pTwoMove: userGuess});
        }

        var victory = ((userGuess === "r") && (opponentGuess === "s") || (userGuess === "s") && (opponentGuess === "p") || (userGuess === "p") && (opponentGuess === "r"));
        var defeat = ((userGuess === "s") && (opponentGuess === "r") || (userGuess === "p") && (opponentGuess === "s") || (userGuess === "r") && (opponentGuess === "p"));
        var same = ((userGuess === "r") && (opponentGuess === "r") || (userGuess === "s") && (opponentGuess === "s") || (userGuess === "p") && (opponentGuess === "p"));

        if(victory){
          victoryStatus = "victory";
          userScore += 1;
          database.ref(playerNum).update({victoryStatus: victoryStatus});
          database.ref(playerNum).update({scoreTracker: userScore});
          database.ref(otherNum).update({victoryStatus: "defeat"});
          guessed = false;
          database.ref(playerNum).update({victoryStatus: ""});
        } else if(defeat){
          victoryStatus = "defeat";
          database.ref(playerNum).update({victoryStatus: victoryStatus});
          database.ref(otherNum).update({victoryStatus: "victory"});
          database.ref(playerNum).update({victoryStatus: ""});
        } else if(same){
          victoryStatus = "same";
          database.ref(playerNum).update({victoryStatus: victoryStatus});
          database.ref(otherNum).update({victoryStatus: victoryStatus});
          database.ref(playerNum).update({victoryStatus: ""});
        };
      };
    };
};



// $("#score-keeper").text(userScore);