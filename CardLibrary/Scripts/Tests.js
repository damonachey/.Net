"use strict";
(function (ns) {
    (function cardTests() {
        var tests = 0;

        (function valuesTest() {
            tests++;
            var expected = 13;
            var length = Object.keys(ns.Card.values).length;

            if (length !== expected)
                throw { message: 'values.length is ' + length + ' and should be ' + expected };
        }());

        (function suitsTest() {
            tests++;
            var expected = 4;
            var length = Object.keys(ns.Card.suits).length;

            if (length !== expected)
                throw { message: 'suits.length is ' + length + ' and should be ' + expected };
        }());

        (function constructorTest() {
            tests++;
            var count = 0;

            for (var suit in ns.Card.suits)
                for (var value in ns.Card.values) {
                    count++;
                    var card = new ns.Card(value, suit);

                    if (!card)
                        throw { message: 'failed creating Card(' + value + ',' + suit + ')' };
                }

            if (count !== Object.keys(ns.Card.suits).length * Object.keys(ns.Card.values).length)
                throw { message: 'only created ' + count + ' cards' };
        }());

        (function constructorInvalidValueTest() {
            tests++;
            var count = 0;
            var suit = ns.Card.suits.Spade.name;
            var invalidValues = ['0', 'G', 'test', null, undefined];

            for (var value in invalidValues) {
                try {
                    count++;
                    var card = new ns.Card(invalidValues[value], suit);
                    console.log(card);
                }
                catch (error) {
                    continue;
                }

                throw { message: 'expected to fail Card(' + invalidValues[value] + ',' + suit + ')' };
            }

            if (count != invalidValues.length)
                throw { message: 'only created ' + count + ' cards' };
        }());

        (function constructorInvalidSuitTest() {
            tests++;
            var count = 0;
            var value = ns.Card.values.T.name;
            var invalidSuits = ['0', 'G', 'test', null, undefined];

            for (var suit in invalidSuits) {
                try {
                    count++;
                    var card = new ns.Card(value, invalidSuits[suit]);
                    console.log(card);
                }
                catch (error) {
                    continue;
                }

                throw { message: 'expected to fail Card(' + value + ',' + invalidSuits[suit] + ')' };
            }

            if (count != invalidSuits.length)
                throw { message: 'only created ' + count + ' cards' };
        }());

        (function handCardCompareTest() {
            tests++;

            var cards = [];

            cards.push(new ns.Card('5', ns.Card.suits.Spade));
            cards.push(new ns.Card('9', ns.Card.suits.Spade));
            cards.push(new ns.Card('7', ns.Card.suits.Spade));
            cards.push(new ns.Card('6', ns.Card.suits.Spade));
            cards.push(new ns.Card('8', ns.Card.suits.Spade));

            cards.sort(ns.Card.cardCompare);
            var values = cards.map(function (card) { return card.value.name; }).join('');

            if (values !== '56789')
                throw { message: 'failed sort' };
        }());

        console.log('CardTests passed ' + tests + ' tests');
    }());

    (function deckTests() {
        var tests = 0;

        (function constructorTest() {
            tests++;

            var deck = new ns.Deck();

            if (!deck)
                throw { message: 'failed creating Deck()' };
        }());

        (function drawTest() {
            tests++;

            var deck = new ns.Deck();

            for (var suitName in ns.Card.suits)
                for (var valueName in ns.Card.values) {
                    var card = deck.draw();

                    if (card.value.name !== valueName)
                        throw { message: 'drawn card has wrong value ' + card.value + ' != ' + value };

                    if (card.suit.name !== suitName)
                        throw { message: 'drawn card has wrong suit ' + card.suits + ' != ' + suit };
                }
        }());

        (function shuffleTest() {
            tests++;
            var duplicates = 0;
            var expectedDuplicates = 5;
            var deck = new ns.Deck().shuffle();

            for (var suitName in ns.Card.suits)
                for (var valueName in ns.Card.values) {
                    var card = deck.draw();

                    if (card.value.name === valueName && card.suit.name === suitName)
                        duplicates++;
                }

            if (duplicates > expectedDuplicates)
                throw { message: 'found ' + duplicates + ' duplicates, expected < ' + expectedDuplicates };
        }());

        (function shuffleDistributionTest() {
            tests++;
            var hist = [];

            for (var i = 0; i < 101; i++)
                hist[i] = 0;

            for (var i = 0; i < 1000000; i++)
                hist[Math.floor(Math.random() * (100 + 1))]++;

            for (var i = 0; i < 101; i++)
                if (hist[i] < 9600 || hist[i] > 10400)
                    throw { message: 'possible random error' };
        }());

        console.log('DeckTests passed ' + tests + ' tests');
    }());

    (function handTests() {
        var tests = 0;

        (function constructorTest() {
            tests++;

            var hand = new ns.Hand();

            if (!hand)
                throw { message: 'failed creating Hand()' };
        }());

        (function handEmptyTest() {
            tests++;

            var hand = new ns.Hand();

            if (hand.cards.length)
                throw { message: 'expected empty hand' };
        }());

        (function handRanksTest() {
            tests++;
            var expected = 11;
            var length = Object.keys(ns.Hand.ranks).length;

            if (length !== expected)
                throw { message: 'suits.length is ' + length + ' and should be ' + expected };
        }());

        (function handEmptyRankTest() {
            tests++;

            var hand = new ns.Hand();

            if (hand.rank !== ns.Hand.ranks.Unknown)
                throw { message: 'expected empty hand to have rank of Unknown' };
        }());

        (function handAddTest() {
            tests++;

            var hand = new ns.Hand();

            hand.add(null);
            if (hand.cards.length !== 1)
                throw { message: 'first add failed' };

            hand.add(null);
            if (hand.cards.length !== 2)
                throw { message: 'first add failed' };

            hand.add(null);
            if (hand.cards.length !== 3)
                throw { message: 'first add failed' };

            var max = 100;
            for (var i = 4; i <= max; i++)
                hand.add(null);

            if (hand.cards.length !== max)
                throw { message: 'lots of adds failed' };
        }());

        (function handRankTest() {
            tests++;

            var hand = new ns.Hand();

            hand.add(new ns.Card('T', ns.Card.suits.Spade));
            hand.add(new ns.Card('J', ns.Card.suits.Spade));
            hand.add(new ns.Card('Q', ns.Card.suits.Spade));
            hand.add(new ns.Card('K', ns.Card.suits.Spade));
            hand.add(new ns.Card('A', ns.Card.suits.Spade));

            if (hand.rank !== ns.Hand.ranks.RoyalFlush)
                throw { message: 'rank not correct' };
        }());

        (function handToStringTest() {
            tests++;

            var hand = new ns.Hand();

            hand.add(new ns.Card('5', ns.Card.suits.Heart));
            hand.add(new ns.Card('9', ns.Card.suits.Spade));
            hand.add(new ns.Card('7', ns.Card.suits.Diamond));
            hand.add(new ns.Card('6', ns.Card.suits.Club));
            hand.add(new ns.Card('8', ns.Card.suits.Spade));

            var handStr = hand.toString();

            if (handStr != '5H 6C 7D 8S 9S Straight') {
                console.log(handStr);
                throw { message: 'failed toString' };
            }
        }());

        (function handGetHighCardTest() {
            tests++;

            var hand = new ns.Hand();

            hand.add(new ns.Card('5', ns.Card.suits.Heart));
            hand.add(new ns.Card('9', ns.Card.suits.Spade));
            hand.add(new ns.Card('7', ns.Card.suits.Diamond));
            hand.add(new ns.Card('6', ns.Card.suits.Club));
            hand.add(new ns.Card('8', ns.Card.suits.Spade));

            var card = hand.getHighCard();

            if (card.value.name !== '9' || card.suit.name !== ns.Card.suits.Spade.name)
                throw { message: 'failed getHighCard' };
        }());

        console.log('HandTests passed ' + tests + ' tests');
    }());
}(window.CardLibrary = window.CardLibrary || {}));