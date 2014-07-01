QUnit.module('Card Tests');
QUnit.test('Constructor', function (assert) {
    for (var suit in CardLibrary.Card.suit) {
        for (var value in CardLibrary.Card.value) {
            assert.ok(new CardLibrary.Card(value, suit));
        }
    }
});

QUnit.test('Constructor invalid value', function (assert) {
    assert.throws(function () { new CardLibrary('0', CardLibrary.Card.suit.Spade); });
    assert.throws(function () { new CardLibrary('G', CardLibrary.Card.suit.Spade); });
    assert.throws(function () { new CardLibrary('test', CardLibrary.Card.suit.Spade); });
    assert.throws(function () { new CardLibrary(null, CardLibrary.Card.suit.Spade); });
    assert.throws(function () { new CardLibrary(undefined, CardLibrary.Card.suit.Spade); });
});

QUnit.test('Constructor invalid suit', function (assert) {
    assert.throws(function () { new CardLibrary(CardLibrary.Card.value.T, '0'); });
    assert.throws(function () { new CardLibrary(CardLibrary.Card.value.T, 'G'); });
    assert.throws(function () { new CardLibrary(CardLibrary.Card.value.T, 'test'); });
    assert.throws(function () { new CardLibrary(CardLibrary.Card.value.T, null); });
    assert.throws(function () { new CardLibrary(CardLibrary.Card.value.T, undefined); });
});

QUnit.test('card properties', function (assert) {
    var card = new CardLibrary.Card(CardLibrary.Card.value.T, CardLibrary.Card.suit.Diamond);

    assert.ok(CardLibrary.Card.value.T.name === card.value.name);
    assert.ok(CardLibrary.Card.value.T.value === card.value.value);
    assert.ok(CardLibrary.Card.suit.Diamond.name === card.suit.name);
});

QUnit.test('highAce', function (assert) {
    assert.ok(CardLibrary.Card.value.A.value === 14);
    CardLibrary.Card.highAce(false);
    assert.ok(CardLibrary.Card.value.A.value === 1);
    CardLibrary.Card.highAce(true);
    assert.ok(CardLibrary.Card.value.A.value === 14);
});

QUnit.test('Value count', function (assert) {
    assert.ok(Object.keys(CardLibrary.Card.value).length === 13);
});

QUnit.test('Suit count', function (assert) {
    assert.ok(Object.keys(CardLibrary.Card.suit).length === 4);
});

QUnit.test('Special count', function (assert) {
    assert.ok(Object.keys(CardLibrary.Card.special).length === 3);
});

QUnit.test('cardCompare sort', function (assert) {
    var cards = [];

    cards.push(new CardLibrary.Card('5', CardLibrary.Card.suit.Spade));
    cards.push(new CardLibrary.Card('9', CardLibrary.Card.suit.Spade));
    cards.push(new CardLibrary.Card('7', CardLibrary.Card.suit.Spade));
    cards.push(new CardLibrary.Card('6', CardLibrary.Card.suit.Spade));
    cards.push(new CardLibrary.Card('8', CardLibrary.Card.suit.Spade));

    cards.sort(CardLibrary.Card.cardCompare);
    var values = cards.map(function (card) { return card.value.name; }).join('');

    assert.ok(values === '56789');
});