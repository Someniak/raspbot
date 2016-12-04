$(document).ready(() => {
    let socket = io('http://127.0.0.1:8040');
    let $numberOfConnections = $('#number_of_connections');

    let term = $('#terminal').terminal(function (command, term) {
            term.echo('Hello I\'m raspbot');
    }, {
        greetings: 'RASPBOT COMMAND AND CONQUER!',
        name: 'raspbot',
        height: 400,
        prompt: ''
    });

    socket.on('new-connection', function (data) {
        console.log(data);
        addConnection(JSON.parse(data));
    });
    socket.on('delete-connection', function (data) {
        console.log(data);
        deleteConnection(JSON.parse(data))
    });
    socket.on('update-connection', function (data) {
        console.log(data);
        updateConnection(JSON.parse(data));
    });
    socket.on('info', function (data) {
        term.echo(JSON.parse(data));
    });

    let addConnection = function (data) {
        $('#connections tr:last').after(getConnectionHtml(data));
        changeNumberOfConnections(1);
    };
    let deleteConnection = function (data) {
        $('tr[data-connection-id=' + data.id + ']').empty();
        changeNumberOfConnections(-1);
    };
    let updateConnection = function (data) {
        console.log(data);
        let element = $('tr[data-connection-id=' + data.id + ']').replaceWith(getConnectionHtml(data));
    };
    let changeNumberOfConnections = function (delta) {
        let currentNumber = parseInt($numberOfConnections.text(), 10);
        console.log(currentNumber);
        $numberOfConnections.text(currentNumber + delta);
    };
    let getConnectionHtml = function (data) {
        return `
             <tr data-connection-id="${data.id}">
                <td>${data.id}</td>
                <td>${data.name}</td>
                <td>${data.ip}</td>
                <td>${data.port}</td>
                <td><a href="/control/${data.id}" class="btn btn-success btn-xs">CONTROL</a></td>
            </tr>`
    };

});