var popup_configure = '\
<div id="configure_page" class="popup" style="visibility: hidden"> \
<form> \
宽：<input type="text" id="filter_w"> \
<br /> \
高：<input type="text" id="filter_h"> \
<br /> \
<input id="lessthan_btn" type="button" value="小于"> \
<input id="morethan_btn" type="button" value="大于"> \
</form> \
<p class="tips">注：填写要过滤的图片的宽高，不填则不作为过滤条件！</p> \
</div>'
var normal_page = ' \
<div class="container"> \
<div class="footer"> \
<button id="configure_btn" type="button" class="btn">配置</button> \
</div> \
<div id="content" class="wrapper"></div> \
<div class="footer"> \
<button id="download_btn" type="button">下载</button> \
<p class="tips">注：点击去掉不需要的图片！</p> \
</div> \
</div>'

var local_links = null;
var ignore_flag = null;
// 设置制定图片为删除状态
function mark_delete(node,index) {
	node.classList.add('cover')
	ignore_flag[index] = 0
}
// 点击任意图片切换删除状态
function toggleDeleteState(event) {
	var index = parseInt(event.currentTarget.id.substr(4))
	var node = document.querySelectorAll('.item')[index]
	var flag = node.classList.contains('cover')
	if(flag){
		node.classList.remove('cover')
		ignore_flag[index] = 1
	}else{
		node.classList.add('cover')
		ignore_flag[index] = 0
	}
} 
// 正则表达式获取图片
function paddingNum(n,l) {
	n = n.toString()
	var padding = ''
	if ( n.length < l) {
		for ( var i = 0; i < l-n.length; i++) {
			padding += '0'
		}
	}
	return padding+n
}
// 正则表达式下载
function regex_maker() {
	var regex_url = document.getElementById('regex_url').value;
	var regex_start = document.getElementById('regex_start').value;
	var regex_end = document.getElementById('regex_end').value;
	var regex_len = parseInt(document.getElementById('regex_len').value);
	if ( parseInt(regex_start) >= parseInt(regex_end)) {
		alert('起始数字要小于终止数字')
	}
	if ( isNaN(regex_len) || regex_len > 3 && regex_len < 1) {
		alert('通配符长度必须是1~3')
	}
	if ( regex_url.indexOf('(\*)') < 0) {
		alert('正则表达式必须包含(*)')
	}
	var urls = []
	for ( var i = parseInt(regex_start); i <= parseInt(regex_end); i++) {
		urls.push(regex_url.replace(/\(\*\)/, paddingNum(i,regex_len)))
	}
	var tmp = document.getElementById("popup_regex");
	tmp.parentNode.removeChild(tmp);
	fill_page(urls)
}
// 下载图片
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
            // TO-DO 最好处理一下
        })
	}
}
// 过滤图片
function morethan(w,h,sw,sh) {
	if ( w != 0) {
		if ( sw > w) {
			return true;
		}
	}

	if ( h != 0) {
		if ( sw > h) {
			return true;
		}
	}

	return false;
}

function lessthan(w,h,sw,sh) {
	if ( w != 0) {
		if ( sw < w) {
			return true;
		}
	}

	if ( h != 0) {
		if ( sw < h) {
			return true;
		}
	}

	return false;
}
function reset(){
	var allitems = document.querySelectorAll('.item')
	;[].forEach.call(allitems,(item,i)=>{
		item.classList.remove('cover')
		ignore_flag[i] = 1
	})
	document.getElementById('filter_w').value = ''
	document.getElementById('filter_h').value = ''
	document.querySelectorAll('input[type="radio"]')[0].checked = true
}
function images_filter() {
	// 获取元素
	var filter_w = document.getElementById('filter_w')
	var filter_h = document.getElementById('filter_h')
	// 短路表达式获取输入值
	var w = parseInt(filter_w.value.trim()) || 0
	var h = parseInt(filter_h.value.trim()) || 0
	// 确定处理方式
	var radios = document.querySelectorAll('input[type="radio"]')
	var compare;
	if (radios[0].checked) {
		compare = lessthan
	} else {
		compare = morethan
	}
	var allitems = document.querySelectorAll('.item')
	for (var i = 0; i < allitems.length; i++) {
		if( compare(w,h,allitems[i].children[0].children[0].naturalWidth,
			allitems[i].children[0].children[0].naturalHeight)) {
			mark_delete(allitems[i],i)
	}
}
}
// 填充界面
function fill_page(links) {
	// 先添加一个默认页面
	//document.getElementsByTagName('body')[0].innerHTML += normal_page;
	local_links = [];
	ignore_flag = [];
	document.getElementById("content").innerHTML = "";
	for ( var i = 0; i < links.length; i++) { 
		if (!links[i] || !(links[i].length > 0))
			continue;
		local_links.push(links[i])
		ignore_flag.push(1)
		// 整体元素
		var d = document.createElement("div"); 
		d.setAttribute("class",'item');
		d.setAttribute('id','item'+i);
		d.onclick = toggleDeleteState;
		// 主体部分
		var h = document.createElement("div"); 
		h.setAttribute("class",'item_header');
		var image = document.createElement("img"); 
		image.setAttribute("src",links[i]);
		h.appendChild(image);
		d.appendChild(h);
		document.getElementById("content").appendChild(d);
	}
	// 增加下载事件响应
	document.getElementById('download_btn').onclick = Download;
	// 控制配置页面显示和消失
	document.getElementById('configure_btn').onclick = function() {
		var configure_page = document.getElementById('configure_page')
		var confirm_btn = document.getElementById('confirm_btn')
		var flag = configure_page.classList.contains('active')
		if(flag){
			configure_page.classList.remove('active')
		}else{
			configure_page.classList.add('active')
		}
		if (!confirm_btn.onclick) {confirm_btn.onclick = images_filter}
	};
	// 控制重置按钮
	document.querySelector('#reset_btn').onclick = reset
}
// 监听background.js发来的请求
chrome.extension.onRequest.addListener(function(links) {
	fill_page(links.data);
})

window.onload = function () {
	if ( window.location.href.indexOf('regex') > 0) {
		var popup_page = document.querySelector('#popup_regex_template').content.cloneNode(true);
		popup_page.querySelector('#regex_btn').onclick = regex_maker;
		document.body.appendChild(popup_page);
	}
	//document.getElementsByTagName('body')[0].innerHTML += popup_configure;
}