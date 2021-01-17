const $ = require('jquery');

$(document).on("click",".cell", function () {
    let row = $(this).attr('r-id');
    let col = Number($(this).attr('c-id')) + Number(65);
    let res = String.fromCharCode(col);
    $('.address').val(res+row);
});
