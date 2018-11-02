document.addEventListener('DOMContentLoaded', function()
{
    function nodeModify(obj){
        obj.innerText="hi"//+obj.innerText
    }
    var observe=new MutationObserver(function (mutations,observe) {
        m = $(mutations)
        m.each(function(){
            $(this.addedNodes).each(function(){nodeModify(this)})

            console.log(this)
            console.log(this.addedNodes)
        });
    });
    var target = document.getElementById('mmComponent_images_1')
    if(target){
        observe.observe(target,{childList: true, subtree: true});
    }
})

