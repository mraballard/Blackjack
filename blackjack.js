/////////////////APP LOGIC

var App = {
//create deck
  deck : [],
  suits: ['Hearts','Diamonds','Clubs','Spades'],
  hearts : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  diamonds : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  clubs : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  spades : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],

  //create player, dealer, stack, pot variables
  playerCards : [],
  dealerCards : [],
  playerChipStack : 100,
  potValue : 0,

  buildDeck: function() {
    App.deck.push(App.hearts, App.diamonds, App.clubs, App.spades);
  },

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
    if (App.playerChipStack < chip) {  //check if player has enough chips
      UI.showMessage('Not enough chips in your stack! Click "Deal"');
    } else {
      App.playerChipStack -= chip;
      App.potValue += chip;
    }
    UI.showBet(App.potValue);
    UI.showMessage("Add to your Bet, or click 'Deal!'");
    UI.onDealButton();
  },

  //create deal function
  dealCard: function() {
    var suit = Math.floor(Math.random()*4);  //0: hearts, 1: diamonds, 2: clubs, 3: spades
    var card = Math.floor(Math.random()*App.deck[suit].length);
    var dealtCard = [];
    dealtCard.push(App.deck[suit][card]); //adds random card to array
    dealtCard.push({'suit': App.suits[suit]}); //add random suit of card to array
    App.deck[suit].splice(card,1);  //removes dealtCard from deck

    return dealtCard;

  },

  //initial deal function
  initialDeal: function() {
    App.buildDeck();
    var initialDeal = [];
    for (var i = 0; i < 4; i++) {
      initialDeal.push(App.dealCard());
      if (i%2 === 0) {
        App.playerCards.push(initialDeal[i]);
      } else {
        App.dealerCards.push(initialDeal[i]);
      }
    }
    console.log(App.playerCards);
    console.log(App.dealerCards);
    // console.log(initialDeal);
    console.log('going to showcard function');
    UI.showCard(App.playerCards,App.dealerCards);
  },

  //win function adds pot x2 to player's chips
  playerWins: function() {

  },

  //lose function empties pot value
  playerLoses: function() {

  },

  //push function returns pot value to player
  push: function() {

  },

};

/////////////////UI LOGIC
var UI = {
//Eventhandlers

  //chip click calls App.bet()
  onChipClick: function() {
    $('#chips').on('click', function(){
      nickel = parseInt($('#chips').attr("data-set-id"));
      App.placeBet(nickel);
    });
  },

  //deal click calls App.initialDeal function
  onDealButton: function() {
    $('#dealbutton').on('click', function(){
      App.initialDeal();
    });

  },

  //hit click calls App.dealCard() to add card to player hand
  onHitButton: function() {

  },

  //stay click calls App.stay() which adds cards to dealer's hand until player score is beat or dealer busts
  onStayButton: function() {

  },

//DOM manipulation

  //show "place your bets" in h1
  showMessage: function(message) {
    var $header = $('h1').text(message);
    UI.onChipClick();
  },

  //show total of player's chips
  updatePlayerStack: function(bet) {

  },

  //show value of player's bet
  showBet: function(bet) {
    //called by App.placeBet() to update DOM with bet
    var $pot = $('#pot');
    $pot.text('$'+bet);
  },

  //show dealt cards for player and dealer
  showCard: function(playerCards, dealerCards) {
    for (var i = 0; i < playerCards.length; i++) {
      $('.playerCard').eq(i).text(Object.keys(playerCards[i][0]) + ' of '+playerCards[i][1].suit);
    }
    for (var i = 0; i < dealerCards.length; i++) {
      $('.dealerCard').eq(i).text(Object.keys(dealerCards[i][0]) + ' of '+dealerCards[i][1].suit);
    }
  },

  //add cards for hit on player or dealer
  showHit: function(card) {

  },

  //show win: display value of chips won
  showWin: function() {

  },

  //show lose: display 'Dealer wins'
  showLose: function() {

  },
  //show push: update value of player's chips
  showPush: function() {

  },
};

/////////////////HTML

//Initial Events
window.onload = function() {
  UI.showMessage('Place Your Bets!');
};
