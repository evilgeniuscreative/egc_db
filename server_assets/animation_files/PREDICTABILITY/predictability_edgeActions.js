
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",0,function(sym,e){yepnope({load:"custom-styles.css"});});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_replay}","click",function(sym,e){sym.play(0);});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'doubleArrow'
(function(symbolName){})("doubleArrow");
//Edge symbol end:'doubleArrow'

//=========================================================

//Edge symbol: 'binaryCode'
(function(symbolName){})("workProduct");
//Edge symbol end:'workProduct'

//=========================================================

//Edge symbol: 'aWorker'
(function(symbolName){})("aWorker");
//Edge symbol end:'aWorker'

//=========================================================

//Edge symbol: 'indAvgLine'
(function(symbolName){})("indAvgLine");
//Edge symbol end:'indAvgLine'

//=========================================================

//Edge symbol: 'aBracket'
(function(symbolName){})("aBracket");
//Edge symbol end:'aBracket'

//=========================================================

//Edge symbol: 'pcurve'
(function(symbolName){})("pcurve");
//Edge symbol end:'pcurve'

//=========================================================

//=========================================================

//Edge symbol: 'youArrow'
(function(symbolName){})("youArrow");
//Edge symbol end:'youArrow'
})(jQuery,AdobeEdge,"EDGE-16617889");