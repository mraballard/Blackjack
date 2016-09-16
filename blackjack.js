/////////////////APP LOGIC

var App = {
//create deck
  deck : [],
  spades : [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ],
  hearts : [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ],
  diamonds : [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ],
  clubs : [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ],
  suits: ['spades','hearts','diamonds','clubs'],
  cardMap: [['a','k','q','j','10','9','8','7','6','5','4','3','2'],['a','k','q','j','10','9','8','7','6','5','4','3','2'],['a','k','q','j','10','9','8','7','6','5','4','3','2'],['a','k','q','j','10','9','8','7','6','5','4','3','2']],

  //create player, dealer, stack, pot variables
  playerCards : [],
  dealerCards : [],
  playerChipStack : 100,
  potValue : 0,
  noChips : false,

  reset: function() {
    // debugger;
    App.deck = [];
    App.potValue = 0;
    App.playerCards = [];
    App.dealerCards = [];
    App.spades = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    App.hearts = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    App.diamonds = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    App.clubs = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
  },

  buildDeck: function() {

    App.deck.push(App.hearts, App.diamonds, App.clubs, App.spades);
    //debugger;
  },

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
    // debugger;
    if (App.noChips && App.potValue === 0) {
      UI.gameOver();
    }
    else if (App.playerChipStack < chip) {  //check if player has enough chips
      UI.showMessage('Not enough chips in your stack! Click "Deal"');
      UI.showBet(App.potValue);
    }
    else {
      App.playerChipStack -= chip;
      App.potValue += chip;
      UI.updatePlayerStack();
      UI.showMessage("Add to your Bet, or click 'Deal!'");
      UI.showBet(App.potValue);
    }
  },

  //create deal function
  dealCard: function() {
    var suit = Math.floor(Math.random()*4);  //0: hearts, 1: diamonds, 2: clubs, 3: spades
    var card = Math.floor(Math.random()*App.deck[suit].length);
    var dealtCard = [];
    dealtCard.push(App.deck[suit][card]); //adds random card to dealtCard array
    dealtCard.push({'suit': suit}); //add random suit of card to dealtCard array
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
    // debugger;
    UI.deal(App.playerCards,App.dealerCards);
    UI.showCardTotals();
    // debugger;
    if (App.calculateTotal(App.playerCards) === 21) {
      App.blackJack();
    }
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
    UI.showCardTotals();
    if (App.calculateTotal(App.playerCards) > 21) {
      App.bust('Player');
    }
  },

  //stay
  stay: function() {
    var dealerTotal = App.calculateTotal(App.dealerCards);
    var playerTotal = App.calculateTotal(App.playerCards)
    // debugger;
    if (dealerTotal > 21) {
      App.playerWins();
    }
    else if (dealerTotal === playerTotal && dealerTotal > 16) {
      App.tieGame();
    }
    else if (dealerTotal <= playerTotal) {
      App.dealerCards.push(App.dealCard());
      UI.addCard(App.dealerCards[App.dealerCards.length-1], 'dealerCard');
      UI.showCardTotals();
      App.stay();
    }
    else {
      App.dealerWins();
    }
  },

  blackJack: function() {
    App.playerChipStack = App.playerChipStack +(App.potValue * 2);
    UI.updatePlayerStack();
    UI.showMessage('Blackjack!!! You now have $'+App.playerChipStack);
    UI.endGame();
  },

  //win function adds pot x2 to player's chips
  playerWins: function() {
    // debugger;
    App.playerChipStack = App.playerChipStack +(App.potValue * 2);
    UI.updatePlayerStack();
    UI.showMessage('You win! You now have $'+App.playerChipStack);
    UI.endGame();
  },

  dealerWins: function() {
    UI.showMessage('Dealer wins!');
    if (App.playerChipStack > 0) {
      UI.endGame();
    }
    else {
      UI.gameOver();
    }
  },

  //lose function empties pot value
  bust: function(player) {
    //debugger;
    UI.showMessage(player + ' busts!');
    if (App.playerChipStack > 0) {
      UI.endGame();
    }
    else {
      UI.gameOver();
    }
  },

  //push function returns pot value to player
  tieGame: function() {
    App.playerChipStack += App.potValue;
    UI.updatePlayerStack();
    UI.showMessage('Push');
    UI.endGame();
  },

};

/////////////////UI LOGIC
var UI = {
//Eventhandlers

  //chip click calls App.bet()
  onChipClick: function() {
    // console.log('chip clicked');
    $('#chipButton').on('click', function(){
      $('#dealButton').attr("disabled", false);
      nickel = parseInt($('#chipButton').attr("data-set-id"));
      App.placeBet(nickel);
    });
  },

  //deal click calls App.initialDeal function
  onDealButton: function() {
    // debugger;
    $('#dealButton').on('click', function(){
      App.initialDeal();
      $('#dealButton').attr("disabled", true);
    });
    $('#dealButton').attr("disabled", true);
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
    // debugger;
    // $('#dealer').children().remove();
    // $('#player').children().remove();
    $('.card').remove();
    $('#potTotal').text('');
    $('.cardTotal').text('');
    $('#dealButton').attr("disabled", true);
    $('#endGame').remove();
    $('#chipButton').attr("disabled", false);
  },

  //show "place your bets" in h1
  showMessage: function(message) {
    var $header = $('h1').text(message);
  },

  //show total of player's chips
  updatePlayerStack: function(bet) {
    $('#chipValue').text('$'+App.playerChipStack);
  },

  //show value of player's bet
  showBet: function(bet) {
    // console.log(bet);
    //called by App.placeBet() to update DOM with bet
    var $pot = $('#potTotal');
    $pot.text('$'+bet);
  },

  //show dealt cards for player and dealer
  deal: function(playerCards, dealerCards) {
    //debugger;
    for (var i = 0; i < playerCards.length; i++) {
      // debugger;
      UI.addCard(playerCards[i],'playerCard');
      // $newCard= Html.createCard(Object.keys(playerCards[i][0]),playerCards[i][1].suit,'card');
      // $('#player').append($newCard);
    }
    for (var i = 0; i < dealerCards.length; i++) {
      UI.addCard(dealerCards[i],'dealerCard');
      // $newCard = Html.createCard(Object.keys(dealerCards[i][0]),dealerCards[i][1].suit,'card');
      // $('#dealer').append($newCard);
    }
    $('#hitButton').attr("disabled", false);
    $('#stayButton').attr("disabled", false);
    $('#chipButton').attr("disabled", true);
  },

  showCardTotals: function() {
    // $dealerTotal = $('<span></span>').attr('id','dealerTotal');
    // $dealerTotal.addClass('cardTotal');
    // $playerTotal = $('<span></span>').attr('id','playerTotal');
    // $playerTotal.addClass('cardTotal');
    // $('#dealer').prepend($dealerTotal);
    // $('#player').prepend($playerTotal);
    $('#dealerTotal').text(App.calculateTotal(App.dealerCards));
    $('#playerTotal').text(App.calculateTotal(App.playerCards));
  },

  addCard: function(card, whichPlayer) {
    // debugger;
    var $suit = card[1].suit; //suit of card
    var coordinateY = ($suit * -59)+'px'; //calculate Y coordinate of suit on sprite
    var $cardFace = Object.keys(card[0]); //face of card
    var coordinateX = (App.cardMap[$suit].indexOf($cardFace[0]) * (-42))+ 'px'; //calculate X coordinate of cardface on sprite
    var uniqueImageId = 'img'+ $suit + $cardFace;  //create a unique ID for the image sprite in order to assign unique coordinates.

    var $newCard = Html.createCard('card'); //create card DIV
    var $cardImage = $(`<img id=${uniqueImageId}>`); //create image element with unique ID
    $cardImage.attr('src', 'images/cards_sprite.png'); //assign image source for sprite
    $cardImage.css({position: 'absolute', 'top': coordinateY, 'left': coordinateX}); //assign unique CSS location to imageID
    $newCard.append($cardImage); //append image element to card DIV
    if (whichPlayer === 'playerCard') {
      $('#player').append($newCard); //append card DIV to player or dealer hand
    } else {
      $('#dealer').append($newCard);
    }
  },

  endGame: function() {
    // debugger;
    // console.log('Endgame start' + App.playerChipStack);
    // UI.updatePlayerStack();
    $('#hitButton').attr("disabled", true);
    $('#stayButton').attr("disabled", true);
    $resetButton = $('<button></button>');
    $resetButton.attr('id','endGame');
    $resetButton.text('Reset Game');
    $('#right').append($resetButton);
    $resetButton.on('click', function() {
      UI.reset();
      App.reset();
      UI.showMessage('Place Your Bets!');
    });
  },

  gameOver: function() {
    // debugger;
    UI.updatePlayerStack();
    $('#hitButton').attr("disabled", true);
    $('#stayButton').attr("disabled", true);
    $('#dealButton').attr("disabled", true);
    $('#chipButton').attr("disabled", true);
    UI.showMessage('GAME OVER');

    return true;
  }
};

/////////////////HTML
var Html = {
  createCard: function(className) {
    var $newCard = $('<div></div>');
    $newCard.addClass(className);

    return $newCard;
  }
};

//Initial Events
window.onload = function() {
  UI.showMessage('Place Your Bets!');
  UI.onChipClick();
  UI.onDealButton();
  UI.onHitButton();
  UI.onStayButton();
  UI.updatePlayerStack();
};
