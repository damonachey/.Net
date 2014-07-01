"use strict";
(function (ns) {
    ns.Deck = function () {
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
            for (var suit in ns.Card.suit) {
                for (var value in ns.Card.value) {
                    self.add(new ns.Card(ns.Card.value[value].name, ns.Card.suit[suit].name));
                }
            }

            if (cards.length != 52) {
                throw { message: 'Deck is supposed to have 52 cards but has ' + cards.length + '.' };
            }
        };

        initialize(cards);
    };
}(window.CardLibrary = window.CardLibrary || {}));