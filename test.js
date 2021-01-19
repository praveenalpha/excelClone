
function getRowIDColID(element){
    let row = element.charCodeAt(0) - 65;
    let col = element.charCodeAt(1) - 49;
    // let arr = [1,2,3,4];
    let x = 10;
    let y = 20;
    let z = eval('( x + y )');
    return {
        row:10,
        col:20
    }
}
let{col,row} = getRowIDColID("A1");
let a = row;
let b = col;
let x = getRowIDColID("A1");
console.log(x.row,x.col);

