function PlaySfxfunc() {
    setTimeout(playSfx, 3000);
}

function SetupAnim() {
    var kfzero = 0;
    var kfanim2 = 300;
    
    var ad_holder_anim = document.getElementById('ad_holder_anim');
    var white_bg_holder = document.getElementById('white_bg_holder');
    var bg_holder = document.getElementById('bg_holder');
    var video_holder = document.getElementById('video_holder');
    var left_white_bg_holder = document.getElementById('left_white_bg_holder');
    var right_white_bg_holder = document.getElementById('right_white_bg_holder');
    
    
    var kfanimShake1 = kfanim2 + 50;
    ad_holder_anim.setAttribute('data-' + kfzero, 'opacity:0');
    ad_holder_anim.setAttribute('data-' + kfanim2, 'opacity:1;transform:translate(-50%,-50%) rotate(0deg)');
    var ShakeFrames = 0;
    var ShakeDeg = 0;
    var PreShakeDeg = 0;
    var maxBound = 7;
    var minBound = 1;
    var stepShakeFrame = 200;
    var stepShakeFrames = [150, 300, 750, 1000, 1250];
    var stepShakeDegs = [3, -5, 3, -5, 3]
    var animType = '';//'[bounce]';
    ShakeDeg = getRandomInt(-maxBound, maxBound);
    
    for (var i = 0; i < 15; i++)
    {
        if (ShakeDeg > 0)
            ShakeDeg = getRandomInt(-maxBound, -minBound);
        else 
            ShakeDeg = getRandomInt(minBound, maxBound);
        ShakeDeg = getRandomInt(-maxBound, maxBound);
        //ShakeDeg = stepShakeDegs[i];
        ShakeFrames += stepShakeFrame;
        ad_holder_anim.setAttribute('data-' + (kfanimShake1 + ShakeFrames - 10), 'left:50%;transform:translate(-50%,-50%) rotate'+ animType +'(' + PreShakeDeg + 'deg)');
        ad_holder_anim.setAttribute('data-' + (kfanimShake1 + ShakeFrames), 'left:50%;transform:translate(-50%,-50%) rotate'+ animType +'(' + ShakeDeg + 'deg)');
        PreShakeDeg = ShakeDeg;
    }
    ShakeFrames += 500;//stepShakeFrames;
    ad_holder_anim.setAttribute('data-' + (kfanimShake1 + ShakeFrames-300), 'left:50%;transform:translate(-50%,-50%) rotate'+ animType +'(' + PreShakeDeg + 'deg)');
    ad_holder_anim.setAttribute('data-' + (kfanimShake1 + ShakeFrames), 'left:50%;transform:translate(-50%,-50%) rotate'+ animType +'(' + 0 + 'deg)');
    
    var stepCrackFrames = 0;
    var curCrackStep = 0;
    var crackEle = null;
    var kfanimCrack1 = kfanimShake1;
    for (var i = 1; i < 6; i++)
    {
        crackEle = document.getElementById("crack_holder" + i);
        crackEle.setAttribute('data-' + kfzero, 'opacity:0;' );
        stepCrackFrames = stepShakeFrames[i-1];
        crackEle.setAttribute('data-' + (kfanimCrack1 + stepCrackFrames - 1), 'opacity:0;' );
        crackEle.setAttribute('data-' + (kfanimCrack1 + stepCrackFrames), 'opacity:1;' );
    }
    
    var MaxSmallCracks = 11;
                     //1   2   3   4   5   6   7   8   9   10  11
    var smallCrackW = [5,  3,  4,  9,  7,  10, 12, 5,  3,  3,  7];
  //var smallCrackH = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
    var smallCrackT = [0,  0,  45, 50, 84, 84, 10, 64, 80, 51, 17];
    var smallCrackL = [1,  15, 0,  91, 37, 79, 64, 40, 15, 46, 64];
    var partSide    = [1,  1,  1,  2,  2,  2,  1,  1,  1,  2,  2];    
    var isCloneAdd  = [1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1];    
    var orderNum  =   [1,  2,  3,  4,  5,  6,  9,  10, 8,  11, 12];    
    //var orderNum    = [1,  2,  3,  ]
    var content_in_ele = document.getElementById('bg_holder');
    var stepSmallCrackFrame = 120;
    var curStepSmallCrack = 0;
    for (var i = 1; i <= MaxSmallCracks; i++)
    {
        var newSmallCrack = document.createElement('div');
        newSmallCrack.id = "SmallCrackHolder" + i;
        newSmallCrack.className = "small_crack" + i;
        newSmallCrack.style.position = 'absolute';
        newSmallCrack.style.top = smallCrackT[i-1] + '%';
        newSmallCrack.style.left = smallCrackL[i-1] + '%';
        newSmallCrack.style.width = smallCrackW[i-1] + '%';
        newSmallCrack.style.height = 'auto';//smallCrackH[i-1] + '%';
        newSmallCrack.style.opacity = '0';
        //newSmallCrack.style.display = 'none';
        var newSmallCrackImg = document.createElement('img');
        newSmallCrackImg.setAttribute('rsrc', "data/Crack_small_" + i + ".png");
        newSmallCrackImg.style.width = '100%';
        newSmallCrackImg.style.height = 'auto';
        newSmallCrack.appendChild(newSmallCrackImg);
      
        newSmallCrack.setAttribute('data-' + (kfanimShake1 + stepSmallCrackFrame*orderNum[i-1] - 1), 'opacity:0;' );
        newSmallCrack.setAttribute('data-' + (kfanimShake1 + stepSmallCrackFrame*orderNum[i-1]), 'opacity:1;' );
        //curStepSmallCrack += stepSmallCrackFrame;
        ///*
        if (partSide[i-1] == 1 )
            left_white_bg_holder.appendChild(newSmallCrack);
        else 
            right_white_bg_holder.appendChild(newSmallCrack);
        //*/
        if (isCloneAdd[i-1] == 1)
        {
            var cloneNode = newSmallCrack.cloneNode(true);
            content_in_ele.appendChild(cloneNode);
        }
    }
    
    var kfOpenCrack0 = 1350;
    var kfOpenCrack1 = kfOpenCrack0 + 700;
    var kfOpenCrack2 = kfOpenCrack1 + 4300;
    
    for (var i = 1; i < 6; i++)
    {
        crackEle = document.getElementById("crack_holder" + i);
        crackEle.setAttribute('data-' + (kfOpenCrack0), 'display:block' );
        crackEle.setAttribute('data-' + (kfOpenCrack0+1), 'display:none' );
    }
    bg_holder.setAttribute('data-' + kfzero, 'opacity:1');
    bg_holder.setAttribute('data-' + (kfOpenCrack0), 'opacity:1');
    bg_holder.setAttribute('data-' + (kfOpenCrack0+1), 'opacity:0');

    left_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:0');
    left_white_bg_holder.setAttribute('data-' + kfOpenCrack0, 'opacity:0');
    left_white_bg_holder.setAttribute('data-' + (kfOpenCrack0+1), 'opacity:1;left:0%');
    left_white_bg_holder.setAttribute('data-' + (kfOpenCrack1), 'left[laggy]:0%');
    left_white_bg_holder.setAttribute('data-' + (kfOpenCrack2), 'left[laggy]:-80%');
    right_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:0');
    right_white_bg_holder.setAttribute('data-' + kfOpenCrack0, 'opacity:0');
    right_white_bg_holder.setAttribute('data-' + (kfOpenCrack0+1), 'opacity:1;');
    right_white_bg_holder.setAttribute('data-' + (kfOpenCrack1), 'right[laggy]:0%');
    right_white_bg_holder.setAttribute('data-' + kfOpenCrack2, 'right[laggy]:-80%');
   
    var kfLogoShow = ShakeFrames + 1000;
    var kftxtHeaderShow = kfLogoShow + 300;
    var kftxtGetfree = kftxtHeaderShow + 300;
    var logo_holder = document.getElementById("logo_holder");
    var text_group_holder = document.getElementById("text_group_holder");
    var txt_header_holder = document.getElementById("txt_header_holder");
    var txt_getfree_holder = document.getElementById("txt_getfree_holder");
    
    txt_header_holder.setAttribute('data-' + kfzero, 'opacity:0');
    txt_header_holder.setAttribute('data-' + (kftxtHeaderShow-1), 'opacity:0');
    txt_header_holder.setAttribute('data-' + (kftxtHeaderShow), 'opacity:1');
    txt_getfree_holder.setAttribute('data-' + kfzero, 'opacity:0');
    txt_getfree_holder.setAttribute('data-' + (kftxtGetfree-1), 'opacity:0');
    txt_getfree_holder.setAttribute('data-' + (kftxtGetfree), 'opacity:1');

    var kfanimbtn1 = kftxtGetfree + 300;
    var kfanimbtn2 = kfanimbtn1 + 300;
    var kfanimbtn3 = kfanimbtn2 + 300;
    var kfanimStop = kfanimbtn3 + 400;
    var kfanimAfterStop1 = kfanimStop + 400;
    var kfanimAfterStop2 = kfanimAfterStop1 + 400;
    var kfanimAfterStop3 = kfanimAfterStop2 + 2500;
    var kfanimAfterStop4 = kfanimAfterStop3 + 400;
    var btn_get_holder = document.getElementById('claim_btn_holder');
    var btn_learnmore_holder = document.getElementById('learnmore_btn_holder');
    var animBtnType = '';
    ///*
    btn_get_holder.setAttribute('data-' + kfzero, 'opacity:0');
    btn_get_holder.setAttribute('data-' + kfanimbtn1, 'opacity:0;right' + animBtnType + ':-30%;');
    btn_get_holder.setAttribute('data-' + kfanimbtn2, 'opacity:1;right' + animBtnType + ':0%;');
    btn_get_holder.setAttribute('data-' + kfanimAfterStop1, 'opacity:1;right' + animBtnType + ':0%');
    btn_get_holder.setAttribute('data-' + kfanimAfterStop2, 'opacity:0;right' + animBtnType + ':-30%;');
    
    var dummyStop = document.createElement('div');
    dummyStop.setAttribute('data-stop', '');
    dummyStop.setAttribute('data-' + kfanimStop, '');
    ad_holder_anim.appendChild(dummyStop);
    
    logo_holder.setAttribute('data-' + kfzero, 'opacity:0');
    logo_holder.setAttribute('data-' + (kfanimAfterStop2-1), 'opacity:0');
    logo_holder.setAttribute('data-' + (kfanimAfterStop2), 'opacity:1');
    btn_learnmore_holder.setAttribute('data-' + kfzero, 'opacity:0');
    btn_learnmore_holder.setAttribute('data-' + (kfanimAfterStop3-1), 'opacity:0');
    btn_learnmore_holder.setAttribute('data-' + kfanimAfterStop3, 'opacity:1;right' + animBtnType + ':-30%;');
    btn_learnmore_holder.setAttribute('data-' + kfanimAfterStop4, 'opacity:1;right' + animBtnType + ':0%');
    
    text_count_down_holder.setAttribute('data-' + kfzero, 'opacity:0');
    text_count_down_holder.setAttribute('data-' + (kfanimAfterStop1-1), 'opacity:0');
    text_count_down_holder.setAttribute('data-' + (kfanimAfterStop1), 'opacity:1');
    setTimeout( function(){ 
        Core.autoresizeText(document.getElementById('txt_btn_get_holder'));
        Core.verticalAlignMiddle(document.getElementById('txt_btn_get_holder'));
    }, kfanimbtn1);
    //*/
}
