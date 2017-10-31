// 获取图片地址
function getImageUrls(info, tab) {
	chrome.tabs.executeScript(tab.id, {
        code: 'var mode="xpath";var img_uri="' + info.srcUrl + '";',
    }, function () {
        chrome.tabs.executeScript(tab.id, {
            file: './js/get_links.js'
        })
    })
}

// 获取所有图片地址
function getAllImageUrls(info, tab) {
    chrome.tabs.executeScript(tab.id, {
        code: 'var mode="all";',
    }, function () {
        chrome.tabs.executeScript(tab.id, {
            file: './js/get_links.js'
        })
    })
}

// 下载图片
function downloadImages(images) {
    var date = new Date().getTime()
    for( var i = 0; i < images.length; i++) {
        var suffix = images[i].split('.')
        suffix = suffix[suffix.length-1]
        chrome.downloads.download({
            url:images[i],
            filename: date + '/image' + i + '.' + suffix
        },function() {
            // 有失败的情况，忽略不计
        })
    }
}

// 监听事件
chrome.extension.onRequest.addListener(function(links) {
    if ( localStorage['isDownloadImmediately']=='true' ) {
        downloadImages(links.data)
    } else {
        // localStorage['c_data'] = links.data
        chrome.tabs.create({url:'./page/content.html',selected:true},function (tab) {
            setTimeout(function () {
                chrome.extension.sendRequest(links);
            },500)
        })
    }
})

chrome.contextMenus.create({
    'title': '下载页面中图片',
    'contexts':['page'],
    'onclick': getAllImageUrls,
})

chrome.contextMenus.create({
	"title": "下载此类图片", 
	'contexts':['image'],
	'onclick': getImageUrls,
});