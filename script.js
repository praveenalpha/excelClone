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
    //on click cell
    $('.cell').click(function(){
        // console.log(db);
        let row = Number($(this).attr('r-id'));
        let col = Number($(this).attr('c-id')) + Number(65);
        let res = String.fromCharCode(col);
        $('.addressBar').val(res+String(row));
        col -= 65;
        lastClickedCell = {row, col};
        if(db[row][col].formula){
            $('.input-formula').val(db[row][col].formula);
        }
        else{
            $('.input-formula').val("");
        }
    })
    //on blur cell
    $('.cell').on('blur', function(){
        let row = $(this).attr('r-id');
        let col = $(this).attr('c-id');
        let value = $(this).text();
        db[row][col].val = value;
        // console.log(db);
    })
    //input formula
    $('.input-formula').blur(function(){
        let formulaValue = $('.input-formula').val();
        if(formulaValue){
            fcomps = formulaValue.split(" ");
            // let ans = fcomps.length;
            // console.log(ans);
            for(let i=0;i<fcomps.length;i++){
                if(fcomps[i].length == 2){
                    let {row , col } = getRowIDColID(fcomps[i]);
                    fcomps[i] = db[row][col].val;
                    console.log(row,col);
                }
            }
            console.log(fcomps);
            
            db[lastClickedCell.row][lastClickedCell.col].formula=formulaValue;

            // console.log(db);
        }
    })
})

function getRowIDColID(element){
    let row = element.charCodeAt(0) - 65;
    let col = element.charCodeAt(1) - 49;
    return {
        row:col,
        col:row
    }
}