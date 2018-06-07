//have it so multiple people can have matches (maybe in the future)
//have option to face automatic process (maybe in the future)

var userScore = 0;
var userLosses = 0;
var spelledGuess;
var scoreTracker;
var opponentScore = 0;
var opponentLosses = 0;
var opponentGuess;
var opGuessUpdate;
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
var userGuess;
var pTwoWins;
var pOneWins;
var textOut;
var textIn;
var stopper = false;

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

function readCookie(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

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

  if(cookSet === true){
    if(snapshot.child("chatUpdate").exists()){
      textOut = snapshot.child("chatUpdate").val().chat;
      var newPelm;
      newPelmSetter(newPelm, null, textOut);
      database.ref("chatUpdate").update({
        chat: ""
      });
    };
  };

  if(snapshot.child('gameStatus').exists()){
    gameStart = snapshot.child('gameStatus').val().gameStart;
  };
  
  /*the following two if statements gives the scripts
  the other player's score and moves to compare against*/
  if(pOneCook === "1"){
    if(snapshot.child("player2").exists()){
      opponentGuess = snapshot.child("player2").val().pTwoMove;
      opponentScore = snapshot.child("player2").val().pTwoWins;
      opGuessUpdate = snapshot.child("player2").val().moveUpdater;
      opponentLosses = snapshot.child("player2").val().pTwoLosses;
    };
  };

  if(pTwoCook === "2"){
    if(snapshot.child("player1").exists()){
      opponentGuess = snapshot.child("player1").val().pOneMove;
      opponentScore = snapshot.child("player1").val().pOneWins;
      opGuessUpdate = snapshot.child("player1").val().moveUpdater;
      opponentLosses = snapshot.child("player1").val().pOneLosses;
    };
  };
  /*End comparative variable set */
  
  if((snapshot.child("player2").exists()) && (pTwoCook === true)){
    playerStatusSetter("#p2-status", opponentScore, opponentLosses);
  } else if(pTwoCook === false){
    $("#p2-status").empty();
  };
  if(pOneCook === "1"){
    playerStatusSetter("#p1-status", userScore, userLosses, "Go!");
  };
  
  if((snapshot.child("player1").exists()) && (pOneCook === true)){
    playerStatusSetter("#p1-status", opponentScore, opponentLosses);
  } else if (pOneCook === false){
    $("#p1-status").empty();
  }
  if(pTwoCook === "2"){
    playerStatusSetter("#p2-status", userScore, userLosses, "Go!");
  };

  /*This next chunk of code is supposed to empty the player's
  corresponding data tree on a reload and/or browser close 
  event.A future goal could be altering the cookies to keep track and
  setting expirations on them, or deletion if another player pair
  is made*/
  if(snapshot.child('player1').exists() && snapshot.child('player2').exists()){
    gameStart = true;
    database.ref('gameStatus').set({
      gameStart: true
    });
  };
  if(snapshot.child('gameStatus').exists()){
    if((pOneCook === false) || (pTwoCook === false)){
      if(snapshot.child('gameStatus').val().gameStart === true){
        database.ref('gameStatus').update({
          gameStart: false
        });
      };
    };
    /*End gameStart setter*/
    
  };
    
  /*the next two if statements deletes the player's data tree on 
  browser close or refresh*/
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
  /*end portion that deletes player's data tree */


  //initialize user as player1 and sets appropriate scoring/set displays
  $("#p1-set").click(function(event){
    event.preventDefault();
    if(cookSet || pOneCook){
      return;
    };
    document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "player=1";
    pOneCook = readCookie("player");
    database.ref("player1").set({
      pOneCook: true,
      pOneWins: 0,
      pOneLosses: 0,
      pOneMove: "",
      victoryStatus: victoryStatus
    });
    cookSet = true;
    playerNum = "player1";
    otherNum = "player2";
    scoreTracker = "pOneWins";
    lossTracker = "pOneLosses";
    moveTracker = "pOneMove";
    playerStatusSetter("#p1-status", userScore, userLosses);
  });
  
  //initialize user as player2 and sets appropriate scoring/set displays
  $("#p2-set").click(function(event){
    event.preventDefault();
    if(cookSet || pTwoCook){
      return;
    };
    document.cookie = "player=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    document.cookie = "player=2";
    pTwoCook = readCookie("player");
    database.ref("player2").set({
      pTwoCook: true,
      pTwoWins: 0,
      pTwoLosses: 0,
      pTwoMove: "",
      victoryStatus: victoryStatus
    });
    cookSet = true;
    playerNum = "player2";
    otherNum = "player1";
    scoreTracker = "pTwoWins";
    lossTracker = "pTwoLosses";
    moveTracker = "pTwoMove";
  });

  if(snapshot.child(playerNum).exists()){
    victoryStatus = snapshot.child(playerNum).val().victoryStatus;
    if(guessed === true){
      vicStatusChecker();
    };
    
  };


});

vicStatusChecker = function(){
  var whatev;
  if (victoryStatus === "victory"){
    updateVicStatChat(whatev, "won");
    userScore++;
    victoryStatus ="";
    userGuess = "";
    guessed = false;
    database.ref(playerNum).update({
      [moveTracker]: userGuess,
      [scoreTracker]: userScore,
      victoryStatus: victoryStatus
    });
  } else if (victoryStatus === "defeat"){
    updateVicStatChat(whatev, "lost");
    userLosses++;
    victoryStatus ="";
    userGuess = "";
    guessed = false;
    database.ref(playerNum).update({
      [moveTracker]: userGuess,
      [lossTracker]: userLosses,
      victoryStatus: victoryStatus
    });
  } else if (victoryStatus === "same"){
    updateVicStatChat(whatev, "tied");
    victoryStatus ="";
    userGuess = "";
    guessed = false;
    database.ref(playerNum).update({
      [moveTracker]: userGuess,
      victoryStatus: victoryStatus
    });
  };
};

playerStatusSetter = function(playTarget, playData, playDataLoss, playMoveStatus){
  $(playTarget).html("<div>Player Ready!</div> <div>Wins: " + playData + "</div> <div>Losses: " + playDataLoss + "<div class='self-move'></div>");
  if(playMoveStatus !== undefined){

    $(playTarget).find("div.self-move").html("Make your move!");
  }

};

newPelmSetter = function(pelmHere, upHere, textHere){
  if((pelmHere !== null) && (textHere !== "")){
    pelmHere = $("<p>");
    pelmHere.attr("class", "border-light border-bottom");
    pelmHere.text(textHere);
    $("#chat-box").prepend(pelmHere);
  }else if(upHere !== null){
    upHere = $("<p>");
    upHere.attr("class", "border-bottom bg-light");
    upHere.text("You picked: " + textHere + "!");
    $("#chat-box").prepend(upHere);
  };
};

updateVicStatChat = function(newDivHere, textUp){
  newDivHere = $("<p>");
  newDivHere.attr("class", "border-bottom bg-light");
  newDivHere.text("You " + textUp + " using " + spelledGuess + " against " + otherNum + "'s " + opGuessUpdate + "!");
  $("#chat-box").prepend(newDivHere);
}

$("button").click(function(){
      
  //setup for winner checking and setting victoryStatus
  if((guessed === false) && (cookSet === true)){
    userGuess = $(this).attr("data-letter");
    spelledGuess = $(this).attr("data-word");
    if((userGuess === "r") || (userGuess === "p") || (userGuess === "s")){
      guessed = true;
      var victory = ((userGuess === "r") && (opponentGuess === "s") || (userGuess === "s") && (opponentGuess === "p") || (userGuess === "p") && (opponentGuess === "r"));
      var defeat = ((userGuess === "s") && (opponentGuess === "r") || (userGuess === "p") && (opponentGuess === "s") || (userGuess === "r") && (opponentGuess === "p"));
      var same = ((userGuess === "r") && (opponentGuess === "r") || (userGuess === "s") && (opponentGuess === "s") || (userGuess === "p") && (opponentGuess === "p"));

      if (pOneCook === "1"){
        pOneMove = userGuess;
        database.ref("player1").update({
          pOneMove: userGuess,
          moveUpdater: spelledGuess
        });
        var upSetter;
        newPelmSetter(null, upSetter, spelledGuess);
      }
      if(pTwoCook === "2"){
        pTwoMove = userGuess;
        database.ref("player2").update({
          pTwoMove: userGuess,
          moveUpdater: spelledGuess
        });
        var upSetter;
        newPelmSetter(null, upSetter, spelledGuess);
      }


      if(victory){
        victoryStatus = "victory";
        database.ref(playerNum).update({victoryStatus: victoryStatus});
        database.ref(otherNum).update({victoryStatus: "defeat"});
      } else if(defeat){
        victoryStatus = "defeat";
        database.ref(playerNum).update({victoryStatus: victoryStatus});
        database.ref(otherNum).update({victoryStatus: "victory"});
      } else if(same){
        victoryStatus = "same";
        database.ref(playerNum).update({victoryStatus: victoryStatus});
        database.ref(otherNum).update({victoryStatus: "same"});
      };
    };
  };
});

document.onkeydown = function(eventTwo){

  

  //setup for chatbox entry
  key = eventTwo.which || eventTwo.keyCode;

  if(key === 13){
    eventTwo.preventDefault();
    text = $("#text-input");
    if(text.val() !== ""){
      textIn = text.val().trim();
      if(pOneCook === "1"){
        textIn = "P1:  " + textIn;
      }
      if(pTwoCook === "2"){
        textIn = "P2:  " + textIn;
      }
      text.val("");
      database.ref("chatUpdate").update({chat: textIn});
    };
  }
};