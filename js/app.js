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
 
 var matchedElements = 1,
 firstObject,
 secondObject,
 moves = 0,
 matches = 0,
 ss = 0, 
 mm = 0, 
 hh = 0,
 stars = 3,
 intervalID;

 Card.prototype.createCard = function(cardIcon) {
     var cardHTML;
     cardHTML = ' <li class="card">' +
                    '<i class="fa ' + cardIcon + '"></i>' +
                '</li>';
    return cardHTML;
 }

function createGame() {
    var arrCardIcons = ['fa-diamond','fa-paper-plane-o','fa-anchor','fa-bolt','fa-cube','fa-leaf','fa-bicycle','fa-bomb'],
        arrCardObjects = [],
        HTMLChunk,
        arrElements;

    for (var index = 0; index < arrCardIcons.length * 2; index++) {
        arrCardObjects[index] = new Card(arrCardIcons[index % arrCardIcons.length]);
    }
    arrCardObjects = shuffle(arrCardObjects);
    console.log(arrCardObjects);
    HTMLChunk = arrCardObjects.map(function (obj) {
        return obj.HTML;
    }).join("");

    document.getElementsByClassName('deck')[0].innerHTML = HTMLChunk;
    
    arrElements = document.getElementsByClassName('card');
    for (var index = 0; index < arrElements.length; index++) {
        addClickEvent(arrElements[index]);
    }

    function addClickEvent(obj) {
        var arrStars;
        obj.addEventListener('click', function(e) {
            if(!intervalID) {
                startTimer();
            }
            if(!secondObject) {
                if(this.className.indexOf('match') > -1) {
                    return;
                }
                if(this.className.indexOf('show open') > -1) {
                    return;
                }
                if(this.className.indexOf('show open') === -1) {
                    this.className += ' show open';
                }
            
                if(!firstObject) {
                    firstObject = this;
                } else {
                    moves++;
                    arrStars = document.getElementsByClassName('stars')[0].children;
                    if(arrStars.length) {
                        if(moves > 20) {
                            stars = 0;
                            arrStars[0].children[0].className = 'fa fa-star-o';
                        } else if(moves > 16) {
                            stars = 1;
                            arrStars[1].children[0].className = 'fa fa-star-o';
                        }else if(moves > 12) {
                            stars = 2;
                            arrStars[2].children[0].className = 'fa fa-star-o';
                        }
                    }
                    
                    document.getElementsByClassName('moves')[0].innerHTML = moves;
                    secondObject = this;
                    setTimeout(function() {
                        checkCards();
                        if(matches === 8) {
                            showSuccess();
                        }
                    }, 300);
                }
            }
        });   
    }
    function checkCards() {
        var firstCard = firstObject.children[0].className.replace("fa ", ""),
            secondCard = secondObject.children[0].className.replace("fa ", "");
        if(firstCard === secondCard) {
            firstObject.className = firstObject.className.replace(" show open", "") + " match"; 
            secondObject.className = secondObject.className.replace(" show open", "") + " match";
            matches++;
            firstObject = "";
            secondObject = "";
        } else {
            firstObject.className += " mismatch";
            secondObject.className += " mismatch"; 
            window.setTimeout(function(){
                firstObject.className = "card"; 
                secondObject.className = "card";
                firstObject = "";
                secondObject = "";
            },500);
        }
    }
}

function showSuccess() {
    setTimeout(function() {
        document.getElementById('stars-count').innerHTML = stars;
        document.getElementsByClassName('success-message')[0].className = "success-message";
        document.getElementsByClassName('container')[0].className = "hidden";
        document.getElementsByClassName('moves')[1].innerHTML = moves;
    }, 500);
    
}

function resetGame() {
    var arrStars = document.getElementsByClassName('stars')[0].children;
    for (var index = 0; index < arrStars.length; index++) {
        arrStars[index].children[0].className = 'fa fa-star';
    }
    document.getElementsByClassName('moves')[0].innerHTML = 0;
    createGame();
}
setTimeout(function() {
    document.getElementsByClassName('circle-loader')[0].className += ' load-complete';
    document.getElementsByClassName('checkmark')[0].className += ' show'; 
},1000);

function startTimer() {
   return setInterval(function() {
        ss++;
        if(ss === 60) {
            ss = 0;
            mm++;
            if(mm === 60) {
                mm = 0;
                hh++;
            }
        }
        time = ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2) + ":" + ("0" + ss).slice(-2);
        document.getElementsByClassName("time")[0].innerHTML = time;
        
    },1000);
}

document.getElementsByClassName('restart')[0].addEventListener('click', function() {
    resetGame();
});

createGame();
})();