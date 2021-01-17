const $ = require('jquery');


//address added to addressBar
$(document).on("click",".cell", function () {
    console.log(this);
    let row = $(this).attr('r-id');
    let col = Number($(this).attr('c-id')) + Number(65);
    let res = String.fromCharCode(col);
    $('.addressBar').val(res+row);
});


//add formula
$(document).on("change", ".input-formula", function() {
    let c = $('.input-formula').val();
    console.log(c);
})
