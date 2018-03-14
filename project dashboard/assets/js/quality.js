$(document).ready(function() {
debugger;
    // it will store values from configuration file
    var qualityConfig;

    moz=document.getElementById&&!document.all 
    mozHeightOffset=20 

    function resize_iframe(){ 
    document.getElementById("quality-content").height=100 // required for Moz bug, value can be "", null, or integer 
    document.getElementById('quality-content').height=window.frames["quality-content"].document.body.scrollHeight+(moz?mozHeightOffset:0) 
    } 

   //set iframe height as per document height
   $('#quality-content').attr('height', $(document).height());

   // get local config json file
   $.getJSON("../config.json", function(json) {
        qualityConfig = json.quality;
   });

   

   // set quality url
   $("#quality-sf").click(function() { 
       $('#quality-content').attr('src', qualityConfig.sf);
   });

   $("#quality-gateway1").click(function() {
       $('#quality-content').attr('src', qualityConfig.gateway1);
   });

   $("#quality-gateway2").click(function() {
       $('#quality-content').attr('src', qualityConfig.gateway2);
   });

   $("#quality-gateway3").click(function() {
    $('#quality-content').attr('src', qualityConfig.gateway3);
});

   


})