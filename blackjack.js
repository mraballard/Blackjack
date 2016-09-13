/////////////////APP LOGIC

var App = {
//create deck
  deck : [],

  hearts : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  diamonds : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  clubs : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],
  spades : [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ],

  //create player, dealer, stack, pot variables
  playerCards : 0,
  dealerCards : 0,
  playerChipStack : 100,
  potValue : 0,

  buildDeck: function() {
    App.deck.push(App.hearts, App.diamonds, App.clubs, App.spades);
  },

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
    App.playerChipStack -= chip;
    App.potValue += chip;
    UI.showBet(App.potValue);
    UI.onDealButton();
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
    UI.placeYourBets();
    App.buildDeck();
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
    var $header = $('h1').text("Place Your Bets!");
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

//Initial Events
window.onload = function() {
  UI.placeYourBets();
};
