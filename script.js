const $ = require('jquery');

//initialise DB
let db=[];
let lastClickedCell;
for(let i=0;i<100;i++){
    let row=[];
    for(let j=0;j<26;j++){
        let Name = String.fromCharCode(65+j)+i;
        let obj = {
            name: Name,
            val: "",
            formula: "",
            parents: [],
            children:[]
        }
        row.push(obj);
    }
    db.push(row);
}


$(document).ready(function() {
    //on click cell
    $('.cell').click(function(){
        let row = Number($(this).attr('r-id'));
        let col = Number($(this).attr('c-id')) + Number(65);
        let res = String.fromCharCode(col);
        $('.addressBar').val(res+String(row));
        col -= 65;
        lastClickedCell = this;
        if(db[row][col].formula){
            $('.input-formula').val(db[row][col].formula);
        }
        else{
            $('.input-formula').val("");
        }
        // console.log(db);
    })
    //on blur cell
    $('.cell').on('blur', function(){
        let row = $(this).attr('r-id');
        let col = $(this).attr('c-id');
        let value = $(this).text();
        if(value != db[row][col].val){
            if(db[row][col].formula){
                removeFormula();
                $('.input-formula').val("");
            }
            db[row][col].val = value;
            let cellObj = db[row][col];
            updateChildren(cellObj);
        }
    })
    //input formula
    $('.input-formula').blur(function(){
        calculateFormula();
    })
})
function calculateFormula(){
    let formulaValue = $('.input-formula').val();
    let lsc = String.fromCharCode(Number($(lastClickedCell).attr('c-id')) + 65);
    lsc += String(Number($(lastClickedCell).attr('r-id')) + 1);
    if(formulaValue){
        fcomps = formulaValue.split(" ");
        for(let i=0;i<fcomps.length;i++){
            if(fcomps[i].length == 2){
                if(fcomps[i][0] >= 'A' && fcomps[i][0] <= 'Z'){
                    let {row , col } = getRowIDColID(fcomps[i]);
                    let temp = getRowIDColID(lsc);
                    if(!db[row][col].children.includes(lsc)){
                        db[row][col].children.push(lsc);

                    }
                    // console.log(col);
                    if(!db[temp.row][temp.col].parents.includes(fcomps[i])){
                        db[temp.row][temp.col].parents.push(fcomps[i]);

                    }
                    fcomps[i] = db[row][col].val;
                }
            }
        }
        let a = "";
        for(let i=0;i<fcomps.length;i++){
            a+=fcomps[i];
        }
        let z = eval(a);
        let element = "";
        element += String.fromCharCode(Number($(lastClickedCell).attr('c-id')) + 65);
        element += String(Number($(lastClickedCell).attr('r-id')) + 1);
        
        let {row,col} = getRowIDColID(element);
        // console.log(row,col);
        db[row][col].formula=formulaValue;
        db[row][col].val = z;
        $(lastClickedCell).html(z);
    }
}
function updateChildren(cellObject) {
    console.log("inside update children");
    for (let i = 0; i < cellObject.children.length; i++) {
      let childName = cellObject.children[i];
      let { row, col } = getRowIDColID(childName);
      let childObject = db[row][col];
      let newValue = solveFormula(childObject.formula);
      db[row][col].val = newValue;
      $(`.cell[r-id=${row}][c-id=${col}]`).html(newValue);
    //   console.log(db);
      updateChildren(childObject);
    }
  }
function solveFormula(formula) {
    console.log("inside solve formula");
    let splitedFormula = formula.split(" ");
    for (let i = 0; i < splitedFormula.length; i++) {
      let fComp = splitedFormula[i];
      let character = fComp[0];
      if (character >= "A" && character <= "Z") {
        let { row, col } = getRowIDColID(fComp);
        
        let value = db[row][col].val;
        console.log(value);
        formula = formula.replace(fComp, value);
        // console.log(formula);
      }
    }
    let val = eval(formula);
    return val;
}
function removeFormula(){
    let lsc = String.fromCharCode(Number($(lastClickedCell).attr('c-id')) + 65);
    lsc += String(Number($(lastClickedCell).attr('r-id')) + 1);
    let x = getRowIDColID(lsc);
    let cellObj = db[x.row][x.col];
    let toBeRemoved = cellObj.name;
    let parents = cellObj.parents;
    for (let i = 0; i < parents.length; i++) {
      //["A1" , "A2"]
      let y = getRowIDColID(parents[i]);
      let parentCellObject = db[y.row][y.col];
      let childs = parentCellObject.children;
      let filteredArray = childs.filter(function (elem) {
        return elem != toBeRemoved;
      });
      parentCellObject.children = filteredArray;
    }
    cellObj.value = "";
    cellObj.formula = "";
    cellObj.parents = [];
}
function getRowIDColID(element){
    let row = element.charCodeAt(0) - 65;
    let col = element.charCodeAt(1) - 49;
    return {
        row:col,
        col:row
    }
}