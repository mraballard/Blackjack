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

  reset: function() {
    //debugger;
    App.deck = [];
    App.potValue = 0;
    App.playerCards = [];
    App.dealerCards = [];
    App.buildDeck();
    UI.reset();
    UI.showMessage('Place Your Bets!');
  },

  buildDeck: function() {
    App.hearts = [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ];
    App.diamonds = [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ];
    App.clubs = [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ];
    App.spades = [ {'2':2}, {'3':3}, {'4':4}, {'5':5}, {'6':6}, {'7':7}, {'8':8}, {'9':9}, {'10':10}, {'J': 10}, {'Q': 10}, {'K': 10}, {'A': 11} ];
    App.deck.push(App.hearts, App.diamonds, App.clubs, App.spades);
    //debugger;
  },

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
    //debugger;
    if (App.playerChipStack < chip) {  //check if player has enough chips
      UI.showMessage('Not enough chips in your stack! Click "Deal"');
    } else {
      App.playerChipStack -= chip;
      App.potValue += chip;
      UI.updatePlayerStack();
    }
    UI.showBet(App.potValue);
    UI.showMessage("Add to your Bet, or click 'Deal!'");
    UI.onDealButton();
  },

  //create deal function
  dealCard: function() {
    //debugger;
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
    // debugger;
    App.reset();
    var initialDeal = [];
    for (var i = 0; i < 4; i++) {
      initialDeal.push(App.dealCard());
      if (i%2 === 0) {
        App.playerCards.push(initialDeal[i]);
      } else {
        App.dealerCards.push(initialDeal[i]);
      }
    }
    UI.deal(App.playerCards,App.dealerCards);
  },

  calculateTotal: function(player) {
    // debugger;
    var total = 0;
    player.forEach(function(card) {
      total += card[0][Object.keys(card[0])];
    });
    return total;
  },

  //HIT
  hit: function() {
    // debugger;
    App.playerCards.push(App.dealCard());
    UI.addCard(App.playerCards[App.playerCards.length-1], 'playerCard');
    if (App.calculateTotal(App.playerCards) > 21) {
      App.bust('Player');
    }
  },

  //stay
  stay: function() {
    var dealerTotal = App.calculateTotal(App.dealerCards);
    var playerTotal = App.calculateTotal(App.playerCards)

    if (dealerTotal > 21) {
      App.playerWins();
    }
    else if (dealerTotal === playerTotal && dealerTotal > 16) {
      App.tieGame();
    }
    else if (dealerTotal < playerTotal) {
      App.dealerCards.push(App.dealCard());
      UI.addCard(App.dealerCards[App.dealerCards.length-1], 'dealerCard');
      App.stay();
    }
    else {
      App.dealerWins();
    }
  },



  //win function adds pot x2 to player's chips
  playerWins: function() {
    App.playerChipStack = App.playerChipStack +(App.potValue * 2);
    UI.showMessage('You win! You now have $'+App.playerChipStack);
    UI.endGame();
  },

  dealerWins: function() {
    UI.showMessage('Dealer wins!');
    UI.endGame();
  },

  //lose function empties pot value
  bust: function(player) {
    //debugger;
    UI.showMessage(player + ' busts!');
    UI.endGame();
  },

  //push function returns pot value to player
  tieGame: function() {
    App.playerChipStack += App.potValue;
    UI.showMessage('Push');
    UI.endGame();
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
    $('#dealButton').on('click', function(){
      App.initialDeal();
      $('#dealButton').attr("disabled", true);
    });

  },

  //hit click calls App.dealCard() to add card to player hand
  onHitButton: function() {
    $('#hitButton').on('click', function(){
      App.hit();
    });
    $('#hitButton').attr("disabled", true);
  },

  //stay click calls App.stay() which adds cards to dealer's hand until player score is beat or dealer busts
  onStayButton: function() {
    $('#stayButton').on('click', function(){
      App.stay();
    });
    $('#stayButton').attr("disabled", true);
  },

//DOM manipulation

  reset: function() {
    $('#dealer').children().remove();
    $('#player').children().remove();
    $('#pot').text('');
    $('#dealButton').attr("disabled", false);
    $('#endGame').remove();
    $('#chips').attr("disabled", false);

  },

  //show "place your bets" in h1
  showMessage: function(message) {
    var $header = $('h1').text(message);
  },

  //show total of player's chips
  updatePlayerStack: function(bet) {
    $('#chipStack').text('$'+App.playerChipStack);
  },

  //show value of player's bet
  showBet: function(bet) {
    //called by App.placeBet() to update DOM with bet
    var $pot = $('#pot');
    $pot.text('$'+bet);
  },

  //show dealt cards for player and dealer
  deal: function(playerCards, dealerCards) {
    //debugger;
    for (var i = 0; i < playerCards.length; i++) {
      $newCard= Html.createCard(Object.keys(playerCards[i][0]),playerCards[i][1].suit,'playerCard');
      $('#player').append($newCard);
    }
    for (var i = 0; i < dealerCards.length; i++) {
      $newCard = Html.createCard(Object.keys(dealerCards[i][0]),dealerCards[i][1].suit,'dealerCard');
      $('#dealer').append($newCard);
    }
    $('#hitButton').attr("disabled", false);
    $('#stayButton').attr("disabled", false);
    $('#chips').attr("disabled", true);
  },

  addCard: function(card, player) {
    //debugger;
    $newCard = Html.createCard(Object.keys(card[0]),card[1].suit, player);
    if (player === 'playerCard') {
      $('#player').append($newCard);
    } else {
      $('#dealer').append($newCard);
    }
  },

  endGame: function() {
    // debugger;
    UI.updatePlayerStack();
    $('#hitButton').attr("disabled", true);
    $('#stayButton').attr("disabled", true);
    $resetButton = $('<button></button>');
    $resetButton.attr('id','endGame');
    $resetButton.text('Reset Game');
    $('body').append($resetButton);
    $resetButton.on('click', function() {
      UI.reset();
      App.reset();
      UI.showMessage('Place Your Bets!');
    });
  }
};

/////////////////HTML
var Html = {
  createCard: function(value, suit, className) {
    var $newCard = $('<div></div>');
    $newCard.addClass(className);
    $newCard.html(value + suit);
    return $newCard;
  }
};

//Initial Events
window.onload = function() {
  UI.showMessage('Place Your Bets!');
  UI.onChipClick();
  UI.onHitButton();
  UI.onStayButton();
  UI.updatePlayerStack();
};
