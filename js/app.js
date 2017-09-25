(function() {
/*
 * Create a list that holds all of your cards
 */
/*

 * /
 * 
 * @param {any} array 
 * @returns 
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 var Card = function(icon) {
    this.HTML = this.createCard(icon);
    this.icon = icon;
 }

 Card.prototype.createCard = function(cardIcon) {
     var cardHTML;
     cardHTML = ' <li class="card">' +
                    '<i class="fa ' + cardIcon + '"></i>' +
                '</li>';
    return cardHTML;
 }

function createGameHTML() {
    var arrCardIcons = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'],
        arrCardObjects = [],
        HTMLChunk,
        arrElements,
        matchedElements = 1,
        currentOject;

    for (var index = 0; index < arrCardIcons.length * 2; index++) {
        arrCardObjects[index] = new Card(arrCardIcons[index % arrCardIcons.length]);
    }
    arrCardObjects = shuffle(arrCardObjects);
    
    HTMLChunk = arrCardObjects.map(function (obj) {
        return obj.HTML;
    }).join("");

    document.getElementsByClassName('deck')[0].innerHTML = HTMLChunk;
    
    arrElements = document.getElementsByClassName('card');
    for (var index = 0; index < arrElements.length; index++) {
        addClickEvent(arrElements[index]);
    }

    function addClickEvent(obj) {
        obj.addEventListener('click', function(e) {
            var firstCard;
            if(this.className.indexOf('match') > -1) {
                return;
            }
            if(this.className.indexOf('show open') > -1) {
                return;
            }
            if(this.className.indexOf('show open') === -1) {
                this.className += ' show open';
            }
        
            if(!currentOject) {
                currentOject = this;
            } else {
                setTimeout(function() {}, 2000);
                firstCard = currentOject.children[0].className.replace("fa ", "");
                if(firstCard === this.children[0].className.replace("fa ", "")) {
                    currentOject.className = currentOject.className.replace(" show open", "") + " match"; 
                    this.className = currentOject.className.replace(" show open", "") + " match";
                } else {
                    currentOject.className = currentOject.className.replace(" show open", ""); 
                    this.className = currentOject.className.replace(" show open", "");
                }
                currentOject = "";
            }
        });   
    }
}
createGameHTML();
document.getElementsByClassName('restart')[0].addEventListener('click', function() {
    createGameHTML();
});
})();