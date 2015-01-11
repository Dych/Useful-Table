Useful Table V1.0
==========

![alt tag](http://git.comput.eu/dex/Flat-Table/raw/master/screen.png)

Description
--------------
Useful Table is a **JavaScript Library** that permits to create a table with many functionalities :

- Possibility to define a header with constraints : nullable ,empty, type(string , number , boolean ..).
- Possibility to Define a header with many options : visible ,editable.
- Possibility to use functions to add/delete/update rows of table.
- Possibility to define functions to listen modifications or/and deletions of datas/rows on the table.
- Possibility to data by Column (asc or desc).
- Alerts when constrains are violated.
- Generate and manage deletion of data if option is enabled.


Dependancy
--------------
- Font Awesome : http://fortawesome.github.io/Font-Awesome/


Initialise Table
==============
```
new UsefulTable(divId,delBtn);
```
- ***divId [string]***:      The id of a div where the table will be build.
- ***delButon [boolean]***:  If you want the table generates buttons to delete row(can belistened with function listenRemove.See after.).

Example
--------------
```
var table = new UsefulTable("idTable",true);
```



Set a header
==============
```
UsefulTable.setHeader(header);
```

- ***header [object]*** : Represents the header. The keys define the column's values which will be displayed , and the values are objects which take options and constrains.

- ***Constraints***
	- ***Empty [boolean]*** : Defines if the column can be empty (default : true)
	- ***Nullable [boolean]*** : Defines if the column can be null (default : true)
	- ***Type [string]*** : Defines the type of column { string,number,integer,boolean } (default : string)

- ***Options***
	- ***visibile [boolean]*** : Defines if the column will be displayed (default : true)

	- ***editable [boolean]*** : Defines if the column can be edited (default : true)

Example
--------------
```
table.setHeader({
    ID        : { empty : false , editable : false, type:"integer"},
    Firstname : { empty : false },
    Age       : { empty : false , type : "integer"},
    Invisible : { type : "boolean" , visible : false}
  });

```


Add One Row
==============
```
UsefulTable.setRows(row);
```

- ***row [object]*** : Takes a object which object's key represent column's name and the key's values represent the cell's values.

Example
--------------
```
table.addOneRow({
    ID : 1,
    Firstname : "vauroi",
    Age : 21
 });
```


Add Several Rows
==============
```
UsefulTable.setRows(rows);
```

- ***rows [object]*** : Takes a array of several rows(Abo)

```
table.addRows([
  {
    ID : 2,
    Firstname : "Paul",
    Age : 27
  },
  {
    ID : 3,
    Firstname : "Bob",
    Age : 52
  },
  {
    ID : 4,
    Firstname : "Tom",
    Age : 44
  }
]);
```

Update a row
==============
```
UsefulTable.updateRow(row,index);
```

- ***row [object]*** : Takes an object(See addOneRow)
- ***index [number]*** : Takes displayed index row that'll be updated(Index start at 0).

Example
--------------
```
table.updateRow({
    ID : 2,
    Firstname : "Paul",
    Age : 42
  },2);
```

Delete a row
==============
```
UsefulTable.removeRow(index);
```

- ***index [number]*** : Takes index row that'll be removed(Index start at 0).

Example
--------------

```
table.removeRow(2);
```

Get a row
==============
```
UsefulTable.getRow(index);
```

- ***index [number]*** : Takes index row that'll be retrieved(Index start at 0).


```
var row = table.removeRow(1);
```

Listen modification events
==============
```
UsefulTable.listenModification(cb);
```

- ***cb [function]*** : Takes a callback's function with paramater :
							- ***respect [boolean]*** : "If modification respect the constraints"
							- ***row [object]*** : "The row where modification occured"
							- ***key [string]*** : "The key that indicates modified cell"
							- ***oldValue*** : The value before modification.

Example
--------------
```
table.listenModification(function (respect,row,key,oldValue) {
  var txt =  "Modification : ";
  txt += " Constraint is respected : " + respect;
  txt += " ,New Value : " + row[key];
  txt += " ,Last Value : " + oldValue;
  console.log(txt);
});

```

Listen deletion events
==============
```
UsefulTable.listenRemove(cb);
```

- ***cb [function]*** : Take a callback function with paramater :
							- ***row [object]*** : "The row which has been removed"

```
table.listenRemove(function (row) {
  console.log("Row removed: ");
  console.log(row);
});
```

License
==============
Licence Apache 2.0