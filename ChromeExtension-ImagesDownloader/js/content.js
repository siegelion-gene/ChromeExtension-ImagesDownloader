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
var popup_regex = '\
		<div class="popup"> \
			<form> \
				正则表达式：<input type="text" id="regex_url"> \
				<input type="radio" name="regex" checked> \
				从 \
				<input type="text" value="0"> \
				到 \
				<input type="text" value="0"> \
				通配符长度: \
				<input type="text" value="0"> \
				(1~3) \
				<br> \
				<input type="radio" name="regex"> \
				从 \
				<input type="text" value="a"> \
				到 \
				<input type="text" value="z"> \
				(区分大小写) \
			</form> \
			<button id="regex_btn" type="button" class="btn">下载</button> \
			<p class="tips"> 批量下载功能可以方便的创建多个包含共同特征的下载任务。 </p> \
			<p class="tips"> 例如网站A提供了10个这样的下载链接：</p> \
			<p class="tips"> http://www.a.com/01.zip </p> \
			<p class="tips"> http://www.a.com/02.zip </p> \
			<p class="tips"> ... </p> \
			<p class="tips"> http://www.a.com/10.zip </p> \
			<p class="tips"> 这10个地址只有数字部分不同，如果用(*)表示不同的部分，这些地址可以写成：</p> \
			<p class="tips"> http://www.a.com/(*).zip </p> \
			<p class="tips"> 同时，通配符长度指的是这些地址不同部分数字的长度，例如：</p> \
			<p class="tips"> 从01.zip－10.zip，通配符长度是2；</p> \
			<p class="tips"> 从001.zip－010.zip，通配符长度是3。 </p> \
			<p class="tips"> 注意，在填写从xxx到xxx的时候，虽然是从01到10或者是001到010，但是，当您设定了通配符长度以后，就只需要填写成从1到10。 </p> \
			<p class="tips"> 填写完成后，在示意窗口会显示第一个和最后一个任务的具体链接地址，您可以检查是否正确，然后点确定完成操作。</p> \
		</div>'
var normal_page = ' \
	<div class="container"> \
			<div class="footer"> \
				<button id="configure_btn" type="button" class="btn">配置</button> \
			</div> \
			<div id="content" class="wrapper"></div> \
			<div class="footer"> \
				<button id="download_btn" type="button" class="btn">下载</button> \
				<p class="tips">注：点击去掉不需要的图片！</p> \
			</div> \
		</div>'

var local_links = null;
var ignore_flag = null;
// 图片标记为删除，即不下载
function mark_delete(node,index) {
	var flag = node.classList.contains('cover')
	if(flag){
		node.classList.remove('cover')
		ignore_flag[index] = 1
	}else{
		node.classList.add('cover')
		ignore_flag[index] = 0
	}
}
function DeleteImage(event) {
	var index = parseInt(event.currentTarget.id.substr(4))
	var item = document.querySelectorAll('.item')[index]
	mark_delete(item,index)
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
	if ( w != 0)
		if ( sw > w) 
			return true;
	if ( h != 0)
		if ( sw > h)
			return true;
	return false;
}
function lessthan(w,h,sw,sh) {
	if ( w != 0)
		if ( sw < w) 
			return true;
	if ( h != 0)
		if ( sw < h)
			return true;
	return false;
}
function images_filter(event) {
	var w = document.getElementById('filter_w').value.length>0?parseInt(document.getElementById('filter_w').value):0;
	var h = document.getElementById('filter_h').value.length>0?parseInt(document.getElementById('filter_h').value):0;
	var compare;
	if (event.target.id == 'lessthan_btn') {
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
	document.getElementsByTagName('body')[0].innerHTML += normal_page;
	local_links = [];
	ignore_flag = [];
	for ( var i = 0; i < links.length; i++) { 
		if (!links[i] || !(links[i].length > 0))
			continue;
		local_links.push(links[i])
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
		image.setAttribute("src",links[i]);
	    h.appendChild(image);
	    d.appendChild(h);
	    // footer部分
	    // var f = document.createElement('div');
	    // f.setAttribute('class','item_footer')
	    // f.setAttribute('id','item_footer'+i);
	    // var label = document.createElement('p');
	    // var tl = links[i].split('/');
	    // var txt = document.createTextNode(tl[tl.length-1]);
	    // label.appendChild(txt)
	    // f.appendChild(label)
	    // d.appendChild(f);
	    document.getElementById("content").appendChild(d);
	}
	// 增加下载事件响应
	document.getElementById('download_btn').onclick = Download;
	// 控制配置页面显示和消失
	document.getElementById('configure_btn').onclick = function() {
		if ( document.getElementById('configure_page').style.visibility == 'visible') {
			document.getElementById('configure_page').style.visibility = 'hidden'
		} else {
			document.getElementById('configure_page').style.visibility = 'visible'
		}
		if (!document.getElementById('lessthan_btn').onclick)
			document.getElementById('lessthan_btn').onclick = images_filter;
		if (!document.getElementById('morethan_btn').onclick)
			document.getElementById('morethan_btn').onclick = images_filter;
	};
}
// 正则表达式下载
function regex_maker() {
	var regex_pattern = document.getElementById('regex_pattern')
	var start = document.getElementById('start')
	var end = document.getElementById('end')
	var urls = []
	if (document.getElementById('regex_mode' == 'num')) {
		for ( var i = start; i <= end; i++) {
			urls.push(regex_pattern.replace(/(*)/, i))
		}
	} else {
		for ( var i = start; i <= end; i++) {
			urls.push(regex_pattern.replace(/(*)/, i))
		}
	}
	fill_page(urls)
}
// 监听background.js发来的请求
chrome.extension.onRequest.addListener(function(links) {
	fill_page(links.data);
})

window.onload = function () {
	if ( window.location.href.indexOf('regex') > 0) {
		document.getElementsByTagName('body')[0].innerHTML += popup_regex;
	}
	document.getElementsByTagName('body')[0].innerHTML += popup_configure;
}
