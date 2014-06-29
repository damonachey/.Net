"use strict";
(function (ns) {
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    };

    var Model = function () {
        var self = this;
        var pileCount = 7;
        var foundationCount = 4;

        self.deck;
        self.waste = [];
        self.foundations = [];
        self.piles = [];

        self.dealPiles = function () {
            for (var row = 0; row < self.piles.length; row++) {
                for (var pile = row; pile < self.piles.length; pile++) {
                    var card = self.deck.draw();

                    card.visible = row === pile;

                    self.piles[pile][row] = card;
                }
            }
        };

        var moveWasteToDeck = function () {
            while (self.waste.length) {
                var card = self.waste.shift();

                card.visible = true;

                self.deck.add(card);
            }
        };

        var dealDeckToWaste = function () {
            self.waste.forEach(function (card) {
                card.visible = false;
            });

            for (var i = 0; i < 3 && self.deck.size; i++) {
                self.waste.push(self.deck.draw());
            }
        };

        self.dealWaste = function () {
            self.deck.size
                ? dealDeckToWaste()
                : moveWasteToDeck();
        };

        self.destinationFoundation = function (foundation, cards) {
            if (self.foundations[foundation].length == 0) {
                if (cards[0].value.name === CardLibrary.Card.values.A.name) {
                    self.foundations[foundation].push(cards[0]);
                    return true;
                }
            }
            else {
                var lastCard = self.foundations[foundation].last();

                if (lastCard.value.value === cards[0].value.value - 1 &&
                    lastCard.suit.name === cards[0].suit.name) {
                    self.foundations[foundation].push(cards[0]);
                    return true;
                }
            }
        };

        self.destinationPile = function (pile, cards) {
            if (self.piles[pile].length == 0) {
                if (cards[0].value.name === CardLibrary.Card.values.K.name) {
                    self.piles[pile] = self.piles[pile].concat(cards);
                    return true;
                }
            }
            else {
                var lastCard = self.piles[pile].last();

                if (lastCard.value.value === cards[0].value.value + 1 &&
                     lastCard.suit.color !== cards[0].suit.color) {
                    self.piles[pile] = self.piles[pile].concat(cards);
                    return true;
                }
            }
        };

        self.destinationAnywhere = function (cards) {
            if (cards.length == 1) {
                for (var foundation = 0; foundation < self.foundations.length; foundation++) {
                    if (self.destinationFoundation(foundation, cards)) {
                        return true;
                    }
                }
            }

            for (var pile = 0; pile < self.piles.length; pile++) {
                if (self.destinationPile(pile, cards)) {
                    return true;
                }
            }
        }

        self.playWaste = function (unused1, unused2, destination) {
            if (self.waste.length) {
                var cards = [self.waste.last()];

                if (destination(cards)) {
                    self.waste.pop();

                    if (self.waste.length) {
                        self.waste.last().visible = true;
                    }
                }
            }
        };

        self.playFoundation = function (foundation, card, destination) {
            var cards = [self.foundations[foundation][card]];

            if (destination(cards)) {
                self.foundations[foundation].pop();
            }
        };

        self.playPile = function (pile, card, destination) {
            var cards = self.piles[pile].slice(card);

            if (destination(cards)) {
                self.piles[pile].length = card;

                if (self.piles[pile].length) {
                    self.piles[pile].last().visible = true;
                }
            }
        };

        self.initialize = function () {
            CardLibrary.Card.highAce(false);
            self.deck = new CardLibrary.Deck().shuffle();

            for (var foundation = 0; foundation < foundationCount; foundation++) {
                self.foundations[foundation] = [];
            }

            for (var pile = 0; pile < pileCount; pile++) {
                self.piles[pile] = [];
            }
        };
    };

    var View = function () {
        var self = this;

        var span = '<span></span>';
        self.lastCard = ' [class*=card]:last';

        self.tableTopSelector;
        self.tableBottomSelector;
        self.deckSelector;
        self.wasteSelector;
        self.foundationSelector;
        self.pileSelector;
        self.onDrawStart = undefined;
        self.onDrawEnd = undefined;

        var clearAllCards = function () {
            $('.card_None').empty();
        };

        var drawDeck = function (model) {
            for (var i = 0; i < Math.ceil(model.deck.size / 3) ; i++) {
                $(span)
                    .addClass('card_Back')
                    .appendTo(self.deckSelector + self.lastCard);
            }
        };

        var drawWaste = function (model) {
            for (var card = 0; card < model.waste.length; card++) {
                $(span)
                    .addClass(model.waste[card].class)
                    .appendTo(self.wasteSelector + self.lastCard)
            }
        };

        var drawFoundations = function (model) {
            for (var foundation = 0; foundation < model.foundations.length; foundation++) {
                for (var card = 0; card < model.foundations[foundation].length; card++) {
                    $(span)
                        .addClass(model.foundations[foundation][card].class)
                        .attr('data-foundation', foundation)
                        .attr('data-card', card)
                        .appendTo(self.foundationSelector + foundation + self.lastCard);
                }
            }
        };

        var drawPiles = function (model) {
            for (var pile = 0; pile < model.piles.length; pile++) {
                for (var card = 0; card < model.piles[pile].length; card++) {
                    $(span)
                        .attr('data-pile', pile)
                        .attr('data-card', card)
                        .addClass(model.piles[pile][card].class)
                        .appendTo(self.pileSelector + pile + self.lastCard);
                }
            }
        };

        self.draw = function (model) {
            if (self.onDrawStart) {
                self.onDrawStart();
            }

            clearAllCards();

            drawDeck(model);
            drawWaste(model);
            drawFoundations(model);
            drawPiles(model);

            if (self.onDrawEnd) {
                self.onDrawEnd();
            }
        };

        var initializeTable = function (tableSelector) {
            self.tableTopSelector = tableSelector + ' #tableTop';
            self.tableBottomSelector = tableSelector + ' #tableBottom';

            $(tableSelector)
                .append('<div id="tableTop" class="row"></div>')
                .append('<div id="tableBottom" class="row"></div>');
        };

        var cardContainer = function (id) {
            return $(span)
                .attr('id', id)
                .append('&nbsp;')
                .append('<span class="card_None">');
        };

        var initializeTableTop = function (model) {
            self.deckSelector = self.tableTopSelector + ' #deck';
            self.wasteSelector = self.tableTopSelector + ' #waste';
            self.foundationSelector = self.tableTopSelector + ' #foundation';

            $(self.tableTopSelector)
                .append(cardContainer('deck'))
                .append(cardContainer('waste'));

            for (var foundation = 0; foundation < model.foundations.length; foundation++) {
                $(self.tableTopSelector).append(cardContainer('foundation' + foundation));
                $(self.foundationSelector + foundation + self.lastCard).attr('data-foundation', foundation);
            }
        };

        var initializeTableBottom = function (model) {
            self.pileSelector = self.tableBottomSelector + ' #pile';

            for (var pile = 0; pile < model.piles.length; pile++) {
                $(self.tableBottomSelector).append(cardContainer('pile' + pile));
                $(self.pileSelector + pile + self.lastCard).attr('data-pile', pile);
            }
        };

        self.initialize = function (tableSelector, model) {
            initializeTable(tableSelector);
            initializeTableTop(model);
            initializeTableBottom(model);
        };
    };

    ns.Klondike = function () {
        var model = new Model();
        var view = new View();
        var count = 0;

        var dragSource;
        var dragNumber;
        var dragCard;

        var animationCard;
        var animationFrom;
        var animationTo;

        var dragState = function (source, number, card) {
            dragSource = source;
            dragNumber = number;
            dragCard = card;
        }

        var animationState = function (card) {
            if (card) {
                animationCard = '.' + $(card).attr('class');
                animationFrom = $(animationCard).offset();
            }
        };

        var attachDeckHandler = function () {
            $(view.deckSelector).click(function () {
                model.dealWaste();
                view.draw(model);
            });
        }

        var attachWasteHandler = function () {
            if (model.waste.length) {
                $(view.wasteSelector + view.lastCard)
                    .attr('draggable', 'true')
                    .on('dragstart', function (e) {
                        e.stopPropagation();
                        dragState(model.playWaste);
                    })
                    .click(function () {
                        animationState(this);

                        model.playWaste(undefined, undefined, model.destinationAnywhere);
                        view.draw(model);
                    });
            }
        };

        var attachFoundationHandlers = function () {
            for (var foundation = 0; foundation < model.foundations.length; foundation++) {
                $(view.foundationSelector + foundation + view.lastCard)
                    .on('dragover', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    })
                    .on('drop', function (e) {
                        e.stopPropagation();

                        animationState(this);

                        var foundationNumber = this.getAttribute('data-foundation');
                        var cardNumber = this.getAttribute('data-card');

                        dragSource(dragNumber, dragCard, function (cards) {
                            return model.destinationFoundation(foundationNumber, cards);
                        });
                        view.draw(model);
                    });

                if (model.foundations[foundation].length &&
                    model.foundations[foundation].last().visible) {
                    $(view.foundationSelector + foundation + view.lastCard)
                        .attr('draggable', 'true')
                        .on('dragstart', function (e) {
                            e.stopPropagation();

                            var foundationNumber = this.getAttribute('data-foundation');
                            var cardNumber = this.getAttribute('data-card');

                            dragState(model.playFoundation, foundationNumber, cardNumber);
                        })
                        .click(function () {
                            animationState(this);

                            var foundationNumber = this.getAttribute('data-foundation');
                            var cardNumber = this.getAttribute('data-card');

                            model.playFoundation(foundationNumber, cardNumber, model.destinationAnywhere);
                            view.draw(model);
                        });
                }
            }
        };

        var attachPileHandlers = function () {
            for (var pile = 0; pile < model.piles.length; pile++) {
                $(view.pileSelector + pile + view.lastCard)
                    .on('dragover', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    })
                    .on('drop', function (e) {
                        e.stopPropagation();

                        animationState(this);

                        var pileNumber = this.getAttribute('data-pile');
                        var cardNumber = this.getAttribute('data-card');

                        dragSource(dragNumber, dragCard, function (cards) {
                            return model.destinationPile(pileNumber, cards);
                        });
                        view.draw(model);
                    });

                for (var card = 0; card < model.piles[pile].length; card++) {
                    if (model.piles[pile][card].visible) {
                        $(view.pileSelector + pile + ' .' + model.piles[pile][card].class)
                            .attr('draggable', 'true')
                            .on('dragstart', function (e) {
                                e.stopPropagation();

                                var pileNumber = this.getAttribute('data-pile');
                                var cardNumber = this.getAttribute('data-card');

                                dragState(model.playPile, pileNumber, cardNumber);
                            })
                            .click(function () {
                                animationState(this);

                                var pileNumber = this.getAttribute('data-pile');
                                var cardNumber = this.getAttribute('data-card');

                                model.playPile(pileNumber, cardNumber, model.destinationAnywhere);
                                view.draw(model);
                            });
                    }
                }
            }
        };

        var animate = function () {
            animationTo = $(animationCard).offset();

            if (animationCard && animationFrom && animationTo) {
                if (animationFrom.top == animationTo.top &&
                    animationFrom.left == animationTo.left) {
                    return;
                }

                var card = $(animationCard);
                var temp = $(animationCard).clone().appendTo('body');

                temp
                    .css('position', 'absolute')
                    .css('left', animationFrom.left)
                    .css('top', animationFrom.top)
                    .css('zIndex', 1000);

                card.css({ 'display': 'none' });

                temp.animate({ 'top': animationTo.top, 'left': animationTo.left }, 'fast', function () {
                    $(animationCard).css({ 'display': 'inline' });
                    temp.remove();

                    animationCard = undefined;
                    animationFrom = undefined;
                    animationTo = undefined;
                });
            }
        };

        var attachHandlers = function () {
            $('*').off();

            attachDeckHandler();
            attachWasteHandler();

            attachFoundationHandlers();
            attachPileHandlers();

            animate();
        };

        this.start = function (tableSelector) {
            model.initialize();
            model.dealPiles();

            view.initialize(tableSelector, model);
            view.onDrawEnd = attachHandlers;
            view.draw(model);
        }
    };
}(window));