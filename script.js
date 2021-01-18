const $ = require('jquery');

//initialise DB
let db=[];
let lastClickedCell = [];
for(let i=0;i<100;i++){
    let row=[];
    for(let j=0;j<26;j++){
        let Name = String.fromCharCode(65+j)+i;
        let obj = {
            name: Name,
            val: "",
            formula: ""
        }
        row.push(obj);
    }
    db.push(row);
}


$(document).ready(function() {
    //address bar
    $('.cell').click(function(){
        // console.log(db);
        let row = Number($(this).attr('r-id'));
        let col = Number($(this).attr('c-id')) + Number(65);
        let res = String.fromCharCode(col);
        $('.addressBar').val(res+String(row));
        col -= 65;
        lastClickedCell = {row, col};
    })
    //input formula
    $('.input-formula').click(function(){
        $('.input-formula').blur(function(){
            let formulaValue = $('.input-formula').val();
            if(formulaValue){
                db[lastClickedCell.row][lastClickedCell.col].formula=formulaValue;
                // console.log(db);
            }
        })
    })
});