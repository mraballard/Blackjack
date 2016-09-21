# Blackjack
Unit 1 project for General Assembly

https://mraballard.github.io/Blackjack/

During the planning phase of this project I built a mockup of the game using wireframes and a project flow with trello. Although my game ended up completley different than the wireframes mockup, it was still useful because it allowed me to build the structure in my head before approaching the code.  The planning phase was extremely useful for this project. By the time I was actually sitting down to code I knew exactly (or almost exactly) which functions I needed to write and how I would divide my code up between App logic, UI (DOM) manipulation, and HTML.  The technologies I used for this appliaction inclued: jQuery, javascript, css, and html.

Deck of cards: constructed using object-like arrays and is scalable.  The deck is an array of 4 elements (deck[0,1,2,3]) where each element represents a suit. Each element is it's own array of objects (deck[0]= suit = [{'A':11},{'K':10}, ... , {'2':2}]).  This did make it a bit difficult to reference individual card because of the nested arrays, but I think it is more robust this way and scalable as you can always push new suit arrays to the deck array.

Displaying cards was difficult because I wanted to do it with sprites.  I decided to create a cardmap array as a coordinate matrix for each card's location on the sprite image, rather than physically type the coordinate for each card in the CSS. As each card is delivered to the screen, it's location on the sprite is calculated dynamically.

Unsolved features:
  - Once hand value passes 21, any and all aces in the hand are changed to value 1 instead of checking if the hand would be improved with one ace as 11 and the other as 1.
  - No split hand
  - Insurance
  - Display odds/strategy
