/////////////////APP LOGIC

var App = {
  //cardmap for locating card on sprite in UI.addCard()
  cardMap:  [['a','k','q','j','10','9','8','7','6','5','4','3','2'],['a','k','q','j','10','9','8','7','6','5','4','3','2'],['a','k','q','j','10','9','8','7','6','5','4','3','2'],['a','k','q','j','10','9','8','7','6','5','4','3','2']],
  playerChipStack : 100,
  noChips : false,

  reset: function() {
    //create player, dealer, stack, pot variables
    this.deck = [];
    this.potValue = 0;
    this.playerCards = [];
    this.dealerCards = [];
    this.cardCount = 0;  //counts how many cards have been dealt.

    this.spades = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    this.hearts = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    this.diamonds = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
    this.clubs = [ {'a': 11}, {'k': 10}, {'q': 10}, {'j': 10}, {'10': 10}, {'9': 9}, {'8': 8}, {'7': 7}, {'6': 6}, {'5': 5}, {'4': 4}, {'3': 3}, {'2': 2} ];
  },

  buildDeck: function() {
    this.deck.push(this.hearts, this.diamonds, this.clubs, this.spades);
  },

  //create bet function to subtract bet from player's chips
  placeBet: function(chip) {
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
      UI.showMessage("Bet more or Deal!");
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
    this.buildDeck();  //builds full deck
    var initialDeal = [];
    for (var i = 0; i < 4; i++) {
      initialDeal.push(this.dealCard());  //deals random card
      this.cardCount ++;
      if (i%2 === 0) {  //everyother card goes to dealer/player
        this.playerCards.push(initialDeal[i]);
          UI.addCard(initialDeal[i],'playerCard');
      } else {
        this.dealerCards.push(initialDeal[i]);
          UI.addCard(initialDeal[i],'dealerCard');
      }
    }
    // UI.deal(this.playerCards,this.dealerCards);
    UI.showPlayerTotal();
    UI.toggleButtons();
    if (this.calculateTotal(this.playerCards) === 21) {
      this.blackJack();
    }
  },

  calculateTotal: function(player) {
    var total = 0;
    player.forEach(function(card) {
      total += card[0][Object.keys(card[0])];
    });
    return total;
  },

  aceCheck: function(hand) {
    if (this.calculateTotal(hand) > 21) {  //check to see if card count > 21
      var aceCount = 0;
      hand.forEach(function(index) { //loop to check if hand contains ace
        if (Object.keys(index[0])[0] === 'a'){
          aceCount ++;
        }
      });
      if (aceCount >= 1) { //Changes ALL aces to value 1
        hand.forEach(function(index) {
          if (Object.keys(index[0])[0] === 'a') {
            index[0]['a'] = 1;
          }
        });
      }
    }
  },

  //HIT
  hit: function() {
    this.playerCards.push(this.dealCard());
    UI.addCard(this.playerCards[this.playerCards.length-1], 'playerCard');
    this.aceCheck(this.playerCards);
    if (this.calculateTotal(this.playerCards) > 21) {
      this.bust('Player');
    }
    UI.showPlayerTotal();
  },

  stay: function() {
    this.aceCheck(this.dealerCards);
    var dealerTotal = this.calculateTotal(this.dealerCards);
    var playerTotal = this.calculateTotal(this.playerCards)
    UI.showDealerTotal();
    if (dealerTotal > 21) {
      this.playerWins();
    }
    else if (dealerTotal === playerTotal && dealerTotal > 16) {
      this.tieGame();
    }
    else if (dealerTotal <= playerTotal) {
      this.dealerCards.push(this.dealCard());
      UI.addCard(this.dealerCards[this.dealerCards.length-1], 'dealerCard');
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
    setTimeout(function() {
      UI.endGame()
    }, 1000);
  },

  //win function adds pot x2 to player's chips
  playerWins: function() {
    this.playerChipStack = this.playerChipStack +(this.potValue * 2);
    UI.updatePlayerStack();
    UI.showMessage('Big winner!');
    setTimeout(function() {
      UI.endGame()
    }, 1000);
  },

  dealerWins: function() {
    UI.showMessage('Dealer wins!');
    if (this.playerChipStack > 0) {
      setTimeout(function() {
        UI.endGame()
      }, 1000);
    }
    else {
      setTimeout(function() {
        UI.gameOver()
      }, 1000);
    }
  },

  //lose function empties pot value
  bust: function(player) {
    UI.showMessage(player + ' busts!');
    if (this.playerChipStack > 0) {
      setTimeout(function() {
        UI.endGame()
      }, 1000);
    }
    else {
      setTimeout(function() {
        UI.gameOver()
      }, 1000);
    }
  },

  //push function returns pot value to player
  tieGame: function() {
    this.playerChipStack += this.potValue;
    UI.updatePlayerStack();
    UI.showMessage('Push');
    setTimeout(function() {
      UI.endGame()
    }, 1000);
  },
};

/////////////////UI LOGIC
var UI = {
//Eventhandlers

  //chip click calls App.bet()
  onChipClick: function() {
    $('#chipButton').on('click', function(){
      $('#dealButton').attr("disabled", false);
      nickel = parseInt($('#chipButton').attr("data-set-id"));
      App.placeBet(nickel);
    });
  },

  //deal click calls App.initialDeal function
  onDealButton: function() {
    $('#dealButton').on('click', function(){
      UI.showMessage("Let's do it");
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
    //called by App.placeBet() to update DOM with bet
    var $pot = $('#potTotal');
    $pot.text('$'+bet);
  },

  //show dealt cards for player and dealer
  toggleButtons: function() {
    $('#hitButton').attr("disabled", false);
    $('#stayButton').attr("disabled", false);
    $('#chipButton').attr("disabled", true);
  },

  showDealerTotal: function() {
    $('#dealerTotal').text(App.calculateTotal(App.dealerCards));
    var $card = $('#dealer').children().eq(1).children().eq(0);  //selects dealers hidden card element
    $card.css({position: 'absolute', 'top': App.dealerCardCoordinateY, 'left': App.dealerCardCoordinateX});
  },

  showPlayerTotal: function() {
    $('#playerTotal').text(App.calculateTotal(App.playerCards));
  },

  addCard: function(card, whichPlayer) {
      //Working with Sprites
      var $suit = card[1].suit; //suit of card
      var $cardFace = Object.keys(card[0]); //face of card
      var uniqueImageId = 'img'+ $suit + $cardFace;  //create a unique ID for the image sprite in order to assign unique coordinates.
          var coordinateY = ($suit * -59)+'px'; //calculate Y coordinate of suit on sprite
          var coordinateX = (App.cardMap[$suit].indexOf($cardFace[0]) * (-42))+ 'px'; //calculate X coordinate of
      var $newCard = Html.createCard('card'); //create card DIV
      var $cardImage = $(`<img id=${uniqueImageId}>`); //create image element with unique ID
      $cardImage.addClass('visible');
      $cardImage.attr('src', 'images/cards_sprite.png'); //assign image source for sprite
      if (App.cardCount === 2) {
        App.dealerCardCoordinateX = coordinateX;
        App.dealerCardCoordinateY = coordinateY;
        $cardImage.css({position: 'absolute', 'top': '0px', 'left': '-546px'}); //assign unique CSS location to imageID
      } else {
        $cardImage.css({position: 'absolute', 'top': coordinateY, 'left': coordinateX}); //assign unique CSS location to imageID
      }
    //Append card element to DOM
    $newCard.append($cardImage); //append image element to card DIV
    switch (whichPlayer) {
      case 'playerCard':
          $('#player').append($newCard); //append card DIV to player or dealer hand
        break;
      default:
        $('#dealer').append($newCard); //append card DIV to player or dealer hand
    }
  },

  endGame: function() {
    $('#hitButton').attr("disabled", true);
    $('#stayButton').attr("disabled", true);
    $resetButton = $('<button></button>');
    $resetButton.attr('id','endGame');
    $resetButton.text('New Game');
    $('body').append($resetButton);
    $resetButton.on('click', function() {
      UI.reset();
      App.reset();
      UI.showMessage('Place Your Bets!');
    });
  },

  gameOver: function() {
    this.updatePlayerStack();
    $('#hitButton').attr("disabled", true);
    $('#stayButton').attr("disabled", true);
    $('#dealButton').attr("disabled", true);
    $('#chipButton').attr("disabled", true);
    this.showMessage('GAME OVER');
    $resetButton = $('<button></button>');
    $resetButton.attr('id','endGame');
    $resetButton.text('New Game');
    $('body').append($resetButton);
    $resetButton.on('click', function() {
      location.reload();
    });
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
  App.reset();
  UI.showMessage('Place Your Bets!');
  UI.onChipClick();
  UI.onDealButton();
  UI.onHitButton();
  UI.onStayButton();
  UI.updatePlayerStack();
};
