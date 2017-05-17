/*
 * Serve content over a socket
 */

module.exports = function(socket) {
  'use strict';

  const clients = [];

  // send the new user their name and a list of users
  socket.emit('init', {
    name: socket.id,
    //users: userNames.get()
  });

  //console.log('Client Connected (id=' + socket.id + ').');
  //clients.push(socket);
  socket.emit('send:name', {
    name: socket.id
  });

  setInterval(function() {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 1000);

  socket.on('message', function (from, msg) {

      console.log('recieved message from',
                  from, 'msg', JSON.stringify(msg));

      console.log('broadcasting message');
      console.log('payload is', msg);
      io.sockets.emit('broadcast', {
        payload: msg,
        source: from
      });
      console.log('broadcast complete');
    });

  //socket.emit('message', {message: 'Socket.IO Inner Chat'});

  // socket.on('send', function(data) {
  //   io.sockets.emit('message', data);
  // });


};
