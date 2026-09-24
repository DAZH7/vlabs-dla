function onLoadPage() {

	let name = sessionStorage.getItem("name");
	if (name == null || name == "")
		name = "EMPTY";
	let html = name;//MkTag("p", name);
	InsertHtml("idResultTable", html);

}
//--------------------------------

function InsertHtml(id, text) {
	let x = document.getElementById(id);
	if (x != null)
		x.innerHTML = text;
}
//--------------------------------
function MkTag(tag, text) {
	return MkTag2(tag, text, "");
}
//--------------------------------
function MkTag2(tag, text, atrbs) {
	let ret = "<" + tag + " " + atrbs + " >" + text + "</" + tag + ">";
	return ret;
}
