<!--
var supportStorage = (function() {  // Detect localStorage availability for Quiz history, Quiz templates (Custom Quiz) and Overall analysis 
	try {
		var mod = "test";
		localStorage.setItem(mod, mod);
		localStorage.removeItem(mod);
		return true;
	} catch (exception) {
		return false;
	}
}());

var nodejsHost = "http://cdore.no-ip.biz:3000/nod/";
//"https://sslgserver-googleserv.44fs.preview.openshiftapps.com/";
//"http://192.168.2.10:3000/nod/";
//"http://cdore.no-ip.biz:3000/nod/";

function getWidth(){
return 300;
}

var imgData;
var txtTP = "Cliquer pour photo";
var txtRP = "< Rogner&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;Pivoter >";


function initCamImgCapture(){
mailTXT = document.getElementById('mailTXT');
tipTxt = document.getElementById('tipTxt');

if (supportStorage){
var eMailAdress = localStorage.getItem("eMailAdress");
if (eMailAdress)
	mailTXT.value = eMailAdress;
}

(function() {

var data = null;
var vendorURL;
  var streaming = false,
      objModal     = document.querySelector('#objModal'),
	  objClip      = document.querySelector('#objClip'),
	  toolDiv      = document.querySelector('#toolDiv'),
	  divVideo     = document.querySelector('#divVideo'),
	  video        = document.querySelector('#video'),
      canvas       = document.querySelector('#canvas'),
      resPhoto     = document.querySelector('#resPhoto'),
	  trimDiv      = document.querySelector('#trimDiv'),
	  buttonZone   = document.querySelector('#buttonZone'),
	  butRetry     = document.querySelector('#butRetry'),
	  butOk        = document.querySelector('#butOk'),
	  butCancel    = document.querySelector('#butCancel'),
	  butFile      = document.querySelector('#butFile'),
	  butCallFile  = document.querySelector('#butCallFile'),
      width = getWidth(),
      height = 0;
	var ctx;

// Stream video
  navigator.getMedia = ( navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia ||
                         navigator.msGetUserMedia);

if (navigator.getMedia){
//alert(navigator.getMedia);
  navigator.getMedia(
    {
      video: true,
      audio: false
    },
    function(stream) {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream;
      } else {
        vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
	  objModal.style.visibility="visible";
	butCancel.addEventListener('click', function(ev){
		stopStream(stream);
		objModal.style.visibility="hidden";
		trimDiv.style.visibility="hidden";
		ev.preventDefault();
	}, false);
    },
    function(err) {   // Video not available
	//alert("Erreur getMedia");
		resPhoto.style.display="inherit";
		butRetry.style.display="none";
		butCallFile.style.display="inline";
		butFile.onchange = readImage;
		ctx = canvas.getContext("2d");
		buttonZone.style.display="inherit";
		objModal.style.visibility="visible";
      console.log("An error occured! " + err);
	  butCancel.addEventListener('click', function(ev){
		objModal.style.visibility="hidden";
		trimDiv.style.visibility="hidden";
		ev.preventDefault();
	  }, false);
    }
  );
}else{ //No media available
//alert("No getMedia");
	  //divVideo.style.height = width + "px";
		resPhoto.style.display="inherit";
		//resPhoto.style.height = width + "px"; 
		butRetry.style.display="none";
		video.style.display="none";
		butCallFile.style.display="inline";
		butFile.onchange = readImage;
		var ctx = canvas.getContext("2d");
		buttonZone.style.display="inherit";
		objModal.style.visibility="visible";
	  butCancel.addEventListener('click', function(ev){
		objModal.style.visibility="hidden";
		ev.preventDefault();
	  }, false);
}
// End stream video
	
	canvas.width = width;
	divVideo.style.width = width + "px";
	objClip.style.width = width + "px";
	objClip.style.left = (((objModal.offsetWidth - width) / 2) - 5) + "px";

    video.addEventListener('canplay', function(ev){
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth/width);
	  divVideo.setAttribute('height', height);
      video.setAttribute('width', width);
      video.setAttribute('height', height);
      canvas.setAttribute('width', width);
      canvas.setAttribute('height', height);
      streaming = true;
    }
  }, false);


  function takepicture() {
	var buttonZone = document.getElementById('buttonZone');
	var toolDiv = document.getElementById('toolDiv');
	var butTrim = document.getElementById('butTrim');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(video, 0, 0, width, height);
    data = canvas.toDataURL('image/png');
	setimgData(data);
	toolDiv.style.display="inherit";
	buttonZone.style.display="inherit";
	butTrim.style.display="none";
	tipTxt.innerHTML = txtRP;
	tipTxt.title = txtRP;
  }

  video.addEventListener('click', function(ev){
	resPhoto.style.display="inherit";
      takepicture();
    ev.preventDefault();
  }, false);

  butOk.addEventListener('click', function(ev){
    if (imgData == null)
		takepicture();
    if (capture(data))
		butCancel.click();
    ev.preventDefault();
  }, false);

  
function readImage() {
var imgObj = document.getElementById('imgObj')
    if ( this.files && this.files[0] ) {
		ctx.clearRect(0,0,canvas.width, canvas.height);
        var FR= new FileReader();
        FR.onload = function(e) {
           var img = new Image();
           img.src = e.target.result;
           img.onload = function() {
			height = width * img.height / img.width;
			imgObj.src = img.src;
			//divVideo.style.height = height + "px";
			//resPhoto.style.height = height + "px";
			//canvas.width = width;
			canvas.height = height;
			divVideo.style.height = height + "px";
			objClip.style.height = height + "px";
            ctx.drawImage(img, 0, 0, width, height);
			setimgData(canvas.toDataURL('image/png'));
			toolDiv.style.display="inherit";
			buttonZone.style.display="inherit";
			tipTxt.innerHTML = txtRP;
			tipTxt.title = txtRP;
           };
        };       
        FR.readAsDataURL( this.files[0] );
    }
}
  
})();

}
// END initCamImgCapture

function retryCapture(){
var resPhoto = document.getElementById('resPhoto')
	resPhoto.style.display="none";
	tipTxt.innerHTML = txtTP;
	tipTxt.title = txtTP;
	imgData = null;
  }

function stopStream(stream) {
if (stream){
	stream.getVideoTracks().forEach(function (track) {
		track.stop();
	});
	}
}

function capture(data){
var eMailAdress = mailTXT.value;
if (eMailAdress && eMailAdress != ""){
	if (supportStorage)
		localStorage.setItem("eMailAdress", eMailAdress);
}else{
	alert("S.v.p. saisir une adresse courriel.");
	mailTXT.focus();
	return false;
}
//alert(data);
sendServ(eMailAdress, imgData);
return true;
}

function sendServ(eMailAdress, data){
var urlInfo = document.location.href;
if (urlInfo.indexOf("192.168.2.10") != -1)
	nodejsHost = "http://192.168.2.10:3000/nod/";

	var strCom = nodejsHost + "sendImage?" ;
	var fd = new FormData();
	fd.append("mailInfo", eMailAdress);
	fd.append("testInfo", "test");
	fd.append("afile", data);

var xhr = new XMLHttpRequest(); 
  xhr.onloadend = function() {
    var text = xhr.responseText;
    //alert('Response from CORS request to : ' + text);
  };
	xhr.open("POST", strCom);
	xhr.setRequestHeader("Content-Type", "multipart/form-data");
	xhr.send(fd);	
}

function setimgData(data){
var imgObj = document.getElementById('imgObj');
imgData = data;
imgObj.src = imgData;
}

var objDrag;

function CIallowDrop(ev) {
    ev.preventDefault();
		return false
}

function CIdrag(ev) {

	objDrag = ev.target;
    ev.dataTransfer.setData("text", ev.target.id);
	ev.dataTransfer.setData("clicLeft", ev.clientX - objDrag.offsetLeft);
	ev.dataTransfer.setData("clicTop", ev.clientY - objDrag.offsetTop  );
	
	var x=1;
}

function CIdrop(ev) {
var parentDiv = document.getElementById('zoneDiv');

    ev.preventDefault();
    var clicLeft = ev.dataTransfer.getData("clicLeft");
	var clicTop = ev.dataTransfer.getData("clicTop");
    //ev.target.appendChild(document.getElementById(data));
		objDrag.style.left = ev.clientX  - clicLeft + "px";;
		objDrag.style.top = ev.clientY  - clicTop + "px";
			var x=1;
}

function showTrimTool(){
var resPhoto = document.getElementById('resPhoto');
var trimDiv = document.getElementById('trimDiv');
var butTrim = document.getElementById('butTrim');
if (trimDiv.offsetHeight > resPhoto.offsetHeight * .9){
	trimDiv.style.height = (resPhoto.offsetHeight * .9) + "px"; 
	trimDiv.style.width = (resPhoto.offsetHeight * .9) + "px"; 
	}
butTrim.style.display = "inherit";
trimDiv.style.left = (((objClip.offsetWidth - trimDiv.offsetWidth) / 2) ) + "px";
trimDiv.style.top = (((objClip.offsetHeight - trimDiv.offsetHeight) / 3) ) + "px";
trimDiv.style.visibility = "visible";
}

function trimImg(){
trimDiv = document.getElementById('trimDiv');
canvas = document.getElementById('canvas');

var actImg = new Image();
actImg.src = imgData;

canvas2 = document.getElementById('canvas2');
canvas2.width = trimDiv.offsetWidth;
canvas2.height = trimDiv.offsetHeight;
ctx = canvas2.getContext("2d");

var x = trimDiv.offsetLeft + 3;
var y = trimDiv.offsetTop + 3;
var w = trimDiv.offsetWidth - 5;
var h = trimDiv.offsetHeight - 5;
ctx.drawImage(actImg,x,y,w,h,0,0,w,h);

setimgData(canvas2.toDataURL('image/png'));
}

function rotateImg(){
var img = document.getElementById('imgObj');
var rotateImg = document.getElementById('rotateImg');

//rotateImg .style.display = "none";
//imgObj.style.transform = "rotate(90deg)";

canvas2 = document.querySelector('#canvas2');

canvas2.width = canvas.width;
canvas2.height = canvas.height;
ctx = canvas2.getContext("2d");
ctx.clearRect(0,0,canvas2.width, canvas2.height);
ctx.save();
//http://jsfiddle.net/m1erickson/EQx8V/

ctx.translate(canvas.width/2,canvas.height/2);
ctx.rotate(Math.PI/2);
ctx.drawImage(img,-img.width/2,-img.height/2);
ctx.rotate(-Math.PI/2);
ctx.translate(-canvas.width/2,-canvas.height/2);

setimgData(canvas2.toDataURL('image/png'));
//alert(img);
img.onload = function() {
	canvas = document.querySelector('#canvas');
	context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(img, 0, 0, img.width, img.height);
};
img.src = imgData;
// testing...just draw a rect top-left
//ctx.fillRect(0,0,25,10);
}

function test(){
alert("Test");
}
	
// -->
