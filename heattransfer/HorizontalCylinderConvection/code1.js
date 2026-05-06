
//version
// 2026-03-27

var g_DEBUG = true;
var def_tag0 = "id0";
var def_error = "idERROOR";
var g_list_Result = [];
var g_list_ResultIndex = 0;
var idTypeFlow = 0;
var fShowTimeer = null;
var g_T0 = 273.15;
var g_Tf = 0;
var g_D = 0;
var g_L = 0;
var g_Fcylnd = 0;
var g_Re = 0.014;
var g_G = 9.81;
var g_Csgma = 5.67;
var g_Esp_back = 0.35;

// Замыкание
(function () {
    /**
     * Корректировка округления десятичных дробей.
     *
     * @param {String}  type  Тип корректировки.
     * @param {Number}  value Число.
     * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
     * @returns {Number} Скорректированное значение.
     */
    function decimalAdjust(type, value, exp) {
        // Если степень не определена, либо равна нулю...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Если значение не является числом, либо степень не является целым числом...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // Сдвиг разрядов
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Обратный сдвиг
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Десятичное округление к ближайшему
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Десятичное округление вниз
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Десятичное округление вверх
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();

function onInit()
{
    oninputslider_P_g();
    iddoclick.disabled = true;
}

function Resetresulttable() {
    g_list_Result = [];
    g_list_ResultIndex = 0;
}

function New() {

    iddoclick.disabled = false;
    ClearReport();
    
    Resetresulttable();

    g_Tf = getRandomInt(280, 300);
    g_D = processNumber(txt_D) * 1e-3;
    g_L = processNumber(txt_L) * 1e-3;

    ClearReport("idInfo");
    AddParam0("idInfo", "Температура воздуха, Tf, K", g_Tf);
    AddParam0("idInfo", "Диаметр трубы, D,м", g_D);
    AddParam0("idInfo", "Длина трубы, L, м", g_L);

    g_Fcylnd = Math.PI * g_D * g_L;

    let titles = [ "Uw,В", "U_T1,мВ", "U_T2,мВ", "U_T3,мВ", "U_T4,мВ", "U_T5,мВ", "U_T6,мВ" ];

    let add_arr = null;
    if (g_DEBUG)
        add_arr = ["W", "Tw_min", "Tw_max", "Tw", "Eds", "Tm", "Qrad", "Qk", "Gr", "Nu", "Alfa", "dT", "dTw"];

    AddRow("№", titles, add_arr);

    Build();

    if (fShowTimeer == null)
        fShowTimeer = setInterval(UpdateT, 1000); 

}
function Register() {

    try {
        res = UpdateT();
        if (res != null) return;

        let Uw = processNumber(txtP_g);
        let ut1 = processNumber(txtT1);
        let ut2 = processNumber(txtT2);
        let ut3 = processNumber(txtT3);
        let ut4 = processNumber(txtT4);
        let ut5 = processNumber(txtT5);
        let ut6 = processNumber(txtT6);
        

        let outputarr = new List();
        
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(Uw));
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(ut1));
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(ut2));
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(ut3));
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(ut4));
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(ut5));
        outputarr.ListAppendData(new Intl.NumberFormat('ru-RU',).format(ut6));

        let add_arr = null;
        if (g_DEBUG)
            add_arr = g_Data_debug;

        AddRow(g_list_ResultIndex, outputarr.GetData(), add_arr);
    }
    catch (err) {
        ShowERROOR("Register", err);
    }

    Build();
}
function UpdateT() {

    let W = processNumber(slider_P_g);
    //W = getRandomT(W, -5, +5);

    txtP_g.value = Math.sqrt(W * g_Re);

    let clc = new Calculator(W, g_Tf);


    try {

        let Tw_min = g_Tf * 1.01;
        let Tw_max = g_Tf * 10;

        let Tw = HalfSegmentCalc(clc, Tw_min, Tw_max, 0.01);

        let twc = Tw - g_T0;
        let Eds = -0.05166 + 0.06582 * twc + 4.30538e-5 * twc * twc - 2.69742e-8 * twc * twc * twc;

        txtT1.value = getRandomT(Eds, -5, -2);
        txtT2.value = getRandomT(Eds, -1, 2);
        txtT3.value = getRandomT(Eds, 0, 3);
        txtT4.value = getRandomT(Eds, 0, 3);
        txtT5.value = getRandomT(Eds, -1, 2);
        txtT6.value = getRandomT(Eds, -5, -2);

        if (g_DEBUG) {
            
            let debug_lst = new List();

            debug_lst.ListAppendData(W);
            debug_lst.ListAppendData(Tw_min);
            debug_lst.ListAppendData(Tw_max);
            debug_lst.ListAppendData(Tw);
            debug_lst.ListAppendData(Eds);
            debug_lst.ListAppendData(clc.Tm);
            debug_lst.ListAppendData(clc.Qrad);
            debug_lst.ListAppendData(clc.Qk);
            debug_lst.ListAppendData(clc.Gr);
            debug_lst.ListAppendData(clc.Nu);
            debug_lst.ListAppendData(clc.Alfa);
            debug_lst.ListAppendData(clc.dT);
            debug_lst.ListAppendData(clc.dTw);

            g_Data_debug = debug_lst.GetData();
        }

    } catch (err) {
        ShowERROOR("UpdateT", err);
        return err;
    }

    return null;
}

//--------------------------------------------------------------------------------------------
//-----        Calculator   -------------------------------------------------------
//--------------------------------------------------------------------------------------------
class Calculator {
    constructor(w, t_f) {
        this.W = w;
        this.Tf = t_f;
        this.Pbar = 101325;
        this.Rgas = 287;
        this.Tm = this.Tf;
        this.dT = 0;
        this.Qrad = 0;
        this.Qk = 0;
        this.Gr = 0;
        this.Nu = 0;
        this.Alfa = 0;
        this.dTw = 0;
    }

    MainFunc(tw) {

        this.dT = tw - g_Tf;

        this.Tm = 0.5 * (tw + g_Tf);

        let Betta = 1 / this.Tm;

        this.Qrad = g_Csgma * g_Esp_back * g_Fcylnd * (Math.pow(tw/100, 4) - Math.pow(g_Tf/100, 4));

        this.Qk = this.W - this.Qrad;

        this.Gr = g_G * Betta * this.dT * g_D * g_D * g_D / Math.pow(this.nu(), 2);

        this.Nu = 0.5 * Math.pow(this.Gr * this.Pr(), 0.25);

        this.Alfa = this.Nu * this.lmbda() / g_D;

        this.dTw = this.Qk / (this.Alfa * g_Fcylnd);

        return this.dT - this.dTw;
    }

    ro() {
        return this.Pbar / (this.Rgas * this.Tm);
    }
    Cp() {
        return (0.9956 + 0.000093 * (this.Tm - 273.15)) * 1000;
    }

    mu() {
        return 1.717e-5 * Math.pow(this.Tm / 273, 0.683);
    }
    nu() { return this.mu() / this.ro(); }

    lmbda() { return 2.44e-2 * Math.pow(this.Tm / 273, 0.82); }

    Pr() {
        return this.mu() * this.Cp() / this.lmbda();
    }
}
//--------------------------------------------------------------------------------------------
function getRandomT(nominal, deviation_percent_min, deviation_percent_max) {

    let v_min = (nominal * (1 + deviation_percent_min/100.0))*1000; 
    let v_max = (nominal * (1 + deviation_percent_max/100.0))*1000; 
    return getRandomInt(v_min, v_max) / 1000;
}
function AddRow(i, arr1, arr2=null) {

    let cells = new List();
    
    for (let j = 0; j < arr1.length; j++)
    {
        cells.ListAppendData(arr1[j]);
    }

    if (arr2 != null) {

        for (k = 0; k < arr2.length; k++) {
            cells.ListAppendData(arr2[k]);
        }
    }

    g_list_Result[g_list_ResultIndex] = MkRow(cells.GetData());
    g_list_ResultIndex++;
    return true;
}
class List
{
    List() { 
        this.tg_list_index = 0;
        this.tg_list = null;
    }
    ListResetData()
    {
        this.tg_list_index = 0;
        this.tg_list = [];
    }
    ListAppendData(data)
    {
        if (this.tg_list == null) {
            this.ListResetData();
        }
            
        this.tg_list[this.tg_list_index] = data;
        this.tg_list_index++;
        return this.tg_list_index;
    }
    ListAppendDataFromArray(arr) {
        if (arr == null) return;

        for (let j = 0; j < arr.length; j++) {
            this.ListAppendData(arr[j]);
        }
    }
    GetData() {
        return this.tg_list;
    }
    get length() { return this.tg_list_index; }
}
    

function oninputslider_P_g() {
    try
    {
        //txtP_g.value = slider_P_g.value; 
        txtP_g.value = Math.sqrt(slider_P_g.value * g_Re);
    }
    catch (e) { alert(e.message); }
}
	
  // использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


    
//--------------------------------
//--------------------------------
//--------------------------------
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
    InsertHtml(def_error, mes);
    return mes;

}


function Build() {
    var tbl = MkTbl(g_list_Result);
    InsertHtml(def_tag0, tbl);

}
    //--------------------
function processNumber(inputField) {
    //return inputField.value;

    try {
        var inpVal = parseFloat(inputField.value, 10);
        if (isNaN(inpVal)) {
            var msg = "Please enter a number only.";
            var err = new Error(msg);
            if (!err.message) {
                err.message = msg;
            }
            throw err;
        }
        return inpVal;
    } catch (e) {
        alert(e.message);
        inputField.focus();
        inputField.select();
    }
    /**/
}

//--------------------------------
function InsertT(text) {
    InsertHtml(def_tag0, MkTag("p", text));
}
    //--------------------------------
function InsertHtml(tag,text) {
    var x = document.getElementById(tag);
    x.innerHTML = text;
}
    //--------------------------------

function MkRow(cells) {
    var tbl = "";
    for (var i = 0; i < cells.length; i++) {
        tbl = tbl + MkTag("td", cells[i]);
    }

    return MkTag("tr", tbl);
}

    //--------------------------------

function MkTbl(trows) {
    if (trows == null)
        return MkTag("p", "No data");

    var tbl = "";
    for (var i = 0; i < trows.length; i++) {
        tbl = tbl + trows[i];
    }
    return MkTag2("table", tbl, "border=1 BORDERCOLOR=BLACK ");
}

    //--------------------------------
function MkTag(tag, text) {
    return MkTag2(tag, text, "");
}
    //--------------------------------
function MkTag2(tag, text, atrbs) {
    var ret = "<" + tag + " " + atrbs + " >" + text + "</" + tag + ">";
    return ret;
}

function AddReport(html) {
    AddReport(def_tag0, html);
}
function AddReport(id, html) {
    var x = document.getElementById(id);
    if (x == null) return;
    x.innerHTML = x.innerHTML + html;
}
function AddText(text) {
    AddText0(def_tag0, text);
}

function AddParam(pName, pValue) {
    AddParam0(def_tag0, pName, pValue);
}

function AddText0(id, text) {
    var x = document.getElementById(id);
    if (x == null) return;
    x.innerHTML = x.innerHTML + MkTag("p", text);
}

function AddParam0(id, pName, pValue) {
    var x = document.getElementById(id);
    if (x == null) return;
    x.innerHTML = x.innerHTML + MkTag("p", pName + ": " + pValue);
    return x.innerHTML;
}

function ClearReport() {
    ClearReport(def_tag0);
}
function ClearReport(id) {
    var x = document.getElementById(id);
    if (x == null) return;
    x.innerHTML = "";
}
