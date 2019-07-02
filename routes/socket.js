/*
 * Username Propagation & Dispatch - MrZ
 * Keep track of which names are being used.
 */

var userNames = (function() {
    var names = {};

    var claim = function(name) {
        if (!name || names[name]) {
            return false;
        } else {
            names[name] = true;
            return true;
        }
    };

    // Lookup for the lowest unused "guest" name and claim it
    var getGuestName = function() {
        var name,
            nextUserId = 1;

        do {
            name = 'Guest-' + nextUserId;
            nextUserId += 1;
        } while (!claim(name));

        return name;
    };

    // Serialize claimed names as an @rray for consumption
    var get = function() {
        var res = [];
        for (user in names) {
            res.push(user);
        }

        return res;
    };

    var free = function(name) {
        if (names[name]) {
            delete names[name];
        }
    };

    return {
        claim: claim,
        free: free,
        get: get,
        getGuestName: getGuestName
    };
}());



/*
 * Socket.IO Export Configurations
 */

module.exports = function(socket) {
    'use strict';

    var name = userNames.getGuestName();
    var people = {};
    people[name] = socket.id;

    // send the new user their name and a list of users
    socket.emit('init', {
        name: name,
        users: userNames.get(),
        id: people[name]
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: name,
        id: people[name]
    });

    // broadcast a user's message to other users
    socket.on('send:message', function(data) {
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.message
        });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function(data, fn) {
        if (userNames.claim(data.name)) {
            var oldName = name;
            userNames.free(oldName);

            name = data.name;

            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: name
            });

            fn(true);
        } else {
            fn(false);
        }
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function() {
        socket.broadcast.emit('user:left', {
            name: name,
            id: people[name]
        });
        userNames.free(name);
    });
};