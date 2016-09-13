/////////////////APP LOGIC

var App = {
//create deck

  hearts : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  diamonds : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  clubs : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  spades : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],

  deck : [this.hearts, this.diamonds, this.clubs, this.spades],

  //create player, dealer, stack, pot variables
  playerCards : 0,
  dealerCards : 0,
  playerChipStack : 100,
  potValue : 0,

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
    App.playerChipStack -= chip;
    App.potValue += chip;
    return App.potValue;
  },

  //create deal function
  dealCard: function() {
    var suit = Math.floor(Math.random()*4);
    var card = Math.floor(Math.random()*App.deck[suit].length);

    dealtCard = App.deck[suit][card]; //select random card from deck.
    App.deck[suit].splice(card,1);  //removes dealtCard from deck

    return dealtCard;

  },

  //initial deal function
  initialDeal: function() {

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

  },

  //deal click calls App.initialDeal function
  onDealButton: function() {

  },

  //hit click calls App.dealCard() to add card to player hand
  onHitButton: function() {

  },

  //stay click calls App.stay() which adds cards to dealer's hand until player score is beat or dealer busts
  onStayButton: function() {

  },

//DOM manipulation

  //show "place your bets" in h1
  placeYourBets: function() {

  },

  //show total of player's chips
  updatePlayerStack: function(bet) {

  },

  //show value of player's bet
  showBet: function(bet) {

  },

  //show dealt cards for player and dealer
  showInitialDeal: function(playerCard1, playerCard2, dealerCard) {

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
