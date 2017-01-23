//var useGameBackgroundCetric = true;
function Core() 
{
	var lastScreenW = 0;
	var lastScreenH = 0;
        var isPaused = false;
	this.setupFirstTime = false;

	this.m_font_scale = 1;
	this.DEVICE_IOS_7 = 1;
	this.DEVICE_IOS_8 = 2;
	this.DEVICE_ANDROID = 3;
	this.DEVICE_ANDROID_LOW = 4;
        
        this.show = function(val)
        {
            var ele = document.getElementById(val);
            if (ele)
                ele.style.display = 'block';
        }

        this.hide = function(val)
        {
            var ele = document.getElementById(val);
            if (ele)
                ele.style.display = 'none';
        }

	this.imagesOnError = function ()
	{
		var images = document.getElementsByTagName('img');
		for(var i = 0; i < images.length; i++)
		{
			var img = images[i];
			if(img.src.length != 0)
			{
				img.onerror = function(){
					console.log('error: bad image source');
					Exit();
				};
			}
		}
	}

        this.preloadimages = function ()
        {
            var newimages=[], loadedimages=0;
            var postaction=function(){};
            var arr = document.getElementsByTagName('img');
            arr=(typeof arr!="object")? [arr] : arr;
            function imageloadpost(){
                loadedimages++;
                if (loadedimages==arr.length){
                    postaction(newimages); //call postaction and pass in newimages array as parameter
                }
            }
            for (var i=0; i<arr.length; i++){
                newimages[i]=new Image();
                newimages[i].src=arr[i].src;
                newimages[i].onload=function(){
                    imageloadpost();
                }
                newimages[i].onerror=function(err){
                    console.log("error load image " + this.src)
                    if (window.Exit)
                        window.Exit();
                }
            }
            return { //return blank object with done() method
                done:function(f){
                    postaction=f || postaction; //remember user defined callback functions to be called when images load
                }
            }
        }
		
        this.loadScripts = function (arr)
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
                    script.src = resource.get_embed_src(linkResourceURL + arr[i]);
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
 
        // added to cheat the brand background and game background 
        //var useGameBackgroundCetric = true;
        this.replaceLink = function (elementTag)
        {
            var objs = document.getElementsByTagName(elementTag);
            for(var i = 0; i< objs.length; i++)
            {
                var obj = objs[i];
                if (DEBUG)
                {
                    var rsrc = obj.getAttribute("rsrc");
                    if(rsrc != null)
                    {
                        obj.src = linkResourceURL + obj.getAttribute("rsrc");
                        if (window.useGameBackgroundCetric)
                        {
                            obj.src = obj.src.replace("brand_bg.jpg", "game_bg.jpg");
                        }
                    }
                    var grsrc = obj.getAttribute("grsrc");
                    if(grsrc != null)
                    {
                        obj.src = obj.getAttribute("grsrc");
                        if (window.useGameBackgroundCetric)
                        {
                            obj.src = obj.src.replace("brand_bg.jpg", "game_bg.jpg");
                        }
                    }
                }
                else 
                {
                    if(obj.getAttribute("rsrc") != null)
                    {
                        var rsrc = linkResourceURL + obj.getAttribute("rsrc");
                        if (window.useGameBackgroundCetric)
                        {
                            rsrc = rsrc.replace("brand_bg.jpg", "game_bg.jpg");
                        }
                        if (resource.get_param('BRAND_NAME') != '')
                        {
                            rsrc = rsrc.replace("brand_bg.jpg", "brand_bg_" + resource.get_param('BRAND_NAME') + ".jpg");
                            rsrc = rsrc.replace("logo.png", "logo_" + resource.get_param('BRAND_NAME') + ".png");
                        }
                        if (res_embed_bp[rsrc] != undefined)
                        {
                            obj.src = res_embed_bp[rsrc].content;
                            obj.removeAttribute("rsrc");
                        }
                        else 
                        {
                            obj.src = resource.get_embed_src(rsrc);
                            obj.removeAttribute("rsrc");
                        }
                    }
                    if(obj.getAttribute("grsrc") != null)
                    {
                        var grsrc = obj.getAttribute("grsrc");
                        if (window.useGameBackgroundCetric)
                        {
                            grsrc = grsrc.replace("brand_bg.jpg", "game_bg.jpg");
                        }
                        if (resource.get_param('BRAND_NAME') != '')
                        {
                            grsrc = grsrc.replace("brand_bg.jpg", "brand_bg_" + resource.get_param('BRAND_NAME') + ".jpg");
                            grsrc = grsrc.replace("logo.png", "logo_" + resource.get_param('BRAND_NAME') + ".png");
                            grsrc = grsrc.replace("end_screen.jpg", "end_screen_" + resource.get_param('BRAND_NAME') + ".jpg");
                        }
                        if (res_embed_bp[grsrc] != undefined)
                        {
                            obj.src = res_embed_bp[grsrc].content;
                            obj.removeAttribute("grsrc");
                        }
                        else 
                        {
                            obj.src = resource.get_embed_src(grsrc);
                            obj.removeAttribute("grsrc");
                        }
                    }
                }
            }
        }
        
        this.replaceText = function (lang, pointcutType, configTxt)
        {
            var objs = document.getElementsByClassName("txt");
            for (var i = 0; i < objs.length; i++)
            {
                var obj = objs[i];
                var txt_content_var = obj.getAttribute("rtxt");
                var txtVal = configTxt[pointcutType].languages[lang][txt_content_var];
                if (txtVal != undefined)
                {
                    if (typeof(txtVal)=="string")
                    {
                        obj.innerHTML = Core.replaceTextWithVariable(txtVal);
                    }
                    else 
                    {
                        obj.innerHTML = Core.replaceTextWithVariable(configTxt[pointcutType].languages[lang][txt_content_var][game_igp_code_define]);
                    }
                }
            }
        }

        this.replaceElementText = function (lang, pointcutType, configTxt, element)
        {
            var txt_content_var = element.getAttribute('rtxt');
            var txtVal = configTxt[pointcutType].languages[lang][txt_content_var];
            if (txtVal != undefined)
            {
                element.innerHTML = Core.replaceTextWithVariable(txtVal);
            }
            else 
            {
                element.innerHTML = Core.replaceTextWithVariable(configTxt[pointcutType].languages[lang][txt_content_var][game_igp_code_define]);
            }
        }

        this.replaceTextWithVariable = function(StringVal)
        {
            var strReplace = StringVal;
            if ( strReplace != undefined ) 
            {
                while ( strReplace.indexOf('%') > -1 && strReplace.indexOf('%',strReplace.indexOf('%')+1) > -1 )
                {
                    var ImgVar = strReplace.substring(strReplace.indexOf('%')+1, strReplace.indexOf('%',strReplace.indexOf('%')+1));
                    strReplace = strReplace.replace('%' + ImgVar + '%', window[ImgVar + '_define']);
                }
            }
            else 
            {
                
            }
            return strReplace;
        }

        this.replaceLinkVideo = function () {
            var objs = document.getElementsByTagName('video');
            for(var i = 0; i< objs.length; i++)
            {
                var obj = objs[i];
                var rsrc = obj.getAttribute("rsrc");
                if(rsrc != null)
                {
                    obj.src = resource.get_embed_src(rsrc);
                    obj.removeAttribute("rsrc");
                }
            }
        }

	this.checkDevice = function () {
            var ua = navigator.userAgent.toLowerCase();
            var isAndroid = ua.indexOf("android") > -1; // Detect Android devices
            if (isAndroid) {
                var splitValue = navigator.userAgent.match(/Android\s([0-9\.]*)/);
                if(splitValue.length > 0)
                {
                    if(splitValue[1] < '4.4.4')
                    {
                        return this.DEVICE_ANDROID_LOW;
                    }
                }
                return this.DEVICE_ANDROID;
            }
        
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                    if (v == null)
                        v = (navigator.appVersion).match(/OS%20(\d+)_(\d+)_?(\d+)?/);
                    var ver = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                    if (ver) {
                            if (ver[0] <= 7) {
                                    return this.DEVICE_IOS_7;
                            }
                            else {
                                    return this.DEVICE_IOS_8;
                            }
                    }
            }
            return this.DEVICE_ANDROID;
	}

	this.checkDeviceSize = function (callback)
	{
		if (Core.setupFirstTime == false)
		{
			// nothing 
		}
		else 
		{
			var screen_width = document.body.offsetWidth;
			var screen_height = document.body.offsetHeight;
                        console.log("check device size, new:"+ screen_width + " " + screen_height);
			if ( lastScreenH != screen_height && lastScreenW != screen_width)
			{
				lastScreenW = screen_width;
				lastScreenH = screen_height;
                                if (window.callback)
                                {
                                    console.log("call back, new:"+ screen_width + " " + screen_height);
                                    callback();
                                }
			}
		}
		return setTimeout(Core.checkDeviceSize, 100); // must call core for calling more than second times 
	}
        
        this.verticalAlignMiddle = function (el) {
            var elH = el.offsetHeight
            var parentEl = el.parentElement;
            var parentElH = parentEl.offsetHeight;
            el.style.top = (parentElH - elH) / 2 + 'px';
        }

        this.autoresizeText = function (el) {
            //if (DEBUG) return false;
            // If argument is not a DOMelement, return false
            if (el.nodeType !== 1) return false;
            var txt = el.innerHTML,
                // Get styles of original element
                styles = window.getComputedStyle(el, null),
                fontsize = parseInt(styles['font-size'], 10),
                padding = parseInt(styles['padding-left'], 10) + parseInt(styles['padding-right'], 10),
                indent = parseInt(styles['text-indent'], 10),
                fontfamily = styles['font-family'],
                // Set width of the original element
                elx = parseInt(el.offsetWidth, 10) - padding - indent,
                // New placeholder element
                placeholder = document.createElement('div'),
                newfontsize;

            // Set the placeholder to fit the text precisely
            placeholder.setAttribute('style', 'float:left;white-space:nowrap;visibility:hidden;font-size:' + fontsize + 'px;font-family:' + fontfamily);
            placeholder.innerHTML = txt;
            // And add to the current DOM
            document.body.appendChild(placeholder);
			if (placeholder.offsetWidth == 0) return; // return when string null
			var prevWidth = 0;
            if (placeholder.offsetWidth > elx) {
                // If the text is too big, decrease font-size until it fits
                while (placeholder.offsetWidth > elx && prevWidth != placeholder.offsetWidth) {
                    prevWidth = placeholder.offsetWidth;
                    placeholder.style.fontSize = parseInt(placeholder.style.fontSize, 10) - 1 + 'px';
                };
            } else {
                // If the text is too small, increase font-size until it fits
                while (placeholder.offsetWidth < elx && prevWidth != placeholder.offsetWidth) {
                    prevWidth = placeholder.offsetWidth;
                    placeholder.style.fontSize = parseInt(placeholder.style.fontSize, 10) + 1 + 'px';
            };
            }
            newfontsize = parseInt(placeholder.style.fontSize, 10) - 1;
            // Default the maximum fontsize is the initial fontsize.
            // If you want the text to grow bigger too, change the following line to
             //el.style.fontSize = newfontsize + 'px';
            
            if (newfontsize >= fontsize ) return ; // return if bigger or it will wrong 
            
            el.style.fontSize = (newfontsize < fontsize ? newfontsize : fontsize) + 'px';

            // Clean up the placeholder
            placeholder.parentElement.removeChild(placeholder);
        }


	this.GetFontScale = function ()
	{
		//return 1;
			var div = document.createElement('DIV');
                        div.innerHTML = 'abc';
                        div.style.position = 'absolute';
                        div.style.top = '-100px';
                        div.style.left = '-100px';
                        div.style.fontFamily = 'Arial';
                        div.style.fontSize = 20 + 'px';
			document.body.appendChild(div);
			
			var size = div.offsetWidth;

			document.body.removeChild(div);
			return 32.24609375/size;
	}
        
        this.is_null = function(variable)
        {
            return (typeof variable == 'undefined' || variable == null);
        };
	
	this.GetDeviceSize = function ()
	{
		return {
			width: document.body.offsetWidth,
			height: document.body.offsetHeight
		};
	}

	this.RedirectProductLink = function ()
	{
		if(window.call_client)
		{
                    reset_time_spent();
                    call_client(window.creative_id, "GLADS_CLICK_INTERSTITIAL", "click", 0,0,"",'link:' + PRODUCT_LINK);
		}
	}

        var isClickedOnLink = false;
	this.OpenProductLink = function()
	{
		try
		{
                    if (isClickedOnLink == false)
                    {
                        isClickedOnLink = true;
                        send_tracking(tracking_actions.click_on_link, function(){return Core.RedirectProductLink();});
                    }
		}
		catch(e)
		{
		}
	};
        
        this.GetRewardAmount = function()
        {
            if ((typeof reward_amount) != 'undefined')
            {
                return reward_amount;
            }

            return 5;
        };

        this.getRewardIcon = function(val) {
            if (DEBUG)
                return;
            else 
            {
                if(window.resource.get_reward_icon)
                {
                    elem = document.getElementById(val);
                    elem.src = resource.get_reward_icon();
                }
                else
                {
                    setTimeout(function(){Core.getRewardIcon(val);}, 1000);
                }
            }
        }

	this.Exit = function ()
	{
		try
		{
			send_tracking(tracking_actions.close_game, function(){return redirect('exit:');});
		}
		catch(e)
		{

		}

	};
        
        this.ExitWithoutTracking = function()
        {
            if (window.redirect)
                redirect('exit:');
        }
        
        this.PauseUserMusic = function ()
        {
			if (window.can_pause_music && can_pause_music == 1)
			{
				if (window.redirect)
					redirect('pauseusermusic:');
			}
        }

	onPause = function()
	{
            isPaused = true;
		if (window.pauseMyAd)
			pauseMyAd();
	}

	onPauseActive = function()
	{
            isPaused = true;
		if (window.pauseMyAd)
			pauseMyAd();
                if (window.pauseMyAdTracking)
                    pauseMyAdTracking();
	}

	onResume = function()
	{
            isClickedOnLink = false;
            isPaused = false;
		if (window.resumeMyAd)
			resumeMyAd();
                if (window.resumeMyAdTracking)
                    resumeMyAdTracking();
	}

	onResumeActive = function()
	{
        isPaused = false;
		if (window.resumeMyAd)
			resumeMyAd();
                if (window.resumeMyAdTracking)
                    resumeMyAdTracking();
	}

	onHide = function()
	{
		// nothing on hide
	}
	
	onBackPressed = function() {
		console.log('onBackPressed called!')
		skipReward();
		//redirect('exit:'); //to get reward on android
	}

	this.InterruptExit = function ()
	{
		if (Core.getMobileOperatingSystem() != 'iOS')
		{
			Core.Exit();
		}
	}

	this.getMobileOperatingSystem = function () {
	  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	  if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
	  {
		return 'iOS';

	  }
	  else if( userAgent.match( /Android/i ) )
	  {

		return 'Android';
	  }
	  else
	  {
		return 'unknown';
	  }
	}

	this.advertisement = function(advertisement, pos, fontColor, shadowColor, s) 
	{
		var o, a, r = 0, d = this._image.clientHeight, h = this._image.clientWidth;
		if (0 != pos) 
		{
			switch (pHeight > pWidth && (r = 1), "iPad" == deviceModel.substring(0, 4) && (tablet = 1), _os) 
			{
			case"ios":
				var o = document.documentElement.clientHeight, a = document.documentElement.clientWidth;
				if (tablet)
					var l = "1.7em";
				else if (_hd)
					if (480 == HEIGHT || 480 == WIDTH)
						var l = "1.7em";
					else 
						var l = "2.3em";
				else 
					var l = "2.3em";
				break;
			case"win":
				var o = pHeight, a = pWidth, l = "150%";
				break;
			case"winp":
				var o = pHeight, a = pWidth, l = "150%";
				break;
			default:
				var o = window.innerHeight, a = window.innerWidth, l = "1.7em"
			}
			if (r)
				var c = (o - d) / 2 + 3, u = (a - h) / 2 + 7;
			else 
				var c = (a - h) / 2 + 6, u = (o - d) / 2 + 3;
			var m;
			switch ("undefined" == typeof pos && (pos = 4), pos) 
			{
			case 3:
				m = "bottom: " + u + "px; right: " + c + "px;", r && (m = "bottom: " + c + "px; right: " + u + "px;");
				break;
			case 2:
				m = "top: " + u + "px; right: " + c + "px;", r && (m = "top: " + c + "px; right: " + u + "px;");
				break;
			case 1:
				m = "top: " + u + "px; left: " + c + "px;", r && (m = "top: " + c + "px; left: " + u + "px;");
				break;
			default:
				m = "bottom: " + u + "px; left: " + c + "px;", r && (m = "bottom: " + c + "px; left: " + u + "px;");
			}
			var p = "font-family:arial;color:" + fontColor + ";z-index:11;font-size: " + l + ";display: block;text-shadow: 1px 1px 5px " + shadowColor + ", -1px -1px 5px " + shadowColor + ", 1px 1px 5px " + shadowColor + ", -1px -1px 5px " + shadowColor + ";position: absolute;" + m;
			if ("undefined" == typeof s) 
			{
				var w = document.createElement("span");
				w.setAttribute("style", p), w.id = "adsText", document.body.appendChild(w), w.innerHTML = t
			} else 
			{
				var w = document.getElementById("adsText");
				"undefined" != typeof w && null !== typeof w && w.setAttribute("style", p);
			}
		}
	}
}
var Core = new Core();

// Font checker 

var FontChecker = function ()
{
    var mig_font_calculateWidth, mig_font_monoWidth, mig_font_serifWidth, mig_font_sansWidth, mig_font_width;
    var mig_font_container     = null;

    FontChecker.prototype.is_init = function()
    {
        return !Core.is_null(mig_font_container);
    };

    FontChecker.prototype.all_font_loaded = function()
    {
        for(var font in font_list)
        {
            if(!is_font_available(font_list[font]))return false;
        }
        return true;
    };

    function mig_font_calculate_width(fontFamily)
    {
        mig_font_container.style.fontFamily = fontFamily;

        document.body.appendChild(mig_font_container);
        width = mig_font_container.clientWidth;
        document.body.removeChild(mig_font_container);

        return width;
    }

    FontChecker.prototype.init = function()
    {
        var mig_font_containerCss  = [
            'position:absolute',
            'width:auto',
            'font-size:128px',
            'left:-99999px'
        ];

        mig_font_container = document.createElement('div');

        // Create a span element to contain the test text.
        // Use innerHTML instead of createElement as it's smaller
        mig_font_container.innerHTML = '<span style="' + mig_font_containerCss.join(' !important;') + '">' + Array(25).join('Gameloft') + '</span>';
        mig_font_container = mig_font_container.firstChild;

        // Pre calculate the widths of monospace, serif & sans-serif
        // to improve performance.
        mig_font_monoWidth  = mig_font_calculate_width('monospace');
        mig_font_serifWidth = mig_font_calculate_width('serif');
        mig_font_sansWidth  = mig_font_calculate_width('sans-serif');
    };

    function is_font_available(fontName)
    {
        return mig_font_monoWidth !== mig_font_calculate_width(fontName + ',monospace') ||
            mig_font_sansWidth !== mig_font_calculate_width(fontName + ',sans-serif') ||
            mig_font_serifWidth !== mig_font_calculate_width(fontName + ',serif');
    };

    FontChecker.prototype.remove_font_checker = function()
    {

    };

};
var FontChecker = new FontChecker();

var InternetConnection = function(){
	
        this.CheckInternetState = null;
	this.connected = true;
	
        this.canConnectInternet = function(){
            return InternetConnection.connected;
        }
        
	this.scheduler = function(){
		if (typeof window.schedulerInterval == 'undefined'){
		
			window.schedulerInterval = setInterval(function(){
				
				if (InternetConnection.connected){
					clearInterval(window.schedulerInterval);
					window.schedulerInterval = undefined;
				}
				
			}, 200);
		}
	}
	
	this.check = function(){

		var img = new Image(1,1);

		img.onerror = function () {
			
			InternetConnection.connected 		= false;
			//InternetConnection.scheduler();
		};

		img.onload = function() {
			
			if (!InternetConnection.connected){

				InternetConnection.connected 		= true;
			}
                        img = null;
		};

		img.src = _protocol + _domain_name + '/un/web/fullscreen/images/pixel.gif?time=' + new Date().getTime();
                //img.src = "http://201205igp.gameloft.com//un/web/fullscreen/images/pixel.gif?time=" + new Date().getTime();
	}
}

var InternetConnection = new InternetConnection();
