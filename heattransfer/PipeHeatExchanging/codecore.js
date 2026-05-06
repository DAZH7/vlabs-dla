
//------------------------------------------------------------------
// ЛАБОРАТОРНАЯ РАБОТА.
// ИССЛЕДОВАНИЕ РАБОТЫ ТЕПЛООБМЕННОГО АППАРАТА ПРИ ИМИТАЦИОННОМ МОДЕЛИРОВАНИИ
//
// codecore.js     2024-05-02+
//
// copyright, www.sibsau.ru, d_zhuikov@sibsau.ru, 2024
//------------------------------------------------------------------


const KgsPerSqM = 9.807;
const TK = 273.15;
const Rg = 287;
const TRUE = 1;
const FALSE = 0;
const deltaMax = 0.01; // относительная погрешность последовательного приблдиженния
var res = [];
var resIndex = 0;
let m_D1 = 0.0085;
let m_L = 0.720;
let m_Pb = 101325;
let m_tf1 = 25;
let x = [25, 45, 85, 155, 250, 370, 490, 610, 690, 715];
let ShowTimeer = null;
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
    try {
        ClearReport();

        Resetresulttable();

        m_Pb = processNumber(editbox_Pb) * 101325 / 760.0;
        m_D1 = processNumber(editbox_D1) / 1000.0;
        m_L = processNumber(editbox_L) / 1000.0;
        m_tf1 = processNumber(editbox_t11);

        if (m_D1 <= 0) { alert("Ошибка исходных данных: D1 <= 0 ."); return; }
        if (m_L <= 0) { alert("Ошибка исходных данных: L <= 0."); return; }
        if (m_Pb <= 0) { alert("Ошибка исходных данных: Pb <= 0 ."); return; }
        if (m_tf1 <= 0) { alert("Ошибка исходных данных: tf1 <= 0 ."); return; }

        ClearReport("idInfo");
        AddParam0("idInfo", "Диаметр трубы внутрениий D1, м", m_D1);
        AddParam0("idInfo", "Длина трубы L, м", m_L);
        AddParam0("idInfo", "Атмосферное давление, Па", m_Pb);
        AddParam0("idInfo", "Температура воздуха на входе в трубу, C", m_tf1);

        AddRow("№", "U", "dP", "dH", "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12");
        Build();

        let element = document.getElementById("bttnGetValues");
        element.removeAttribute("hidden");

        if (ShowTimeer != null)
            clearTimeout(ShowTimeer);            
        ShowTimeer = setInterval(Calculate, 1000);
    }
    catch (e) {

        ErrorMess(-1, e.message);
    }


}

function get_U() {

    return processNumber(editbox_U) * 5.0 / 100.0 + 1;
}
function get_dH() {

    return processNumber(editbox_dH) * 797. / 100. + 100;
}
function Calculate() {

    m_Pb = processNumber(editbox_Pb) * 101325 / 760.0;
    m_D1 = processNumber(editbox_D1) / 1000.0;
    m_L = processNumber(editbox_L) / 1000.0;
    m_tf1 = processNumber(editbox_t11);

    let _U = get_U();
    let _dH = get_dH();
    let _dPg = 0;
    let Fd = Math.PI * m_D1 * m_D1 / 4;
    let Fl = Math.PI * m_D1 * m_L;

    let tf2 = 100;//Конечная температура в первом приближении
    let tw_mid = 105; //Температура стенки средняя в первом приближении
    let tw = []; // Температура стенки локальная

    for (var i = 0; i < 10; i++) // подбор tw_mid
    {
        for (var j = 0; j < 10; j++) // подбор tf2
        {
            tf_mid = 0.5 * (tf2 + m_tf1);
            Tfmid = tf_mid + 273.15;

            ro = m_Pb / (Rg * Tfmid);
            mu = 1.717e-5 * Math.pow(Tfmid / 273.15, 0.683);
            nu = mu / ro;
            lm = 2.44e-2 * Math.pow(Tfmid / 273.15, 0.82);
            Cp = 995.6 + 0.093 * tf_mid;
            Pr = mu * Cp / lm;

            Gf = 0.63 * Fd * Math.sqrt(2 * ro * _dH);
            Re = 4 * Gf / (Math.PI * m_D1 * mu);
            W = Re * nu / m_D1;
            ksi = 0.316 * Math.pow(Re, -0.25);
            _dPg = ksi * W * W * ro * m_L / (2 * m_D1);


            Qe = _U * _U / 0.0344;
            dzt = 1.25;// коэффициент подгона 
            Qrad = 0.18 * (tw_mid - tf_mid);

            Qk = Qe - Qrad;

            tf2_ = m_tf1 + Qk / (Gf * Cp);

            deltaTf = Math.abs(tf2 - tf2_) / tf2;
            
            tf2 = tf2_;
            if (deltaTf < deltaMax)
            {
                break;
            }
        }
        tf_mid = 0.5 * (tf2 + m_tf1);
        Tfmid = tf_mid + 273.15;
        ro2 = (m_Pb - _dPg) / (Rg * Tfmid);
        lm2 = 2.44e-2 * Math.pow(Tfmid / 273.15, 0.82);
        tw_mid_ = 0;
        for (var k = 0; k < x.length; k++) // температуры вдоль стенки
        {
            xd = x[k] / (1000 * m_D1);
            eps = 1 + 0.5 / xd;
            Nu = 0.023 * Math.pow(Re, 0.8) * Math.pow(Pr, 0.43) * eps;
            alfa = Nu * lm2 / m_D1;
            dTw = Qk / (Fl * alfa);

            tw[k] = m_tf1 + (tf2 - m_tf1) * x[k] / (1000 * m_L) + dTw;
            tw_mid_ += tw[k] / x.length;
        }

        deltaTwmid = Math.abs(tw_mid - tw_mid_) / tw_mid_;

        tw_mid = tw_mid_;
        if (deltaTwmid < deltaMax) {
            break;
        }
    }


    T01.value = getRandomT(tw[0], 3);
    T02.value = getRandomT(tw[1], 3);
    T03.value = getRandomT(tw[2], 3);
    T04.value = getRandomT(tw[3], 3);
    T05.value = getRandomT(tw[4], 3);
    T06.value = getRandomT(tw[5], 3);
    T07.value = getRandomT(tw[6], 3);
    T08.value = getRandomT(tw[7], 3);
    T09.value = getRandomT(tw[8], 3);
    T10.value = getRandomT(tw[9], 3);
    T11.value = getRandomT(m_tf1, 3);
    T12.value = getRandomT(tf2, 3);

    V_U.value = getRandomT(_U, 2);
    V_dH.value = getRandomT(_dH, 6);
    V_dPg.value = getRandomT(_dPg, 2);
}


function Register() {

    try {

        Calculate();

        _U = new Intl.NumberFormat('ru-RU',).format(processNumber(V_U));
        _dPg = new Intl.NumberFormat('ru-RU',).format(processNumber(V_dPg));
        _dH = new Intl.NumberFormat('ru-RU',).format(processNumber(V_dH));
        _T01 = new Intl.NumberFormat('ru-RU',).format(processNumber(T01));
        _T02 = new Intl.NumberFormat('ru-RU',).format(processNumber(T02));
        _T03 = new Intl.NumberFormat('ru-RU',).format(processNumber(T03));
        _T04 = new Intl.NumberFormat('ru-RU',).format(processNumber(T04));
        _T05 = new Intl.NumberFormat('ru-RU',).format(processNumber(T05));
        _T06 = new Intl.NumberFormat('ru-RU',).format(processNumber(T06));
        _T07 = new Intl.NumberFormat('ru-RU',).format(processNumber(T07));
        _T08 = new Intl.NumberFormat('ru-RU',).format(processNumber(T08));
        _T09 = new Intl.NumberFormat('ru-RU',).format(processNumber(T09));
        _T10 = new Intl.NumberFormat('ru-RU',).format(processNumber(T10));
        _T11 = new Intl.NumberFormat('ru-RU',).format(processNumber(T11));
        _T12 = new Intl.NumberFormat('ru-RU',).format(processNumber(T12));

        AddRow(resIndex, _U, _dPg, _dH, _T01, _T02, _T03, _T04, _T05, _T06, _T07, _T08, _T09, _T10, _T11, _T12);

    }
    catch (e) {
        //alert(e.message);
        ErrorMess(resIndex, e.message);
    }

    Build();
}
function ErrorMess(resIndex, emessage) {
    cells = [resIndex, emessage];

    res[resIndex] = MkRow(cells);
    resIndex++;
    return true;
}

function getRandomT(normval, percent) {

    let v_min = 1000 * normval * (1.0 - percent/100.); 
    let v_max = 1000 * normval * (1.0 + percent / 100.);
    return getRandomInt(v_min, v_max) / 1000;
}

function AddRow(i, _U, _dPg, _dH, _T01, _T02, _T03, _T04, _T05, _T06, _T07, _T08, _T09, _T10, _T11, _T12) {
    cells = [i, _U, _dPg, _dH, _T01, _T02, _T03, _T04, _T05, _T06, _T07, _T08, _T09, _T10, _T11, _T12];

    res[resIndex] = MkRow(cells);
    resIndex++;
    return true;
}

    

function oninputslider_H() {
    try
    {
        let v = slider_H.value;
        editbox_dH.value = v; 
    }
    catch (e) {  }
}
function oninputslider_U() {
    try {
        let u = slider_U.value;
        editbox_U.value = u;
    }
    catch (e) { }
}

  // использование Math.round() даст неравномерное распределение!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function Build() {
    var tbl = MkTbl(res);
    InsertH(tbl);

}
    //--------------------
function processNumber(inputField) {
    //return inputField.value;

    try {
        if (inputField.value == null || inputField.value == "")
            return 0;

        var inpVal = parseFloat(inputField.value, 10);
        if (isNaN(inpVal)) {
            var msg = "Please enter a number only:" + inputField.pName;
            var err = new Error(msg);
            if (!err.message) {
                err.message = msg;
            }
            throw err;
        }
        return inpVal;
    } catch (e) {
        ErrorMess(resIndex, e.message);
        //alert(e.message);
    //    inputField.focus();
    //    inputField.select();
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
