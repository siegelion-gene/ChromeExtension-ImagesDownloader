chrome.extension.onRequest.addListener(function(links) {
	for ( var i = 0; i < links.data.length; i++) { 
	    var image = document.createElement("img"); 
	    var d = document.createElement("div"); 
	    image.setAttribute("src",links.data[i]); 
	    d.appendChild(image);
	    d.setAttribute("class",'item');
	    document.getElementById("content").appendChild(d) 
	}
})
