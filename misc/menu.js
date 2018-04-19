<!--


var subMenus = [
	{
	"parent": "oMenu2",
	"options": [
					{
					"caption": "Repas de la semaine",
					"href": "https://www.traiteursimpas.com/"
					},
					{
					"caption": "Nos mets",
					"href": "https://www.traiteursimpas.com/"
					},
					{
					"caption": "Questions fréquentes",
					"href": "https://www.traiteursimpas.com/"
					}
				]
	},
	{
	"parent": "oMenu3",
	"options": [
					{
					"caption": "Buffet froid",
					"href": "https://www.traiteursimpas.com/"
					},
					{
					"caption": "Boîte à lunch",
					"href": "https://www.traiteursimpas.com/"
					},
					{
					"caption": "Cocktail dînatoire",
					"href": "https://www.traiteursimpas.com/"
					},
					{
					"caption": "Chef à domicile",
					"href": "https://www.traiteursimpas.com/"
					}
				]
	}
]


function initMenu(selID){
var optColl = document.getElementsByClassName("optMenu");
for (i = 0; i < optColl.length; i++) {
	if (optColl[i].id == selID)
		optColl[i].classList.add('selectedOpt');
}
}

function showSubMenu(oOpt){
var ht = 0;
var docBody = document.getElementsByTagName("BODY")[0];
var parent = oOpt.parentNode;
var subName = oOpt.id + "sub";
var subOptions = false;
var subElem = document.getElementById(subName);
// Close other sub menu
var othSub = document.getElementsByClassName("submenu");
for (i = 0; i < othSub.length; i++) {
	outSub(othSub[i])
}
if (subElem){
	subElem.style.height = "auto";
}else{
	for (i = 0; i < subMenus.length; i++) {
		if (subMenus[i].parent == oOpt.id)
			subOptions = subMenus[i].options;
	}
	if (subOptions){
		var divElem = document.createElement("div");
		divElem.setAttribute('id', subName);
		divElem.setAttribute('class', 'submenu');		
		divElem.setAttribute('onmouseleave', 'outSub(this)');
		for (i = 0; i < subOptions.length; i++) {
			opt = addMenuOpt(subOptions[i]);
			ht =+ 1;
			divElem.appendChild(opt);
		}
		docBody.appendChild(divElem);
		subElem = divElem;
	}
}
if (subElem){
	subElem.style.top = parent.offsetHeight + "px" ;
	subElem.style.left = parent.offsetLeft + "px" ;
	subElem.style.opacity = 1;
	}
}

function addMenuOpt(attrib){
//for (i = 0; i < optColl.length; i++) {
var ancElem = document.createElement("a");
ancElem.setAttribute('class', 'inputButton');
if (attrib.href)
	ancElem.setAttribute('href', attrib.href);
if (attrib.target)
	ancElem.setAttribute('target', attrib.target);
if (attrib.caption)
	ancElem.innerHTML = attrib.caption;
return ancElem;
}

function outSub(oSub){
oSub.style.opacity = 0;
}


// -->
