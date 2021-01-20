function getRowIDColID(element){
    let row = element.charCodeAt(0) - 65;
    let col = element.charCodeAt(1) - 49;
    return {
        row:col,
        col:row
    }
}


calculateFormula('A1');
















