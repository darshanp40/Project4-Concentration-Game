(function () {

    var matchedElements = 1,
    firstObject,
    secondObject,
    moves = 0,
    matches = 0,
    ss = 0,
    mm = 0,
    hh = 0,
    stars = 3,
    time,
    intervalID;

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    /**
    * @description Constructor to initialize a card
    * @constructor
    * @param {string} icon - Icon to be shown on the card
    */
    var Card = function (icon) {
        this.HTML = this.createCard(icon);
        this.icon = icon;
    }

    /**
    * @description Creates a card
    * @param {string} icon Icon to be shown on the card
    * @returns {string} HTML Chunk to create the card
    */
    Card.prototype.createCard = function (cardIcon) {
        var cardHTML;
        cardHTML = ' <li class="card">' +
            '<i class="fa ' + cardIcon + '"></i>' +
            '</li>';
        return cardHTML;
    }

    /**
    * @description Heart of the application - Runs the applications
    */
    function createGame() {
        var arrCardIcons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'],
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

        /**
        * @description Adds click event to the cards
        * @param {number} obj
        */
        function addClickEvent(obj) {
            obj.addEventListener('click', function (e) {
                var arrStars;
                if (!intervalID) {
                    intervalID = startTimer();
                }
                if (!secondObject) {
                    if (this.className.indexOf('match') > -1) {
                        return;
                    }
                    if (this.className.indexOf('show open') > -1) {
                        return;
                    }
                    if (this.className.indexOf('show open') === -1) {
                        this.className += ' show open';
                    }

                    if (!firstObject) {
                        firstObject = this;
                    } else {
                        moves++;
                        arrStars = document.getElementsByClassName('stars')[0].children;
                        if (arrStars.length) {
                            if (moves > 16) {
                                stars = 1;
                                arrStars[1].children[0].className = 'fa fa-star-o';
                            } else if (moves > 12) {
                                stars = 2;
                                arrStars[2].children[0].className = 'fa fa-star-o';
                            }
                        }
                        document.getElementsByClassName('moves')[0].innerHTML = moves;
                        secondObject = this;
                        setTimeout(function () {
                            checkCards();
                            if (matches === 8) {
                                showSuccess();
                            }
                        }, 300);
                    }
                }
            });
        }

        /**
        * @description Adds dynamic behavior to the cards when they match or differ
        */
        function checkCards() {
            var firstCard = firstObject.children[0].className.replace("fa ", ""),
                secondCard = secondObject.children[0].className.replace("fa ", "");
            if (firstCard === secondCard) {
                firstObject.className = firstObject.className.replace(" show open", "") + " match";
                secondObject.className = secondObject.className.replace(" show open", "") + " match";
                matches++;
                firstObject = "";
                secondObject = "";
            } else {
                firstObject.className += " mismatch";
                secondObject.className += " mismatch";
                window.setTimeout(function () {
                    firstObject.className = "card";
                    secondObject.className = "card";
                    firstObject = "";
                    secondObject = "";
                }, 500);
            }
        }
    }

    /**
    * @description Shows the success page
    */
    function showSuccess() {
        setTimeout(function () {
            document.getElementById('stars-count').innerHTML = stars;
            document.getElementById('complete-time').innerHTML = time;
            document.getElementsByClassName('success-message')[0].className = "success-message";
            document.getElementsByClassName('container')[0].className = "hidden";
            document.getElementsByClassName('moves')[1].innerHTML = moves;
            document.getElementsByClassName('circle-loader')[0].className += ' load-complete';
            document.getElementsByClassName('checkmark')[0].className += ' show';
        }, 500);
    }

    /**
    * @description Resets the game
    */
    function resetGame() {
        var arrStars = document.getElementsByClassName('stars')[0].children;
        for (var index = 0; index < arrStars.length; index++) {
            arrStars[index].children[0].className = 'fa fa-star';
        }
        document.getElementsByClassName('moves')[0].innerHTML = 0;
        resetTImer();
        createGame();
    }

    /**
    * @description Starts the timer
    * @param {number} interval ID
    */
    function startTimer() {
        return setInterval(function () {
            ss++;
            if (ss === 60) {
                ss = 0;
                mm++;
                if (mm === 60) {
                    mm = 0;
                    hh++;
                }
            }
            time = ("0" + hh).slice(-2) + "h:" + ("0" + mm).slice(-2) + "m:" + ("0" + ss).slice(-2) + "s";
            document.getElementsByClassName("time")[0].innerHTML = time;
        }, 1000);
    }

    /**
    * @description Resets the timer
    */
    function resetTImer() {
        time = ("00h:00m:00s");
        stopTimer();
        hh = mm = ss = 0;
        document.getElementsByClassName("time")[0].innerHTML = time;
    }

    /**
    * @description Stops the timer
    */
    function stopTimer() {
        clearInterval(intervalID);
    }

    // resets game on click of reset button
    document.getElementsByClassName('restart')[0].addEventListener('click', function () {
        resetGame();
    });

    // start of the game
    createGame();
})();