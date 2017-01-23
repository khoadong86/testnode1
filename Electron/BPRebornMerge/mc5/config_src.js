function PlaySfxfunc() {
    setTimeout(playSfx, 1500);
}

var min_shape_pool = new Array(50);
var m_timeCnt = 0;
function SetupMinionShapeAnim(min_shape_pool) {
    //var ad_holder_anim = document.getElementById('white_bg_holder');//ad_holder_anim
    var ad_holder_anim = document.getElementById('content_in');//
    var min_shape_holder;
    var min_shape_ratio = 25/28;
    var posX = 0; 
    var posY = 0;
    var offsetRow = 0;
    var iMaxPos = 26; 
    var jMaxPos = 40;
    var shapeH = Math.floor(ad_holder_anim.offsetHeight / (jMaxPos+1)*2 );
    var shapeW = Math.floor(shapeH / min_shape_ratio); 
    
    ///*
    var poolMax = 40;
    for (var poolNum = 0; poolNum < poolMax; poolNum++)
    {
        var i = Math.ceil(Math.random() * iMaxPos);
        var j = Math.ceil(Math.random() * jMaxPos);
        if (poolNum < poolMax / 2)
        {
            ad_holder_anim = null;
            while (ad_holder_anim == null)
            {
                i = Math.ceil(Math.random() * iMaxPos);
                j = Math.ceil(Math.random() * jMaxPos);
                if (  Math.floor(i*3.5) + j <= 57 )
                {
                    ad_holder_anim = document.getElementById('left_white_bg_holder');
                }
            }
            
        }
        else 
        {
            ad_holder_anim = null;
            while (ad_holder_anim == null)
            {
                i = Math.ceil(Math.random() * iMaxPos);
                j = Math.ceil(Math.random() * jMaxPos);
                if ( Math.floor(i*3.5) + j >= 58 )
                {
                    ad_holder_anim = document.getElementById('right_white_bg_holder');
                }
            }
        }
        
            offsetRow = (j % 2) * (shapeW / 4 * 3)
            var idTemp = 'min_shape_holder_' + poolNum;
            //min_shape_holder = document.getElementById(idTemp);
            //if (min_shape_pool == undefined)
                //min_shape_pool = new Array(50);
            if (min_shape_pool[poolNum] == null)
            {
                min_shape_pool[poolNum] = document.createElement('div');
                min_shape_pool[poolNum].id = idTemp;
                var min_shape_img = new Array(3);
                for (var min_shape_num = 0; min_shape_num < 3; min_shape_num++ )
                {
                    min_shape_img[i] = document.createElement('img');
                    min_shape_img[i].id = 'min_shape_img' + min_shape_num;
                    min_shape_img[i].setAttribute('src', link_min_img[min_shape_num+1]);
                    min_shape_img[i].style.width = "100%";
                    min_shape_img[i].style.height = '100%';
                    min_shape_img[i].style.display = 'none';
                    min_shape_pool[poolNum].appendChild(min_shape_img[i]);
                    ad_holder_anim.appendChild(min_shape_pool[poolNum]);
                }
            }
            if ( typeof  min_shape_pool[poolNum].timer == "undefined" || min_shape_pool[poolNum].timer <= 0 )
            {
                min_shape_pool[poolNum].style.position = 'absolute';
                min_shape_pool[poolNum].style.display = 'block';
                min_shape_pool[poolNum].style.width = shapeW + 'px';
                min_shape_pool[poolNum].style.height = shapeH + 'px';
                min_shape_pool[poolNum].style.left = offsetRow + posX  + i * Math.floor(shapeW * 6 / 4) + 'px';
                min_shape_pool[poolNum].style.top =  posY +  j * (shapeH/2) + 'px';
                min_shape_pool[poolNum].timer = Math.random() * 3000 + 1000;// + 500;
                //if (min_shape_pool[poolNum].alpha == undefined)
                {
                    min_shape_pool[poolNum].alpha = 0.8;
                    min_shape_pool[poolNum].style.opacity = 1.0;
                    min_shape_pool[poolNum].fadeMulti = (Math.random() * 3) + 0.2;
                }
                
                var min_shape_img = min_shape_pool[poolNum].childNodes;
                var rand = Math.floor(Math.random() * 3);
                for (var img_num = 0; img_num < 3; img_num++)
                {
                    min_shape_img[img_num].style.display = 'none';
                    if (img_num == rand)
                    {
                        min_shape_img[img_num].style.display = 'block';
                    }
                }
            }
            else 
            {
                min_shape_pool[poolNum].timer -= m_timeCnt;                
                min_shape_pool[poolNum].alpha -= m_timeCnt/1000 * min_shape_pool[poolNum].fadeMulti;
                
                if ( min_shape_pool[poolNum].alpha <= 0 )
                {
                    min_shape_pool[poolNum].timer = 0;
                }
                min_shape_pool[poolNum].style.opacity = min_shape_pool[poolNum].alpha;
            }
    }
    
    /*
    var poolIncrease = poolMax + 50;
    var prei, prej;
    for (var poolNum = poolMax ; i < poolIncrease; i++ )
    {
        var i = Math.ceil(Math.random() * iMaxPos);
        var j = Math.ceil(Math.random() * jMaxPos);
        ad_holder_anim = null;
        while (ad_holder_anim == null)
        {
            i = Math.ceil(Math.random() * iMaxPos);
            j = Math.ceil(Math.random() * jMaxPos);
            if (  Math.floor(i*3.5) + j <= 59 )
            {
                ad_holder_anim = document.getElementById('left_white_bg_holder');
            }
            else 
            {
                if ( Math.floor(i*3.5) + j >= 68 )
                {
                    ad_holder_anim = document.getElementById('right_white_bg_holder');
                }
            }
        }
        
    }
    //*/
    m_timeCnt = (Math.random()* 200 + 60);
    m_timeCnt = 100;
    setTimeout( function(){SetupMinionShapeAnim(min_shape_pool);}, m_timeCnt);
    //*/
    /*
    ad_holder_anim = document.getElementById('right_white_bg_holder');//ad_holder_anim

    for (var i = 0; i < 26; i++)
    {
        for (var j = 0; j < 40; j++)
        {
            if (  Math.floor(i*3.5) + j <= 58 )
            {
                ad_holder_anim = document.getElementById('left_white_bg_holder');
            }
            else 
            {
                if ( Math.floor(i*3.5) + j >= 59 )
                {
                    ad_holder_anim = document.getElementById('right_white_bg_holder');
                }
            }
            offsetRow = (j % 2) * (shapeW / 4 * 3)
            var idTemp = 'min_shape_holder_' + i + '_' + j;
            min_shape_holder = document.getElementById(idTemp);
            if (min_shape_holder == null)
            {
                min_shape_holder = document.createElement('div');
                min_shape_holder.id = idTemp;
            }
            while (min_shape_holder.firstChild) {
               min_shape_holder.removeChild(min_shape_holder.firstChild);
}
            min_shape_holder.style.position = 'absolute';
            min_shape_holder.style.display = 'block';
            min_shape_holder.style.width = shapeW + 'px';
            min_shape_holder.style.height = shapeH + 'px';
            min_shape_holder.style.left = offsetRow + posX  + i * Math.floor(shapeW * 6 / 4) + 'px';
            min_shape_holder.style.top =  posY +  j * (shapeH/2) + 'px';
            var min_shape_img = document.createElement('img');
            var rand = Math.floor(Math.random() * 3) + 1;
            var sss = 60;
            if ( Math.floor(i*3.5) + j <= 58)
            {
                rand = 1;
            }
            else
            {
                if ( Math.floor(i*3.5) + j >= 59)
                    rand = 2;
                else 
                    rand = 3;
            }
            //min_shape_img.setAttribute('rsrc', "data/minion-shape-" + rand + ".png");
            //if (rand != 0)
            min_shape_img.setAttribute('src', link_min_img[rand]);
            min_shape_img.style.width = "100%";
            min_shape_img.style.height = '100%';
            min_shape_holder.appendChild(min_shape_img);
            
            ad_holder_anim.appendChild(min_shape_holder);
        }
    }
    //*/
}

var RunAnimMC5 = function()
{
    SetupMinionShapeAnim(min_shape_pool);
}

var link_min_img = new Array(4);
if (DEBUG)
{
    for (var i = 1; i <= 3; i++)
    {
        link_min_img[i] = linkResourceURL + "data/minion-shape-" + i + ".png";
    }
}
else
{
    for (var i = 1; i <= 3; i++)
    {
        link_min_img[i] = resource.get_embed_src(linkResourceURL + "data/minion-shape-" + i + ".png");
    }
}
function SetupAnim() {
    var kfzero = 0;
    var kfanim_show = 400;
    var kfanim_lightend = kfanim_show + 200; // speed of light run 
    var kfanim_lightend_offset = kfanim_lightend + 5; // start anim after light run end 
    var kfanim3 = kfanim_lightend_offset + 500;
    var kfanim4 = kfanim_lightend_offset + 0;
    var kfanim_remove_light = kfanim_lightend_offset;
    var kfanim_light_fadeout = kfanim_lightend_offset + 100;
    var kfanim_open = kfanim4 + 2000;
    var kfanim_btn_get = kfanim_open + 700;
    var anim_open = '[easeIn]';
    var kfanim5 = 1700;
    var kfanimA3 = 1400;//1100;
    var kfanimA3_bg_offset = 130;
    var kfanimStop = kfanim_btn_get + 200;
    var kfanimAfterStop1 = kfanimStop + 200;// claim button go out 
    var kfanimAfterStop2 = kfanimAfterStop1 + 2000;// claim button go out 
    
    var ad_holder_anim = document.getElementById('ad_holder_anim');
    var white_bg_holder = document.getElementById('white_bg_holder');
    var bg_holder = document.getElementById('bg_holder');
    var video_holder = document.getElementById('video_holder');
    var left_white_bg_holder = document.getElementById('left_white_bg_holder');
    var right_white_bg_holder = document.getElementById('right_white_bg_holder');
    
    ad_holder_anim.setAttribute('data-' + kfzero, 'height[outCubic]:100%;width[outCubic]:100%');
    ad_holder_anim.setAttribute('data-' + kfanim_show, 'height[outCubic]:100%;width[outCubic]:100%');
    white_bg_holder.setAttribute('data-' + (kfanim3+1), 'opacity:1');
    bg_holder.setAttribute('data-' + kfzero, 'opacity:0');
    bg_holder.setAttribute('data-' + (kfanimA3-kfanimA3_bg_offset), 'opacity:0');
    bg_holder.setAttribute('data-' + (kfanimA3+kfanimA3_bg_offset), 'opacity:1');
    video_holder.setAttribute('data-' + kfzero, 'opacity:0');
    video_holder.setAttribute('data-' + kfanim4, 'opacity:0');
    video_holder.setAttribute('data-' + kfanim5, 'opacity:1');

    ///*
    var contentH = 500;//document.body.innerHeight;
    left_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:1;left' + anim_open + ':-8%');
    left_white_bg_holder.setAttribute('data-' + kfanim_lightend, 'opacity:1;left' + anim_open + ':-8%');
    left_white_bg_holder.setAttribute('data-' + (kfanim4+1), 'opacity:1;left' + anim_open + ':-8%');
    left_white_bg_holder.setAttribute('data-' + kfanim_open, 'left' + anim_open + ':-100%');
    right_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:1;right' + anim_open + ':-8%');
    right_white_bg_holder.setAttribute('data-' + kfanim_lightend, 'opacity:1;right' + anim_open + ':-8%');
    right_white_bg_holder.setAttribute('data-' + (kfanim4+1), 'opacity:1;right' + anim_open + ':-8%');
    right_white_bg_holder.setAttribute('data-' + kfanim_open, 'right' + anim_open + ':-100%');
    //*/
    var light_line_holder = document.getElementById('light_line_holder');
    light_line_holder.setAttribute('data-' + kfanim_show, 'width:10px;height:10px;opacity:1;');
    light_line_holder.setAttribute('data-' + (kfanim_lightend), 'width:' + contentH + 'px;height:' + contentH + 'px;opacity:1;');
    light_line_holder.setAttribute('data-' + (kfanim_remove_light), 'opacity:1;');
    light_line_holder.setAttribute('data-' + (kfanim_light_fadeout), 'opacity:0;');
    var light_line_over_holder = document.getElementById('line_over_holder');
    light_line_over_holder.setAttribute('data-' + kfzero, 'opacity:1;');
    light_line_over_holder.setAttribute('data-' + (kfanim_remove_light-1), 'opacity:1;');
    light_line_over_holder.setAttribute('data-' + (kfanim_remove_light), 'opacity:0;');
    
    var btn_get_holder = document.getElementById('claim_btn_holder');
    var btn_learnmore_holder = document.getElementById('learnmore_btn_holder');
    var logo_holder = document.getElementById("logo_holder");
    var text_group_holder = document.getElementById("text_group_holder");
    var txt_header_holder = document.getElementById("txt_header_holder");
    var txt_getfree_holder = document.getElementById("txt_getfree_holder");
    txt_header_holder.setAttribute('data-' + kfzero, 'opacity:0');
    txt_header_holder.setAttribute('data-' + (kfanim_open-1), 'opacity:0');
    txt_header_holder.setAttribute('data-' + (kfanim_open), 'opacity:1');
    txt_getfree_holder.setAttribute('data-' + kfzero, 'opacity:0');
    txt_getfree_holder.setAttribute('data-' + (kfanim_open-1), 'opacity:0');
    txt_getfree_holder.setAttribute('data-' + (kfanim_open), 'opacity:1');

    
    var dummyStop = document.createElement('div');
    dummyStop.setAttribute('data-stop', '');
    dummyStop.setAttribute('data-' + kfanimStop, '');
    ad_holder_anim.appendChild(dummyStop);
    
    logo_holder.setAttribute('data-' + kfzero, 'opacity:0');
    logo_holder.setAttribute('data-' + (kfanim_open+1), 'opacity:0');
    logo_holder.setAttribute('data-' + (kfanim_btn_get), 'opacity:1');
    
    btn_get_holder.setAttribute('data-' + kfzero, 'opacity:0');
    btn_get_holder.setAttribute('data-' + kfanim_open, 'opacity:0;right:-50%');
    btn_get_holder.setAttribute('data-' + (kfanim_btn_get), 'opacity:1;right:-2%');
    btn_get_holder.setAttribute('data-' + kfanimAfterStop1, 'opacity:1;right:-2%');
    btn_get_holder.setAttribute('data-' + (kfanimAfterStop1+700), 'opacity:0;right:-50%');
    btn_learnmore_holder.setAttribute('data-' + kfzero, 'opacity:0;right:-50%');
    btn_learnmore_holder.setAttribute('data-' + kfanimAfterStop2, 'opacity:0;right:-50%');
    btn_learnmore_holder.setAttribute('data-' + (kfanimAfterStop2+700), 'opacity:1;right:-2%');
    //*/
    var text_count_down_holder = document.getElementById('text_count_down_holder');
    text_count_down_holder.setAttribute('data-' + kfzero, 'opacity:0');
    text_count_down_holder.setAttribute('data-' + (kfanimAfterStop1-1), 'opacity:0');
    text_count_down_holder.setAttribute('data-' + (kfanimAfterStop1), 'opacity:1');
    //setTimeout( function(){SetupMinionShapeAnim();}, 400);
    
    setTimeout( function(){ 
        Core.autoresizeText(document.getElementById('txt_btn_get_holder'));
        Core.verticalAlignMiddle(document.getElementById('txt_btn_get_holder'));
    }, kfanim_open);
    //if (link_min_img == undefined)
    {
        //link_min_img = new Array(4);
    }
    if (DEBUG)
    {
        for (var i = 1; i <= 3; i++)
        {
            link_min_img[i] = linkResourceURL + "data/minion-shape-" + i + ".png";
        }
    }
    else
    {
        for (var i = 1; i <= 3; i++)
        {
            link_min_img[i] = resource.get_embed_src(linkResourceURL + "data/minion-shape-" + i + ".png");
        }
    }
}
