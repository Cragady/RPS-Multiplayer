[Application](https://cragady.github.io/RPS-Multiplayer/)

**Main Purpose**<hr>

This project's purpose was to utilize an online database, specifically firebase, to communicate between two users on two different connections. This displays ability to achieve a goal using the basics of firebase.

Two users connect and pick either player1 or player2 with a button click. When they're set as player1 or player2 they then can utilize the chat-box function, but the chat-box can only be seen by the players set. The users will click on the rock, paper, or scissors buttons to set their move, and the information is sent to the database and back to the other user for comparison. A notification pops up showing the user's move. After both users made their choices, they are notified if they won, lost, or tied.

**Things to Improve**<hr>

NEEDS REFACTORING:

There is an unholy amount of global variables used.

Change out the api key, and serve out application with a node-server that supplies the api key using a '.env' file or using another method. Might need to scrub git's history to completely remove any reference to the key.

 This project does not currently have the capability to:
 
* Connect multiple sessions of two. 
  * Possibly look in to giving auth tokens for these sessions, with an overhaul to the firebase code.

 * Have player data persistence
   * Auth tokens assigned to usernames could fix this

 * Have viewers of active sessions.
   * Different auth tokens for users viewing, instead of a player token.
 
 * Display the chat to viewers of said session.

 * Some instances of redundant code and messy code
   * I need to look into cleaning up for this problem

A current problem:

 * Sometimes the database isn't correctly updated of player disconnect, and will affect if a player can be set
   * Further testing showed interaction with database even though cookie isn't set with local browser path, this list item may not be accurate with the problem, but it brings to light that furthur coding is needed to prevent a browser with no cookie writing to database.
   * Further testing required