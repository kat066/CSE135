async function drawLine(){
    var myData;
    await $.getJSON("https://watermelonsugarhi.site/api/performance",function(data){
        myData=data;
    });
    var object={};
    for(var i in myData){
        if(myData[i].ready==="true"){
            var num = (myData[i].responseEnd-myData[i].responseStart).toFixed(2);
            if(object.hasOwnProperty(num)){
                object[num]=object[num]+1;
            }else{
                object[num]=1;
            }
        }    
    }
    var output=[];
    for(var d in object){
        output.push([d,object[d]]);
    }
    var myConfig = {
        "graphset": [{
            "type": "line",
            "theme": 'light',
            "title": {
                "text": "Response Time Counts",
                "adjust-layout":true,
                "fontSize": 24,
            },
            "scale-x": {
                // "labels":id,
                "label": {
                    text: 'response time (s)',
                }
            },
            "globals": {
                fontSize: 14
            },
            "plotarea":{ 
                margin: 'dynamic',
                "adjust-layout":true,
            },
            "scaleY": {
                // scale label with unicode character
                label: {
                    text: 'frequency (number of entries)'
                }
            },
            // "legend": {
            //     layout: "1x1", //row x column
            // },
            plot: {
                valueBox: {
                  placement: 'top-in',
                  color: '#fff',
                },
                // hoverstate
                tooltip: {
                  // turn individual point tooltip off
                  // visible: false,
                  padding: '10 15',
                  borderRadius: 3,
                  // % symbol represents a token to insert a value. Full list here:
                  // https://www.zingchart.com/docs/tutorials/chart-elements/zingchart-tokens/
                  text: 'it takes %kt seconds to receice a response for %v entries',
                  // htmlMode renders text attribute as html so
                  // &deg; is rendered
                  htmlMode: true,
                },
            },
            "series": [{values:output}]
        }]
    };
    zingchart.render({
        id: 'LineChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });
}
async function drawPie(){
    var myData;
    await $.getJSON("https://watermelonsugarhi.site/api/static",function(data){
        myData=data;
    });
    var count=0;
    var object={};
    var objectName=[];
    var output=[];
    for(var entry in myData){
        if(object[myData[entry].userAgent]==null){
            object[myData[entry].userAgent]=1;
            objectName.push(myData[entry].userAgent);
        }else{
            object[myData[entry].userAgent]=object[myData[entry].userAgent]+1;
        }
        count++;
    }
    for(var name of objectName){
        var config={
            values: [object[name]/count],
            text: name,
        }
        output.push(config);
    }
    var myConfig = {
        "graphset": [{
            "type": "pie",
            "theme": 'dark',
            "title": {
                "text": "User Devices and Browser Used",
                "adjust-layout":true,
                "fontSize": 22,
            },
            "globals": {
                fontSize: 14
            },
            "plotarea":{ 
                margin: "dymamic",
            },
            
            plot: {
                valueBox: {
                    placement: 'out',
                    'offset-r': "-10",
                    'font-family': "Georgia",
                    'font-size':18,
                    'font-weight': "normal"
                },
                // hoverstate
                tooltip: {
                  // turn individual point tooltip off
                  // visible: false,
                  padding: '8 5',
                  borderRadius: 1,
                  'font-size':12,
                  // % symbol represents a token to insert a value. Full list here:
                  // https://www.zingchart.com/docs/tutorials/chart-elements/zingchart-tokens/
                  text: '%plot-text',
                  // htmlMode renders text attribute as html so
                  // &deg; is rendered
                  htmlMode: true,
                },
            },
            "animation": {
                effect: 'ANIMATION_EXPAND_BOTTOM',
                method: 'ANIMATION_STRONG_EASE_OUT',
                sequence: 'ANIMATION_BY_PLOT',
                speed: 275,
              },
            "series": output,
        }]
    };
    zingchart.render({
        id: 'PieChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });
}


async function drawWord(){
    var myData;
    await $.getJSON("https://watermelonsugarhi.site/api/static",function(data){
        myData=data;
    });
    var object={};
    var output=[];
    for(var entry in myData){
        if(object[myData[entry].language]==null){
            object[myData[entry].language]=1;
        }else{
            object[myData[entry].language]=object[myData[entry].language]+1;
        }
    }
    for(var name in object){
        var config={
            count:object[name],
            text: name,
        }
        output.push(config);
    }
    var myConfig = {
        "graphset": [{
            "type": 'wordcloud',
            "theme": 'light',
            "title": {
                "text": "User Language",
                "adjust-layout":true,
                "fontSize": 22,
            },
            options:{
                words:output,
                rotate: true,
                style: {
                    fontFamily: 'Crete Round',
               
                    hoverState: {
                      backgroundColor: 'darkgrey',
                      borderRadius: 2,
                      fontColor: 'white'
                    },
                    tooltip: {
                      text: '%text: %hits',
                      visible: true,
                      alpha: 0.9,
                      backgroundColor: 'darkgrey',
                      borderRadius: 2,
                      borderColor: 'none',
                      fontColor: 'white',
                      fontFamily: 'Georgia',
                      textAlpha: 1
                    }
                },
                
            }
        }]
    };
    zingchart.render({
        id: 'WordChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });
}
function drawGrid(){
    var myData
    $.getJSON("https://watermelonsugarhi.site/api/performance",function(data){
        myData=data;
        var object=[];
        for(var i in myData){
            if(myData[i].ready=="true"&&myData[i].duration!=null){
                var config={
                    "Duration of pageload":Number(myData[i].duration).toFixed(2),
                    "Page transfer size":myData[i].transferSize,
                    "Page decoded size":myData[i].decodedBodySize
                }
                object.push(config);
            }    
        }
        document.getElementById("dataGrid").data=object;
      }); 
}
function draw(){
    if(document.getElementById("WordChart")!=null){
        drawWord();
    }
    if(document.getElementById("PieChart")!=null){
        drawPie();
    }
    if(document.getElementById("LineChart")!=null){
        drawLine();
    }
    if(document.getElementById("dataGrid")!=null){
        drawGrid();
    }
}
draw();



