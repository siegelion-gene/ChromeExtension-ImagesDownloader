var local_links = null;
var ignore_flag = null;
function DeleteImage(event) {
	var index = event.currentTarget.id.substr(4);
	index = parseInt(index);
	var color = document.getElementById('item_footer'+index).style.backgroundColor;
	if (color.length > 0) {
		document.getElementById('item_footer'+index).style.backgroundColor = ''
		ignore_flag[index] = 1;
	} else {
		document.getElementById('item_footer'+index).style.backgroundColor = 'red'
		ignore_flag[index] = 0;
	}
}

function Download() {
	var date = new Date().getTime()
    for( var i = 0; i < local_links.length; i++) {
    	if (ignore_flag[i] == 0)
    		continue;
        var image_name = local_links[i].split('/')
        image_name = image_name[image_name.length-1]
        if ( image_name.split('.').length == 1)
            image_name = image_name + '.jpg'
        chrome.downloads.download({
            url:local_links[i],
            filename: date + '/' + image_name
        },function() {
            // 有失败的情况，忽略不计
        })
    }
}

chrome.extension.onRequest.addListener(function(links) {
	local_links = [];
	ignore_flag = []
	for ( var i = 0; i < links.data.length; i++) { 
		if (!links.data[i] || !(links.data[i].length > 0))
			continue;
		local_links.push(links.data[i])
		ignore_flag.push(1)
		// 整体元素
		var d = document.createElement("div"); 
		d.setAttribute("class",'item');
		d.setAttribute('id','item'+i);
		d.onclick = DeleteImage;
		// header部分
		var h = document.createElement("div"); 
		h.setAttribute("class",'item_header');
		var image = document.createElement("img"); 
		image.setAttribute("src",links.data[i]);
	    h.appendChild(image);
	    d.appendChild(h);
	    // footer部分
	    var f = document.createElement('div');
	    f.setAttribute('class','item_footer')
	    f.setAttribute('id','item_footer'+i);
	    var label = document.createElement('p');
	    var tl = links.data[i].split('/');
	    var txt = document.createTextNode(tl[tl.length-1]);
	    label.appendChild(txt)
	    f.appendChild(label)
	    d.appendChild(f);
	    document.getElementById("content").appendChild(d);
	}
})

window.onload = function () {
    document.getElementById('download_btn').onclick = Download;
}