"use strict";
(function (ns) {
    ns.Hand = function () {
        var _cards = [];

        this.add = function (card) {
            _cards.push(card);
        };

        Object.defineProperty(this, 'cards', {
            get: function () {
                return _cards.slice(0);
            }
        });

        Object.defineProperty(this, 'rank', {
            get: function () {
                if (!this._rank)
                    this._rank = this.getRank();

                return this._rank;
            }
        });
    }

    ns.Hand.prototype.toString = function () {
        var str = this
            .cards
            .sort(ns.Card.cardCompare)
            .map(function (card) { return card.value.name + card.suit.value; })
            .join(' ');

        return str + ' ' + this.rank.name;
    };

    ns.Hand.ranks = {
        RoyalFlush: { name: 'RoyalFlush' },
        StraightFlush: { name: 'StraightFlush' },
        FourOfAKind: { name: 'FourOfAKind' },
        FullHouse: { name: 'FullHouse' },
        Flush: { name: 'Flush' },
        Straight: { name: 'Straight' },
        ThreeOfAKind: { name: 'ThreeOfAKind' },
        TwoPair: { name: 'TwoPair' },
        Pair: { name: 'Pair' },
        HighCard: { name: 'HighCard' },
        Unknown: { name: 'Unknown' }
    };

    ns.Hand.prototype.getHighCard = function () {
        return this
            .cards
            .sort(ns.Card.cardCompare)[this.cards.length - 1];
    };

    ns.Hand.prototype.getRank = function () {
        var hand = this;

        var groupCards = function (cards) {
            var group = {};

            for (var card in cards)
                if (cards[card].value.value in group) group[cards[card].value.value]++;
                else group[cards[card].value.value] = 1;

            return group;
        };

        var hasFlush = function (cards) {
            var suit = cards[0].suit;

            for (var card in cards)
                if (cards[card].suit.name !== suit.name)
                    return false;

            return true;
        };

        var hasStraight = function (cards) {
            cards = cards.sort(ns.Card.cardCompare);

            var first = cards[0].value.value;

            for (var i = 0; i < cards.length; i++)
                if (cards[i].value.value - i != first)
                    return false;

            return true;
        };

        var hasNumberOfKind = function (count, cards) {
            var group = groupCards(cards);

            for (var item in group)
                if (group[item] === count)
                    return true;

            return false;
        };

        var hasTwoPair = function (cards) {
            var group = groupCards(cards);
            var pairs = 0;

            for (var item in group)
                if (group[item] === 2)
                    pairs++;

            return pairs === 2;
        };

        var isRoyalFlush = function (cards) {
            return hasFlush(cards) && hasStraight(cards) && hand.getHighCard().value.name === ns.Card.values.A.name;
        };

        var isStraightFlush = function (cards) {
            return hasFlush(cards) && hasStraight(cards);
        };

        var isFourOfAKind = function (cards) {
            return hasNumberOfKind(4, cards);
        };

        var isFullHouse = function (cards) {
            return hasNumberOfKind(3, cards) && hasNumberOfKind(2, cards);
        };

        var isFlush = function (cards) {
            return hasFlush(cards);
        };

        var isStraight = function (cards) {
            return hasStraight(cards);
        };

        var isThreeOfAKind = function (cards) {
            return hasNumberOfKind(3, cards);
        };

        var isTwoPair = function (cards) {
            return hasTwoPair(cards);
        };

        var isPair = function (cards) {
            return hasNumberOfKind(2, cards);
        };

        var cards = hand.cards;
        if (cards.length === 0) return ns.Hand.ranks.Unknown;
        if (isRoyalFlush(cards)) return ns.Hand.ranks.RoyalFlush;
        if (isStraightFlush(cards)) return ns.Hand.ranks.StraightFlush;
        if (isFourOfAKind(cards)) return ns.Hand.ranks.FourOfAKind;
        if (isFullHouse(cards)) return ns.Hand.ranks.FullHouse;
        if (isFlush(cards)) return ns.Hand.ranks.Flush;
        if (isStraight(cards)) return ns.Hand.ranks.Straight;
        if (isThreeOfAKind(cards)) return ns.Hand.ranks.ThreeOfAKind;
        if (isTwoPair(cards)) return ns.Hand.ranks.TwoPair;
        if (isPair(cards)) return ns.Hand.ranks.Pair;

        return ns.Hand.ranks.HighCard;
    };
}(window.CardLibrary = window.CardLibrary || {}));