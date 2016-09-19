# Blackjack
Unit 1 project for General Assembly

https://mraballard.github.io/Blackjack/

For planning I used wireframes and trello. My app ended up looking quite different from my wireframe because I had a hard time aligning elements with CSS.

Deck of cards: constructed using object-like arrays and is scalable.

Displaying cards was difficult to figure out with sprites. At first I thought about creating a separate ID for each card and in the CSS file giving it's location on the sprite. After some contemplation I decided to create a cardmap array as a matrix for each card's location on the sprite image. As each card is delivered to the screen, it's location on the sprite is calculated dynamically.

Unsolved features:
  - Once hand value passes 21, any and all aces in the hand are changed to value 1 instead of checking if the hand would be improved with one ace as 11 and the other as 1.
  - No split hand
  - Double Down
  - Insurance
  - Display odds/strategy
