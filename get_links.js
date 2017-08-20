function getElementByXpath(sXPath) {
    var oEvaluator = new XPathEvaluator();
    var oResult = oEvaluator.evaluate(sXPath, document, null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var aNodes = new Array();
    if (oResult != null) {
        var oElement = oResult.iterateNext();
        while (oElement) {
            aNodes.push(oElement);
            oElement = oResult.iterateNext();
        }
    }
    aNodes = aNodes.map(function(element) {
        return element;
    })
    return aNodes;
};

function getSrcByXpath(sXPath) {
    var oEvaluator = new XPathEvaluator();
    var oResult = oEvaluator.evaluate(sXPath, document, null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var aNodes = new Array();
    if (oResult != null) {
        var oElement = oResult.iterateNext();
        while (oElement) {
            aNodes.push(oElement);
            oElement = oResult.iterateNext();
        }
    }
    aNodes = aNodes.map(function(element) {
        return element.currentSrc;
    })
    return aNodes;
};

function getPathTo(element) {
    if (element.id!=='')
        return "//*[@id='"+element.id+"']";
    
    if (element===document.body)
        return element.tagName.toLowerCase();

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        
        if (sibling===element) return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
        
        if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
            ix++;
        }
    }
}

var links = null;
if( xpath == null) {
    var elements = getElementByXpath("//img");
    var targetElement = null;
    for (var index in elements) {
        if ( elements[index].currentSrc == img_uri) {
            targetElement = elements[index]
            break;
        }
    }
    if (targetElement) {
        var xpath = getPathTo(targetElement);
        xpath = xpath.replace(/\[[1-9]*\]/g,'')
        console.log(xpath)
        links = {
            "type":"byMouse",
            "data":getSrcByXpath(xpath)
        }
    }
} else {
    links = {
        "type":"byXpath",
        "data":getSrcByXpath(xpath)
    }
}

chrome.extension.sendRequest(links);
