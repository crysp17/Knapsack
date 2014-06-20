$(function(){
    var things=$('.thing');
    var weight=0;
    var value=0;
    var maxweight=parseInt($('#knapsack').data('maxweight'));
    
    $('#warning').hide();
    
    var mute=$('#muteButton');
    //set the mute button to not muted
    mute.data('setting','sound');
    mute.css('background-image', 'url("sound.png")');
    
    //all the things start off in the house
    things.each(function(){
        var t = $(this)
        t.data('location','house');
        t.append("<br>$"+t.data('value')+", "+t.data('weight')+"kg")

    })
    
    //flashes the too heavy warning
    function tooHeavy(){
        $('#warning').fadeIn(700);
        $('#warning').fadeOut(700);
    }
    
    function playSound(sound){
        if (mute.data('setting')=='sound'){
            (new Audio(sound)).play();
        }  
    }
    
    //takes a thing from the house and puts it in the knapsack, adjusts weight and value
    function steal(thing){
        var new_weight =weight+ parseInt($(thing).data('weight'));
        var new_thing=$(thing);
        if(new_weight <= maxweight){
            new_thing.hide();
            thing.remove();
            playSound('steal.mp3');
            $('#knapsack_things').append(thing);
            new_thing.show('slow');
            new_thing.data('location','knapsack');
            weight=new_weight;
            value += parseInt(new_thing.data('value'));
        }
        else{
            playSound('tooheavy.mp3');
            tooHeavy();
        }
    }
    
    //returns thing from to knapsack to the house, adjusts weight and value
    function replace(thing){
        var new_thing=$(thing);
        new_thing.hide();
        thing.remove();
        playSound('replace.mp3');
        $('#house_things').append(thing);
        new_thing.show('slow');
        new_thing.data('location','house');
        weight -= parseInt(new_thing.data('weight'));
        value -= parseInt(new_thing.data('value'));
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
        
        updateInfo();
        
    });
    
    $('#recordButton').click(function(event){
        updateRecords();
    });
    
    $('#clearButton').click(function(event){
        clearRecords();
    });
    
    //mute button changes settings and images when clicked
    //sounds only play if the setting is to sound
    mute.click(function(event){
        if(mute.data('setting')=='sound'){
            mute.data('setting','mute'); 
            mute.css('background-image', 'url("mute.png")'); 
        }
        else{
            mute.data('setting','sound');
            mute.css('background-image', 'url("sound.png")');
        }
    });
    
     $('#resetButton').click(function(event){
        weight=0;
        value=0;
        for (i=0; i<things.length; i++){
            var t=$(things[i]);
            things[i].remove();
            $('#house_things').append(things[i]);
            t.data('location','house');
        }
         updateInfo();
    });
    
    //click intro to start 
    $('body').click(function(event){
        $('#intro').remove();
    });
    
    //update records of certain things
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
        //plays audio of someone writing
        playSound('record.mp3');
        //scrolls to the latest record
        recHistory.animate({scrollTop: recHistory[0].scrollHeight},1000);
    }
    
    
    function clearRecords(){
        var recHistory=$('#recordHistory');
        recHistory.html('');
    }
    //redraws pie chart and text for value and weight
    function updateInfo(){
        $('#info-text').html("($"+value+", "+weight+"kg)<br>")
        pie.value(function(d) { return d[weight]; }); // change the value function
        path = path.data(pie); // compute the new angles
        path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
    }

        // Store the displayed angles in _current.
        // Then, interpolate from _current to the new angles.
        // During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
    }
    
    //initializes text with weight and value
    $('#info-text').append("($"+value+", "+weight+"kg)<br>")
    
    //creates a pie chart        
    var width = 200,
        height = 150,
        radius = 75;

    var color = ['MediumAquaMarine','grey'];

    var pie = d3.layout.pie()
        .value(function(d) { return d[weight]; })
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var dic1={'label':'full'};
    var dic2={'label':'empty'};
    for (var i=0; i <= maxweight; i++){
        dic1[i]=i;
        dic2[i]=20-i;
    }
    var data = [dic1, dic2];

    var svg = d3.select('#info').append("svg:svg")
        .attr("width", width)
        .attr("height", height)
      .append("svg:g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var path = svg.datum(data).selectAll("path")
    .data(pie)
    .enter().append("path")
    .attr("fill", function(d, i) { return color[i]; })
    .attr("d", arc)
    .each(function(d) { this._current = d; }); // store the initial angles   
    
    


});