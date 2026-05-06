var res = [];
var resIndex = 0;
var fShowTimeer = null;
const Lambda = [36,47,58,98,35];
const Simens = [1.4,7,14,15,4.8];
const Imax = 90;
const Imin = 45;
let idLiquid = -1;
let norm_Tflow = 0;// условная температура воды
const L = 0.045;
const D = 0.006;
const Rr = 0.001;

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

}

function Resetresulttable() {
    res = [];
    resIndex = 0;
}

function New() {

    ClearReport();
    
    Resetresulttable();

    norm_Tflow = getRandomInt(10,20)
    idLiquid = getRandomInt(0,4)

    ClearReport("idInfo");
    AddParam0("idInfo", "Режим охлаждения: ", norm_Tflow);
    AddParam0("idInfo", "Испытуемый образец установлен",idLiquid);

    AddRow("№", "U_T1", "U_T2", "U_T3", "dU_1-2", "dU_2-3", "Uk", );
    Build();

    fShowTimeer = setInterval(UpdateT, 1000); 

}
function UpdateT() {


    // ------------------------------------------------
    // CORE CALC  

    S = 0.25 * Math.PI * D * D;
    I = processNumber(txtP_g);
    valLambda = Lambda[idLiquid];
    valSimens = Simens[idLiquid];

    ro = 1 / (valSimens * 1e6);
    dU = I * L * ro / S;
    dUk = I * Rr;
    dt = I * L * dU / (2  * S * valLambda);

    t1 = norm_Tflow*(1 + getRandomInt(10, 40)/100.0);
    t3 = norm_Tflow*(1 + getRandomInt(10, 40)/100.0);
    t_mid = 0.5*(t1 + t3);
    t2 = t_mid+ dt;

    Ut1 = t1 * 0.0695;
    Ut3 = t3 * 0.0695;
    Ut2 = t2 * 0.0695;

    flag1 = getRandomInt(0, 2) - 1;
    flag2 = getRandomInt(0, 2) - 1;

    ddU12 = getRandomInt(0, 40)/100.0;
    ddU23 = getRandomInt(0, 40)/100.0;
    dU12 = dU*(1 + flag1*ddU12);
    dU23 = dU*(1 + flag2*ddU23);

    // ------------------------------------------------

    txtT1.value = Ut1;
    txtT2.value = Ut2;
    txtT3.value = Ut3;
    txtT4.value = dU12 * 1000;
    txtT5.value = dU23 * 1000;
    txtT6.value = dUk  * 1000;
}

//--------------------------------------------------------------------------------------------------
function AddRow(i, ut1, ut2, ut3, ut4, ut5, ut6) {
    cells = [];
    cells[0] = i;
    cells[1] = ut1;
    cells[2] = ut2;
    cells[3] = ut3;
    cells[4] = ut4;
    cells[5] = ut5;
    cells[6] = ut6;

    res[resIndex] = MkRow(cells);
    resIndex++;
    return true;
}

    

function oninputslider_P_g() {
    try
    {
        let I = slider_P_g.value * (Imax-Imin)/ 100 + Imin;
        txtP_g.value = I; 
    }
    catch (e) { alert(e.message); }
}
	
  // использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Register() {

    try {
        //U = processNumber(txtP_g);
        UpdateT();

        var ut1 = processNumber(txtT1);
        var ut2 = processNumber(txtT2);
        var ut3 = processNumber(txtT3);
        var ut4 = processNumber(txtT4);
        var ut5 = processNumber(txtT5);
        var ut6 = processNumber(txtT6);

        ut1 = new Intl.NumberFormat('ru-RU',).format(ut1);
        ut2 = new Intl.NumberFormat('ru-RU',).format(ut2);
        ut3 = new Intl.NumberFormat('ru-RU',).format(ut3);
        ut4 = new Intl.NumberFormat('ru-RU',).format(ut4);
        ut5 = new Intl.NumberFormat('ru-RU',).format(ut5);
        ut6 = new Intl.NumberFormat('ru-RU',).format(ut6);

        AddRow(resIndex, ut1, ut2, ut3, ut4, ut5, ut6);

    }
    catch (e) {
        //alert(e.message);
        AddRow(resIndex, e.message, "", "", "", "", "", "", "", "", "");
    }

    Build();
}
    


function Build() {
    var tbl = MkTbl(res);
    InsertH(tbl);

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
    InsertH(MkTag("p", text));
}
    //--------------------------------
function InsertH(text) {
    var x = document.getElementById("id0");
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
    AddReport("id0", html);
}
function AddReport(id, html) {
    var x = document.getElementById(id);
    if (x == null) return;
    x.innerHTML = x.innerHTML + html;
}
function AddText(text) {
    AddText0("id0", text);
}

function AddParam(pName, pValue) {
    AddParam0("id0", pName, pValue);
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
    ClearReport("id0");
}
function ClearReport(id) {
    var x = document.getElementById(id);
    if (x == null) return;
    x.innerHTML = "";
}
