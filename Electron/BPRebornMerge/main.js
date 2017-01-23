var HostGameMapNameScript = {
	//Sniper Fury
	"FWHM" : "sf",  //android
	"MCFW" : "sf",	//iphone
	"MCFI" : "sf",	//ipad
	//Asphalt 8 
	"A8HM" : "a8",
	"ASP8" : "a8",
	"AS8I" : "a8",
	//MC5
	"M5HM" : "mc5",
	"MCO5" : "mc5",
	"MC5I" : "mc5",
	//Dragon Manila
	"DOHM" : "dml",
	"DAMA" : "dml",
	"DAMI" : "dml",
	
	"LLHM" : "dml",
	"GLLS" : "dml",
};
	
var loadScripts = function (arr)
{
    var newscripts = [], loadedscripts = 0;
    var postaction = function(){};
    function scriptloadpost(){
        loadedscripts++;
        if (loadedscripts==arr.length){
            postaction(newscripts);
        }
    }
    for (var i=0; i<arr.length; i++){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.type = 'text/javascript';

        if (window.resource)
            script.src = resource.get_embed_src(arr[i]);
        else script.src = arr[i];
        script.charset = 'UTF-8';

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            //script.onreadystatechange = scriptloadpost;
            script.onload = function(){
                scriptloadpost();
            }
            script.onerror = function(){
                if (window.Exit)
                    window.Exit();
            }
        // Fire the loading
        head.appendChild(script);

    }
    return { //return blank object with done() method
        done:function(f){
            postaction=f || postaction; //remember user defined callback functions to be called when images load
        }
    }
}
        
var main = function()
{
    linkResourceURL = 'a8/';
    var BP_src = 'a8';
    if ( resource.get_param("TEST_DEBUG") == 'debug' )
    {
		creative_type_id = resource.get_param("POINTCUT_TYPE_BP");
		window.game_igp_code = resource.get_param("HG_IGPCODE");
    }
    
    if (window.game_igp_code)
       linkResourceURL = HostGameMapNameScript[game_igp_code] + '/';
    if (window.game_igp_code)
       BP_src = HostGameMapNameScript[game_igp_code];
    if (linkResourceURL == undefined)
        linkResourceURL = 'a8/';
    if (BP_src == undefined)
        BP_src = 'a8';
   
    if (resource.get_param('BRAND_NAME') != '')
    {
        VIDEO_SRC_LINK = "general_data/product_video_" + resource.get_param("BRAND_NAME") + ".mp4";
    }
	//BP_src = 'sf';
    //linkResourceURL = 'sf/';
	var script_file_list= [
		"main_src.js",
		BP_src + "/" + "config_src.js"
		];

    if (window.resource)
    {
        loadScripts(script_file_list).done(function(){
            if (window.LoadBuddyPack)
                LoadBuddyPack();
        });
    }
}


