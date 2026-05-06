
//version
// 202-04-16

var res = [];
var resIndex = 0;
var txt_U = 0;
var idTypeFlow = 0;
var fShowTimeer = null;
const TT = [
[
    [ 9.31, 10.23, 10.78, 11.18, 11.50, 10.58, 11.23, 9.60, 9.60, 9.60 ],
    [ 10.64, 11.68, 12.31, 12.77, 13.13, 11.52, 12.65, 10.89, 10.89, 10.89 ],
    [ 12.03, 13.22, 13.95, 14.46, 14.86, 13.30, 14.73, 12.26, 12.26, 12.26 ],
    [ 13.51, 14.84, 15.64, 16.19, 16.62, 15.14, 16.11, 13.69, 13.69, 13.69 ],
    [ 15.05, 16.50, 17.34, 17.94, 18.40, 16.19, 17.25, 15.18, 15.18, 15.18 ],
    [ 16.63, 18.18, 27.48, 19.71, 20.19, 17.22, 19.21, 16.70, 16.70, 16.70 ],
    [ 18.23, 19.88, 20.82, 21.48, 21.98, 19.08, 21.10, 18.24, 18.24, 18.24 ],
    [ 19.85, 21.58, 22.56, 23.25, 23.78, 21.77, 22.69, 19.79, 19.79, 19.79 ],
    [ 21.49, 23.29, 24.33, 25.05, 25.59, 23.12, 23.43, 21.36, 21.36, 21.36 ],
    [ 23.13, 25.03, 26.10, 26.84, 27.39, 24.62, 26.34, 22.93, 22.93, 22.93 ]
],
[
    [ 5.04, 5.98, 6.34, 6.61, 6.83, 7.02, 7.17, 7.32, 7.45, 7.56 ],
    [ 6.11, 6.77, 7.20, 7.52, 7.77, 7.99, 8.17, 8.33, 8.47, 8.61 ],
    [ 6.85, 7.62, 8.10, 8.47, 8.76, 9.00, 9.22, 9.40, 9.57, 9.72 ],
    [ 7.63, 8.50, 9.06, 9.47, 9.81, 10.08, 10.32, 10.53, 10.71, 10.89 ],
    [ 8.45, 9.44, 10.06, 10.52, 10.89, 11.21, 11.48, 11.71, 11.93, 12.12 ],
    [ 9.31, 10.41, 11.11, 11.63, 12.04, 12.39, 12.69, 12.95, 13.20, 13.42 ],
    [ 10.21, 11.43, 12.20, 12.78, 13.25, 13.65, 13.98, 14.27, 14.54, 14.77 ],
    [ 11.16, 12.49, 13.36, 14.01, 14.51, 14.94, 15.31, 15.63, 15.91, 16.17 ],
    [ 12.13, 13.63, 14.57, 15.27, 15.82, 16.28, 16.67, 17.01, 17.32, 17.59 ],
    [ 13.16, 14.79, 15.82, 16.56, 17.15, 17.64, 18.06, 18.42, 18.75, 19.03 ]
],
[
    [ 9.78, 10.71, 11.29, 10.46, 9.64, 8.82, 8.82, 8.82, 8.82, 8.82 ],
    [ 11.18, 12.25, 12.89, 11.92, 10.95, 10.01, 10.01, 10.01, 10.01, 10.01 ],
    [ 12.64, 13.86, 14.60, 13.46, 12.34, 11.25, 11.25, 11.25, 11.25, 11.25 ],
    [ 14.20, 15.55, 16.33, 15.06, 13.80, 12.54, 12.54, 12.54, 12.54, 12.54 ],
    [ 15.80, 17.25, 18.09, 16.69, 15.31, 13.92, 13.92, 13.92, 13.92, 13.92 ],
    [ 17.44, 18.98, 19.86, 18.35, 16.84, 15.34, 15.34, 15.34, 15.34, 15.34 ],
    [ 19.09, 20.72, 21.64, 20.02, 18.40, 16.78, 16.78, 16.78, 16.78, 16.78 ],
    [ 20.76, 22.45, 23.43, 21.69, 19.97, 18.24, 18.24, 18.24, 18.24, 18.24 ],
    [ 22.43, 24.22, 25.23, 23.37, 21.54, 19.73, 19.73, 19.73, 19.73, 19.73 ],
    [ 24.13, 25.98, 27.02, 25.07, 23.13, 21.23, 21.23, 21.23, 21.23, 21.23 ]
],
[
    [ 9.66, 10.58, 11.15, 11.56, 11.09, 10.62, 10.17, 10.17, 10.17, 10.17 ],
    [ 11.03, 12.10, 12.74, 13.21, 12.64, 12.09, 11.55, 11.55, 11.55, 11.55 ],
    [ 12.48, 13.70, 14.42, 14.94, 14.29, 13.65, 13.00, 13.00, 13.00, 13.00 ],
    [ 14.02, 15.37, 16.15, 16.70, 15.98, 15.25, 14.52, 14.52, 14.52, 14.52 ],
    [ 15.60, 17.06, 17.90, 18.49, 17.68, 16.88, 16.08, 16.08, 16.08, 16.08 ],
    [ 17.23, 18.77, 19.66, 20.29, 19.41, 18.53, 17.67, 17.67, 17.67, 17.67 ],
    [ 18.87, 20.50, 21.44, 22.07, 21.14, 20.20, 19.27, 19.27, 19.27, 19.27 ],
    [ 20.53, 22.23, 23.21, 23.89, 22.87, 21.87, 20.87, 20.87, 20.87, 20.87 ],
    [ 22.19, 23.98, 25.00, 25.69, 24.62, 23.55, 22.49, 22.49, 22.49, 22.49 ],
    [ 23.82, 25.74, 26.79, 27.51, 26.38, 25.25, 24.13, 24.13, 24.13, 24.13 ]
]
];
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

    idTypeFlow = selectorTypeFlow.value;
    let nameTypeFlow = selectorTypeFlow.options[idTypeFlow].innerHTML;

    ClearReport("idInfo");
    AddParam0("idInfo", "Рабочая жидкость", nameTypeFlow);


    AddRow(("№"), "U", "U_T1", "U_T2", "U_T3", "U_T4", "U_T5", "U_T6", "U_T7", "U_T8", "U_T9", "U_T10");
    Build();

    if (fShowTimeer == null)
        fShowTimeer = setInterval(UpdateT, 1000); 

}
function UpdateT() {

    U = processNumber(txtP_g);
    let id_min = GetID(U);
    let id_max = id_min + 1;
    if (id_min == 9)
    {
        id_min = 8;
        id_max = 9;
    }


    txtT1.value = getRandomT(id_min, id_max, 0);
    txtT2.value = getRandomT(id_min, id_max, 1);
    txtT3.value = getRandomT(id_min, id_max, 2);
    txtT4.value = getRandomT(id_min, id_max, 3);
    txtT5.value = getRandomT(id_min, id_max, 4);
    txtT6.value = getRandomT(id_min, id_max, 5);
    txtT7.value = getRandomT(id_min, id_max, 6);
    txtT8.value = getRandomT(id_min, id_max, 7);
    txtT9.value = getRandomT(id_min, id_max, 8);
    txtT10.value = getRandomT(id_min, id_max, 9);
}
function getRandomT(id_min, id_max, index) {

    let v_min = 1000 * TT[idTypeFlow][id_min][index]; 
    let v_max = 1000 * TT[idTypeFlow][id_max][index];
    return getRandomInt(v_min, v_max) / 1000;
}
function GetU(res)
{
    if (res < 2 )
        return 1.0;
    if (res < 2.1)
        return 2.0;
    if (res < 2.3)
        return 2.2;
    if (res < 2.5)
        return 2.4;
    if (res < 2.7)
        return 2.6;
    if (res < 2.9)
        return 2.8;
    if (res < 3.1)
        return 3.0;
    if (res < 3.3)
        return 3.2;
    if (res < 3.5)
        return 3.4;
    if (res < 3.7)
        return 3.6;

    return 3.8;
}
function GetID(res)
{
    if (res < 2.0)
        return 0;
    if (res < 2.2)
        return 1;
    if (res < 2.4)
        return 2;
    if (res < 2.6)
        return 3;
    if (res < 2.8)
        return 4;
    if (res < 3.0)
        return 5;
    if (res < 3.2)
        return 6;
    if (res < 3.4)
        return 7;
    if (res < 3.6)
        return 8;

    return 9;
}
function AddRow(i, U, ut1, ut2, ut3, ut4, ut5, ut6, ut7, ut8, ut9, ut10) {
    cells = [];
    cells[0] = i;
    cells[1] = U;
    cells[2] = ut1;
    cells[3] = ut2;
    cells[4] = ut3;
    cells[5] = ut4;
    cells[6] = ut5;
    cells[7] = ut6;
    cells[8] = ut7;
    cells[9] = ut8;
    cells[10] = ut9;
    cells[11] = ut10;

    res[resIndex] = MkRow(cells);
    resIndex++;
    return true;
}

    

function oninputslider_P_g() {
    try
    {
        let u = slider_P_g.value * (3.8 - 2.0)/ 100 + 2.0;
        txtP_g.value = GetU(u); 
    }
    catch (e) { alert(e.message); }
}
	
  // использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Register() {

    try {
        U = processNumber(txtP_g);
        UpdateT();

        var ut1 = processNumber(txtT1);
        var ut2 = processNumber(txtT2);
        var ut3 = processNumber(txtT3);
        var ut4 = processNumber(txtT4);
        var ut5 = processNumber(txtT5);
        var ut6 = processNumber(txtT6);
        var ut7 = processNumber(txtT7);
        var ut8 = processNumber(txtT8);
        var ut9 = processNumber(txtT9);
        var ut10 = processNumber(txtT10);

        U = new Intl.NumberFormat('ru-RU',).format(U);
        ut1 = new Intl.NumberFormat('ru-RU',).format(ut1);
        ut2 = new Intl.NumberFormat('ru-RU',).format(ut2);
        ut3 = new Intl.NumberFormat('ru-RU',).format(ut3);
        ut4 = new Intl.NumberFormat('ru-RU',).format(ut4);
        ut5 = new Intl.NumberFormat('ru-RU',).format(ut5);
        ut6 = new Intl.NumberFormat('ru-RU',).format(ut6);
        ut7 = new Intl.NumberFormat('ru-RU',).format(ut7);
        ut8 = new Intl.NumberFormat('ru-RU',).format(ut8);
        ut9 = new Intl.NumberFormat('ru-RU',).format(ut9);
        ut10 = new Intl.NumberFormat('ru-RU',).format(ut10);

        AddRow(resIndex, U, ut1, ut2, ut3, ut4, ut5, ut6, ut7, ut8, ut9, ut10);

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
