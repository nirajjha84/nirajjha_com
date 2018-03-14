$(document).ready(function() {

     // it will store values from configuration file
     var config;

    //set iframe height as per document height
    $('#page-content').attr('height', $(document).height());

    // get local config json file
    var confilData = $.getJSON("config.json", function(json) {
        config = json;
    });

    // set page configuration after config json load
    confilData.promise().done(function() {
        $('#project-name').text(config.project);
        $('#sub-project').text(config.subProject);
    });
    
    

    // set nav url and active css class
    $("#nav-home").click(function() { 
        $('#page-content').attr('src', config.nav.home);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-design").click(function() {
        $('#page-content').attr('src', config.nav.design);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-code").click(function() {
        $('#page-content').attr('src', config.nav.code);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-build").click(function() {
        $('#page-content').attr('src', config.nav.build);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-quality").click(function() {
        $('#page-content').attr('src', config.nav.quality);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-test").click(function() {
        $('#page-content').attr('src', config.nav.test);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-performance").click(function() {
        $('#page-content').attr('src', config.nav.performance);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });

    $("#nav-documentation").click(function() {
        $('#page-content').attr('src', config.nav.documentation);
        $("#leftNav>a.active").removeClass("active");
        $(this).addClass("active");
    });


})