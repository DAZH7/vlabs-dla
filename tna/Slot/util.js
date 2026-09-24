//--------------------------------
// UTILS
// 2025-10-01
//--------------------------------

const TypeListItem = { ParamNumber: 0, ParamText: 1, ParamColor: 2, ParamOnOff: 3, ParamTextReadOnly: 4};



//--------------------------------
function isError(err) {
	return err instanceof Error;
}

//--------------------------------
class RootObject {
	constructor() {
		this.Errors = [];
		this.indexError = 0;
		this.LastError = "";
		this.ID = 0;
	}
	FireCalcError(obj, err) {

		let meserr = err;
		if (err != null && isError(err)) {
			let a = [err.name, err.message, err.stack];
			meserr = a.join(";");
		}
		let txt = obj + " -> " + meserr;
		console.log(txt);
		if (txt != null && txt != "") {
			this.LastError = txt;
			this.AddError(txt);
		}

	}
	ResetError() {
		this.Errors = [];
		this.indexError = 0;
		this.LastError = "";
	}
	AddError(mes) {
		this.Errors[this.indexError] = mes;
		this.indexError++;
	}
	GetLastErrors() {

		let i = 0;
		let resString = "";
		for (i = 0; i < this.indexError; i++) {
			resString += this.Errors[i] + "; ";
		}
		return resString;
	}
	CollectErrors() {
		this.LastError = this.GetLastErrors();
	}
	IsNotValid(val) {
		return Checks.IsNotValid(val);
	}
}

class Checks {
	//_______________________________________________________________________________________
	static IsValid(val) {
		if (!(typeof val === 'number')) return true; 
		return typeof val === 'number' && Number.isFinite(val) && !Number.isNaN(val) && val != undefined && val != null;
	}
	static IsNotValid(val) {
		return !this.IsValid(val);
	}
	//_______________________________________________________________________________________
	static AnyNaN(obj) {

		if (obj == null)
			return null;

		var keys = Object.keys(obj);
		for (var key in keys) {
			let val = obj[keys[key]];

			if (!this.IsValid(val)) {
				let res = "" + keys[key] + " is INVALID!";
				return res;
			}
		}
		return null;
	}
}


//--------------------------------
class Dot
{
	constructor(x, y)
	{
		this.X = x;
		this.Y = y;
	}
}
//--------------------------------

class NewInputParam
{
	constructor(iditem, name, defval, comment, val, typeitem = 0, _comboboxvalues=null) 
	{
		this.iditem = iditem;
		this.id = "iditem_" + iditem +"_idprm_"+name+"_"+typeitem;
		this.name = name;
		this.defval = defval;
		this.value = val;
		this.comment = comment;
		this.typeitem = typeitem;
		if (_comboboxvalues) {
			this.comboboxvalues = _comboboxvalues;
			this.idcombobox = "idselectoritem_" + iditem + "_idprm_" + name + "_" + typeitem;;
		}
		this.UpdateListItemValues = function () {

			if (this.typeitem == TypeListItem.ParamNumber) {

				let cbVal = null;
				if (this.idcombobox) {
					let itemcbx = document.getElementById(this.idcombobox);

					if (itemcbx != null) {
						cbVal = itemcbx.value;
					}
				}

				let x = document.getElementById(this.id);
				if (x != null)
				{
					if (cbVal)
						x.value = cbVal;

					this.value = this.processNumber(x);
				}
			}
			if (this.typeitem == TypeListItem.ParamText
				||
				this.typeitem == TypeListItem.ParamOnOff)
			{
				let x = document.getElementById(this.id);
				if (x != null)
					this.value = x.value;
			}
		};
	}
	processNumber(inputField)
	{
		if(inputField==null) return null;
		return inputField.value;
	}	
}
//--------------------------------
class List
{
	constructor() 
	{
		this.items =[];
		this.index =0;
		this.AsLogX = false;
		this.AsLogY = false;

		this.Reset = function()
		{
			this.index =0;
			this.items =[];
		};
		this.Add = function(item)
		{
			this.items[this.index] = item;
			this.index++;
		};

		this.AddParam = function (iditem, name, defval, comment)
		{

			this.AddParamValue(iditem, name, defval, comment, defval);

		};
		this.AddParamValue = function (iditem, name, defval, comment, val)
		{
			
			this.AddNewParamValue(iditem, name, defval, comment, val, TypeListItem.ParamNumber );
		};
		this.AddNewParamValue = function (iditem, name, defval, comment, val, typeitem, _comboboxvalues=null)
		{
			let item = new NewInputParam(iditem, name, defval, comment, val, typeitem, _comboboxvalues);
			this.items[this.index] = item;
			this.index++;
		};

		this.AddItemsFromList= function(list)
		{
			for(let i=0;i<list.items.length;i++)
			{
				let item = list.items[i];
				this.items[this.index] = item;
				this.index++;
			}
		};
		this.UpdateListValues = function ()
		{
			for(let i = 0; i < this.items.length; i++)
			{
				let paramobj = this.items[i];
				paramobj.UpdateListItemValues();
			}
		};	
	}
	get length() {return this.index;}
}

class MyMath
{
	static LengthVector(x,y)
	{
		return Math.sqrt(x*x+y*y);
	}
	static NumberFormat(oneval, numpercition) {

		let notationtype = "standard";
		if (Math.abs(oneval) < 1e-3 || Math.abs(oneval) > 1e9)
			notationtype = "scientific";

		let f = new Intl.NumberFormat('ru-RU', {
			maximumSignificantDigits: numpercition,
			notation: notationtype
		});

		return f.format(oneval);
	}
}

class GraffInfo {
	constructor() {
		this.xname = "";
		this.yname = "";
		this.xscale= 1;
		this.yscale = 1;
		this.onoff = false;
		this.width = 1;
		this.AsLogX = false;
		this.AsLogY = false;
	}
}