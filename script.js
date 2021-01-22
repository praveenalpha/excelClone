let $ = require("jquery");
let fs = require("fs");
let dialog = require("electron").remote.dialog;

$(document).ready(function () {
  let db; //database
  let lsc; //last selected column

  //DOM Functions=========================================================================

  $("#new").on("click", function () {
    console.log("clicked on new.");
    db = [];
    let allRows = $("#cells").find(".row");
    for (let i = 0; i < allRows.length; i++) {
      let row = [];
      let allCols = $(allRows[i]).find(".cell");
      for (let j = 0; j < allCols.length; j++) {
        let name = String.fromCharCode(j + 65) + (i + 1);
        let cellObject = {
          name: name,
          value: "",
          formula: "",
          parents: [],
          childs: [],
          leftColHeight: 18,
          fontStyle: { bold: false, underline: false, italic: false },
          fontFamily: "Times New Roman",
          textcolor: "black",
          textAlignment: { left: false, center: true, right: false },
          fontsize: "16px",
          background: "white",
        };

        row.push(cellObject);
        $(allCols[j]).html("");
        $(allCols[j]).css("font-weight", "normal");
        $(allCols[j]).css("text-decoration", "none");
        $(allCols[j]).css("font-style", "normal");
        $(allCols[j]).css("text-alignment", "center");
        $(allCols[j]).css("font-family", "Times New Roman");
        $(allCols[j]).css("font-color", "black");
        $(allCols[j]).css("background-color", "white");
      }
      db.push(row);
    }
    //reset heights of left cells
    let leftCols = $("#left-col .left-cell");
    for (let i = 0; i < leftCols.length; i++) {
      $(leftCols[i]).height("18.4");
    }
    $("#address").val("");
    $("#formula-input").val("");

    // let defaultFontFamily = "Times New Roman";
    // let mySelect = document.getElementById("font");
    // mySelect.selectedIndex;

    // for (let i, j = 0; (i = mySelect.options[j]); j++) {
    //   if (i.value == "Times New Roman") {
    //     mySelect.selectedIndex = j;
    //     break;
    //   }
    // }
  });
  $("#open").on("click", function () {
    console.log("clicked on open.");

    let paths = dialog.showOpenDialogSync();
    let path = paths[0];
    let data = fs.readFileSync(path);
    data = JSON.parse(data);
    db = data;
    console.log(db);

    let allRows = $("#cells").find(".row");
    let leftCols = $("#left-col .left-cell");
    for (let i = 0; i < allRows.length; i++) {
      let allCellsInARow = $(allRows[i]).find(".cell");
      let maxLeftColHeight = 20;
      for (let j = 0; j < allCellsInARow.length; j++) {
        let {
          value,
          fontStyle,
          textAlignment,
          fontColor,
          fontSize,
          fontFamily,
          leftColHeight,
        } = db[i][j];
        let { bold, underline, italic } = fontStyle;
        $(allCellsInARow[j]).html(value);
        //set fontStyle
        $(allCellsInARow[j]).css("font-weight", bold ? "bold" : "normal");
        $(allCellsInARow[j]).css(
          "text-decoration",
          underline ? "underline" : "none"
        );
        $(allCellsInARow[j]).css("font-style", italic ? "italic" : "normal");

        //set textAlignment
        if (textAlignment.left) {
          $(allCellsInARow[j]).css("text-align", "left");
        } else if (textAlignment.right) {
          $(allCellsInARow[j]).css("text-align", "right");
        } else {
          $(allCellsInARow[j]).css("text-align", "center");
        }

        //set fontColor

        //set fontSize

        //set fontFamily
        $(allCellsInARow[j]).css("font-family", fontFamily);

        //find max left column height
        if (leftColHeight > maxLeftColHeight) {
          maxLeftColHeight = leftColHeight;
        }
      }

      //set left column height
      $(leftCols[i]).height(maxLeftColHeight);
    }
  });
  $("#save").on("click", function () {
    console.log("clicked on save.");
    console.log(db);
    let path = dialog.showSaveDialogSync();
    console.log(path);
    let data = JSON.stringify(db);
    fs.writeFileSync(path, data);
    alert("File Saved");
  });

  //Home Menu Options==============================================================
  // bold / underline / italic
  $("#bold").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { fontStyle } = cellObject;
    $(lsc).css("font-weight", fontStyle.bold ? "normal" : "bold");
    fontStyle.bold = !fontStyle.bold;
  });
  $("#underline").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { fontStyle } = cellObject;
    $(lsc).css("text-decoration", fontStyle.underline ? "none" : "underline");
    fontStyle.underline = !fontStyle.underline;
  });
  $("#italic").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { fontStyle } = cellObject;
    $(lsc).css("font-style", fontStyle.italic ? "normal" : "italic");
    fontStyle.italic = !fontStyle.italic;
  });

  //text alignment
  $("#left").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { textAlignment } = cellObject;
    $(lsc).css("text-align", "left");
    textAlignment.left = true;
    textAlignment.center = false;
    textAlignment.right = false;
  });
  $("#center").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { textAlignment } = cellObject;
    $(lsc).css("text-align", "center");
    textAlignment.left = false;
    textAlignment.center = true;
    textAlignment.right = false;
  });
  $("#right").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { textAlignment } = cellObject;
    $(lsc).css("text-align", "right");
    textAlignment.left = false;
    textAlignment.center = false;
    textAlignment.right = true;
  });

  //font family
  $("#font").on("click", function () {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObject = db[rowID][colID];
    let { fontFamily } = cellObject;
    let selectedFont = $("#font").children("option").filter(":selected").text();
    $(lsc).css("font-family", selectedFont);
    cellObject.fontFamily = selectedFont;
    // console.log(cellObject.fontFamily);
  });

  //Content Scrolling
  $(".content").on("scroll", function () {
    //find the distance from top and left while scrolling
    let topOffset = $(this).scrollTop();
    let leftOffset = $(this).scrollLeft();
    //change top and left of top row and left col
    $("#top-row , #top-left-cell").css("top", topOffset + "px");
    $("#left-col , #top-left-cell").css("left", leftOffset + "px");
  });

  //change height of left cell in UI
  $("#cells #cell").on("keyup", function () {
    // get the current height of cell
    let ht = $(this).height();
    //get row id of its corresponding left cell
    let leftCellId = $(this).attr("r-id");
    //get that left cell from the UI
    let allLeftCells = $("#left-col .left-cell");
    let leftCell = allLeftCells[leftCellId];
    //make the height of left cell same
    $(leftCell).height(ht);
    //update left cell height in db
    let { rowID, colID } = getRowIdColId(this);
    let cellObj = db[rowID][colID];
    cellObj.leftColHeight = ht;
  });

  // Toggle between file and menu options
  $(".menu-container div").on("click", function () {
    let id = $(this).attr("id");
    //id = file
    $(".file-menu-options").removeClass("active");
    $(".home-menu-options").removeClass("active");
    $('#file').removeClass("selected-menu");
    $('#home').removeClass("selected-menu");
    $('#view').removeClass("selected-menu");
    $('#help').removeClass("selected-menu");
    $(`.${id}`).addClass("selected-menu");
    $(`.${id}-menu-options`).addClass("active");
    // if (id == "file") $(`.file-menu-options`).addClass("active");

    // console.log(`.${id}-menu-options`);
  });

  //Formula Bar Functions==================================================================
  $("#cells #cell").on("click", function () {
    let { rowID, colID } = getRowIdColId(this);
    $(`.top-cell[id=top-row-${colID}]`).addClass("row-col-highlighter");
    $(`.left-cell[id=left-cell-${rowID+1}]`).addClass("row-col-highlighter");
    
    //form the address
    let address = String.fromCharCode(colID + 65) + (rowID + 1);
    let formula = db[rowID][colID].formula;

    console.log(address);

    //display address and formula in formula bar
    $("#address").val(address);
    $("#formula-input").val(formula);
  });
  $("#cells #cell").on("blur", function () {
    // set last selected cell to this
    lsc = this;

    // value from the UI cell
    let value = $(this).text();
    // rowId and colId of cell
    let { rowID, colID } = getRowIdColId(this);
    $(`.top-cell[id=top-row-${colID}]`).removeClass("row-col-highlighter");
    $(`.left-cell[id=left-cell-${rowID+1}]`).removeClass("row-col-highlighter");
    
    if (value != db[rowID][colID].value) {
      if (db[rowID][colID].formula) {
        removeFormula();
        $("#formula-input").val("");
      }

      // update cellobject value in db
      db[rowID][colID].value = value;
      let cellObject = db[rowID][colID];
      updateChildren(cellObject);
    }
  });
  $("#formula-input").on("blur", function () {
    let formula = $(this).val();
    if (formula) {
      let { rowID, colID } = getRowIdColId(lsc);
      let cellObject = db[rowID][colID];
      let dbFormula = db[rowID][colID].formula;
      // dbFormula = ? " " , "akjsdbha";
      if (dbFormula != formula) {
        if (dbFormula) {
          removeFormula();
        }
        addFormula(formula);
        updateChildren(cellObject);
      }
    }
    console.log(db);
  });

  //Functions=============================================================================
  function removeFormula() {
    // update value , formula , parents
    // loop on parents
    // remove yourself from parents childrens
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObj = db[rowID][colID];
    let toBeRemoved = cellObj.name;
    let parents = cellObj.parents;
    for (let i = 0; i < parents.length; i++) {
      //["A1" , "A2"]
      let { rowID, colID } = getRowAndColFromAddress(parents[i]);
      let parentCellObject = db[rowID][colID];
      let childs = parentCellObject.childs;
      let filteredArray = childs.filter(function (elem) {
        return elem != toBeRemoved;
      });
      parentCellObject.childs = filteredArray;
    }
    cellObj.value = "";
    cellObj.formula = "";
    cellObj.parents = [];
  }
  function updateChildren(cellObject) {
    for (let i = 0; i < cellObject.childs.length; i++) {
      let childName = cellObject.childs[i];
      let { rowID, colID } = getRowAndColFromAddress(childName);
      let childObject = db[rowID][colID];
      let newVal = solveFormula(childObject.formula);
      childObject.value = newVal;
      $(`#cells #cell[r-id=${rowID}][c-id=${colID}]`).html(newVal);
      updateChildren(childObject);
    }
  }
  function getParents(formula) {
    let parents = [];
    // formula => ( A1 + A2 )
    let splitedFormula = formula.split(" ");
    //["(" , "A1" , "+" , "A2" , ")"]
    for (let i = 0; i < splitedFormula.length; i++) {
      let fComp = splitedFormula[i];
      let character = fComp[0];
      if (character >= "A" && character <= "Z") {
        parents.push(fComp);
      }
    }
    return parents;
  }
  function addSelfToChildsOfParents(cellObj) {
    for (let i = 0; i < cellObj.parents.length; i++) {
      let addressOfParent = cellObj.parents[i];
      //A1 => (0,0)
      let { rowID, colID } = getRowAndColFromAddress(addressOfParent);
      let parentCellObj = db[rowID][colID];
      parentCellObj.childs.push(cellObj.name);
    }
  }
  function addFormula(formula) {
    let { rowID, colID } = getRowIdColId(lsc);
    let cellObj = db[rowID][colID];

    //Cycle Detection
    if (checkCycle(cellObj, formula)) {
      console.log("Cycle Detected");
      alert("Cycle Detected!");
      return;
    } else {
      console.log("No Cycle");
    }

    //update cellobject formula with this formula
    cellObj.formula = formula;
    //update parents of cellobject
    let parents = getParents(formula);
    for (let i = 0; i < parents.length; i++) {
      cellObj.parents.push(parents[i]);
    }
    //goto parent cell object and add self to their childs array
    addSelfToChildsOfParents(cellObj);

    //set value in db as well as ui
    let value = solveFormula(formula);
    cellObj.value = value;
    $(lsc).html(value);
  }
  function solveFormula(formula) {
    let splitedFormula = formula.split(" ");
    for (let i = 0; i < splitedFormula.length; i++) {
      let fComp = splitedFormula[i];
      let character = fComp[0];
      if (character >= "A" && character <= "Z") {
        let { rowID, colID } = getRowAndColFromAddress(fComp);
        let value = db[rowID][colID].value;
        // console.log(value);
        formula = formula.replace(fComp, value);
        // console.log(formula);
      }
    }
    // console.log(formula);
    let val = eval(formula);
    return val;
  }

  //Cycle Detection
  function checkCycle(cellObj, formula) {
    //add all my parents i.e. the cells given in formula in the visited array
    let vis = [];
    let myParents = getParents(formula);
    myParents.map((parent) => vis.push(parent));

    //check if the current cell is forming the cycle with itself
    for (let i = 0; i < myParents.length; i++) {
      if (myParents[i] == cellObj.name) return true;
    }

    //check for all its children
    return detectCycle(cellObj, vis);
  }
  function detectCycle(cellObj, vis) {
    let childArray = cellObj.childs;
    vis.push(cellObj.name);

    let res = false;

    for (let i = 0; i < childArray.length; i++) {
      let childName = childArray[i];
      let { rowID, colID } = getRowAndColFromAddress(childName);
      let childObj = db[rowID][colID];
      if (vis.includes(childName)) return true;
      else {
        res = res || detectCycle(childObj, vis);
      }
    }

    vis.filter((name) => {
      return name != cellObj.name;
    });

    return res;
  }

  // Utility Functions====================================================================
  //return rowId and colId from attributes
  function getRowIdColId(elem) {
    let rowId = Number($(elem).attr("r-id"));
    let colId = Number($(elem).attr("c-id"));
    return {
      rowID: rowId,
      colID: colId,
    };
  }
  //function to get row and col index from address(string)
  function getRowAndColFromAddress(address) {
    let colId = address.charCodeAt(0) - 65;
    let rowId = address[1] - 1;
    return {
      rowID: rowId,
      colID: colId,
    };
  }

  //cell size -> done
  $("#size").on("click", function () {
    let cellobject = getcellobject(lsc);
    let currsize = $("#size").children("option").filter(":selected").text();
    $(lsc).css("font-size", `${currsize}px`);
    cellobject.fontsize = `${currsize}px`;
  });

  //text color -> done
  $("#cell-background").on("click", function () {
    let cellobject = getcellobject(lsc);
    // console.log("hi");
    let currcolor = $("#cell-background").val();
    // let currcolor = $("#cell-background").children("option").filter(":selected").text();
    $(lsc).css("background-color", currcolor);
    cellobject.background = `${currcolor}`;
  });
  $("#cell-text").on("click", function () {
    let cellobject = getcellobject(lsc);
    let currtextcolor = $("#cell-text").val();
    // let currtextcolor = $("#cell-text").children("option").filter(":selected").text();
    $(lsc).css("color", currtextcolor);
    cellobject.textcolor = `${currtextcolor}`;
  });

  //function to get cell object from db using address
  function getcellobject(elem) {
    let rowid = Number($(elem).attr("r-id"));
    let colid = Number($(elem).attr("c-id"));
    let cellobject = db[rowid][colid];
    return cellobject;
  }

  //make local database
  function init() {
    $("#new").trigger("click");
  }
  init();
});
