function getImageUrls(info, tab) {
	chrome.tabs.executeScript(tab.id, {
        code: 'var xpath=null;var img_uri="' + info.srcUrl + '";',
    }, function () {
        chrome.tabs.executeScript(tab.id, {
            file: 'get_links.js'
        })
    })
}

function downloadImages(images) {
    var date = new Date().getTime()
    for( var i = 0; i < images.length; i++) {
        var suffix = images[i].split('.')
        suffix = suffix[suffix.length-1]
        chrome.downloads.download({
            url:images[i],
            filename: date + '/image' + i + '.' + suffix
        })
    }
}

chrome.extension.onRequest.addListener(function(links) {
    if ( links.type == "byMouse" ) {
        downloadImages(links.data)
    }
})

chrome.contextMenus.create({
	"title": "下载此类图片", 
	'contexts':['image'],
	'onclick': getImageUrls,
});