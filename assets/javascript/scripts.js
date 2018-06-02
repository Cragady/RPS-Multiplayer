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