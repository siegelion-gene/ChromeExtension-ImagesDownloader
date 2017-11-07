window.onload = function() {
    var check = document.querySelector('#isDownloadImmediately')
    var regex = document.querySelector('#regex')
    // 设置单选框状态
    check.checked = localStorage.getItem('isDownloadImmediately') === 'true'
    // 单选框点击事件
    check.addEventListener('click',function(){
      var flag = this.checked + ''
      localStorage.setItem('isDownloadImmediately', flag)
    })
    // 正则表达式下载
    regex.addEventListener('click',function(){
        chrome.tabs.create({url:'./page/content.html?regex=1',selected:true},function (tab) {

        })
    })
}
