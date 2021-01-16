const $ = require('jquery');

// $(document).on("click",".cell", function () {
//     var clickedBtnID = $(this).attr('class'); // or var clickedBtnID = this.id
//     alert('you clicked on button #' + clickedBtnID);
//     console.log(this);
// });

$(document).ready(function(){
    console.log("jsjs");
    $('.cell').click( () => {
        console.log(this);
    })    
});