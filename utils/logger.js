(function(){
    // Save the original method in a private variable
    var _privateLog = console.log;
    // Redefine console.log method with a custom function
    console.log = function (message) {
        var date = new Date();
        var dateString = `${date.toLocaleString()}`;

        var output = `${dateString} :: ${arguments['0']}`;
        _privateLog.call(console, output);
    };
})();
