//________________________________
 // CalculatioEngine
 // hdxcode.js
 // 2026-01-20
 //



 //================================
//import SlotInput from "SlotInput.js";
//import Slot from "Slot.js";




const TypeHtmlCntrl = {Text: 0, Button: 1, Checker: 3, Selector: 4, Color: 5};
const TypeInputHTML = { text: "text", color: "color", checkbox: "checkbox", selector: "selector" };

let g_defName = "?";
let g_lines = [];
let g_linesIndex = 0;
let g_dataCore = [];
let g_DataTrend = null;
let g_colors = [
			"rgb(164,   0,   0)"
			,"rgb(  0, 164, 0)"
			,"rgb(  0,   0, 164)"
 			,"rgb(164, 164,   0)"
			,"rgb(  0, 164, 164)"
			,"rgb(  0,   0, 0)"
			,"rgb(164,   0, 164)"
			,"rgb(128,   0,   0)"
			,"rgb(  0, 128, 0)"
			,"rgb(  0,   0, 128)"
			,"rgb(128, 128,   0)"
			,"rgb(  0, 128, 128)"
			,"rgb(  0,   0, 0)"
			,"rgb(128,   0, 128)"
			];
			 //--'rgb(0, 128, 0)'
let g_idTypeToStudy = -1;
let g_indexGlobalColors = 0;
let g_ir = 0;
let g_tbl_output_params_cash = "";
let g_SkipDots = 1;
let global_iparams = null;
let global_itemslist = null;
let global_ItemID = -1;
let g_IsSetupLinesDefinitionsForTrendCalcParams = false;
let g_linesDefinition = null;
let g_TrendIncreaseParamNames = null;
let g_firstSlot = null;
let g_listGraff = null;
let g_defaultSelectedParamName = "CMd";
let g_yparamGraffOuputskip = ["i_max", "dR", "LastError"];
let g_xparamGraffOuput = "ReDisk"; 

let DEBUG = 0;
//--------------------------------------------------------------------------------------

function onLoadPage()
{
	StateMenuDisabled(true);

	let def_test_type_study_model = null;//VortexChamber
	if (DEBUG == 1) {
		def_test_type_study_model = 4;//VortexChamber
	}

	FillSelectorObjectToStudy(def_test_type_study_model);
	
}
function SwitchTheme() {
	let theme = document.getElementById('theme');

	if (theme.getAttribute('href') == 'pstyles-light.css') {
		theme.setAttribute('href', 'pstyles.css');
	} else {
		theme.setAttribute('href', 'pstyles-light.css');
	}
}
function OnChangeSelectorObjectToStudy() {
	FillSelectorTrendIncreaseParam();

	StateMenuDisabled(false);
}
function StateMenuDisabled(flag) {
	myfile.disabled = flag;
	idinputSavefile.disabled = flag;
	idinputresetcalc.disabled = flag;
	idinputdocalc.disabled = flag;
	idinputexport.disabled = flag;

}
async function ExportToCliboard()
{
	let text = BuildResultTotalReport2(true,"\t");// id0.innerHTML;
	copyToClipboard(text);
	alert("Copied!");
}
//--------------------------------
async function copyToClipboard(text) {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		ShowERROOR("copyToClipboard",err);
	}
}
//--------------------------------
function Start()
{
	try
	{
		ResetERROOR();
		DoWork();
	}
	catch(e)
	{
		console.log(e);
		ShowERROOR("Start", e);
	}
}
//--------------------------------------------------------------------------------------
function OpenToFile() {
	try {
		g_idTypeToStudy = GetSelectedObjectToStudy();
		if (g_idTypeToStudy == -1 || g_idTypeToStudy == "" || g_idTypeToStudy == null)
		{
			alert("Выбери тип расчета.");
			return;
		}
		ShowERROOR_async("Загрузка....", null);

		//let file = myfile.files[0];//myfile.value

		readFile(myfile);

	}
	catch (e) {
		ShowERROOR("OpenToFile", e);
	}
}
//----------//----------//----------//----------//----------

function readFile(input)
{
	let file = input.files[0];
	let reader = new FileReader();
	reader.readAsText(file);
	reader.onload = function() { onLoadReader(reader.result); }; 
	reader.onerror = function() { ShowERROOR("readFile",reader.error); };
}
//----------//----------//----------//----------//----------
function onLoadReader(textblob)
{
	try
	{
		//InsertTParagraf(textblob);
		g_idTypeToStudy = GetSelectedObjectToStudy();
		if (g_idTypeToStudy == -1 || g_idTypeToStudy == null)
		{
			alert("Select \"ОБЪЕКТ РАСЧЕТА\"")
			return;
		}
		NewClearAll(g_idTypeToStudy);		
		
		let objs = JSON.parse(textblob.replace("\n",""));
		for (let i = 0; i < objs.length; i++)
		{
			let nobj = objs[i];
			AddSlot(nobj);
		}
		ShowERROOR_async("", null);
	}
	catch (e) {
		ShowERROOR_async("onLoadReader", e);
	}
}
//--------------------------------------------------------------------------------------
function SaveToFile()
{
	if (g_DataTrend == null) { ShowERROOR("DEBUG::SaveToFile >> DataTrend = null"); return; }
	let cash = new List();
	for (let i = 0; i < g_DataTrend.length; i++) 
	{
		item_slot = g_DataTrend.items[i];
		CollectInputData(item_slot);
		//let blob = JSON.stringify(item_slot.input);
		cash.Add(item_slot.input);//blob);
	}
	let text = JSON.stringify(cash.items);
	try {
		
		var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
		var dt = new Date();


		var fname = g_defName + "_InputData_" + formatDate(dt) + ".json";
		saveAs(blob, fname);
	}
	catch (e) {
		ShowERROOR("ExportToFile", e);
	}

}
//--------------------------------------------------------------------------------------

function NewAddSlot() {
	AddSlot();
	StateMenuDisabled(false);
}
//--------------------------------------------------------------------------------------
function CopyData(fromObj, toObj)
{
	if(toObj==null || fromObj==null) return toObj;
	
	let keys = Object.keys(toObj);

	for (let i = 0; i < keys.length; i++) 
	{
		if (fromObj[keys[i]] != null) 
			toObj[keys[i]] = fromObj[keys[i]];
	}
	return toObj;
}
//--------------------------------------------------------------------------------------
function GetSelectedObjectToStudy()
{
	let itemselected = idSelectorObjectToStudy.value;
	if (itemselected == null || itemselected < 0) return -1;

	let _idtype = TypesToStudy[itemselected].idtype;
	if (_idtype == null) return -1;

	g_defName = TypesToStudy[itemselected].name;

	return _idtype;
}
//--------------------------------------------------------------------------------------
function AddSlot(obj=null) {

	try {

		if (g_idTypeToStudy == -1 || g_idTypeToStudy == null)
			return;
		
		if (g_DataTrend == null) {
			g_DataTrend = new List();
			global_ItemID = 1;
		}

		let name = g_defName + "_" + global_ItemID;//GetCurrentDateTimeStr(true);

		let input = Factory.CreateObjectInput(g_idTypeToStudy, name);//new SlotInput(name);
		if (input == null) return;
		
		// if(g_firstSlot!=null)
		// {	
		// 	input = SetupIncrease(input, g_firstSlot.input);
		// }

		if(obj!=null)
			input = CopyData(obj, input);
		
		let item_slot = Factory.CreateObject(g_idTypeToStudy, input);// new Slot(input);
		if (item_slot == null) return;

		item_slot.ID = global_ItemID;
		global_ItemID++;

		MakeInputList(item_slot);

		g_DataTrend.Add(item_slot);

		if(g_firstSlot == null)
			g_firstSlot = item_slot;

		idSelectorObjectToStudy.disabled = true;

		FillSelectorTrend();
		FillSelectorTrendGraffX();
		PreparePlottingDetailLines();
		
		SetupLinesDefinitionsForTrendCalcParams();
		InsertTParagraf(" Ready to calculate...");

	}
	catch (e) {
		ShowERROOR("LoadException: ", e);
	}
}
//-------------------------------------------------------------
function NewClearAll(curidTypeToStudy=-1) {
	g_idTypeToStudy = curidTypeToStudy;
	if(curidTypeToStudy==-1)
		g_defName = "?";

	g_lines = [];
	g_linesIndex = 0;
	g_dataCore = [];
	g_DataTrend = null;
	idSelectorObjectToStudy.disabled = false;
	g_ir = 0;
	g_tbl_output_params_cash = "";
	g_SkipDots = 1;
	global_iparams = null;
	global_itemslist = null;
	global_ItemID = -1;
	g_IsSetupLinesDefinitionsForTrendCalcParams = false;
	g_linesDefinition = null;
	g_TrendIncreaseParamNames = null;
	g_firstSlot = null;
	g_listGraff = null;
	InsertHtml("idERROOR", "<br/>");
	InsertHtml("idlist", "<br/>");
	InsertHtml("id0", "<br/>");
	InsertHtml("idResultTable", "<br/>");
	InsertHtml("myDiv", "<br/>");
	InsertHtml("idListSlotGraff", "<br/>");
	InsertHtml("myDiv2", "<br/>");
	InsertHtml("idResultDetailsTable", "<br/>");
	InsertHtml("idlinessetupCoreData", "<br/>");
}
//-------------------------------------------------------------
function SetupIncrease(input, finput)
{ 
	if (g_TrendIncreaseParamNames == null) return input;
	if (idSelectorTrendIncreaseParam == null) return input;
	if (idTrendIncreaseParamStep == null) return input;
	let itemselected = 1 * idSelectorTrendIncreaseParam.value;
	if (itemselected == null || itemselected < 0) return input;

	let _ParamName = g_TrendIncreaseParamNames[itemselected];
	if (_ParamName == null) return input;

	let lastval = finput[_ParamName];
	input[_ParamName] += 1.0 * idTrendIncreaseParamStep.value * global_ItemID*lastval / 100;

	return input;
}
function FillSelectorObjectToStudy(def_id_TypesToStudy=null)
{
	var names = new List();

	if (TypesToStudy == null) {
		ShowERROOR("FillSelectorObjectToStudy >>> TypesToStudy == null", null);
		return;
	}
	let def_name = null;

	for (i = 0; i < TypesToStudy.length; i++)
	{
		names.Add(TypesToStudy[i].name);

		if (def_id_TypesToStudy != null) {
			if (def_id_TypesToStudy == TypesToStudy[i].idtype) {
				def_name = TypesToStudy[i].name;
			}
		}
	}

	g_idTypeToStudy = def_id_TypesToStudy;
	g_defName = def_name;

	FillSelectoes("idSelectorObjectToStudy", names.items, def_name);

	if (def_id_TypesToStudy != null) {
		NewAddSlot();
	}
}
function FillSelectorTrendIncreaseParam() {

	g_idTypeToStudy = GetSelectedObjectToStudy();

	if (g_idTypeToStudy == null || g_idTypeToStudy == -1) return;
	let di = Factory.CreateObjectInput(g_idTypeToStudy,"");// new SlotInput();
	let keys = Object.keys(di);

	var names = new List();
	for (i = 0; i < keys.length; i++) {

		if (keys[i] == "name") continue;

		names.Add(keys[i]);
	}
	g_TrendIncreaseParamNames = names.items;
	
	FillSelectoes("idSelectorTrendIncreaseParam", names.items);
}
function FillSelectorTrendGraffX() {

	if (g_DataTrend == null) return;

	let TrendCalcParamList = GetTrendCalcParamList();
	var names = new List();
	for (i = 0; i < TrendCalcParamList.length; i++) {

		if (g_yparamGraffOuputskip.includes(TrendCalcParamList[i])) continue;

		names.Add(TrendCalcParamList[i]);
	}

	FillSelectoes("idSelectorTrendGraffX", names.items, g_xparamGraffOuput);
}
//--------------------------------
function ResetInputData()
{
	ResetInputNumberValues2();
}

//--------------------------------
function MakeInputList(slot)
{
	if (slot == null) { ShowERROOR("DEBUG::MakeInputList >> slot = null"); return; }

	if (slot.g_iparams == null)
		slot.g_iparams = new List();

	const slotID = slot.ID; // ранее полученный
	let obj = slot.input;//RotationSlotInput
	var keys = Object.keys(obj);
	let typeitem = TypeListItem.ParamNumber;
	let TypeListItemStr = "";
	let ComboboxValuesObj = obj["ComboboxValues"];

	for (var key in keys) {

		let name = keys[key];
		if(name == "ComboboxValues")
			continue;
		
		let val = obj[keys[key]];

		typeitem = TypeListItem.ParamNumber;
		TypeListItemStr = TypeListItem.ParamNumber;
		if (typeof val === "string") {
			typeitem = TypeListItem.ParamText;
			TypeListItemStr = TypeListItem.ParamText;
		}
		let _comboboxvalues = null;
		let defval = val;
		if (ComboboxValuesObj) {
			for (var cbvkey in ComboboxValuesObj) {
				let record = ComboboxValuesObj[cbvkey];
				if (record["name"] == name) {
					if(defval == null)
						defval = record["defval"];
					_comboboxvalues = record["values"];
					break;
				}
			}
		}
			
		slot.ID = slotID;// recovered
		if(keys[key] == "ID")
		{
			defval = slot.ID;
			val = slot.ID;
			TypeListItemStr = TypeListItem.ParamTextReadOnly;
		}
		slot.g_iparams.AddNewParamValue(slot.ID, keys[key], defval, TypeListItemStr, val, typeitem, _comboboxvalues);
	}

	GenerateInputList(slot.g_iparams);
}

//--------------------------------//--------------------------------//--------------------------------
function MakeOutputList(item_slot)
{
	if (item_slot == null) { ShowERROOR("DEBUG::MakeOutputList >> item_slot = null"); return; }
	if (item_slot.output == null) { ShowERROOR("DEBUG::MakeOutputList >> item_slot.output = null"); return; }


	if (item_slot.outparams == null)
		item_slot.outparams = new List();


	let obj = item_slot.output;//RotationSlotOutput
	
	var keys = Object.keys(obj);
	for (var key in keys)
	{
		let val = item_slot[keys[key]];
		if (item_slot.outparams !=null)
		{
			if(val == undefined)
				val = "<?>";
			item_slot.outparams.AddParamValue(item_slot, keys[key], val, keys[key], val);
		}
	}
	/**/
}

//--------------------------------
function DoWork() {

	ResetERROOR();

	if (g_DataTrend == null) {
		ShowERROOR("PUSH 'NEW' BUTTON!");
		return;
	}

	let errFlag = false;

	for (let i = 0; i < g_DataTrend.length; i++) {
		item_slot = g_DataTrend.items[i];
		item_slot.ResetError();

		if (CollectInputData(item_slot))
			item_slot.Calculate();

		item_slot.CollectErrors();
		if (item_slot.LastError != "" && item_slot.LastError !=null) { errFlag = true;}	
		MakeOutputList(item_slot);
	}

	
	OutputRESULT();		

	if (errFlag) { InsertHtml("idERROOR", "ОШИБКИ: см.LastError."); }	

}
//--------------------------------

function CollectInputData(item_) {
	if (item_ == null) { ShowERROOR("DEBUG::CollectInputData >> item_ = null"); return; }
	if (item_.input == null) return false;
	if (item_.g_iparams == null) return false;

	item_.g_iparams.UpdateListValues();

	let obj = item_.input;//RotationSlotInput

	let keys = Object.keys(obj);
	for (var key in keys)
	{
		item_[keys[key]] = GetListItemValue(item_, keys[key]);
		item_.input[keys[key]] = item_[keys[key]];
	}

	return true;
}
//--------------------------------

function OutputRESULT() {


	let htmltable = BuildResultTotalReport2();
	if (htmltable == null || htmltable == "") return;
	g_tbl_output_params_cash = htmltable;
	InsertHtml("id0", htmltable);
	

	// for DEBUG
	//if(DataTrend.length == 1) 	ShowDetailsOfSlot(DataTrend.items[0]);
	
	PlottingLines(g_DataTrend);	
}
//
function GetTrendCalcParamList(all=false) {

	if (g_DataTrend == null || g_DataTrend.length == 0) return null;

	let obj = g_DataTrend.items[0];
	let keys = Object.keys(obj.output);
	if (all)
		keys = Object.keys(obj.input).concat(Object.keys(obj.output));
	return keys;
}
//--------------------------------
function BuildResultForSlot(slot, all = false) {

	let keys = GetTrendCalcParamList(all);
	let hrows = new List();

	for (let k = 0; k < keys.length; k++) {
		let slotval = new List();
		let key = keys[k];
		slotval.Add(key);//название
		let fVal = FormatNumberValue(slot[key]);
		slotval.Add(fVal);//значение
		hrows.Add(MkRow(slotval.items));
	}

	return MkTbl(hrows.items);
}
//--------------------------------
function BuildResultTotalReport2(all = false, tocsv = "")
{
	if(g_DataTrend==null || g_DataTrend.length==0) return;

	let hrows = new List();
	let headers = ["Параметр"];
	for (let i = 0; i < g_DataTrend.length; i++) 
	{
		let item = g_DataTrend.items[i];
		headers[i+1] = item.name;
	}
	if (tocsv!="")
		hrows.Add(headers.join(tocsv));
	else 
		hrows.Add(MkRow(headers, true));

	//let obj = DataTrend.items[0];
	let keys = GetTrendCalcParamList(all);

	for (let k = 0; k < keys.length; k++) 
	{
		let slotval = new List();
		let key = keys[k];
		slotval.Add(key);//название
		for (let i = 0; i < g_DataTrend.length; i++) 
		{
			let item = g_DataTrend.items[i];
			slotval.Add(FormatNumberValue(item[key]));//значение
		}
		if (tocsv)
			hrows.Add(slotval.items.join(tocsv));
		else 
			hrows.Add(MkRow(slotval.items));
	}
	if (tocsv)
		return hrows.items.join("\n");

	return MkTbl(hrows.items);
}


//--------------------------------
function BuildResultTotalReport()
{
   var reslist = new List();
	//g_acells = new Array();

	for (let i = 0; i < g_DataTrend.length; i++) {
		let item = g_DataTrend.items[i];

		if (item.g_iparams != null)
			reslist.AddItemsFromList(item.g_iparams);
		if (item.outparams)
			reslist.AddItemsFromList(item.outparams);
	}

	let hrows = new List();
	hrows.Add(MkRow(["название", "коммент", "значение"], true));

	for (let i = 0; i < reslist.items.length; i++) {
		hrows.Add(MkRow(MkReportParam(reslist.items[i])));
	}
	

	g_tbl_output_params_cash = MkTbl(hrows.items);

	InsertHtml("id0",g_tbl_output_params_cash);
}
//--------------------------------
function PreparePlottingLines() {

	if (idSelectorTrendGraffX == null) return;

	let itemselected = idSelectorTrendGraffX.value;
	if (itemselected == null || itemselected < 0) return;

	//let TrendCalcParamList = GetTrendCalcParamList();
	//g_xparamGraffOuput = TrendCalcParamList[itemselected];
	g_xparamGraffOuput = idSelectorTrendGraffX.selectedOptions[0].label;
	g_IsSetupLinesDefinitionsForTrendCalcParams = false;
	SetupLinesDefinitionsForTrendCalcParams();
}
//--------------------------------
function PreparePlottingDetailLines() {

	if (g_DataTrend == null) return;

	let coreCalcParamList = GetCoreCalcParamList();
	if (coreCalcParamList == null) return null;

	var names = new List();
	for (i = 0; i < coreCalcParamList.length; i++) {

		//if (g_yparamGraffOuputskip.includes(coreCalcParamList[i])) continue; filter

		names.Add(coreCalcParamList[i]);
	}

	FillSelectoes("idSelectorSlotGraffX", names.items, coreCalcParamList[0]);
	FillSelectoes("idSelectorSlotGraffY", names.items, coreCalcParamList[0]);
}
//--------------------------------
function AddPlottingDetailLines() {

	if (g_listGraff == null)
		g_listGraff = new List();

	let x_index = GetSelectedSelector(idSelectorSlotGraffX);
	if (x_index == null) return;

	let y_index = GetSelectedSelector(idSelectorSlotGraffY);
	if (y_index == null) return;

	let coreCalcParamList = GetCoreCalcParamList();
	if (coreCalcParamList == null) return null;

	let g = new GraffInfo();

	g.xname = coreCalcParamList[x_index];
	g.yname = coreCalcParamList[y_index];
	g.xscale = idScaleSlotGraffX.value;
	g.yscale = idScaleSlotGraffY.value;
	g.onoff = true;
	g.width = 2;
	g.title = "" + g.yname + " = f(" + g.xname + ")";
	g.AsLogX = false;
	g.AsLogY = false;

	g_listGraff.Add(g);

	if (g_listGraff.items.length > 0)
		idSelectorSlotGraffX.disabled = true;

	Make_oGraffList();
	UpdatePlottingDetailLines();
}
//------------------------------------------------------
function Make_oGraffList() {
	if (g_listGraff == null) return;

	let cashlst = new List();
	for (let i = 0; i < g_listGraff.items.length; i++)
	{
		let g = g_listGraff.items[i];
		let grfftitle = g.title;
		let litag = MkTag2("li", grfftitle);
		cashlst.Add(litag);
	}
	let olist = MkTag2("ol", cashlst.items.join(""));
	InsertHtml("idListSlotGraff", olist);
}
//------------------------------------------------------
function ClearPlottingDetailLines() {

	idSelectorSlotGraffX.disabled = false;
	ResultTableClear("idListSlotGraff");
	g_listGraffTracks = null;
	UpdatePlottingDetailLines();
	g_listGraff = null;
}
//--------------------------------
function GetSelectedSelector(element) {
	if (element == null) return null;

	let itemselected = element.value;

	if (itemselected == null || itemselected < 0) return null;

	return itemselected;
}
//--------------------------------
function UpdatePlottingDetailLines() {

	if (g_listGraff == null)
	{
		//ShowERROOR("DEBUG::PlottingLines >> g_listGraff = null");
		plotting(null, "", "", "myDiv2");
		return;
	}

	
	let	g_listGraffTracks = new List();

	let xtitle = "";
	let ytitle = "";
	let flag = 0;
	let lines = [];
	let ynames = new List();
	for (let i = 0; i < g_DataTrend.length; i++) {
		let item = g_DataTrend.items[i];

		for (let i = 0; i < g_listGraff.items.length; i++) {
			let ld = g_listGraff.items[i];
			if (!ld.onoff) continue;

			ynames.Add(ld.yname);

			if (flag == 0) {
				xtitle = ld.xname;
				ytitle = ld.yname;
				flag = 1;
			}
			else {
				if (!ynames.items.includes(ld.yname))
					ytitle += ", " + ld.yname;
			}

			let xparam = ld.xname;
			let yparam = ld.yname;
			let grfftitle = ld.title + " - " + item.name; 
			let ncolor = getNextColor();//ld.color
			let track = MakeGraffTrack(item.Data, xparam, yparam, grfftitle, ncolor, ld.AsLogX, ld.AsLogY);
			g_listGraffTracks.Add(track);
		}
	}
	
	plotting(g_listGraffTracks.items, xtitle, ytitle,"myDiv2");
}
//--------------------------------------------------------------------------------------------------------------------------------
function MakeGraffTrack(ardata, indexX, indexY, lname, lcolor, vAsLogX, vAsLogY)
{
	if (ardata == null) return;
	let track = { line: null, name: lname, color: lcolor, AsLogX: vAsLogX, AsLogY: vAsLogY };

	track.line = [];
	for (let i = 0; i < ardata.length; i++) {
		track.line[i] = new Dot(ardata[i][indexX], ardata[i][indexY]);
	}

	return track;
}
//--------------------------------------------------------------------------------------------------------------------------------
function SetupLinesDefinitionsForTrendCalcParams() {

	if (g_IsSetupLinesDefinitionsForTrendCalcParams) return;
	let _linesList = new List();

	_linesList.Reset();

	let TrendCalcParamList = GetTrendCalcParamList();

	for (let i = 0; i < TrendCalcParamList.length; i++) {

		if (TrendCalcParamList[i] == g_xparamGraffOuput) continue;

		if (g_yparamGraffOuputskip.includes(TrendCalcParamList[i])) continue;

		let yparam = TrendCalcParamList[i];
		let linetitle = "" + yparam  + " = f(" + g_xparamGraffOuput + ")";
		let flag = yparam == g_defaultSelectedParamName;
		_linesList.Add(new LineDef(g_xparamGraffOuput, yparam, linetitle, flag, getNextColor(), yparam, g_xparamGraffOuput));
	}

	SetupInput("idlinessetup", _linesList);

	g_IsSetupLinesDefinitionsForTrendCalcParams = true;

}
//--------------------------------//--------------------------------//--------------------------------

function GetCoreCalcParamList() {

	if (g_idTypeToStudy == null || g_idTypeToStudy == -1) return;
	
	let obj = Factory.CreateObjectCoreCalc(g_idTypeToStudy);// new SlotData();
	if (obj == null) return null;

	let res = new List();
	var keys = Object.keys(obj);
	for (var key in keys) {
		res.Add(keys[key]);
	}
	return res.items;
}


//--------------------------------
function GetListItemValue(item, name)
{
	if (item == null) return null;
	if (name == null || name == "") return;
	let list = item.g_iparams;
	if (list == null) return null;

	if (list == null) return null;
	for(let i = 0; i < list.items.length; i++)
	{
		let paramobj = list.items[i];
		if(paramobj.name == name)
		{
			if (paramobj.typeitem == TypeListItem.ParamNumber)
				return paramobj.value * 1.0;

			return paramobj.value;
		}
	}
	return null;
}
//--------------------------------
function SetListItemValue(list, name, value)
{
	for(let i = 0; i < list.items.length; i++)
	{
		let paramobj = list.items[i];
		if(paramobj.name == name)
		{
			paramobj.value = value;
			return true;
		}
	}
	return false;
}
//--------------------------------
function GenerateInputList(local_iparams) {

	if (global_iparams == null) {
		global_iparams = new List();
	}
	if (global_itemslist == null) {
		global_itemslist = new List();
	}

	
	global_itemslist.Add(local_iparams);//global_iparams.AddItemsFromList(local_iparams);
	//

	ReGenerateGlobalInputList2();//ReGenerateGlobalInputList();//

}
//--------------------------------
function ResetInputNumberValues2()
{
	for (let i = 0; i < global_itemslist.items.length; i++) 
	{
		let itemslotlist =  global_itemslist.items[i];
		for (let j = 0; j < itemslotlist.items.length; j++) 
		{
			let paramobj = itemslotlist.items[j];
			paramobj.value = paramobj.defval;

			let x=document.getElementById(paramobj.id);
			
			if(x!=null)
				x.value = paramobj.defval;
		}
	}
}
//--------------------------------
function ReGenerateGlobalInputList2()
{
	if (global_itemslist == null) return;
	let hrows = new List();
	let headers = ["название", "поумолчанию"];

	for (let i = 0; i < global_itemslist.items.length; i++) {
		headers[i+2] = "Slot "+(i+1);
	}
	hrows.Add(MkRow(headers, true));

	let local_iparams_item0 = global_itemslist.items[0];
	for (let ig = 0; ig < local_iparams_item0.items.length; ig++) 
	{
		let paramobj = local_iparams_item0.items[ig];
		let columns = new List();
		columns.Add(paramobj.name);
		if(paramobj.name != "name")
			columns.Add(paramobj.defval);
		else
			columns.Add(g_defName); 

		for (let i = 0; i < global_itemslist.items.length; i++) {
			let itemslotlist =  global_itemslist.items[i];

			for (let j = 0; j < itemslotlist.items.length; j++) 
			{
				let iinputparam = itemslotlist.items[j];

				if(paramobj.name == iinputparam.name)
				{
					let setval = iinputparam.defval;
					if(iinputparam.value!=null && iinputparam.val!=iinputparam.defval)
						setval = iinputparam.value;

					let cellhml = "";
					if (iinputparam.typeitem == TypeListItem.ParamNumber)
					{
						cellhml = MakeInputNumber(iinputparam.id, setval);
					}
					if (iinputparam.typeitem == TypeListItem.ParamText) {
						cellhml = MakeInputText(iinputparam.id, setval);
					}
					if (iinputparam.typeitem == TypeListItem.ParamTextReadOnly) {
						cellhml = MakeInputText(iinputparam.id, setval, true);
					}
					
					if (iinputparam.comboboxvalues) {
						cellhml += "<br/>"
						cellhml += MakeInputComboBox(iinputparam, setval);
					}
					columns.Add(cellhml);
				}
			}
		}
		hrows.Add(MkRow(columns.items));
	}
	let text = MkTbl(hrows.items);

	InsertHtml("idlist", text);
}
//--------------------------------
//function ReGenerateGlobalInputList()
//{
//	if (global_iparams == null) return;

//	let hrows = new List();
//	hrows.Add(MkRow(["название", "коммент", "значение нач", "значение"], true));

//	for (let i = 0; i < global_iparams.items.length; i++) {
//		let paramobj = global_iparams.items[i];
//		let cells = [];
//		cells[0] = paramobj.name;
//		cells[1] = paramobj.comment;
//		cells[2] = paramobj.defval;
//		cells[3] = paramobj.value;

//		if (paramobj.typeitem == TypeListItem.ParamNumber) {
//			cells[3] = MakeInputNumber(paramobj.id, paramobj.defval);
//		}
//		if (paramobj.typeitem == TypeListItem.ParamText) {
//			cells[3] = MakeInputText(paramobj.id, paramobj.defval);
//		}
//		hrows.Add(MkRow(cells));
//	}
//	let text = MkTbl(hrows.items);
//	InsertHtml("idlist", text);
//}

//--------------------------------
function ResetInputNumberValues()
{
	for(let i = 0; i < g_iparams.items.length; i++)
	{
		let paramobj = g_iparams.items[i];
		paramobj.value = paramobj.defval;

		let x=document.getElementById(paramobj.id);
		  
		if(x!=null)
		   x.value = paramobj.defval;
	}
}

//--------------------------------
//--------------------------------

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function delayedGreeting(ms) {
   await sleep(ms);
 }
 //--------------------------------
function UpdateProgessValue(val)
{
	var elem = document.getElementById("myBar");
	if(elem!=null)
	{
		elem.style.width = val + "%";
		elem.innerHTML = val + "%";
	}
}
//--------------------------------
function UpdatePlottingLines() {

	PlottingLines(g_DataTrend);
}
//--------------------------------
function PlottingLines(dataarray) {

	if (dataarray == null) { ShowERROOR("DEBUG::PlottingLines >> dataarray = null"); return; }
	if (g_linesDefinition == null) { ShowERROOR("DEBUG::PlottingLines >> g_linesDefinition = null"); return; }

	ResetDataLines();

	g_linesDefinition.UpdateListValues();

	//let TrendCalcParamList = GetTrendCalcParamList();

	let xtitle = "";
	let ytitle = "";
	let flag = 0;
	for (let i = 0; i < g_linesDefinition.items.length; i++) {
		let ld = g_linesDefinition.items[i];
		if (!ld.onoff) continue;

		if (flag == 0) {
			xtitle = ld.xtitle;
			ytitle = ld.ytitle;
			flag = 1;
		}
		else {
			ytitle += ", " + ld.ytitle;
		}

		let xparam = ld.indx_x;
		let yparam = ld.indx_y;
		AddTrendGraffline(dataarray, xparam, yparam, dataarray.length, ld.title, ld.color, ld.AsLogX, ld.AsLogY);
	}

	plotting(g_lines, xtitle, ytitle);
}
//--------------------------------
function FillSelectorTrend() {

	if (g_DataTrend == null) return;

	var names = [];
	names[0] = "-unselected-";
	for (i = 0; i < g_DataTrend.items.length; i++) {
		names[i+1] = g_DataTrend.items[i].name;
	}

	FillSelectoes("idSelectorTrend", names);
}
//--------------------------------
function ShowSlotDetaisOnOtherWindow()
{

	let _trendListItem = GetSelectedSlot();
	if (_trendListItem == null) return null;
	let output_params_cash = BuildResultForSlot(_trendListItem, true);
	let htmltble = ShowDetailsOfSlot(_trendListItem, false);
	let cash = output_params_cash + htmltble;
	sessionStorage.setItem("name", cash);
	window.open("report.html", "_blank");
}
//--------------------------------
function SelectorTrendChanged() {

	//BuildDetailsOfSlot(true);

}

function GetSelectedSlot() {
	let x = document.getElementById("idSelectorTrend");
	if (x == null) return;

	if (x.selectedIndex == 0) {
		ResultTableClear("idResultDetailsTable");
		return null;
	}
	let itemselected = 1 * x.value;//x.options[].text;
	if (itemselected == null || itemselected < 0 || itemselected == 0) return null;

	let _trendListItem = g_DataTrend.items[itemselected - 1];

	return _trendListItem;
}

function BuildDetailsOfSlot(showinthispage) {
	try {

		let _trendListItem = GetSelectedSlot();
		if (_trendListItem == null) return null;

		return ShowDetailsOfSlot(_trendListItem, showinthispage);
	}
	catch (e) {
		ShowERROOR("SelectorTrendChanged: ",e);

	}
}
//--------------------------------
function ShowDetailsOfSlot(_trendListItem, showinthispage = true)
{
	if (_trendListItem == null) return;

	let codearraydata = _trendListItem.GetCoreData();
	if (codearraydata == null) return;

	let CoreCalcParamList = GetCoreCalcParamList();
	if (CoreCalcParamList == null) return;

	let ar_data_cells = new List();
	ar_data_cells.Add(MkRow(CoreCalcParamList, true));

	for (let i = 0; i < codearraydata.length; i++) 
	{
		if(i< 100 || i%g_SkipDots == 0)
		{
			let itemvalues = codearraydata[i].GetValues(CoreCalcParamList);
			let formatedValues = FormatNumberValues(itemvalues);
			ar_data_cells.Add(MkRow(formatedValues));
		}
	}
	let htmltable = MkTbl(ar_data_cells.items);
	if (showinthispage)
		InsertHtml("idResultDetailsTable", htmltable);
	else return htmltable;
}
//--------------------------------
function FormatNumberValues(arr)
{
	let resarr = [];
	if(arr==null) return null;

	for(let i=0;i<arr.length;i++)
	{
		resarr[i] = FormatNumberValue(arr[i]);
	}
	return resarr;
}
//--------------------------------
function FormatNumberValue(oneval, numpercition=7) {
	if (oneval != null && typeof oneval === 'number') {

		return MyMath.NumberFormat(oneval, numpercition);
	}
	return oneval;
}

//--------------------------------
function SelectorParamChanged()
{
	let valX = getValueOfHtmlCntrl("idSelectorParamX", "", TypeHtmlCntrl.Selector);		
	let valY = getValueOfHtmlCntrl("idSelectorParamY", "", TypeHtmlCntrl.Selector);		
		
	let linetitle = valY + " = f("+valX+")";
	setValueOfHtmlCntrl("idNewLineDefName", linetitle, TypeHtmlCntrl.Text);
}

//--------------------------------
function SetupInput(tag, _linesDefinitionList) {

	if (_linesDefinitionList == null) { ShowERROOR("DEBUG::SetupInput >> _linesDefinitionList = null"); return; }
	let hrows = new List();

	for (let i = 0; i < _linesDefinitionList.items.length; i++) {
		let paramobj = _linesDefinitionList.items[i];
		let cells = [];
		cells[0] = MakeInputHTML(TypeInputHTML.text, paramobj.id + "_title", paramobj.title);
		cells[1] = MakeInputHTML(TypeInputHTML.color, paramobj.id + "_color", paramobj.color);
		cells[2] = MakeInputHTML(TypeInputHTML.checkbox, paramobj.id + "_onoff", paramobj.onoff, "Вкл/Выкл");
		cells[3] = MakeInputHTML(TypeInputHTML.checkbox, paramobj.id + "_AsLogX", paramobj.AsLogX, "Log x");
		cells[4] = MakeInputHTML(TypeInputHTML.checkbox, paramobj.id + "_AsLogY", paramobj.AsLogY, "Log y");

		hrows.Add(MkRow(cells));
	}
	g_linesDefinition = _linesDefinitionList;
	let text = MkTbl(hrows.items);
	InsertHtml(tag, text);

}

//--------------------------------
function getNextColor()
{
	let val = g_colors[g_indexGlobalColors];
	
	g_indexGlobalColors++;
	if(g_indexGlobalColors >=g_colors.length) g_indexGlobalColors = 0;
		
	return rgbToHex(val);
}
//--------------------------------
function rgbToHex(rgb) {
  let y = rgb.match(/\d+/g).map(function(x) {
    return parseInt(x).toString(16).padStart(2, '0')
  });
  return '#' + y.join('').toUpperCase();
}
//--------------------------------
function MakeInputHTML(type, objid, defvalue, label = "tooltip", idcombobox = null, _comboboxvalues=null, isreadonly=false) {
	let append = "";

	if (type == TypeInputHTML.selector && idcombobox && _comboboxvalues) {
		let inptCmbBx = "<select id=\"#paramname#\" onchange=\"#changecode#\" >#values#</select>";
		inptCmbBx = inptCmbBx.replace("#paramname#", idcombobox);
		let options = "";
		for (let item in _comboboxvalues) {
			let record = _comboboxvalues[item];
			let cellval = record["idtype"];
			let cbxtext = record["name"];

			let ifselected = "";
			if (cellval == defvalue)
				ifselected = " selected=selected ";//"SELECTED"
			options += "<option value=" + cellval + ifselected+ " > "+ cbxtext +"</option>\n";
		}
		inptCmbBx = inptCmbBx.replace("#values#", options);
		let tmpchge = "document.getElementById('#ideditcode#').value = this.value;";
		tmpchge = tmpchge.replace("#ideditcode#", objid.id);
		inptCmbBx = inptCmbBx.replace("#changecode#", tmpchge);

		return inptCmbBx;
	}
	if (type == TypeInputHTML.checkbox && defvalue) append = "checked";

	let typeinput = "\"" + type + "\"";
	let addtitle = "title=\"" + label + "\"";

	if(isreadonly)
		append += " readonly ";

	let str = "<input  id=" + objid + " " + addtitle + " type=" + typeinput + " value =\"" + defvalue + "\"" + append + ">";
	return str;
}

//--------------------------------
function MakeInputNumber(objid, defvalue)
{
	let typeinput = "number";//text
	return MakeInputHTML(typeinput, objid, defvalue);
}
//--------------------------------
function MakeInputComboBox(objid, defvalue)
{
	let typeinput = TypeInputHTML.selector;
	return MakeInputHTML(typeinput, objid, defvalue, "", objid.idcombobox, objid.comboboxvalues);
}
//--------------------------------
function MakeInputText(objid, defvalue, isreadonly=false)
{
	let typeinput = "text";
	return MakeInputHTML(typeinput, objid, defvalue, null,null,null,isreadonly);
}

//--------------------------------
function LineDef(indx_x, indx_y, title, onoff, color, ytitle, xtitle) {
	this.id = "idline_" + indx_x + "_" + indx_y;
	this.indx_x = indx_x;
	this.indx_y = indx_y;
	this.title = title;
	this.onoff = onoff;
	this.color = color;
	this.ytitle = ytitle;
	this.xtitle = xtitle;
	this.AsLogX = false;
	this.AsLogY = false;

	this.UpdateListItemValues = function () {
		this.title = getValueOfHtmlCntrl(this.id + "_title", this.title, TypeHtmlCntrl.Text);
		this.color = getValueOfHtmlCntrl(this.id + "_color", this.color, TypeHtmlCntrl.Color);
		this.onoff = getValueOfHtmlCntrl(this.id + "_onoff", this.onoff, TypeHtmlCntrl.Checker);
		this.AsLogX = getValueOfHtmlCntrl(this.id + "_AsLogX", this.AsLogX, TypeHtmlCntrl.Checker);
		this.AsLogY = getValueOfHtmlCntrl(this.id + "_AsLogY", this.AsLogY, TypeHtmlCntrl.Checker);
	};
}
//--------------------------------
function getValueOfHtmlCntrl(id, defvale, typecntl)
{		
	let x = document.getElementById(id);
	if(x==null) return defvale;
	
	switch(typecntl)
	{
		case TypeHtmlCntrl.Selector: return x.options[x.value].text;
		case TypeHtmlCntrl.Checker: return x.checked;
		case TypeHtmlCntrl.Text: break;
		case TypeHtmlCntrl.Button:  break;
		case TypeHtmlCntrl.Color:break;
	}
	
	return x.value;
}
//--------------------------------
function setValueOfHtmlCntrl(id, value, typecntl)
{		
	let x = document.getElementById(id);
	if(x==null) return;

	switch(typecntl)
	{
		case TypeHtmlCntrl.Selector: x.options[x.value].text = value;
		case TypeHtmlCntrl.Checker: x.checked = value;	break;
		case TypeHtmlCntrl.Text: break;
		case TypeHtmlCntrl.Button:  break;
		case TypeHtmlCntrl.Color:break;
	}

	x.value = value;
}


 //--------------------------------
function ResetDataLines()
{
	g_linesIndex = 0;
	g_lines = [];
}
 //--------------------------------
function AddTrendGraffline(datalist, indexX, indexY, n, lname, lcolor, vAsLogX = false, vAsLogY=false)
{
	if (datalist == null) return;
	if (datalist.items == null) return;

	let ardata = datalist.items;
	let track = { line: null, name: lname, color: lcolor, AsLogX: vAsLogX, AsLogY: vAsLogY };

	track.line =[];
	for(let i = 0; i < n; i++)
	{
		track.line[i] = new Dot(ardata[i][indexX], ardata[i][indexY]);
	}

	if (g_lines == null)
		ResetDataLines();

	g_lines[g_linesIndex] = track;
	g_linesIndex++;
}

 //--------------------------------
function Rfx( num )
{
	return num.toFixed(3);
}

function GetCurrentDateTimeStr(together=false) {
	var dt = new Date();
	return formatDate(dt, together);
}

function ExportToFile() {
	try {
		let textdata = MkPage(ExportData(), "Slots Results");
		var blob = new Blob([textdata], { type: "text/plain;charset=utf-8" });
		var dt = new Date();
		var fname = "result_" + formatDate(dt) + ".html";
		saveAs(blob, fname);
	}
	catch (e) {
		ShowERROOR("ExportToFile", e);
	}
}
function formatDate(date, together = false)
{
	// отформатировать дату
	// добавить ведущие нули к единственной цифре дню/месяцу/часам/минутам
	let d = date;
	d = [
	'' + d.getFullYear(),
	'0' + (d.getMonth() + 1),
	'0' + d.getDate(),
	'0' + d.getHours(),
	'0' + d.getMinutes()
	].map(component => component.slice(-2)); // взять последние 2 цифры из каждой компоненты

	if (together)
		return d.slice(0, 3).join("") + d.slice(3).join("");
	// соединить компоненты в дату
	return d.slice(0, 3).join('-') + '_' + d.slice(3).join('-');
}

function ExportData()
{
	return g_tbl_output_params_cash;//   +  "<hr/>" + MkTbl(g_acells);
}

//--------------------
function ResultTableClear(iddiv) {
	InsertHtml(iddiv, "<br/>");
}

//--------------------
function MkReportParam(prm, prctn=5)
{
	let cells = [];
	if (prm == null) return cells;

	cells[0] = prm.name;
	cells[1] = prm.comment;
	cells[2] = FormatNumberValue(prm.value,prctn);


  return cells;
}
//--------------------
function processNumber(inputField)
{
	return inputField.value;
}
 //--------------------------------
function InsertTParagraf(text)
{
  InsertHtml("id0",MkTag("p", text));
}

//--------------------------------
function ShowERROOR(etext, err = null) {
	
	if (etext == null)
		etext = "";

	if (etext != "")
		console.log(etext);

	let mes = etext;

	if (err != null) {
		let a = [etext, err.name, err.message, err.stack];
		mes = a.join(";");
		console.log(err);
	}
	InsertHtml("idERROOR", mes);
	return mes;
	
}

function resolveAfter2Seconds(etext, err = null) {
	return new Promise((resolve) => {
		let res = ShowERROOR(etext, err);
		resolve(res);
	});
}

async function ShowERROOR_async(etext, err = null) {
	const result = await resolveAfter2Seconds(etext, err);
	console.log(result);
}

//--------------------------------
function ResetERROOR() {
	InsertHtml("idERROOR", "");
}
//--------------------------------
function InsertHtml(id,text)
{
	let x = document.getElementById(id);
  if(x != null)
	   x.innerHTML = text;
}
//--------------------
function SetHtmlElementValue(idelem, val)
{
	let x = document.getElementById(idelem);
	if(x != null)
	   x.value = val;
}
//--------------------------------

function MkRow(cells, markbold = false)
{
	if(cells == null) return "";
	let tbl= "";
	for(let i = 0; i < cells.length; i++)
	{
		if (markbold)
		{
			tbl = tbl + MkTag("th", cells[i]);
		}
		else tbl = tbl + MkTag("td", cells[i]);	 
	}

	return MkTag("tr", tbl) ;
}

//--------------------------------

	function MkTbl(trows) {
		let tbl = "";
		for (let i = 0; i < trows.length; i++) {
			tbl = tbl + trows[i];
		}

		return MkTag2("table", tbl);
	}

//--------------------------------
	function MkTag(tag, text) {
		return MkTag2(tag, text, "");
	}
//--------------------------------
	function MkTag2(tag, text, atrbs="") {
		let ret = "<" + tag + " " + atrbs + " >" + text + "</" + tag + ">";
		return ret;
	}
	function MkPage(text, titlename="") {
		let title = "<title> " + titlename +"</title>";
		let css = "<link rel=\"stylesheet\" href=\"pstyles-light.css\">";
		let meta = "<meta content=\"text/html; charset=utf-8\" http-equiv=\"Content-Type\" />";
		let head = MkTag("head", title + meta + css);
		let body = MkTag("body", text);
		let page = MkTag("html", head + body, "xmlns=\"http://www.w3.org/1999/xhtml\"");

		return page;
	}

//-------------------------

function plotting(tracks, xtitle, ytitle, plotdiv = 'myDiv') {

	try {

		let graftitle = ytitle+" = f("+xtitle+")";
		let layout = {
			title: graftitle,
			height: 600,
			width: 800,
			xaxis: {
				title: xtitle,
				linecolor: 'rgb(0,0,0)',
				tickcolor: 'rgb(64,64,64)',
				showgrid: true,
				gridcolor: 'rgb(64,64,64)',
				zeroline: true,
				showline: true,
				showticklabels: true
			},
			yaxis: {
				title: ytitle,
				linecolor: 'rgb(0,0,0)',
				tickcolor: 'rgb(64,64,64)',
				showgrid: true,
				gridcolor: 'rgb(64,64,64)',
				zeroline: true,
				showline: true,
				showticklabels: true
			}
		};

		let dataPlot = [];

		if (tracks == null || tracks.length == 0) {
			//ShowERROOR("plotting: No data", null);
			return;
		}
		
		{
			if (tracks[0].AsLogX)
				layout.xaxis.type = "log";
			if (tracks[0].AsLogY)
				layout.yaxis.type = "log";

			//let data = [trace1];//, trace2];
			let curPlotLineType = 0;
			if (tracks != null) {
				for (let il = 0; il < tracks.length; il++) {

					let trace1 = {
						mode: 'lines',
						name: tracks[il].name,
						line: {
							dash: PlotLineTypes[curPlotLineType],
							width: 2,
							color: tracks[il].color,
						}
					};

					curPlotLineType++;
					if (curPlotLineType >= PlotLineTypes.length)
						curPlotLineType = 0;

					let line = tracks[il].line;
					trace1.y = [];
					trace1.x = [];
					for (let i = 0; i < line.length; i++) {
						trace1.x[i] = line[i].X;
						trace1.y[i] = line[i].Y;
					}
					dataPlot[il] = trace1;
				}
			}
		}
		Plotly.newPlot(plotdiv, dataPlot, layout, { showSendToCloud: false });
	}
	catch (e) {
		ShowERROOR("plotting: ",e);
	}


}

const PlotLineTypes = ["solid", "dash", "dashdot","dot"]
//--------------------------------------------------------------------------------------

function FillSelectoes(idSelector, names, defSelected=null)
{
	var item = document.getElementById(idSelector);
	if (item == null) return;
	if (names == null) return;

	item.innerHTML = "";//.options.length = 0;
	for (let i = 0; i < names.length; i++) {

		let newOption = new Option(names[i], i);

		if (defSelected != null && names[i] == defSelected)
			newOption.selected = true;

		item.append(newOption);
	}


	
}
//--------------------------------------------------------------------------------------



//onLoad();
 //-------------------------------- The END --------------------------------