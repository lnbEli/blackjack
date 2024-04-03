let scoreDealer = 0;                                              //I have used the parameter player to refer to either the Dealer or the Gambler withing functions. 
let scorePlayer = 0;
let deck = [];
let deckSuits =['C','D','S','H'];
let deckFace = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
let gambler = {cards:[],stayBust:false,handScore:0,gamesWon:0}
let dealer = {cards:[],stayBust:false,handScore:0,gamesWon:0,hiddenCard:[]}
let shuffledDeck = shuffleArray(deck);
let cardNumToImg = [];

function createDeck(){                                          // creates a 52 card deck // needs to be shuffled 
  for(let i=0;i<deckSuits.length;i++){
    for(let j=0;j<deckFace.length;j++){
      deck.push(deckSuits[i]+deckFace[j])
    }
  }
}

function shuffleArray(array) {                                   //Randomize array in-place using Durstenfeld shuffle algorithm //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
  }
 
function deal(){                                                 // deals first three/four cards// Hoped to go back to this and clean it up.
  let firstCard = deck.shift();
  let secondCard = deck.shift();
  let thirdCard = deck.shift();
  gambler.cards.push(firstCard); 
  dealer.cards.push(secondCard);
  gambler.cards.push(thirdCard);
  $("#gamblersCards").text(gambler.cards.join(" "));
  $("#dealersCards").text(dealer.cards.join(" "));
}


function checkAce(score,aceCount=0,player){                     // It is the return value of checkValueOfHand(player). If the hand count goes over 21 it checks for an ace and if there is one removes 10 from count. This function really grew hands and feet and If I were to go back to it I would try to mudularise it. Both this function and checkValuesAndAssignWinner() are used for deciding winner depending on stage of the game.  
  if(score >21 && aceCount!=0){
    return checkAce(score-10,aceCount-1,player)
  }else if(score >21 && aceCount===0){
    player.stayBust = true
    player.handScore = score;
    if(player === dealer){ 
      refreshCardsAndSwap();
      $("#dealersScore").text(score+" Bust, You Win!");
      gambler.gamesWon++;
      $("#gamblersGamesWon").text(gambler.gamesWon);
      hideStay();
      resetGame();
    }else{
      $("#gamblersScore").text(score+" Bust, You Lose!");
      dealer.gamesWon++;
      $("#dealersGamesWon").text(dealer.gamesWon);
      hideHit();
      hideStay();
      showDeal();
      $("#deal").html($("#deal").html().replace("Deal", "Play Again"));
      //resetGame();// this is removing the images of these cards!!!only in this instance
    }
  }else if(score === 21){
    player.stayBust = true;
    player.handScore = score;
    if(player === dealer && score>gambler.handScore){
      $("#dealersScore").text(score +  " Blackjack! You Loose!");
      dealer.gamesWon++;
      $("#dealersGamesWon").text(dealer.gamesWon);
      refreshCardsAndSwap();
      hideStay();
      resetGame();
    }else if(player === dealer && score===gambler.handScore){
      $("#dealersScore").text(score + " Blackjack! Draw");
      refreshCardsAndSwap();
      hideStay();
      resetGame();
    }else{
      $("#gamblersScore").text(score + " Blackjack!");
      hideHit();
    }
  }else{   
    if(player===dealer&& player.cards.length>1){
      player.handScore = score;
      $("#dealersScore").text(score);
      dealerStay();
    }else if(player===dealer){
      player.handScore = score;
      $("#dealersScore").text(score);
    }else{
      player.handScore = score;
      $("#gamblersScore").text(score);
    }
  }
}


function checkValueOfHand(player){             //loops through players hand and calculates score and ace count
  let score = 0;
  let aceCount = 0
  for(let i = 0; i<player.cards.length;i++){
    if(player.cards[i][1]=== 'K' || player.cards[i][1]=== 'Q' || player.cards[i][1]=== 'J' || player.cards[i][1] + player.cards[i][2] === '10'){
      score += 10;
    }else if(player.cards[i][1]==='A'){
      score +=11;
      aceCount++;
    }else{
      score = score + parseInt(player.cards[i][1]);
    }  
  }return checkAce(score,aceCount,player);
}


function hit(player){                            //adds card to players hand
    let nextCard = deck.shift();
    player.cards.push(nextCard);
      if(player===gambler){
        $("#gamblersCards").text(gambler.cards.join(" "));
        $("#dealersCards").text(dealer.cards.join(" "));
      }else{
        $("#dealersCards").text(player.cards.join(" "));
    }
  }

function hideDeal(){                          //hide/shows buttons depending on stage of game
  $("#deal").prop("disabled", true)
};

function showDeal(){
  $("#deal").prop("disabled", false)
};
  
function hideHit(){
  $("#hit").prop("disabled", true)
};
    
function showHit(){
  $("#hit").prop("disabled", false)
};

function hideStay(){
  $("#stay").prop("disabled", true)
};
        
function showStay(){
  $("#stay").prop("disabled", false)
};



function dealerStay(){                      // Continues to hit dealer with cards until a score of 17+ is acheived.
  if(dealer.handScore<17){
    hit(dealer);
    checkValueOfHand(dealer);
   }else{
    return checkValuesAndAssignWinner();
   }
}

function onClickPlay(){                      // Runs set functions on click of HTML Deal/Play button
  resetGame();
  createDeck();
  shuffleArray(deck);
  deal();
  checkValueOfHand(dealer);
  checkValueOfHand(gambler);
  hideDeal();
  showHit();
  showStay();
  refreshCardsAndSwap();
  addBackgroundToCards()
}

function onClickStay(){                        // Runs set functions on click of HTML Stay button
  hideHit();
  hideStay();
  dealerStay();
 
}

function onClickHit(){                       // Runs set functions on click of HTML Hit button
  hit(gambler);
  checkValueOfHand(gambler);
  refreshCardsAndSwap();
}

function resetGame(){                        // clears players hand data and prepares to play again
  dealer.stayBust=false;
  gambler.stayBust=false;
  dealer.handScore=0;
  dealer.cards=[];
  gambler.handScore=0;
  gambler.cards=[];
  deck=[];
  showDeal();
  $("#deal").html($("#deal").html().replace("Deal", "Play Again"));

}

function checkValuesAndAssignWinner(){                     // if neither players bust checks scores and declares winner
  if(dealer.handScore===gambler.handScore){
    $("#dealersScore").text(dealer.handScore + " Draw!");
    refreshCardsAndSwap();
    resetGame();
  }else if(dealer.handScore>gambler.handScore){  
    dealer.gamesWon++;
    $("#dealersGamesWon").text(dealer.gamesWon);
    $("#dealersScore").text(dealer.handScore + " You Lose!");
    refreshCardsAndSwap();
    resetGame();
  }else{
    gambler.gamesWon++;
    $("#gamblersGamesWon").text(gambler.gamesWon);
    $("#gamblersScore").text(gambler.handScore + " You Win!");
    refreshCardsAndSwap();
    resetGame();
  }
}

function jQuerySwapTextForCards(){                                            //swaps text for card PNGs
  cardNumToImg = gambler.cards.concat(dealer.cards);
  for(let i=0;i<cardNumToImg.length;i++){
  $("#gamblersCards").html($("#gamblersCards").html().replace(new RegExp("\\b"+cardNumToImg[i]+"\\b"), "<img src=playingcards/"+cardNumToImg[i]+".png>"))
  $("#dealersCards").html($("#dealersCards").html().replace(new RegExp("\\b"+cardNumToImg[i]+"\\b"), "<img src=playingcards/"+cardNumToImg[i]+".png>"))
  }
}

function refreshCardsAndSwap(){                                             //reloads players hands before replacing text with PNGs
  $("#gamblersCards").text(gambler.cards.join(" "));
  $("#dealersCards").text(dealer.cards.join(" "));
  jQuerySwapTextForCards();

}


function addBackgroundToCards() {
  $("#dealersCards").css({"border": "4px solid","border-color": "#000","background-color": "darkgreen","font-size":"140px"});
  $("#gamblersCards").css({"border": "4px solid","border-color": "#000","background-color": "darkgreen","font-size":"140px"});
}



