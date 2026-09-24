///---------------------------------------------
///
/// code.js
/// 2026-09-04
///
///---------------------------------------------


 //-------------------------------- 
function onLoad()
{
 InsertT("----?---"); 
}
 //-------------------------------- 
function Start() 
{
	try
	{
		DoWork();
	}
	catch(e)
	{
	  alert("Exception: " + e.message);
	}
}
 
 //-------------------------------- 
function DoWork()
{
	let nbulltes = txtBullets.value;
	var nquestions = txtCount.value;
	var txtb = txtBlob.value;
	acells = txtb.split("\n");
	acells = PrepareArrayTexts( acells ) ;

	var n = acells.length;

	var groups = generateUniqueGroups(1, n, nbulltes, nquestions);

	var htmlTotal = new Array(); 
		
	var clip = new Array(); 
	var iclip = 0;	
	for(var i = 0; i < groups.length; i++) 
	{
		let g = groups[i];

		var bullets = new Array(); 
		for(var j = 0; j < g.length ; j++) 
		{
			let index_in_group = g[j];
			bullets[j] = acells[index_in_group];
		}
		clip[iclip] = bullets;
		iclip++;
	}
	for(var iclip = 0; iclip < clip.length; iclip ++) 
	{
		var number = iclip + 1;
		var bullet = MkList( clip[iclip] );
		htmlTotal.push("-------------------------------------------<br/>");
		htmlTotal.push("Билет №"+number);
		htmlTotal.push(bullet);
	}
	
	InsertH(htmlTotal.join("&nbsp;")); 
}
/**
 * Генерация указанного количества групп из 3 уникальных случайных чисел
 * @param {number} min - Минимальное значение диапазона (включительно)
 * @param {number} max - Максимальное значение диапазона (включительно)
 * @param {number} count - Количество групп для генерации
 * @returns {number[][]} - Массив групп, каждая группа содержит 3 числа
 */
function generateUniqueGroups(min, max, count, nquestions) {
    // Проверка валидности входных данных
    if (min > max) {
        throw new Error('Минимальное значение не может быть больше максимального');
    }
    
    const rangeSize = max - min + 1;
    if (rangeSize < nquestions) {
        throw new Error('Диапазон должен содержать минимум 3 числа');
    }
    
    if (count <= 0) {
        throw new Error('Количество групп должно быть положительным числом');
    }
    
    // Максимально возможное количество уникальных групп
    const maxPossibleGroups = Math.floor(rangeSize / nquestions);
    if (count > maxPossibleGroups) {
        console.warn(`Максимально возможное количество групп: ${maxPossibleGroups}. 
                     Будет сгенерировано ${maxPossibleGroups} групп вместо ${count}`);
        count = maxPossibleGroups;
    }
    
    const groups = [];
    const usedNumbers = new Set();
    
    // Генерируем группы с уникальными числами
    for (let i = 0; i < count; i++) {
        const group = [];
        let attempts = 0;
        const maxAttempts = 10000;
        
        while (group.length < nquestions && attempts < maxAttempts) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            
            // Проверяем, что число не использовано ни в одной группе и не дублируется в текущей
            if (!usedNumbers.has(num) && !group.includes(num)) {
                group.push(num);
                usedNumbers.add(num);
            }
            attempts++;
        }
        
        // Если не удалось найти 3 уникальных числа, прерываем генерацию
        if (group.length < nquestions) {
            console.warn(`Не удалось сгенерировать группу ${i + 1}. 
                         Доступно уникальных чисел: ${rangeSize - usedNumbers.size}`);
            break;
        }
        
        groups.push(group);
    }
    
    return groups;
}
 //-------------------------------- 
function Build( acells )
{
  var tbl = MkTbl(acells) ;
  
  
  InsertH(tbl); 
  
}
function PrepareArrayTexts( acells ) 
{
	var txtArray = new Array( );
	
	var j = 0
	for(var i = 0; i < acells.length; i++) 
	{
		var str = acells[i];
		
		if(str == null || str == "" || str.length == 0 ) continue;
		str = str.trim();
		
		if(str.length > 0 )
		{
			txtArray[j]  = str;
			j ++;
		}
	}

  return txtArray;
}

function MkList( acells ) //<ol type="1"><li>Coffee</li></ol>
{
	var txtArray = new Array( );
	txtArray.push("<ol type=\"1\">");
	
	for(var i = 0; i < acells.length; i++) 
	{
		txtArray.push(MkTag("li",acells[i]));
	}
	txtArray.push("</ol>");
  return txtArray.join("");
}

//--------------------
function processNumber(inputField) 
{ 
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
} 
catch (e) { 
alert(e.message); 
inputField.focus(); 
inputField.select(); 
} 
/**/
} 
 //-------------------------------- 
function InsertT(text)
{
  InsertH(MkTag("p", text));
} 
 //-------------------------------- 
function InsertH(text)
{
	var x=document.getElementById("id0"); 
	x.innerHTML = text;
}
 //-------------------------------- 

function MkRow(cells)
{
 var tbl= "";
 for(var i = 0; i < cells.length; i++) 
 {
	tbl = tbl + MkTag("td", cells [i]); 
 }

 return MkTag("tr", tbl) ;
}
 
//-------------------------------- 

function MkTbl(trows)
{
 var tbl= "";
 for(var i = 0; i < trows.length; i++) 
 {
 tbl = tbl + trows[i] ;
  }
 return MkTag2("table", tbl,"border=1 BORDERCOLOR=RED ") ;
} 

//-------------------------------- 
function MkTag(tag, text)
{
 return MkTag2(tag, text, "");
} 
//-------------------------------- 
function MkTag2(tag, text, atrbs)
{
 var ret= "<"+tag+" "+atrbs+" >"+text+"</"+tag+">";
 return ret;
} 

