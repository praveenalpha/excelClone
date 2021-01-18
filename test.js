
function getRowIDColID(element){
    let row = element.charCodeAt(0) - 65;
    let col = element.charCodeAt(1) - 49;
    // let arr = [1,2,3,4];
    console.log(row,col);
}
getRowIDColID("A1");

