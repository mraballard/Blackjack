# Blackjack
Unit 1 project for General Assembly

https://mraballard.github.io/Blackjack/

For planning I used wireframes and trello. My app includes jQuery, javascript, css, and html.

Deck of cards: constructed using object-like arrays and is scalable.

Displaying cards was difficult,  I decided to create a cardmap array as a coordinate matrix for each card's location on the sprite image. As each card is delivered to the screen, it's location on the sprite is calculated dynamically.

Unsolved features:
  - Once hand value passes 21, any and all aces in the hand are changed to value 1 instead of checking if the hand would be improved with one ace as 11 and the other as 1.
  - No split hand
  - Insurance
  - Display odds/strategy
