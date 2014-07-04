"use strict";
(function (CL) {
    CL.Hand = function () {
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

    CL.Hand.prototype.toString = function () {
        var str = this
            .cards
            .sort(CL.Card.cardCompare)
            .map(function (card) { return card.value.name + card.suit.value; })
            .join(' ');

        return str + ' ' + this.rank.name;
    };

    CL.Hand.rank = {
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

    CL.Hand.prototype.getHighCard = function () {
        return this
            .cards
            .sort(CL.Card.cardCompare)[this.cards.length - 1];
    };

    CL.Hand.prototype.getRank = function () {
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
            cards = cards.sort(CL.Card.cardCompare);

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
            return hasFlush(cards) && hasStraight(cards) && hand.getHighCard().value.name === CL.Card.value.A.name;
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
        if (cards.length === 0) return CL.Hand.rank.Unknown;
        if (isRoyalFlush(cards)) return CL.Hand.rank.RoyalFlush;
        if (isStraightFlush(cards)) return CL.Hand.rank.StraightFlush;
        if (isFourOfAKind(cards)) return CL.Hand.rank.FourOfAKind;
        if (isFullHouse(cards)) return CL.Hand.rank.FullHouse;
        if (isFlush(cards)) return CL.Hand.rank.Flush;
        if (isStraight(cards)) return CL.Hand.rank.Straight;
        if (isThreeOfAKind(cards)) return CL.Hand.rank.ThreeOfAKind;
        if (isTwoPair(cards)) return CL.Hand.rank.TwoPair;
        if (isPair(cards)) return CL.Hand.rank.Pair;

        return CL.Hand.rank.HighCard;
    };
}(window.CardLibrary = window.CardLibrary || {}));