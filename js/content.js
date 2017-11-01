
chrome.extension.onRequest.addListener(function(links) {
	for ( var i = 0; i < links.data.length; i++) { 
		if (!links.data[i] || !(links.data[i].length > 0))
			continue;
	    var image = document.createElement("img"); 
	    var d = document.createElement("div"); 
	    image.setAttribute("src",links.data[i]);
	    var label_div = document.createElement('div');
	    label_div.setAttribute('class','label')
	    var label = document.createElement('p');
	    label_div.appendChild(label)
	    d.appendChild(image);
	    d.appendChild(label_div);
	    d.setAttribute("class",'item');
	    document.getElementById("content").appendChild(d) 
	}
})
