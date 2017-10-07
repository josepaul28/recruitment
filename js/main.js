var socket = io({
    autoConnect: false
});

socket.on('clientconnect', function (data) {
    addIp(data.client);
});

socket.on('clientdisconnect', function (data) {
    removeIP(data.client);
});

$(document).ready(function () {
    init();

    $(this).find("header input#search_field").keyup(function () {
        var filter = $(this).val();
        $("div#sources > div").each(function () {
            if ($(this).find('span').text().search(new RegExp(filter, "i")) < 0) {
                $(this).slideUp();
            } else {
                $(this).slideDown();
            }
        });
    });
});

function init() {
    //get data for first time
    console.log("init");
    $.ajax({
        url: "./",
        dataType: "json"
    }).done(function(data) {
        $.each(data.clients, function (key, client) {
            addIp(client);
        });
        socket.open();
    }).fail(function() {
        alert( "error" );
    });

    $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows'
    });
}

function addIp(client) {
    console.log("addIp");
    $sources = $('#sources');
    if(!$sources.find('div#' + client.id).length) {
        //$p = $("<li>").html(client.ip).attr('id', client.id);
        var $items = $(getMarkupFromData(client));
        $sources.prepend(
            $items
        ).isotope( 'prepended', $items );
    } else {
        console.log("aun esta");
    }
}

function removeIP(client) {
    console.log("removeIP");
    $sources = $('#sources');
    $sources.find('div#' + client.id).remove();
    $sources.isotope('layout')
    //$('#sources').isotope( 'remove', $('#sources').find('div#' + client.id) )
    // layout remaining item elements
    //  .isotope('layout');
}

function getMarkupFromData(client) {
    // https://www.paulirish.com/2009/random-hex-color-code-snippets/
    var randomColor = ('000000' + Math.random().toString(16).slice(2, 8)).slice(-6);
    return [
        '<div id="' + client.id + '" class="grid-item" style="background-color:#' + randomColor + '">',
        '<span>' + client.ip + '</span>',
        '</div>'
    ].join('');
}