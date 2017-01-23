var lang = "en";
var tracking_ggi_bp = 0;
var configTxt; 
var PointcutType = 'reward';

var timer;
var timer_count_down_define = '30';
var TIME_COUNT_DOWN_CIRCLE_BORDER_PERCENT = 0.125; // .125 height of size countDownCircle div
var isGotRewardOnce = false;
var isCancelPopupOpen = false;
var isGettingReward = false;
var timerCheckDeviceSize = null;
var bp_resource=
    [
        "data/out.js"
    ];

function gotReward()
{
    Core.hide('txt_count_down');
    Core.show('txt_got_reward');
}

function CompleteAgreedView() 
{
    try 
    {
        if (window.notifyGameComplete)
        {
            notifyGameComplete();
        }

        //get reward when wait time end
        if(window.saveReward)
        {
           saveReward();
        }
        gotReward();
        isGotRewardOnce = true;
    }
    catch(e) 
    {

    }
}

function updateTimer() 
{
    timer_count_down_define =  Math.round(VideoPlayer.getTimeCountDown());
    if (timer_count_down_define <= 0)
    {
        //Core.hide('txt_count_down');
    }
    else 
    {
        if (InternetConnection.canConnectInternet() == false)
        {
            Core.show('no_internet_popup');
            if(VideoPlayer.isVideoPlaying)
            {
                VideoPlayer.stop();
            }    
        }
        if (!DEBUG)
        {
            InternetConnection.check();
        }
    }
    Core.replaceElementText(lang, PointcutType, configTxt, document.getElementById('txt_count_down'));
    //document.getElementById('txt_count_down').innerHTML = Core.replaceTextWithVariable( document.getElementById('txt_count_down').innerHTML );
}

function ShowGetRewardState()
{
    Core.hide('text_group_holder');
    document.getElementById('video_holder').style.visibility = '';
    VideoPlayer.PrepareStartVideo();
    updateTimer();
    timer = setInterval(updateTimer, 1000);
}

function GetReward()
{
    if (isGettingReward == false) // just click to button 1 times 
    {
        isGettingReward = true;
        Core.PauseUserMusic();
        anim.resume();
        if(window.send_tracking)
        {
            send_tracking(tracking_actions.mig_engagements, ShowGetRewardState);
            update_time_spent();
        }
    }
    //ShowGetRewardState();
}

function cancel_video_popup_close()
{
    quitBuddyPack();
}

function cancel_video_popup_resume()
{
    isCancelPopupOpen = false;
    Core.hide('cancel_video_popup');
    if(VideoPlayer.isVideoPlaying)
    {
        VideoPlayer.play();
    }    
}

function no_internet_popup_close()
{
    quitBuddyPack();
}

function no_internet_popup_resume()
{
    Core.hide('no_internet_popup');
    if(VideoPlayer.isVideoPlaying)
    {
        VideoPlayer.play();
    }    
}

function skipReward()
{
    if (isGotRewardOnce == false && isGettingReward == true)
    {
        isCancelPopupOpen = true;
        Core.show('cancel_video_popup');
        if(VideoPlayer.isVideoPlaying)
        {
            VideoPlayer.stop();
        }    
    }
    else 
    {
        quitBuddyPack();
    }
}

function quitBuddyPack()
{
    Core.hide("adContainer");
    if (isGotRewardOnce == false)
        Core.Exit();
    else Core.ExitWithoutTracking();
}

function setupAnim()
{
    var left_id = document.getElementById('left_white_bg_holder');
    //data-0="opacity:0" data-1900="opacity:0" data-1901="opacity:1;left[quadratic]:-5%" data-2500="left[quadratic]:-30%"    
    //left_id.setAttribute("data-0","opacity:0");// data-1900="opacity:0" data-1901="opacity:1;left[quadratic]:-5%" data-2500="left[quadratic]:-30%"    
}

var adsParentElement = null;
var countDownParentElement = null;
function videoCallExpand()
{
    countDownElement = document.getElementById('text_count_down_holder');
    countDownParentElement = countDownElement.parentNode;
    countDownParentElement.removeChild(countDownElement);
    document.body.appendChild(countDownElement);
    countDownElement.className = 'txtCoundDownExpandState';
    
    adsElement = document.getElementById('adsText');
    adsParentElement = adsElement.parentNode;
    adsParentElement.removeChild(adsElement);
    document.body.appendChild(adsElement);
    adsElement.className = 'adsTextExpandState';
}

function videoCallCollapse()
{
    countDownElement = document.getElementById('text_count_down_holder');
    countDownParentElement.appendChild(countDownElement);
    countDownElement.className = 'txtCountDownCollapseState';
    
    adsElement = document.getElementById('adsText');
    adsParentElement.appendChild(adsElement);
    adsElement.className = 'adsTextCollapseState';
}

function videoCallReplay()
{
}

function videoCallFinish()
{
    CompleteAgreedView();
    VideoPlayer.hideCountDownCircle();
}

var intervalCheckResume = null;
var isResumeAfterPause = true;

function waitForResume()
{
    isResumeAfterPause = true;
    if (VideoPlayer.videoElement.paused == true && VideoPlayer.videoElement.ended == false)
    {
        videoElement.play();
    }
    else 
    {
        if (intervalCheckResume != null)
        {
           clearInterval(intervalCheckResume);
           intervalCheckResume = null;
        }
    }
}

function pauseMyAd()
{
    VideoPlayer.stop();
    isResumeAfterPause = false;
    if (VideoPlayer.isVideoPlaying)
    {
        if (Core.checkDevice() == Core.DEVICE_IOS_7)
        {
            if (intervalCheckResume == null)
                intervalCheckResume = setInterval(waitForResume, 1000);
        }
    }
    if (timerCheckDeviceSize != null)
        timerCheckDeviceSize = null;
}

function resumeMyAd()
{
    if(VideoPlayer.isVideoPlaying)
    {
        if (isCancelPopupOpen == false)
            VideoPlayer.play();
    }
}

function playSfx() {
    audioEle.play();
}

function restartAnim() {
    anim.restart();
}

function showMyAd()
{
    /*
    if (Core.checkDeviceSize && timerCheckDeviceSize == null)
        timerCheckDeviceSize = Core.checkDeviceSize(showMyAd);
        */
    anim.init();
    //anim.restart();
    Core.show("ad_holder");
    Core.hide('txt_got_reward');
    
    
    if (window.resource)
        VideoPlayer.loadVideo('video_div_holder', resource.get_src(VIDEO_SRC_LINK));
    else if (DEBUG)
        VideoPlayer.loadVideo('video_div_holder', VIDEO_SRC_LINK);
    
    setTimeout( function(){ 
        Core.autoresizeText(document.getElementById('txt_btn_get_holder'));
        Core.verticalAlignMiddle(document.getElementById('txt_btn_get_holder'));
    }, 2000);
    
    Core.getRewardIcon('reward_icon_btn');
    Core.getRewardIcon('reward_icon');
    
    setTimeout( function(){RunAnimMC5();}, 100);
    
    //PlaySfxfunc();
}

var loop_check = function ()
{
    if(document.readyState == 'complete')
    {
        if(!FontChecker.is_init())
        {
            FontChecker.init();
        }

        if(FontChecker.all_font_loaded())
        {
            if (window.send_tracking)
            {
                var url = resource.get_param("pixel_tracking_url");
                if(typeof(url) != 'undefined' && url != null)
                {
                    SetPixelTracking(tracking_actions.mig_start_viewing, url);
                }
                send_tracking(tracking_actions.mig_start_viewing, showMyAd);
            }
            //showMyAd();
            return;
        }
    }
    setTimeout(loop_check, 100);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

var isStarted = false;
var finishLoadAudio = function() {
    if (isStarted == false)
    {
        isStarted = true;
        loop_check();
    }
}

var finishLoadedSound = function ()
{
    if (isStarted == false)
    {
        isStarted = true;
        loop_check();
    }
}

var checkSoundLoaded = function(callback) 
{
    if (audioEle.readyState == 4)
    {
        callback();
    }
    else 
    {
        soundCheckLoop = setTimeout(function(){checkSoundLoaded(finishLoadedSound);}, 50);
    }
}

var soundCheckLoop = null;
var audioEle = null;
var init = function() 
{
    //return ;
        var elem = document.getElementById("adFrame");
        if(typeof elem === 'undefined' || elem == null)
            document.body.innerHTML = resource.get_embed_src(linkResourceURL + "main_view.html");	
        else
            elem.innerHTML = resource.get_embed_src(linkResourceURL + "main_view.html");
        Core.setupFirstTime = true;
        SetupAnim();
        
        configTxt = txtData;
        Core.replaceText(lang, PointcutType, configTxt);
        
        Core.hide("ad_holder");
        Core.replaceLink('img');
        /*
        Core.replaceLink('audio');
        audioEle = document.createElement('audio');
        if (Core.checkDevice() == Core.DEVICE_ANDROID || Core.checkDevice() == Core.DEVICE_ANDROID_LOW )
        {
            audioEle.src = resource.get_embed_src(linkResourceURL + "data/sfx_sound_ending.mp4");
        }
        else 
        {
            audioEle.src = resource.get_embed_src(linkResourceURL + "data/sfx_sound_ending.mp4");
        }
        audioEle.preload = 'auto';
        audioEle.volume = 1;
        audioEle.load();
        if (soundCheckLoop == null)
        {
            soundCheckLoop = setTimeout(function(){checkSoundLoaded(finishLoadedSound);}, 50);
        }
        //*/
        Core.preloadimages().done(function(images){
            //call back codes, for example:
            loop_check();
        });

        try
        {
            Core.advertisement(advertisement, position, font_color, shadow_color);
        }
        catch(e)
        {
        }	
}

var LoadBuddyPack = function()
{
    if (window.creative_type_id && creative_type_id == 45)
    {
        PointcutType = "rescue";
    }
    
    game_igp_code_define = 'A8';
    if (window.game_igp_code)
       game_igp_code_define = txtData[game_igp_code];
   if (game_igp_code_define == undefined)
	   game_igp_code_define = 'A8';
    tracking_ggi_bp = resource.get_param("tracking_ggi");//txtData["ggi_bp"][game_igp_code_define];
    
    Pointcut_NotShowAmounts = [
        'enter_section_Button_Reward_CampaignWin',
        'enter_section_Button_Rescue_Food',
    ];
    Pointcut_ShowX2Text = [
        'exit_section_Interst_Buddypack_Win_PvP_Mission_Time',
        'exit_section_Interst_Buddypack_Mission_Stat_Accuracy',
        'exit_section_Interst_Buddypack_Mission_Stat_Explosive_Kills',
        'exit_section_Interst_Buddypack_Mission_Stat_Headshots',
        'exit_section_Interst_Buddypack_Mission_Stat_Multikills_Assault_Mission'
    ];
    if (window.resource)
    {
        pointcutStr = resource.get_args("location");
    }
    for (var i = 0; i < Pointcut_NotShowAmounts.length; i++)
    {
        if (pointcutStr && pointcutStr == Pointcut_NotShowAmounts[i])
        {
            txtData[PointcutType].languages[lang]['txt_claim'] = "<b>GET </b>";
        }
    }
    for (var i = 0; i < Pointcut_ShowX2Text.length; i++)
    {
        if (pointcutStr && pointcutStr == Pointcut_ShowX2Text[i])
        {
            txtData[PointcutType].languages[lang]['txt_claim'] = "<b>GET x2 </b>";
        }
    }
    
    if (window.resource)
    {
        resource.load_css(linkResourceURL + "css/style.css");
        resource.load_css(linkResourceURL + "css/video_player.css");
        
        /* load script when not minify  
        Core.loadScripts(script_file_list).done(function(){
            var newStyle = document.createElement('style');
            newStyle.appendChild(document.createTextNode("\
            @font-face {\
                font-family: '" + 'Quark' + "';\
                src: url('" + resource.get_src(linkResourceURL + 'fonts/quark-bold.ttf') + "');\
            }\
            "));
            document.head.appendChild(newStyle);
           init(); 
        });
        */
       Core.loadScripts(bp_resource).done(function(){
            init();
       })
    }
}


