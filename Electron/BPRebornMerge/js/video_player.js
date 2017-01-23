//var element; 
var timeCountDownCircleBorderSize = 0;
var countDownCircleSize = 0;
var strCountDownBorderFull = 'px solid rgba(27,89,200,1)';
var strCountDownBorderFill = "px solid #FFFFFF"
function initCircleCountDownTimer(CircleSize)
{
    var cntDownCircle = document.getElementById("countDownCircle");
    cntDownCircle.style.width  = countDownCircleSize + 'px';
    cntDownCircle.style.height  = countDownCircleSize + 'px';
    cntDownCircle.style.border  = timeCountDownCircleBorderSize + strCountDownBorderFull;
    cntDownCircle.style.lineHeight  = countDownCircleSize + 'px';
    document.getElementById("countDownCircleProcess").style.left = (-timeCountDownCircleBorderSize) + 'px';
    document.getElementById("countDownCircleProcess").style.top = (-timeCountDownCircleBorderSize) + 'px';
    document.getElementById("countDownCircleProcess").style.clip = 'rect(0px, ' + (countDownCircleSize + 2 * timeCountDownCircleBorderSize) + 'px, ' + (countDownCircleSize + 2 * timeCountDownCircleBorderSize) + 'px, ' + (countDownCircleSize / 2 + timeCountDownCircleBorderSize) + 'px)';
    document.getElementById("countDownCircleHalfCircle1").style.width  = countDownCircleSize + 'px';
    document.getElementById("countDownCircleHalfCircle1").style.height  = countDownCircleSize + 'px';
    document.getElementById("countDownCircleHalfCircle1").style.border  = timeCountDownCircleBorderSize + 'px solid #FFFFFF';
    document.getElementById("countDownCircleHalfCircle1").style.clip = 'rect(0px, ' + (countDownCircleSize / 2 + timeCountDownCircleBorderSize) + 'px, ' + (countDownCircleSize + 2 * timeCountDownCircleBorderSize) + 'px, 0px)';
    document.getElementById("countDownCircleHalfCircle2").style.width  = countDownCircleSize + 'px';
    document.getElementById("countDownCircleHalfCircle2").style.height  = countDownCircleSize + 'px';
    document.getElementById("countDownCircleHalfCircle2").style.border  = timeCountDownCircleBorderSize + 'px solid #FFFFFF';
    document.getElementById("countDownCircleHalfCircle2").style.clip = 'rect(0px, ' + (countDownCircleSize / 2 + timeCountDownCircleBorderSize) + 'px, ' + (countDownCircleSize + 2 * timeCountDownCircleBorderSize) + 'px, 0px)';
    document.getElementById("countDownCircleNumber").style.fontSize  = (countDownCircleSize * 0.675 * Core.GetFontScale()) + 'px';
}

function updateCountDownCircleProcess(time, totalTime) {
    var percent, deg, element;
    percent = time / totalTime;
    percent = 1 - percent;
    deg = percent * 360;

    if (percent >= 0 && percent <= 1) {
        element = document.getElementById("countDownCircleHalfCircle1");
        element.style.webkitTransform = "rotate(" + deg + "deg)";
        element.style.MozTransform = "rotate(" + deg + "deg)";
        element.style.msTransform = "rotate(" + deg + "deg)";
        element.style.OTransform = "rotate(" + deg + "deg)";
        element.style.transform = "rotate(" + deg + "deg)";

        if (percent <= 0.5) {
            element = document.getElementById("countDownCircleHalfCircle2");
            element.style.border =  timeCountDownCircleBorderSize + strCountDownBorderFill;
            element.style.webkitTransform = "rotate(10deg)";
            element.style.MozTransform = "rotate(10deg)";
            element.style.msTransform = "rotate(10deg)";
            element.style.OTransform = "rotate(10deg)";
            element.style.transform = "rotate(10deg)";

            element = document.getElementById("countDownCircle");
            element.style.border =  timeCountDownCircleBorderSize + strCountDownBorderFull;

            element = document.getElementById("countDownCircleProcess");
            element.style.clip = 'rect(0px, ' + (countDownCircleSize + 2 * timeCountDownCircleBorderSize) + 'px, ' + (countDownCircleSize + 2 * timeCountDownCircleBorderSize) + 'px, ' + (countDownCircleSize / 2 + timeCountDownCircleBorderSize) + 'px)';
        }
        else if (percent > 0.5 && percent < 1) {
            element = document.getElementById("countDownCircleHalfCircle2");
            element.style.border =  timeCountDownCircleBorderSize + strCountDownBorderFill;
            element.style.webkitTransform = "rotate(180deg)";
            element.style.MozTransform = "rotate(180deg)";
            element.style.msTransform = "rotate(180deg)";
            element.style.OTransform = "rotate(180deg)";
            element.style.transform = "rotate(180deg)";

            element = document.getElementById("countDownCircle");
            element.style.border =  timeCountDownCircleBorderSize + strCountDownBorderFull;

            element = document.getElementById("countDownCircleProcess");
            element.style.clip = '';
        }
        else {
            element = document.getElementById("countDownCircleHalfCircle2");
            element.style.border =  timeCountDownCircleBorderSize + strCountDownBorderFill;
            element.style.webkitTransform = "rotate(180deg)";
            element.style.MozTransform = "rotate(180deg)";
            element.style.msTransform = "rotate(180deg)";
            element.style.OTransform = "rotate(180deg)";
            element.style.transform = "rotate(180deg)";

            element = document.getElementById("countDownCircle");
            element.style.border =  timeCountDownCircleBorderSize + strCountDownBorderFull;

            element = document.getElementById("countDownCircleProcess");
            element.style.clip = '';
        }
    }
}



function VideoPlayer()
{
    this.videoParentNodeElement = null;
    this.videoDiv = null;
    this.videoFullscreenDiv = null;
    this.videoElement = null;
    this.btnReplayElement = null;
    this.btnExpandElement = null;
    this.countDownCircleElement = null;
    this.openProductZoneElement = null;
    this.loadingIconElement = null;
    this.endScreenElement = null;
    this.videoTimer = null;
    this.timeCountDown = 0;
    this.timeCountDownSetTimeOut = 0;
    this.isVideoPlaying = false;
    this.isVideoExpanded = false;
    
    this.savedClassName = null;
    
    this.isHideCountDown = false;
    
    this.createVideoElement = function(video_div_name, url)
    {
        var myElem = document.getElementById('adVideo');
        if (myElem === null)
        {
            VideoPlayer.videoElement = document.createElement('video');
            VideoPlayer.videoElement.setAttribute('id', 'adVideo');
            VideoPlayer.videoElement.setAttribute('webkit-playsinline', '');
        }
        else 
        {
            VideoPlayer.videoElement = document.getElementById("adVideo");
        }
        VideoPlayer.videoElement.setAttribute('src', url);
        VideoPlayer.videoElement.setAttribute('preload', 'auto');
        VideoPlayer.videoElement.style.position = "absolute";
        VideoPlayer.videoElement.style.width = "100%";
        if (Core.checkDevice() == Core.DEVICE_IOS_7)
            VideoPlayer.videoElement.style.height = "100%";
        else VideoPlayer.videoElement.style.height = "auto";
        VideoPlayer.videoElement.style.display = 'none';
        VideoPlayer.videoElement.style.backgroundColor = 'black';
        VideoPlayer.videoElement.classList.add('center_div');

        elem = document.getElementById(video_div_name);
        elem.innerHTML = '<div id="loadingIcon" class="loadingIcon"> <img class="loadingSpin" rsrc="data/loading_wheel.png" width="100%"> </div> <div id="btn_expand" onclick="javascript:VideoPlayer.onVideoExpand();"> <img id="expand_btn_img" rsrc="data/icon_addExp.png" >  <img id="collapse_btn_img" rsrc="data/icon_addColl.png" > </div> <img grsrc="general_data/end_screen.jpg" id="end_screen" class="center_div"> <div id="open_product_link_zone"  onlick="Core.OpenProductLink();"> </div> <div id="btn_replay" class="nohover"  onclick="javascript:VideoPlayer.replayVideo();">   <img id="replay_btn_img" rsrc="data/icon_replay.png" > </div> <div id="countDownCircle" > <img id="collapse_img" rsrc="data/icon_timerCenter.png" > <div id="countDownCircleProcess">   <div id="countDownCircleHalfCircle1" ></div>  <div id="countDownCircleHalfCircle2" ></div>  </div>  <div id="countDownCircleNumber"></div> </div>';
        var theFirstChild = elem.firstChild;
       
        // Insert the new element before the first child ( video behide other elements ) 
        elem.insertBefore(VideoPlayer.videoElement, theFirstChild);        

        VideoPlayer.btnExpandElement = document.getElementById('btn_expand');
        VideoPlayer.btnReplayElement = document.getElementById('btn_replay');
        VideoPlayer.countDownCircleElement = document.getElementById('countDownCircle');
        VideoPlayer.openProductZoneElement = document.getElementById('open_product_link_zone');
        VideoPlayer.loadingIconElement = document.getElementById("loadingIcon");
        VideoPlayer.videoDiv = elem;
        VideoPlayer.videoParentNodeElement = VideoPlayer.videoDiv.parentNode;
        VideoPlayer.endScreenElement = document.getElementById('end_screen');
        VideoPlayer.videoFullscreenDiv = document.getElementById('Video_Fullscreen_holder');
        
        VideoPlayer.btnReplayElement.className = 'replayBtn center_div';

        Core.replaceLink('img');
        hide(VideoPlayer.loadingIconElement);
        hide(VideoPlayer.openProductZoneElement);
        hide(VideoPlayer.btnExpandElement);
        //hide(VideoPlayer.countDownCircleElement);
        hide(VideoPlayer.btnReplayElement);
        switchExpandCollapseImage(false);
        
        VideoPlayer.videoElement.loop = false;
        
    }

    function switchExpandCollapseImage(isExpanded)
    {
        if (isExpanded == true)
        {
            VideoPlayer.btnExpandElement.className = 'expandStateBtn';
            document.getElementById("expand_btn_img").style.display = 'none';
            document.getElementById("collapse_btn_img").style.display = 'block';
            VideoPlayer.countDownCircleElement.className = 'countDownCircleExpandState';
        }
        else 
        {
            VideoPlayer.btnExpandElement.className = 'collapseStateBtn';
            document.getElementById("expand_btn_img").style.display = 'block';
            document.getElementById("collapse_btn_img").style.display = 'none';
            VideoPlayer.countDownCircleElement.className = 'countDownCircleCollapseState';
        }
    }
    
    function show(element)
    {
        element.style.display = 'block';
    }
    
    function hide(element)
    {
        element.style.display = 'none';
    }
    
    function onVideoFadeIn()
    {
        if (VideoPlayer.isVideoExpanded)
        {
            VideoPlayer.onVideoCollapse(true);
        }
        switchExpandCollapseImage(false);
        if(window.send_tracking)
            send_tracking(tracking_actions.mig_completed);
    }
    
    function onVideoFinished() 
    {
        VideoPlayer.isVideoPlaying = false;
        isVideoFinished = true;
        hide(VideoPlayer.btnExpandElement);
        show(VideoPlayer.btnReplayElement);
        show(VideoPlayer.endScreenElement);
        //hide(VideoPlayer.countDownCircleElement);
        
        switchExpandCollapseImage(VideoPlayer.isVideoExpanded);
        onVideoFadeIn();
        VideoPlayer.videoElement.removeEventListener('ended', onVideoFinished);
        if (window.videoCallFinish)
            videoCallFinish();
    }

    this.hideCountDownCircle = function () 
    {
        VideoPlayer.isHideCountDown = true;
        hide(VideoPlayer.countDownCircleElement);
    }

    this.replayVideo = function()
    {
        if (VideoPlayer.isHideCountDown == false)
            show(VideoPlayer.countDownCircleElement);
        show(VideoPlayer.btnExpandElement);
        hide(VideoPlayer.btnReplayElement);
        hide(VideoPlayer.openProductZoneElement);
        hide(VideoPlayer.endScreenElement);

        VideoPlayer.isVideoReachFirstQuarter = false;
        VideoPlayer.isVideoReachSecondQuarter = false;
        VideoPlayer.isVideoReachThirdQuarter = false;
        VideoPlayer.videoElement.addEventListener('ended', onVideoFinished, false);
        VideoPlayer.PrepareStartVideo();
        if (window.videoCallReplay)
            videoCallReplay();
        if (window.send_tracking)
            send_tracking(tracking_actions.mig_replay);
        
    }

    this.play = function()
    {
        VideoPlayer.videoElement.play();
    }

    this.stop = function()
    {
        VideoPlayer.videoElement.pause();
    }

    this.loadVideo = function(video_div_name, url)
    {
        VideoPlayer.createVideoElement(video_div_name, url);
        VideoPlayer.videoElement.load();
        VideoPlayer.videoElement.addEventListener('canplaythrough', VideoPlayer.onVideoCanPlayThrough, false);
        VideoPlayer.videoElement.addEventListener('ended', onVideoFinished, false);
    }

    this.loadVideoLowAndroidDevice = function(video_div_name, url)
    {
        VideoPlayer.createVideoElement(video_div_name, url);
        VideoPlayer.videoElement.addEventListener('ended', onVideoFinished, false);
        VideoPlayer.videoElement.play();
        videoInterval = setInterval(checkVideoPlay, 500);
    }
    
    this.getVideoPercentage = function ()
    {
        if(typeof VideoPlayer.videoElement === 'undefined' || VideoPlayer.videoElement.readyState == 0)
            return 0;
        var percent = (VideoPlayer.videoElement.currentTime / VideoPlayer.videoElement.duration) * 100;
        if (percent > 99) percent = 100;
        return Math.round(percent);
    }

    this.updateTimeCountDown = function () {
        clearTimeout(VideoPlayer.timeCountDownSetTimeOut);
        timeCountDownSetTimeOut = setTimeout(updateTimeCountDown, 1000);        
    }
    
    this.resetTimeCountDown = function() {
        VideoPlayer.timeCountDown = VideoPlayer.videoElement.duration;
        VideoPlayer.timeCountDownSetTimeOut = VideoPlayer.updateTimeCountDown;
    }

    this.onVideoCollapse = function(isEndScreen)
    {
        if (isEndScreen == false)
        {
            if (window.send_tracking)
                send_tracking(tracking_actions.click_on_collapse);
        }
        VideoPlayer.isVideoExpanded = false;
        switchExpandCollapseImage(false);
        VideoPlayer.btnExpandElement.onclick = function(){VideoPlayer.onVideoExpand(false);};
        VideoPlayer.videoParentNodeElement.appendChild(VideoPlayer.videoDiv);
        VideoPlayer.videoDiv.className = '';
        VideoPlayer.videoDiv.className = VideoPlayer.savedClassName;
        
        if (isEndScreen == true)
        {
        }
        else VideoPlayer.videoElement.play();
        if (window.videoCallCollapse)
            videoCallCollapse();
    }
    
    this.onVideoExpand = function()
    {
        if (window.send_tracking)
            send_tracking(tracking_actions.click_on_expand);
        VideoPlayer.isVideoExpanded = true;
        VideoPlayer.videoParentNodeElement.removeChild(VideoPlayer.videoDiv);
        VideoPlayer.videoFullscreenDiv.appendChild(VideoPlayer.videoDiv);
        //document.body.appendChild(VideoPlayer.videoDiv);
        VideoPlayer.savedClassName = VideoPlayer.videoDiv.className;
        VideoPlayer.videoDiv.className = '';
        VideoPlayer.videoDiv.classList.add('videoFullScreen');
        VideoPlayer.videoElement.play();  

        VideoPlayer.btnExpandElement.classList.add('expandStateBtn');
        
        VideoPlayer.btnExpandElement.onclick = function(){VideoPlayer.onVideoCollapse(false);};
        switchExpandCollapseImage(true);

        if (window.videoCallExpand)
            videoCallExpand();
    }

    this.getTimeCountDown = function()
    {
        return VideoPlayer.timeCountDown;
    }
    
    this.isVideoReachFirstQuarter = false;
    this.isVideoReachSecondQuarter = false;
    this.isVideoReachThirdQuarter = false;
    this.onSecCountDown = function() 
    {
        VideoPlayer.timeCountDown = VideoPlayer.videoElement.duration - VideoPlayer.videoElement.currentTime;
        updateCountDownCircleProcess(Math.round(VideoPlayer.timeCountDown), Math.round(VideoPlayer.videoElement.duration));
        //tracking
        var video_percent = VideoPlayer.getVideoPercentage();
        if(video_percent >= 25 && !VideoPlayer.isVideoReachFirstQuarter)
        {
            VideoPlayer.isVideoReachFirstQuarter = true;
            if(window.send_tracking)
                send_tracking(tracking_actions.video_first_quartile);
        }
        if(video_percent >= 50 && !VideoPlayer.isVideoReachSecondQuarter)
        {
            VideoPlayer.isVideoReachSecondQuarter = true;
            if(window.send_tracking)
                send_tracking(tracking_actions.video_second_quartile);
        }
        if(video_percent >= 75 && !VideoPlayer.isVideoReachThirdQuarter)
        {
            VideoPlayer.isVideoReachThirdQuarter = true;
            if(window.send_tracking)
                send_tracking(tracking_actions.video_third_quartile);
        }
        //end tracking
    }

    this.PrepareStartVideo = function()
    {
        VideoPlayer.isVideoPlaying = true;
        hide(VideoPlayer.loadingIconElement);
        show(VideoPlayer.btnExpandElement);
        if (VideoPlayer.isHideCountDown == false)
            show(VideoPlayer.countDownCircleElement);
        hide(VideoPlayer.endScreenElement);
        
        VideoPlayer.videoElement.currentTime = 0;
        VideoPlayer.videoElement.setAttribute('webkit-playsinline', '');
        VideoPlayer.videoElement.style.display = 'block';
        //VideoPlayer.videoElement.load();
        VideoPlayer.videoElement.play();
        VideoPlayer.resetTimeCountDown();
        VideoPlayer.videoTimer = setInterval(VideoPlayer.onSecCountDown, 1000);

        if (countDownCircleSize == 0)
        {
            countDownCircleSize = document.getElementById('countDownCircle').offsetWidth;
            timeCountDownCircleBorderSize = Math.floor(countDownCircleSize * 0.2);
        }

        initCircleCountDownTimer(7);
        
        if(window.send_tracking)
            send_tracking(tracking_actions.video_started);
    }
    
    this.onVideoCanPlayThrough = function(){
        VideoPlayer.videoElement.removeEventListener('canplaythrough', VideoPlayer.onVideoCanPlayThrough);
    }
}

var VideoPlayer = new VideoPlayer();


