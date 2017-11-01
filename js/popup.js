
window.onload = function () {
    document.getElementById('isDownloadImmediately').checked = localStorage['isDownloadImmediately']=='true';
    document.getElementById('isDownloadImmediately').onclick = function (event) {
        localStorage['isDownloadImmediately'] = event.target.checked
    }
}