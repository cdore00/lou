<!--

var CIimgData;

function getWidth(){
return 300;
}

function setimgData(data){
var imgObj = document.getElementById('imgObj');
if (data == null)
	imgObj.style.visibility="hidden";
else
	imgObj.style.visibility="visible";

CIimgData = data;
imgObj.src = CIimgData;
}

function initCamImgCapture(){  // Start image capture object initialisation
tipTxt = document.getElementById('tipTxt');


(function() {

var data = null;

  var streaming = false,
      objModal     = document.getElementById('objModal'),
	  objClip      = document.getElementById('objClip'),
	  toolDiv      = document.getElementById('toolDiv'),
	  divVideo     = document.getElementById('divVideo'),
	  video        = document.getElementById('video'),
      canvas       = document.getElementById('canvas'),
      resPhoto     = document.getElementById('resPhoto'),
	  trimDiv      = document.getElementById('trimDiv'),
	  //buttonZone   = document.getElementById('buttonZone'),
	  butRetry     = document.getElementById('butRetry'),
	  butOk        = document.getElementById('butOk'),
	  butCancel    = document.getElementById('butCancel'),
	  butFile      = document.getElementById('butFile'),
	  butCallFile  = document.getElementById('butCallFile'),
      width = getWidth(),
      height = 0,
	  txtTP = "Cliquer pour photo",
      txtRP = "< Rogner&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;&#8239;Pivoter >",
	  ctx;

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
        var vendorURL = window.URL || window.webkitURL;
        video.src = vendorURL.createObjectURL(stream);
      }
      video.play();
	  video.style.visibility = "visible";
	  objModal.style.visibility="visible";
	butCancel.addEventListener('click', function(ev){
		stopStream(stream);
		quitPhoto();
		ev.preventDefault();
	}, false);
    },
    function(err) {   // Video not available
	//alert("Erreur getMedia");
		setNoVideo();
      console.log("An error occured! " + err);
	  butCancel.addEventListener('click', function(ev){
		quitPhoto();
		ev.preventDefault();
	  }, false);
    }
  );
}else{ //No media available
//alert("No getMedia");
		setNoVideo();
	  butCancel.addEventListener('click', function(ev){
		  quitPhoto();
		ev.preventDefault();
	  }, false);
}
// End stream video
	
  video.addEventListener('click', function(ev){
	resPhoto.style.display="inherit";
      takepicture();
    ev.preventDefault();
  }, false);

  butOk.addEventListener('click', function(ev){
    if (CIimgData == null)
		takepicture();
	if (trimDiv.style.visibility == "visible")
		trimImg();
		
	butCancel.click();
    ev.preventDefault();
  }, false);

  butRetry.addEventListener('click', function(ev){
	var tipDiv = document.getElementById('tipDiv');
	toolDiv.style.display="none";
	tipDiv.style.display="inherit";
	resPhoto.style.display="none";
	tipTxt.innerHTML = txtTP;
	tipTxt.title = txtTP;
	setimgData(null);
  }, false);
  
  
	function quitPhoto(){
		video.style.visibility = "hidden";
		redim.style.visibility = "hidden";
		trimDiv.style.visibility="hidden";
		objModal.style.visibility="hidden";
		objClip.style.display="none";
	}
	
	function setNoVideo(){
		resPhoto.style.display="inherit";
		butRetry.style.display="none";
		butCallFile.style.display="inline";
		butFile.onchange = readImage;
		ctx = canvas.getContext("2d");
		objModal.style.visibility="visible";
		objClip.style.display="inherit";
	}
	
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
	  resPhoto.style.display="none";
	  objClip.style.display="inherit";
	  butCallFile.style.display="none";
	  toolDiv.style.display="none";
	  tipTxt.innerHTML = txtTP;
	  tipTxt.title = txtTP;
      streaming = true;
    }
  }, false);


function takepicture() {
	canvas.width = width;
	canvas.height = height;
	canvas.getContext('2d').drawImage(video, 0, 0, width, height);
	data = canvas.toDataURL('image/png');
	setimgData(data);
	toolDiv.style.display="inherit";
	tipTxt.innerHTML = txtRP;
	tipTxt.title = txtRP;
}

  
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
			//buttonZone.style.display="inherit";
			tipTxt.innerHTML = txtRP;
			tipTxt.title = txtRP;
           };
        };       
        FR.readAsDataURL( this.files[0] );
    }
}

function stopStream(stream) {
if (stream){
	stream.getVideoTracks().forEach(function (track) {
		track.stop();
	});
	}
}

function trimImg(){
var actImg = new Image();
actImg.src = CIimgData;

canvas2 = document.getElementById('canvas2');
canvas2.width = trimDiv.offsetWidth;
canvas2.height = trimDiv.offsetHeight;
ctx = canvas2.getContext("2d");

var x = trimDiv.offsetLeft ;
var y = trimDiv.offsetTop ;
var w = trimDiv.offsetWidth ;
var h = trimDiv.offsetHeight ;
ctx.drawImage(actImg,x,y,w,h,0,0,w,h);

setimgData(canvas2.toDataURL('image/png'));
}
  
})();  // End anonyme function

}
// END initCamImgCapture




var objDrag;

function CIallowDrop(ev) {
    ev.preventDefault();

		return false
}


function CIdrag(ev) {
	objDrag = ev.target;
    ev.dataTransfer.setData("id", ev.target.id);
	CIoffSetX = ev.clientX - objDrag.offsetLeft;
	CIoffSetY = ev.clientY - objDrag.offsetTop;
}

function CIdrop(ev) {
	ev.preventDefault();
	if (objDrag.id == "redim"){
		redimTrimObj(ev.clientX, ev.clientY);
	}
	objDrag.style.left = ev.clientX - CIoffSetX + "px";
	objDrag.style.top =  ev.clientY - CIoffSetY + "px";	
	CIvalidPos();
}

function CIposObjs(){
var trimDiv = document.getElementById('trimDiv');
var redim = document.getElementById('redim');
	if (objDrag.id == "trimDiv"){
		redim.style.left = (trimDiv.offsetLeft - 9) + "px";
		redim.style.top = (trimDiv.offsetTop - 9) + "px";
	}else{
		trimDiv.style.left = (redim.offsetLeft + 9) + "px";
		trimDiv.style.top = (redim.offsetTop + 9) + "px";		
	}
}

function redimTrimObj(evX, evY){
	var infoTXT = document.getElementById('infoTXT');
	var trimDiv = document.getElementById('trimDiv')
	var objClip = document.getElementById('objClip');
	var cX = evX - objClip.offsetLeft;
	var cY = evY - objClip.offsetTop;
	//infoTXT.value = (evX + " redim Y = " + evY + "  cX= " + cX + " cY=" + cY);	
	if (trimDiv.offsetTop > evY)
		var oHeight = trimDiv.offsetHeight + (trimDiv.offsetTop - cY);
	else
		var oHeight = trimDiv.offsetHeight - (cY - trimDiv.offsetTop);
	if (trimDiv.offsetLeft > cX)
		var oWidth = trimDiv.offsetWidth + (trimDiv.offsetLeft - cX);
	else
		var oWidth = trimDiv.offsetWidth - (cX - trimDiv.offsetLeft);
	//alert(oWidth + " oHeight=" + oHeight);	
	trimDiv.style.width = (oWidth ) + "px";
	trimDiv.style.height = (oHeight) + "px";	
}

// Drag & drop with touch event for mobil

var CIoffSetX = 0;
var CIoffSetY = 0;
function CIstartTouch(event) {
	objDrag = event.target;
	var touch = event.targetTouches[0];
	CIoffSetX = touch.pageX-objDrag.offsetLeft;
	CIoffSetY = touch.pageY-objDrag.offsetTop;
	this.addEventListener('touchmove', CImoveTouch, false);
	this.addEventListener('touchend', CIendTouch, false);
}

function CIendTouch(event) {   //Drop DIV
var objClip = document.getElementById('objClip');
var trimDiv = document.getElementById('trimDiv');
this.removeEventListener('touchmove', CImoveTouch, false);
this.removeEventListener('touchend', CIendTouch, false);
	if (event.target.id == "redim"){
		redimTrimObj(event.target.offsetLeft+objClip.offsetLeft+9, event.target.offsetTop+objClip.offsetTop+9);
		trimDiv.style.left = (event.target.offsetLeft + 9) + "px";
		trimDiv.style.top = (event.target.offsetTop + 9) + "px";	
	}
CIvalidPos();
}

function CIvalidPos(){
var objClip = document.getElementById('objClip');
var trimDiv = document.getElementById('trimDiv');
if (trimDiv.offsetLeft + trimDiv.offsetWidth < 0 || 
	trimDiv.offsetLeft > objClip.offsetWidth || 
    trimDiv.offsetTop > objClip.offsetHeight || 
	trimDiv.offsetTop + trimDiv.offsetHeight < objClip.offsetTop )
showTrimTool();
if (trimDiv.offsetLeft < 0)
	trimDiv.style.left = "0px";
if (trimDiv.offsetLeft + trimDiv.offsetWidth > objClip.offsetWidth)
	trimDiv.style.left = (objClip.offsetWidth - trimDiv.offsetWidth - 1) + "px";
if (trimDiv.offsetTop < 0)
	trimDiv.style.top = "0px";
if (trimDiv.offsetTop + trimDiv.offsetHeight > objClip.offsetHeight)
	trimDiv.style.top = (trimDiv.offsetHeight - 30) + "px";
CIposObjs();	
}

function CImoveTouch(event) {
    var touch = event.targetTouches[0];
    // Place element where the finger is
	var obj = event.target;

    obj.style.left = touch.pageX-CIoffSetX + 'px';
    obj.style.top = touch.pageY-CIoffSetY + 'px';
	if (obj.id != "redim"){
		CIposObjs();
		//redimTrimObj(touch.pageX, touch.pageY);
	}
    event.preventDefault();
}

function showTrimTool(){
var resPhoto = document.getElementById('resPhoto');
var trimDiv = document.getElementById('trimDiv');
var redim = document.getElementById('redim');
var tipDiv = document.getElementById('tipDiv');
trimDiv.style.width = (resPhoto.offsetHeight / 2) + "px"; 
trimDiv.style.height = (trimDiv.offsetWidth) + "px";
if (trimDiv.offsetHeight > resPhoto.offsetHeight * .9){
	trimDiv.style.height = (resPhoto.offsetHeight * .9) + "px"; 
	trimDiv.style.width = (resPhoto.offsetHeight * .9) + "px"; 
	}
trimDiv.style.left = (((objClip.offsetWidth - trimDiv.offsetWidth) / 2) ) + "px";
trimDiv.style.top = (((objClip.offsetHeight - trimDiv.offsetHeight) / 3) ) + "px";
redim.style.left = (trimDiv.offsetLeft - 9) + "px";
redim.style.top = (trimDiv.offsetTop - 9) + "px";
trimDiv.addEventListener('touchstart', CIstartTouch, false);  // Drag and drop for mobil
redim.addEventListener('touchstart', CIstartTouch, false);  // Drag and drop for mobil
tipDiv.style.display="none";
trimDiv.style.visibility = "visible";
redim.style.visibility = "visible";
}

function rotateImg(){
var img = document.getElementById('imgObj');
var canvas2 = document.getElementById('canvas2');

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
	canvas = document.getElementById('canvas');
	context = canvas.getContext("2d");
	context.clearRect(0,0,canvas.width, canvas.height);
	context.drawImage(img, 0, 0, img.width, img.height);
};
img.src = CIimgData;

}

function test(){
alert("Test");
}
	
// -->
