"use strict";
(function (ns) {
    if (!Array.prototype.last) {
        Array.prototype.last = function () {
            return this[this.length - 1];
        };
    };

    ns.Socket = function () {
        var self = this;
        var users = {};

        self.initialize = function (user) {
            users.user = [];
        }

        self.send = function (user, data) {
            users[user].push(data);
        }

        self.receive = function (user, data) {
            return users[user].pop();
        }
    }

    ns.MentalPoker = function (user, socket) {
        var self = this;

        self.start = function (container) {
            var cards = ['1', '2', '3', '4', '5'];



        };

        socket.initialize(user);
    };
}(window));