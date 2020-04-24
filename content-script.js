var host = window.location.host
var url = window.location.toString()
var image_repl_src = "https://www.lobotz.com/wp-content/uploads/edd/2018/03/SL3.jpg"

document.addEventListener('DOMContentLoaded', function()
{
    function nodeModify(node){
        console.log("nodeModify")
        console.log(node)
        if(node.tagName == "UL"){
            $(node).find('img.mimg').each(function(index, img){
                $(img).attr("src", image_repl_src)
            })
        }
            //obj.innerText="hi"//+obj.innerText
    }

    function repl(){
        console.log(host)
        if(host.match(".*\.bing\.com")){
            repl_bing()
        }
    }

    function repl_bing(){
        $(document).find('img.mimg').each(function(img){
            $(img).attr("src", image_repl_src)
        })
    }
	
    var observer=new MutationObserver(function (mutations,observe) {
//        m = $(mutations)
//        repl()
//        console.log(m)
        mutations.forEach(function(mutation){
//            console.log("each mutation")
            if(target.isEqualNode(mutation.target)){
                console.log(mutation)
                mutation.addedNodes.forEach(function(node){
                    nodeModify(node)})
            }
         });
    });
    var target = document.getElementById('mmComponent_images_1')
    var config = {childList: true, subtree: false, attributeFilter: [ "li" ]}
    if(target){
        observer.observe(target, config);
    }
})

