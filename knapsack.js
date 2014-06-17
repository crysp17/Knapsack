$(function(){
    var things=$('.thing');
    var weight=0;
    var value=0;
    var maxweight=parseInt($('#knapsack').data('maxweight'))
    $('#warning').hide();
    
    //all the things start off in the house
    for (var i=0; i < things.length;i++){
        var t = $(things[i])
        t.data('location','house');
        t.append("<br>$"+t.data('value')+", "+t.data('weight')+"kg")

    }
    
    //flashes the too heavy warning
    function tooHeavy(){
        $('#warning').fadeIn(700);
        $('#warning').fadeOut(700);
    }
    
    //takes a thing from the house and puts it in the knapsack, adjusts weight and value
    function steal(thing){
        var new_weight =weight+ parseInt($(thing).data('weight'));
        if(new_weight <= maxweight){
            thing.remove();
            (new Audio('steal.mp3')).play();
            $('#knapsack_things').append(thing);
            $(thing).data('location','knapsack');
            weight=new_weight;
            value += parseInt($(thing).data('value'));
        }
        else{
            (new Audio('tooheavy.mp3')).play();
            tooHeavy();
        }
    }
    
    //returns thing from to knapsack to the house, adjusts weight and value
    function replace(thing){
        thing.remove();
        (new Audio('replace.mp3')).play();
        $('#house_things').append(thing);
        $(thing).data('location','house');
        weight -= parseInt($(thing).data('weight'));
        value -= parseInt($(thing).data('value'));
    }
    
    things.click(function(event){
        //if the thing is in the house, it is stolen
        if ($(this).data('location') == 'house'){
            steal(this);
        }
        //if it is already in the knapsack, it is replaced
        else{
            replace(this);
        }
        //updates the total value and weight in the knapsack
        $('#info').html("($"+value+", "+weight+"kg)<br>")
        
        updateInfo();
        
    });
    
    $('#recordButton').click(function(event){
        updateRecords();
    });
    
    function updateRecords(){
        var knapsackThings=$('#knapsack .thing');
        var knapString='';      //string of the names of all the things in the knapsack
        for (var i =0; i<knapsackThings.length; i++){
            knapString += $(knapsackThings[i]).data('name') + ", ";
        }
        //removes last comma
        knapString=knapString.slice(0,-2);
        //displays the value, weight, and things in the knapsack
        var recHistory=$('#recordHistory')
        recHistory.append("($"+value+", "+weight+"kg): "+knapString+"<br>");
        (new Audio('record.mp3')).play();
        //scrolls to the latest record
        recHistory.animate({scrollTop: recHistory[0].scrollHeight},1000);
    }
    
    //redraws pie chart and text for value and weight
    function updateInfo(){
        //updates values
        var data = [{"label":"full", "value":weight}, 
            {"label":"empty", "value":20-weight}];
    
        //get the data and set width, height, location
        var vis = d3.select("#info")
            .append("svg:svg")             
            .data([data])                  
                .attr("width", w)          
                .attr("height", h)
            .append("svg:g")               
                .attr("transform", "translate(" + r + "," + r + ")")    
        
        //recreates slices (of pie) for new data
        var arcs = vis.selectAll("g.slice")
            .data(pie)                          
            .enter()
                .append("svg:g")               
                    .attr("class", "slice");  
        
            //colors slices
            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color[i]; } ) 
                    .attr("d", arc); 
        
            //adds the labels
            arcs.append("svg:text")                                     
                    .attr("transform", function(d) {                    
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";      
                })
                .attr("text-anchor", "middle")
                //if there slice doesn't exist, doesn't display label for it
                .text(function(d, i) { if (data[i].value != 0){return data[i].label; }}); 
    }
    
    $('#info').append("($"+value+", "+weight+"kg)<br>")
        
    var w = 230,                        //width
    h = 230,                            //height
    r = 100,                            //radius
    color = ['green','red']     //colors for slices
    var data = [{"label":"full", "value":weight}, 
            {"label":"empty", "value":20-weight}];
    
    var vis = d3.select("#info")
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", w)          
            .attr("height", h)
        .append("svg:g")               
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
        .outerRadius(r);

    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.value; });   

    var arcs = vis.selectAll("g.slice")     //create pie slices
        .data(pie)                          
        .enter()
            .append("svg:g")               
                .attr("class", "slice");   

        arcs.append("svg:path")     //color in the slices
                .attr("fill", function(d, i) { return color[i]; } ) 
                .attr("d", arc);                                    

        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
               
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";      
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array
        


    
});