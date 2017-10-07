var express = require("express"),
    app = express(),
    http = require('http').Server(app),
    io = require('socket.io')(http),
    md5 = require('md5');

app.use("/js", express.static(__dirname + '/js'));
app.use("/css", express.static(__dirname + '/css'));

app.get('/', function(req, res){
    switch (req.accepts(['html', 'json'])) {
        case 'html':
            res.sendFile(__dirname + '/index.html');
            break;
        case 'json':
            res.send(JSON.stringify({
                clients: allClients.reverse()
            }));
            break;
        default:
            res.status(400).send('Bad Request');
            return;
    }
});

var allClients = [];
io.on('connection', function(socket) {
    var client = {
        id : md5(socket.handshake.address),
        ip: socket.handshake.address
    };

    if (allClients.indexOf(client) === -1) {
        console.log('New connection from ' + client.ip);
        allClients.push(client);
        io.sockets.emit('clientconnect', {
            client: client
        });
    } else {
        console.log("already exist");
    }

    socket.on('disconnect', function() {
        var i = allClients.indexOf(client);
        console.log('Got disconnect! ' + client.ip);
        allClients.splice(i, 1);
        io.sockets.emit('clientdisconnect', {
            client: client
        });
    });
});

http.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function paginate (array, page_size, page_number) {
    --page_number; // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}