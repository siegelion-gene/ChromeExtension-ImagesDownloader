window.onload = function() {
  var check = document.querySelector('#isDownloadImmediately')
  var btn = document.querySelector('#openFile')
  // 设置单选框状态
  check.checked = localStorage.getItem('isDownloadImmediately') === 'true'
  // 单选框点击事件
  check.addEventListener('click',function(){
    var flag = this.checked + ''
    localStorage.setItem('isDownloadImmediately', flag)
  })
  // 打开默认下载文件夹
  btn.addEventListener('click',function(){
  })
}
