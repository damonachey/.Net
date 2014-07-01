QUnit.module('Hand Tests');
QUnit.test('Constructor', function (assert) {
    assert.ok(new CardLibrary.Hand());
});

QUnit.test('empty', function (assert) {
    assert.ok(new CardLibrary.Hand().cards.length === 0);
});

QUnit.test('cards immutable', function (assert) {
    var hand = new CardLibrary.Hand();
    var cards = hand.cards;
    cards.push(null);

    assert.ok(hand.cards.length === 0);
});

QUnit.test('rank', function (assert) {
    assert.ok(Object.keys(CardLibrary.Hand.rank).length === 11);
});

QUnit.test('default rank', function (assert) {
    assert.ok(CardLibrary.Hand.rank.Unknown === new CardLibrary.Hand().rank);
});

QUnit.test('add', function (assert) {
    var hand = new CardLibrary.Hand();

    hand.add(null);
    assert.ok(hand.cards.length === 1);
    hand.add(null);
    assert.ok(hand.cards.length === 2);
    hand.add(null);
    assert.ok(hand.cards.length === 3);

    var max = 100;
    for (var i = 4; i <= max; i++) {
        hand.add(null);
    }

    assert.ok(hand.cards.length === max);
});

QUnit.test('rank RoyalFlush', function (assert) {
    var hand = new CardLibrary.Hand();

    hand.add(new CardLibrary.Card('T', CardLibrary.Card.suit.Spade));
    hand.add(new CardLibrary.Card('J', CardLibrary.Card.suit.Spade));
    hand.add(new CardLibrary.Card('Q', CardLibrary.Card.suit.Spade));
    hand.add(new CardLibrary.Card('K', CardLibrary.Card.suit.Spade));
    hand.add(new CardLibrary.Card('A', CardLibrary.Card.suit.Spade));

    assert.ok(hand.rank === CardLibrary.Hand.rank.RoyalFlush);
});

QUnit.test('toString', function (assert) {
    var hand = new CardLibrary.Hand();

    hand.add(new CardLibrary.Card('5', CardLibrary.Card.suit.Heart));
    hand.add(new CardLibrary.Card('9', CardLibrary.Card.suit.Spade));
    hand.add(new CardLibrary.Card('7', CardLibrary.Card.suit.Diamond));
    hand.add(new CardLibrary.Card('6', CardLibrary.Card.suit.Club));
    hand.add(new CardLibrary.Card('8', CardLibrary.Card.suit.Spade));

    var handStr = hand.toString();

    assert.ok(handStr === '5H 6C 7D 8S 9S Straight');
});

QUnit.test('getHighCard', function (assert) {
    var hand = new CardLibrary.Hand();

    hand.add(new CardLibrary.Card('5', CardLibrary.Card.suit.Heart));
    hand.add(new CardLibrary.Card('9', CardLibrary.Card.suit.Spade));
    hand.add(new CardLibrary.Card('7', CardLibrary.Card.suit.Diamond));
    hand.add(new CardLibrary.Card('6', CardLibrary.Card.suit.Club));
    hand.add(new CardLibrary.Card('8', CardLibrary.Card.suit.Spade));

    var card = hand.getHighCard();

    assert.ok(card.value.name === CardLibrary.Card.value['9'].name);
    assert.ok(card.suit.name === CardLibrary.Card.suit.Spade.name);
});