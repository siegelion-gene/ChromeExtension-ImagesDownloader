var observe = new MutationObserver(function (mutations, observe)) {
  m = $(mutations)
  m.each(function(){
    $(this.addedNodes).each(function(){
      #do something
    })    
  })
});
