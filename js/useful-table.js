/*
 * Utils Functions and Methods
 */

 Object.prototype.getKeyByValue = function( value ) {
    for( var prop in this ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[ prop ] === value )
                 return prop;
        }
    }
    return null;
};

 Object.prototype.getAllOwnProperties = function() {
 	var ret = [];

    for( var prop in this ) 
        if( this.hasOwnProperty( prop ) ) 
             ret.push(prop); 
        
    return ret;
};



function quickSortStruct(arr,key,desc,fnSort){
  
  if (arr.length === 0) return [];

  if(!fnSort){
  	var strDesc = function(a, b) { return a.toLowerCase() < b.toLowerCase(); };
  	var strAsc =  function(a, b) { return a.toLowerCase() > b.toLowerCase(); };
  	var nbDesc = function(a, b)  { return a < b; };
  	var nbAsc = function(a, b)   { return a > b; };

  	 fnSort = typeof arr[0][key] == "string" ? (desc ? strDesc : strAsc) : (desc ? nbDesc : nbAsc);
  }

  var left = [], 
     right = [], 
     pivot = arr[0];

  for (var i = 1; i < arr.length; i++)
  	if (fnSort(arr[i][key], pivot[key]))
    	right.push(arr[i]);
    else 
    	left.push(arr[i]);

  return quickSortStruct(left,key,desc,fnSort).concat(pivot, quickSortStruct(right,key,desc,fnSort));
};

/*
 * Constraints
 */
var GobalTabConstraint = {
	constraint : {
		nullable : true,
		empty    : true,
		type     : "string"
	},
	option : {
		editable : true,
		visible  : true,
		order    : ""
	}
};

GobalTabConstraint.type = function(cell,head){
	if(head == "integer")
		return cell === parseInt(cell,10);
	if(head == "number")
		return typeof cell == "number";
	if(head == "boolean")
		return typeof cell == "boolean";

	return true; 
};

GobalTabConstraint.nullable = function(cell,canNull){
	return canNull || cell != null;
};

GobalTabConstraint.empty = function(cell,canEmpty){
	return canEmpty || cell != "";
};

GobalTabConstraint.isValidCell = function(headCell,cell){
	var props = this.constraint.getAllOwnProperties();
	for(var i = 0 ; i < props.length ; i++)
		if(!this[props[i]](cell,headCell[props[i]]))
			return false;

	return true;
};

GobalTabConstraint.validInput = function(headCell,cell) {
	if(headCell.type == "integer")
		return cell.match("^[0-9]*$");
	if(headCell.type == "number")
		return !isNaN(cell);

	return true;
};

GobalTabConstraint.validInputModification = function(headCell,cell){
	return this.empty(cell,headCell.empty) 
		&& this.validInput(headCell,cell);
};

GobalTabConstraint.isValidRow = function(header,row){
	if(typeof row != "object") 
		return false;

	var propsHeader = header.getAllOwnProperties();
	for(var i = 0 ; i < propsHeader.length ; i++)
		if(!this.isValidCell(header[propsHeader[i]],row[propsHeader[i]]) )
			return false;
		else if(row[propsHeader[i]] == null)
			row[propsHeader[i]] = "";

	return true;
};

GobalTabConstraint.fillHeader = function(headCell){
	var propsConstraint = this.constraint.getAllOwnProperties();
	var propsOption = this.option.getAllOwnProperties();

	headCell.err = 0;
	for(var i = 0; i < propsConstraint.length ; i++)
		if(headCell[propsConstraint[i]] == null)
			headCell[propsConstraint[i]] = this.constraint[propsConstraint[i]];

	for(var i = 0; i < propsOption.length ; i++)
		if(headCell[propsOption[i]] == null)
			headCell[propsOption[i]] = this.option[propsOption[i]];
};



/*
 * Table
 */
function UsefulTable(divId,delBtn){
	this.header = {};
 	this.rows = [];
 	this.displayRows = [];
 	this.clickedElement = null;
 	this.events = {};
 	this.delButton = !!delBtn;

 	this.tabElement = document.getElementById(divId);
 	this.tabElement.className = "useful-table";
}



//HEADER
UsefulTable.prototype.setHeader = function(header){
	this.header = header;
	var propsHeader = header.getAllOwnProperties();
	
	for(var i = 0 ; i < propsHeader.length ; i++)
		GobalTabConstraint.fillHeader(header[propsHeader[i]]);

	this.setHeadElement();
};

UsefulTable.prototype.setHeadElement = function () {
	var headerElement = this.tabElement.children[0] || document.createElement('div');
	var propsHeader = this.header.getAllOwnProperties();

	headerElement.className = "useful-row useful-header";

	for(var i = 0 ; i < propsHeader.length; i++){
		if(!this.header[propsHeader[i]].visible) 
			continue;

		var self = this;
		var cellElement = document.createElement('div');
		cellElement.className = "useful-cell";
		cellElement.appendChild(document.createTextNode(propsHeader[i]));
		
		cellElement.addEventListener("click",function () {
			self.orderBy(this);
		});

		headerElement.appendChild(cellElement);
	}

	if(this.delButton){
		var cellDelete = document.createElement('div');

		cellDelete.className = "useful-cell delcell";
		cellDelete.appendChild(document.createTextNode(""));
		headerElement.appendChild(cellDelete);
		
	}

	this.tabElement.appendChild(headerElement);
};




//ROW
UsefulTable.prototype.addOneRow = function(row,bef){
	if(GobalTabConstraint.isValidRow(this.header,row)){
		row._usefulerr = {};
		this.rows.push(row);
		this.displayRows.push(row);
		this.addOneRowElement(row);

		return true;
	}
	return false
};

UsefulTable.prototype.addRows = function(rows){
	for(var i  = 0 ; i < rows.length ; i++)
		this.addOneRow(rows[i]);

};

UsefulTable.prototype.addRowsElement = function(rows){
	for(var i  = 0 ; i < rows.length ; i++)
		this.addOneRowElement(rows[i]);
};

UsefulTable.prototype.addOneRowElement = function(row,before){
	var propsHeader = this.header.getAllOwnProperties();

	var rowElement = document.createElement('div');
	rowElement.className = 'useful-row';

	for(var i = 0 ; i < propsHeader.length ; i++){
		var prop = this.header[propsHeader[i]];
		if(!prop.visible)
			continue;
		
		var cellElement = document.createElement('div');
	
		if(prop.type == "boolean")
			cellElement.appendChild(this.generateCheckBox(row,propsHeader[i]));
		else if(prop.editable)
			cellElement.appendChild(this.generateInputText(row,propsHeader[i]));
		else
			cellElement.appendChild(this.generateText(row[propsHeader[i]]));

		cellElement.className = row._usefulerr[propsHeader[i]] ? "useful-cell useful-err" : "useful-cell" ;
		rowElement.appendChild(cellElement);

	}

	if(this.delButton)
		rowElement.appendChild(this.generateDelButton());

	if(before)
		this.tabElement.insertBefore(rowElement,this.tabElement.children[before]);
	else 
		this.tabElement.appendChild(rowElement);
		
	return rowElement;
};

UsefulTable.prototype.generateCheckBox = function(row,key){
	var labelElement = document.createElement('label');
	var spanElement  = document.createElement('span');

	spanElement.className = "useful-icon";

	var cbElement = document.createElement('input');

	cbElement.className = "useful-checkbox";
	cbElement.type      = "checkbox";
	cbElement.checked   = row[key];
	cbElement.disabled  = !this.header[key].editable;

	var self = this;
	if(this.header[key].editable){
		cbElement.addEventListener("click",function(){

			var lastValue = cbElement.checked;
			row[key] = lastValue;

			if(self.events.modification)
				self.events.modification(true,row,key,!lastValue);
		});
	}

	labelElement.appendChild(cbElement);
	labelElement.appendChild(spanElement);

	return labelElement;
};

UsefulTable.prototype.generateInputText = function(row,key){
	var inpElement = document.createElement('input');

	inpElement.type  = "text";
	inpElement.value = row[key];

	var self = this;
	inpElement.addEventListener("blur",function(){

		if(GobalTabConstraint.validInputModification(self.header[key],inpElement.value))
			var val = self.header[key].type == "number" || self.header[key].type == "integer" ? parseFloat(inpElement.value) : inpElement.value;
		
		var lastValue = row[key];
		row[key] = val || inpElement.value;

		var isErr = val == null;

		if(row._usefulerr[key] && !isErr)
			self.header[key].err--;
		else if(!row._usefulerr[key] && isErr)
			self.header[key].err++;


		row._usefulerr[key] = isErr ? true : null;

		inpElement.parentNode.className = isErr ? "useful-cell useful-err" : "useful-cell";
		if(self.events.modification && lastValue != row[key])
			self.events.modification( val != null,row,key,lastValue);

	});

	return inpElement;
};

UsefulTable.prototype.generateText = function(txt){
	var spanElement = document.createElement('div');

	spanElement.appendChild(document.createTextNode(txt));

	return spanElement;
};


UsefulTable.prototype.generateDelButton = function(){
	var cellElement = document.createElement('div');
	var iconElement = document.createElement('i');
	var self = this;

	iconElement.className = "fa fa-times-circle";
	cellElement.className = "useful-cell delcell";

	cellElement.appendChild(iconElement);

	cellElement.addEventListener("click",function () {
		self.innerRemove(this);
	});

	return cellElement;
};

UsefulTable.prototype.orderBy = function(cellElement){

	var key = this.findHeadById(this.indexCellHead(cellElement));
	
	if(this.header[key].err)
		return;

	this.switchOrder(this.header[key]);
	this.orderIcon(cellElement,this.header[key].order);
	
	var order = this.header[key].order;
	var propsHeader = this.header.getAllOwnProperties();
	this.displayRows = [];

	for(var i = 0 ; i <  propsHeader.length ; i ++)
		if(propsHeader[i] != key)
			this.header[propsHeader[i]].order = "";
	
		
	for(var i = 0; i < this.rows.length ;i++)
		this.displayRows[i] = this.rows[i];
	
	this.removeAllRowElement();

	if(order != ""){
		this.displayRows = quickSortStruct(this.displayRows,key,order == "asc");
		this.addRowsElement(this.displayRows);
	} else {
		this.addRowsElement(this.rows);
	}

};


UsefulTable.prototype.indexCellHead = function(cell){
	if(this.tabElement.children.length < 1)
		return;

	var rowH = this.tabElement.children[0];

	for(var i in  rowH.children)
		if(cell == rowH.children[i])
			return i;

	return -1;
};


UsefulTable.prototype.findIndexByRowElement = function(row){
	for(var i = 0 ; i < this.tabElement.children.length ;i++)
		if(row == this.tabElement.children[i])
			return i;

	return -1;
};


UsefulTable.prototype.findHeadById =function (id) {
	var index = -1;
	for(var i in this.header)
		if(this.header[i].visible)
			if(++index == id)
				return i;
	
	return null;
};	

UsefulTable.prototype.orderIcon = function(cellElement,typeOrder){
	var rowElement = cellElement.parentNode;

	for(var i = 0 ; i < rowElement.childNodes.length ; i++){

		if(rowElement.childNodes[i].className == "useful-cell delcell")
			continue;

		rowElement.childNodes[i].className = "useful-cell";
	}

	cellElement.className = "useful-cell " + typeOrder;
};

//REMOVE
UsefulTable.prototype.removeAllRowElement = function(){
	while( this.tabElement.children.length  > 1)
		this.tabElement.removeChild(this.tabElement.children[1]);
};

UsefulTable.prototype.removeRow = function(index){
	var rowsIndex = this.rows.getKeyByValue(this.displayRows[index]);
	
	if(rowsIndex == null)
		return;

	var key = this.displayRows[index]._usefulerr;
	var propsKey = key.getAllOwnProperties();

	for(var i = 0; i < propsKey.length ;i++)
		if(key[propsKey[i]])
			this.header[propsKey[i]].err--;
	
	this.rows.splice(rowsIndex,1);
	this.displayRows.splice(index,1);
	this.removeRowElement(index);

};

UsefulTable.prototype.removeRowElement = function(index){
	this.tabElement.removeChild(this.tabElement.children[index+1]);
};

UsefulTable.prototype.getRow = function(index){
	return index > this.displayRows.length ? null : this.displayRows[index];
};


UsefulTable.prototype.innerRemove = function (cellElement) {
	var i = this.findIndexByRowElement(cellElement.parentNode)-1;
	if(i == -1)
		return;

	if(this.events.remove)
		this.events.remove(this.rows[i]);

	this.removeRow(i);
};

//UPDATE
UsefulTable.prototype.updateRow = function(row,index){
	if(GobalTabConstraint.isValidRow(this.header,row)){
	
		var rowsIndex = this.rows.getKeyByValue(this.displayRows[index]);
		var key = this.displayRows[index]._usefulerr;
		var propsKey = key.getAllOwnProperties();

		for(var i = 0; i < propsKey.length ;i++)
			this.header[propsKey[i]].err--;
			
		row._usefulerr = {};
		this.rows[rowsIndex] = row;
		this.displayRows[index] = row;
		this.addOneRowElement(row,index+1);
		this.removeRowElement(index+1);

		return true;
	}
	return false;
};

//EVENT
UsefulTable.prototype.listenModification = function(cb){
	this.events.modification = cb;
};

UsefulTable.prototype.listenRemove = function(cb){
	this.events.remove = cb;
};

UsefulTable.prototype.switchOrder = function(headCell){
	switch(headCell.order){
		case "":
			headCell.order = "asc"
			break;
		case "asc" :
			headCell.order = "desc"	
			break;
		default:
			headCell.order = ""
			break;
	}
};

