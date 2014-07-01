QUnit.module('Deck Tests');
QUnit.test('Constructor', function (assert) {
    var deck = new CardLibrary.Deck();

    assert.ok(deck.size === 52, 'Passed');
});

QUnit.test('initial order', function (assert) {
    var deck = new CardLibrary.Deck();

    for (var suit in CardLibrary.Card.suit) {
        for (var value in CardLibrary.Card.value) {
            var card = deck.draw();

            assert.ok(card.value.name === value, 'drawn card has wrong value ' + card.value + ' != ' + value);
            assert.ok(card.suit.name === suit, 'drawn card has wrong value ' + card.value + ' != ' + suit);
        }
    }
});

QUnit.test('draw/size', function (assert) {
    var deck = new CardLibrary.Deck();

    for (var i = 1; i <= 52; i++) {
        assert.ok(undefined !== deck.draw());
        assert.ok(deck.size === 52 - i, 'Passed');
    }

    assert.ok(undefined === deck.draw());
    assert.ok(deck.size === 0, 'Passed');
});

QUnit.test('add', function (assert) {
    var deck = new CardLibrary.Deck();

    deck.add(new CardLibrary.Card(CardLibrary.Card.value.A, CardLibrary.Card.suit.Spade));

    assert.ok(deck.size === 53);
});

QUnit.test('shuffle no duplicates', function (assert) {
    var duplicates = 0;
    var expectedDuplicates = 5;
    var deck = new CardLibrary.Deck().shuffle();

    for (var suit in CardLibrary.Card.suit) {
        for (var value in CardLibrary.Card.value) {
            var card = deck.draw();

            if (card.value.name === value && card.suit.name === suit)
                duplicates++;
        }
    }

    assert.ok(duplicates <= expectedDuplicates, 'found ' + duplicates + ' duplicates, expected < ' + expectedDuplicates);
});