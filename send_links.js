function getElementByXpath(sXPath) {
  111
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
  console.log(aNodes)
  return aNodes;
};

var links = getElementByXpath(xpath)

chrome.extension.sendRequest(links);
