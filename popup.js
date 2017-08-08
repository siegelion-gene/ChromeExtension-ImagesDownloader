var links_local;
function showImageUrls(links) {
    var div = document.getElementById('images_area');
    div.style.height = '450px';
    div.style.overflowY = 'scroll';
    if (div.children.length > 1) 
        div.empty()
    for ( var i = 0; i < links.length; i++) {
        var image = document.createElement('img')
        var d = document.createElement('div')
        image.setAttribute('src',links[i])
        d.appendChild(image)
        div.appendChild(d)
    }
    links_local = links;
}

function getImagesByXpath() {
    var xpath = document.getElementById('xpath_text').value
    chrome.tabs.executeScript(null, {
        code: 'var xpath="' + xpath.replace(/"/g,'\\"') + '"',
    }, function () {
        chrome.tabs.executeScript(null, {
            file: 'send_links.js'
        })
    })
}

function downloadImages() {
    var date = new Date().getTime()
    for( var i = 0; i < links_local.length; i++) {
        var suffix = links_local[i].split('.')
        suffix = suffix[suffix.length-1]
        chrome.downloads.download({
            url:links_local[i],
            filename: date + '/image' + i + '.' + suffix
        })
    }
}

chrome.extension.onRequest.addListener(function(links) {
    showImageUrls(links)
})

window.onload = function() {
    document.getElementById('getImagesButton').onclick = getImagesByXpath;
    document.getElementById('downloadImagesButton').onclick = downloadImages;
}