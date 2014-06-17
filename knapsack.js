$(function(){
    var things=$('.thing');
    var weight=0;
    var value=0;
    $('#warning').hide();
    
    //all the things start off in the house
    for (var i=0; i < things.length;i++){
        things[i].location='house';
    }
    
    //flashes the too heavy warning
    function tooHeavy(){
        $('#warning').fadeIn(500);
        $('#warning').fadeOut(500);
    }
    
    //takes a thing from the house and puts it in the knapsack, adjusts weight and value
    function steal(thing){
        var new_weight =weight+ parseInt($(thing).attr('data-weight'));
        if(new_weight <=20){
            thing.remove();
            $('#knapsack_things').append(thing);
            thing.location='knapsack';
            weight=new_weight;
            value += parseInt($(thing).attr('data-value'));
        }
        //if the weight with the new thing is too heavy, flashes warning
        else{
            tooHeavy();
        }
    }
    
    //returns thing from to knapsack to the house, adjsuts weight and value
    function replace(thing){
        thing.remove();
        $('#house_things').append(thing);
        thing.location='house';
        weight -= parseInt($(thing).attr('data-weight'));
        value -= parseInt($(thing).attr('data-value'));
    }
    
    things.click(function(event){
        //if the thing is in the house, it is stolen
        if (this.location == 'house'){
            steal(this);
        }
        //if it is already in the knapsack, it is replaced
        else{
            replace(this);
        }
        //updates the total value and weight in the knapsack
        $('#info').html("($"+value+", "+weight+"kg)")
        
    });
        
    var w = 300,                        //width
    h = 300,                            //height
    r = 100,                            //radius
    color = d3.scale.category20c();     //builtin range of colors
    data = [{"label":"full", "value":weight}, 
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

    var arcs = vis.selectAll("g.slice")
        .data(pie)                          
        .enter()
            .append("svg:g")               
                .attr("class", "slice");   

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) 
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