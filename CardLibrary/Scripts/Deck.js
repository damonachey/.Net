"use strict";
(function (CL) {
    CL.Deck = function () {
        var self = this;
        var cards = [];

        self.shuffle = function () {
            for (var i = cards.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = cards[i];
                cards[i] = cards[j];
                cards[j] = temp;
            }

            return this;
        };

        Object.defineProperty(self, 'size', {
            get: function () {
                return cards.length;
            }
        });

        self.draw = function () {
            return cards.shift();
        };

        self.add = function (card) {
            cards.push(card);
        }

        var initialize = function (cards) {
            for (var suit in CL.Card.suit) {
                for (var value in CL.Card.value) {
                    self.add(new CL.Card(CL.Card.value[value].name, CL.Card.suit[suit].name));
                }
            }

            if (cards.length != 52) {
                throw { message: 'Deck is supposed to have 52 cards but has ' + cards.length + '.' };
            }
        };

        initialize(cards);
    };
}(window.CardLibrary = window.CardLibrary || {}));