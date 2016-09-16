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
    this.deck = [];
    this.potValue = 0;
    this.playerCards = [];
    this.dealerCards = [];
    this.spades = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    this.hearts = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    this.diamonds = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    this.clubs = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
  },

  buildDeck: function() {

    this.deck.push(this.hearts, this.diamonds, this.clubs, this.spades);
    //debugger;
  },

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
    // debugger;
    if (this.noChips && this.potValue === 0) {
      UI.gameOver();
    }
    else if (this.playerChipStack < chip) {  //check if player has enough chips
      UI.showMessage('Not enough chips in your stack! Click "Deal"');
      UI.showBet(this.potValue);
    }
    else {
      this.playerChipStack -= chip;
      this.potValue += chip;
      UI.updatePlayerStack();
      UI.showMessage("Add to your Bet, or click 'Deal!'");
      UI.showBet(this.potValue);
    }
  },

  //create deal function
  dealCard: function() {
    var suit = Math.floor(Math.random()*4);  //0: hearts, 1: diamonds, 2: clubs, 3: spades
    var card = Math.floor(Math.random()*this.deck[suit].length);
    var dealtCard = [];
    dealtCard.push(this.deck[suit][card]); //adds random card to dealtCard array
    dealtCard.push({'suit': suit}); //add random suit of card to dealtCard array
    this.deck[suit].splice(card,1);  //removes dealtCard from deck

    return dealtCard;

  },

  //initial deal function
  initialDeal: function() {
    this.buildDeck();
    var initialDeal = [];
    for (var i = 0; i < 4; i++) {
      initialDeal.push(this.dealCard());
      if (i%2 === 0) {
        this.playerCards.push(initialDeal[i]);
      } else {
        this.dealerCards.push(initialDeal[i]);
      }
    }
    // debugger;
    UI.deal(this.playerCards,this.dealerCards);
    UI.showCardTotals();
    // debugger;
    if (this.calculateTotal(this.playerCards) === 21) {
      this.blackJack();
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
    this.playerCards.push(this.dealCard());
    UI.addCard(this.playerCards[this.playerCards.length-1], 'playerCard');
    if (this.calculateTotal(this.playerCards) > 21) {  //check to see if card count > 21
      var aceCount = 0;

      this.playerCards.forEach(function(index) { //loop to check if hand contains ace
          console.log(Object.keys(index[0]));
        if (Object.keys(index[0])[0] === 'a'){
          aceCount ++;
          console.log(aceCount);
        }
      });
        if (aceCount >= 1) { //Chanes ALL aces to value 1
        this.playerCards.forEach(function(index) {
          if (Object.keys(index[0])[0] === 'a') {
            index[0]['a'] = 1;
          }
        });
      }
      if (this.calculateTotal(this.playerCards) > 21) {
        this.bust('Player');
      }
    }
    UI.showCardTotals();
  },

  //stay
  stay: function() {
    var dealerTotal = this.calculateTotal(this.dealerCards);
    var playerTotal = this.calculateTotal(this.playerCards)
    // debugger;
    if (dealerTotal > 21) {
      this.playerWins();
    }
    else if (dealerTotal === playerTotal && dealerTotal > 16) {
      this.tieGame();
    }
    else if (dealerTotal <= playerTotal) {
      this.dealerCards.push(this.dealCard());
      UI.addCard(this.dealerCards[this.dealerCards.length-1], 'dealerCard');
      UI.showCardTotals();
      this.stay();
    }
    else {
      this.dealerWins();
    }
  },

  blackJack: function() {
    this.playerChipStack = this.playerChipStack +(this.potValue * 2);
    UI.updatePlayerStack();
    UI.showMessage('Blackjack!!! You now have $'+this.playerChipStack);
    UI.endGame();
  },

  //win function adds pot x2 to player's chips
  playerWins: function() {
    // debugger;
    this.playerChipStack = this.playerChipStack +(this.potValue * 2);
    UI.updatePlayerStack();
    UI.showMessage('You win! You now have $'+this.playerChipStack);
    UI.endGame();
  },

  dealerWins: function() {
    UI.showMessage('Dealer wins!');
    if (this.playerChipStack > 0) {
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
    if (this.playerChipStack > 0) {
      UI.endGame();
    }
    else {
      UI.gameOver();
    }
  },

  //push function returns pot value to player
  tieGame: function() {
    this.playerChipStack += this.potValue;
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
      this.addCard(playerCards[i],'playerCard');
      // $newCard= Html.createCard(Object.keys(playerCards[i][0]),playerCards[i][1].suit,'card');
      // $('#player').append($newCard);
    }
    for (var i = 0; i < dealerCards.length; i++) {
      this.addCard(dealerCards[i],'dealerCard');
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
    $resetButton.text('New Game');
    $('#right').append($resetButton);
    $resetButton.on('click', function() {
      UI.reset();
      App.reset();
      UI.showMessage('Place Your Bets!');
    });
  },

  gameOver: function() {
    // debugger;
    this.updatePlayerStack();
    $('#hitButton').attr("disabled", true);
    $('#stayButton').attr("disabled", true);
    $('#dealButton').attr("disabled", true);
    $('#chipButton').attr("disabled", true);
    this.showMessage('GAME OVER');

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
