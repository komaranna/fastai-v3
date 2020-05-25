var el = x => document.getElementById(x);
var pictureSource = "none";

function showPicker() {
  el("file-input").click();
}

function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
  pictureSource = "file";
  el("result-label").innerHTML = ""
}

function showPickedFromUrl() {
	var input = document.getElementById("url-to-grab").value;
	src = input;
	el("image-picked").src = src;
    el("image-picked").className = "";
	el("upload-label").innerHTML = input;
	pictureSource = "url";
	el("result-label").innerHTML = ""
}

function analyze() {
  var uploadFiles = el("file-input").files;
  var fileUrl = el("image-picked").src;
  
  el("analyze-button").innerHTML = "Analyzing...";
  
  if (pictureSource == "none")
  {
	alert("Please select a file to analyze!");
	el("analyze-button").innerHTML = "Analyze";
  }
  else
  {
    {
	  if (pictureSource == "url")
      {
        analyzeFromUrl(fileUrl);
	  }
	  if (pictureSource == "file")
	  {
	    analyzeFromFile(uploadFiles);
	  }
    }
  }
  
}

function analyzeFromFile(uploadFiles) {
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze-from-file`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("result-label").innerHTML = `Result: ${response["result"]}`;
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}

function analyzeFromUrl(fileUrl) {
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze-from-url`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
	  if (response["result"] == "none")
      {
		alert("Invalid url");
	  }
	  else
      {
        el("result-label").innerHTML = `Result: ${response["result"]}`;
	  }
    }
    el("analyze-button").innerHTML = "Analyze";
  };

  var fileData = new FormData();
  fileData.append("url", fileUrl);
  xhr.send(fileData);
}

