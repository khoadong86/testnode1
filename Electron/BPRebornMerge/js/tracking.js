var tracking_host = "http://game-portal.gameloft.com/2093/?_rp_=tracking/send_event";
var tracking_actions = {
    click_on_ads:{
        id:211307,
        send_one:false,
        add_session_time:false,
        add_video_percentage:false,
        video_percent:0,
        reset_timespent:true
    },
    click_on_link:
    {
        id:191967,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:0,
        reset_timespent:true
    },
    close_game:{
        id:191969,
        send_one:true,
        add_session_time:true,
        add_video_percentage:true,
        video_percent:0,
        reset_timespent:false
    },
    mig_completed:{
        id:191968,
        send_one:false,
        add_session_time:true,
        add_video_percentage:true,
        video_percent:0,
        reset_timespent:false
    },
    mig_replay:{
        id:191964,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:0,
        reset_timespent:false
    },
    mig_started:{
        id:191963,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:0,
        reset_timespent:false
    },
    mig_start_viewing:{
        id:210628,
        send_one:true,
        add_session_time:false,
        add_video_percentage:false,
        add_impression_load:true,
        video_percent:0,
        reset_timespent:false
    },
    click_on_expand:{
        id:224025,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:0,
        reset_timespent:false
    },
    click_on_collapse:{
        id:224026,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:0,
        reset_timespent:false
    },
    mig_engagements:{
        id:218009,
        send_one:true,
        add_session_time:true,
        add_video_percentage:false,
        add_engagement_load:true,
        video_percent:0,
        reset_timespent:false
    },
    video_started:{
        id:228364,
        send_one:true,
        add_session_time:true,
        add_video_percentage:false,
        add_video_load_timer:true,
        video_percent:0,
        reset_timespent:false
    },
    video_first_quartile:{
        id:224028,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:25,
        reset_timespent:false
    },
    video_second_quartile:{
        id:224029,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:50,
        reset_timespent:false
    },
    video_third_quartile:{
        id:224030,
        send_one:false,
        add_session_time:true,
        add_video_percentage:false,
        video_percent:75,
        reset_timespent:false
    }
};

var tracking_events = {
    mig_gameplay:{
        id:226761
    }
};

var tracking_token = 1;
var time_spent = 0;
var loading_time_spent = 0;
var video_load_time = 0;
var video_wait_time = 0;

var video_can_loaded = false;
var pixel_tracking_url = null;

var TrackingPaused = false;
update_time_spent = function ()
{
    if (TrackingPaused == false)
    {
        if (video_can_loaded == false)
        {
            video_load_time += 100;
        }
        time_spent += 100;
    }
    setTimeout(update_time_spent,100);
};

update_loading_time_spent = function ()
{
    if (TrackingPaused == false)
    {
        loading_time_spent += 100;
    }
    setTimeout(update_loading_time_spent, 100);
}
update_loading_time_spent();

var set_video_loaded = function(val)
{
    video_can_loaded = val;
}

var reset_time_spent = function() 
{
    time_spent = 0;
};

var SetPixelTracking = function(action, url)
{
        if(action)
        {
            action.pixel_tracking = url;            
        }
}

var pauseMyAdTracking = function()
{
    TrackingPaused = true;
}

var resumeMyAdTracking = function()
{
    TrackingPaused = false;
}

var send_tracking = function(action, callback)
{
    if (DEBUG)
        return;
    if(action.send_one && action.count)
    {
        if(callback)
        {
            callback(false);
        }
        return false;
    };
    action.count = action.count || 0;
    action.count++;
    var hostgame_clientid = decodeURIComponent(resource.get_args("clientid") || "");
    var clientid_parts = hostgame_clientid.split(":");

    var source_game_ver = "";
    var source_game_ggi = 0;
    if(clientid_parts.length >= 4)
    {
        source_game_ggi = parseInt(isNaN(clientid_parts[0]) ? clientid_parts[2] : clientid_parts[1]);
        source_game_ver = isNaN(clientid_parts[0]) ? clientid_parts[3] : clientid_parts[2];
    }
    
    var time_loading_param = 0;
    if (action.add_video_load_timer)
    {
        time_loading_param = Math.ceil(video_load_time);
    }
    else if (action.add_impression_load)
    {
        time_loading_param = Math.ceil(loading_time_spent);
    }
    else if (action.add_engagement_load)
    {
        time_loading_param = Math.ceil(video_load_time);
    }
    
    var trackdata = {
        ggi:parseInt(tracking_ggi_bp),
        entity_type:resource.get_param("tracking_entity_type"),
        entity_id:'2093:'+resource.get_param("tracking_ggi")+':'+resource.get_param('tracking_version')+':HTML5:Ads',
        proto_ver:resource.get_param("tracking_version"),
        events:[
            {
                gdid:0,
                type:tracking_events.mig_gameplay.id,
                token:tracking_token,
                data:{
                    action_type:action.id,
                    ad:decodeURIComponent(resource.get_args("ad") || ""),
                    anon_id:decodeURIComponent(resource.get_args("anonymous") || ""),
                    campaign_id:window.campaign_id || "",
                    creative_id:window.creative_id || "",
                    custom_tracking:"N/A",
                    d_country:decodeURIComponent(resource.get_args("device_country") || ""),
        	    ip_country:decodeURIComponent(resource.get_args("ip_country_code") || ""),
                    rim_pointcut_id:decodeURIComponent(resource.get_args('location')),
                    source_game:source_game_ggi,
                    time_spent_loading:time_loading_param,
                    total_time_spent_ads:action.add_session_time ? Math.ceil(time_spent/1000) : 0,
                    ver: resource.get_param("tracking_version")
                }
            }
        ]
    };
    time_spent = action.reset_timespent ? 0 : time_spent;
    tracking_token++;

    var http = new (XMLHttpRequest || ActiveXObject)();
    //http.timeout = 5000;
    http.onload = function(e) {
        if(callback)
        {
            callback(true);
        }
    };
    http.onerror = function(e)
    {
        if(callback)
        {
            callback(false);
        }
    };
    /*
    http.ontimeout = function(e)
    {
        if(callback)
        {
            callback(false);
        }
    }
    */
    http.open("post",tracking_host,true);
    var payload = new FormData();
    payload.append("data",JSON.stringify(trackdata));
    if(action.pixel_tracking)
    {
        var url = action.pixel_tracking;
        var img = new Image();
        img.crossOrigin = "anonymous"; //always use anonymous for 3rd impression tracking
        img.src = url;
        img.style.width = 0;
        img.style.height = 0;
        img.onload = function(){
            //http.send(payload);
        };
        img.onerror = function(){
            //[NMH] still send ETS tracking even pixel tracking fail
            //http.send(payload);
        };
        document.body.appendChild(img);
    }
    //else
    {
        http.send(payload);
    }
    return http;
    
};

