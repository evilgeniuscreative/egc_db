
(function($,Edge,compId){var Composition=Edge.Composition,Symbol=Edge.Symbol;
//Edge symbol: 'stage'
(function(symbolName){Symbol.bindElementAction(compId,symbolName,"document","compositionReady",function(sym,e){});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",26000,function(sym,e){var pBox=sym.$('#Stage_peopleBox'),fp=pBox.find('.person-100');lp=pBox.find('.person-1');fp.css({'position':'absolute','z-index':'999'}).animate({left:-10,width:'8%',height:'48%',top:'-2%',left:0});pBox.find('.person-99').css({'margin-left':'4%'});lp.css({'position':'absolute','z-index':'999'}).animate({width:'8%',height:'48%',bottom:'-1%',right:0});lp.find('.person-count').css({'font-weight':'bold','font-size':'1em'});fp.find('.person-count').css({'font-weight':'bold','font-size':'1em'});pBox.find('div').not('.person-1, .person-1 > div, .person-100, .person-100 > div').animate({'opacity':'0.25'},1000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",42071,function(sym,e){var pBox=sym.$('#Stage_peopleBox');pBox.find('.person-2').css({'position':'absolute','z-index':'1000'}).animate({width:'8%',height:'50%',bottom:'-1%',right:'10%'});pBox.find('.person-2, .person-2 > div').animate({'opacity':'1'});pBox.find('.person-1').animate({'width':'4%','height':'25%','bottom':'0'});pBox.find('.person1, .person-1 > div').animate({'opacity':'0.25'}).find('.person-count').removeAttr('style');pBox.find('.person-2, .person-2 > div').find('.person-count').css({'font-weight':'bold','font-size':'1em'});});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",47206,function(sym,e){var pBox=sym.$('#Stage_peopleBox')
sWP=pBox.find('.person-2');sWP.find('.person-count').animate({'font-size':'0.5em','opacity':'0'});sWP.animate({'width':'0px','height':'0px','right':'0'},1000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",3000,function(sym,e){function layOutPeople(qPeeps,targetDiv){var tinyPerson=[],personSym=[],numberOne={};for(var myCount=qPeeps;myCount>0;myCount--){var whichColor=Math.floor((Math.random()*6)+1),whichGender=Math.floor((Math.random()*2)+1),myGender="fem";if(whichGender>1){myGender="mal";}
if(qPeeps<200){if(myCount==100){numberOne.myGender="fem";numberOne.whichColor=whichColor;myGender="fem";}
if(myCount==1&&myGender==numberOne.myGender){myGender=="fem"?myGender="mal":myGender="fem";}
if(myCount==1&&whichColor==numberOne.whichColor){numberOne.whichColor==3?whichColor=6:whichColor=(numberOne.whichColor+3)%6;}}
tinyPerson[myCount]=sym.createChildSymbol(myGender+whichColor.toString(),targetDiv);var thisPerson=tinyPerson[myCount].getSymbolElement();switch(qPeeps){case 10:thisPerson.css({'height':'85%','width':'8%','margin-right':'2%','float':'left'});break;case 100:thisPerson.append('<span class="person-count">'+myCount+'</span>');thisPerson.css({'height':'25%','width':'4%','float':'left'});break;case 1000:var thisPerson=tinyPerson[myCount].getSymbolElement().addClass('thousandPeople');thisPerson.css({'height':'10%','width':'1%','float':'left'});break;}
thisPerson.addClass('person-'+myCount);thisPerson.find('div').css({'height':94+'%','width':100+'%'});}}
layOutPeople(100,"peopleBox");layOutPeople(1000,"thousandsBox");layOutPeople(10,"ten1st");layOutPeople(10,"ten50th");layOutPeople(10,"ten100th");sym.$('#Stage_thousandPeopleImg').remove();sym.$('#Stage_hundredPeopleImg').remove();sym.$('#Stage_ten1stImg').remove();sym.$('#Stage_ten50thImg').remove();sym.$('#Stage_ten100thImg').remove();sym.$('#Stage_stairsImg').remove();});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",76000,function(sym,e){function makeMyRows(targetDiv){var whichRow=0,someDiv=[];for(var someCount=100;someCount>=0;someCount=someCount-5){someDiv[someCount]=$('<div/>',{'id':'stairStep-'+someCount,'class':'stair-step','style':'height:'+someCount+'%; width:'+(4.75+whichRow*4.75)+'%;'});whichRow++;if(someCount==0){someDiv[0].css({'height':'5%','background-color':'transparent'});}
sym.$('#Stage_stairSteps').append(someDiv[someCount].html('<div class="stair-step-number">'+someCount+'</div>'));}}
makeMyRows('Stage_stairSteps');});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_playLink}","click",function(sym,e){sym.play();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_stopLink}","click",function(sym,e){sym.stop();});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_ffLink}","click",function(sym,e){var newPos=sym.getPosition()+10000;sym.play(newPos);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_rrLink}","click",function(sym,e){var newPos=sym.getPosition()-10000;sym.play(newPos);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_rLink}","click",function(sym,e){var newPos=sym.getPosition()-5000;sym.play(newPos);});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_fLink}","click",function(sym,e){var newPos=sym.getPosition()+5000;sym.play(newPos);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",28000,function(sym,e){sym.$('#Stage_peopleBox').find('.person-87, .person-87 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",28500,function(sym,e){sym.$('#Stage_peopleBox').find('.person-81, .person-81 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",29000,function(sym,e){sym.$('#Stage_peopleBox').find('.person-66, .person-66 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",29500,function(sym,e){sym.$('#Stage_peopleBox').find('.person-50, .person-50 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",30000,function(sym,e){sym.$('#Stage_peopleBox').find('.person-34, .person-34 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",30500,function(sym,e){sym.$('#Stage_peopleBox').find('.person-22, .person-22 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",31000,function(sym,e){sym.$('#Stage_peopleBox').find('.person-16, .person-16 > div').animate({'opacity':'0.9'}).delay(750).animate({'opacity':'0.25'},2000);});
//Edge binding end
Symbol.bindTriggerAction(compId,symbolName,"Default Timeline",91500,function(sym,e){sym.$('#stairStep-75').animate({'background-color':'#FF8200'}).find('stair-step-number').animate({'font-size':'0.75em','color':'#000000'});});
//Edge binding end
Symbol.bindElementAction(compId,symbolName,"${_replay}","click",function(sym,e){sym.play(0);});
//Edge binding end
})("stage");
//Edge symbol end:'stage'

//=========================================================

//Edge symbol: 'normal-dist'
(function(symbolName){})("normal-dist");
//Edge symbol end:'normal-dist'

//=========================================================

//Edge symbol: 'tomato'
(function(symbolName){})("tomato");
//Edge symbol end:'tomato'

//=========================================================

//Edge symbol: 'starsym'
(function(symbolName){})("starsym");
//Edge symbol end:'starsym'

//=========================================================

//Edge symbol: 'tomato-burst'
(function(symbolName){})("tomato-burst");
//Edge symbol end:'tomato-burst'

//=========================================================

//Edge symbol: 'bootKicker'
(function(symbolName){})("bootKicker");
//Edge symbol end:'bootKicker'

//=========================================================

//Edge symbol: 'tenPeopleSym'
(function(symbolName){})("tenPeopleSym");
//Edge symbol end:'tenPeopleSym'

//=========================================================

//Edge symbol: 'fem1'
(function(symbolName){})("fem1");
//Edge symbol end:'fem1'

//=========================================================

//Edge symbol: 'fem2'
(function(symbolName){})("fem10");
//Edge symbol end:'fem10'

//=========================================================

//Edge symbol: 'fem11'
(function(symbolName){})("fem11");
//Edge symbol end:'fem11'

//=========================================================

//Edge symbol: 'fem12'
(function(symbolName){})("fem12");
//Edge symbol end:'fem12'

//=========================================================

//Edge symbol: 'fem2'
(function(symbolName){})("fem2");
//Edge symbol end:'fem2'

//=========================================================

//Edge symbol: 'fem3'
(function(symbolName){})("fem3");
//Edge symbol end:'fem3'

//=========================================================

//Edge symbol: 'fem4'
(function(symbolName){})("fem4");
//Edge symbol end:'fem4'

//=========================================================

//Edge symbol: 'fem5'
(function(symbolName){})("fem5");
//Edge symbol end:'fem5'

//=========================================================

//Edge symbol: 'fem6'
(function(symbolName){})("fem6");
//Edge symbol end:'fem6'

//=========================================================

//Edge symbol: 'fem7'
(function(symbolName){})("fem7");
//Edge symbol end:'fem7'

//=========================================================

//Edge symbol: 'fem8'
(function(symbolName){})("fem8");
//Edge symbol end:'fem8'

//=========================================================

//Edge symbol: 'fem9'
(function(symbolName){})("fem9");
//Edge symbol end:'fem9'

//=========================================================

//Edge symbol: 'mal1'
(function(symbolName){})("mal1");
//Edge symbol end:'mal1'

//=========================================================

//Edge symbol: 'mal10'
(function(symbolName){})("mal10");
//Edge symbol end:'mal10'

//=========================================================

//Edge symbol: 'mal11'
(function(symbolName){})("mal11");
//Edge symbol end:'mal11'

//=========================================================

//Edge symbol: 'mal12'
(function(symbolName){})("mal12");
//Edge symbol end:'mal12'

//=========================================================

//Edge symbol: 'mal2'
(function(symbolName){})("mal2");
//Edge symbol end:'mal2'

//=========================================================

//Edge symbol: 'mal3'
(function(symbolName){})("mal3");
//Edge symbol end:'mal3'

//=========================================================

//Edge symbol: 'mal4'
(function(symbolName){})("mal4");
//Edge symbol end:'mal4'

//=========================================================

//Edge symbol: 'mal5'
(function(symbolName){})("mal5");
//Edge symbol end:'mal5'

//=========================================================

//Edge symbol: 'mal6'
(function(symbolName){})("mal6");
//Edge symbol end:'mal6'

//=========================================================

//Edge symbol: 'mal7'
(function(symbolName){})("mal7");
//Edge symbol end:'mal7'

//=========================================================

//Edge symbol: 'mal8'
(function(symbolName){})("mal8");
//Edge symbol end:'mal8'

//=========================================================

//Edge symbol: 'mal9'
(function(symbolName){})("mal9");
//Edge symbol end:'mal9'

//=========================================================

//Edge symbol: 'oneRowSym'
(function(symbolName){})("oneRowSym");
//Edge symbol end:'oneRowSym'
})(jQuery,AdobeEdge,"pctl-");