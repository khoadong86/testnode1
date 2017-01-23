function SetupAnim() {
    var kfzero = 0;
    var kfanim1 = 0;
    var kfanim2 = 400;
    var kfanim3 = 750;
    var kfanim3_1 = 1000;
    var kfanim4 = 1600;
    var kfanim5 = 1700;
    var kfanimA1 = 400;// clear arrows go 
    var kfanimA2 = 1000;//700;// blur arrows 
    var kfanimA2a = 1200;//850;
    var kfanimA3 = 1400;//1100;
    var kfanimA3_bg_offset = 130;
    var kfanimAfterStop1 = 1900;// claim button go out 
    var kfanimAfterStop2 = 2050;
    var kfanimAfterStop3 = 2500;
    var kfanimAfterStop4 = 4200;// learnmore button come in 
    var kfanimAfterStop5 = 4400;
    
    var ad_holder_anim = document.getElementById('ad_holder_anim');
    var white_bg_holder = document.getElementById('white_bg_holder');
    var bg_holder = document.getElementById('bg_holder');
    var video_holder = document.getElementById('video_holder');
    var left_white_bg_holder = document.getElementById('left_white_bg_holder');
    var right_white_bg_holder = document.getElementById('right_white_bg_holder');
    
    ad_holder_anim.setAttribute('data-' + kfzero, 'height[outCubic]:10%;width[outCubic]:10%');
    ad_holder_anim.setAttribute('data-' + kfanim2, 'height[outCubic]:100%;width[outCubic]:100%');
    white_bg_holder.setAttribute('data-' + kfzero, 'height:0%');
    white_bg_holder.setAttribute('data-' + kfanim2, 'height:0%');
    white_bg_holder.setAttribute('data-' + kfanim3, 'height:100%;opacity:1');
    white_bg_holder.setAttribute('data-' + (kfanim3+1), 'opacity:0');
    bg_holder.setAttribute('data-' + kfzero, 'opacity:0');
    bg_holder.setAttribute('data-' + (kfanimA3-kfanimA3_bg_offset), 'opacity:0');
    bg_holder.setAttribute('data-' + (kfanimA3+kfanimA3_bg_offset), 'opacity:1');
    video_holder.setAttribute('data-' + kfzero, 'opacity:0');
    video_holder.setAttribute('data-' + kfanim4, 'opacity:0');
    video_holder.setAttribute('data-' + kfanim5, 'opacity:1');
    left_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:0');
    left_white_bg_holder.setAttribute('data-' + kfanim3, 'opacity:0');
    left_white_bg_holder.setAttribute('data-' + (kfanim3+1), 'opacity:1;left:-5%');
    left_white_bg_holder.setAttribute('data-' + kfanim3_1, 'left:-30%');
    right_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:0');
    right_white_bg_holder.setAttribute('data-' + kfanim3, 'opacity:0');
    right_white_bg_holder.setAttribute('data-' + (kfanim3+1), 'opacity:1;right:-5%');
    right_white_bg_holder.setAttribute('data-' + kfanim3_1, 'right:-40%');
    
    var dist = 35;
    var lvalue = 100;
    var move = 200;//(kfanimA2 - kfanimA1)/2;
    var moveFaster = 300;
    var arrow, arrowb;
    var maxArrow = 6;//6;
    var maxArrowB = 10;//10;
    var animType = '[quadratic]';//'[quadratic]';
    for (var i = 1; i < maxArrowB; i++)
    {
        var curPos = (lvalue+(i-1)*dist);
        if (i <= maxArrow)
        {
            arrow = document.getElementById('arrow' + i);
            
            arrow.setAttribute('data-' + kfanimA1, 'left' + animType +':' + curPos + '%;');
            arrow.setAttribute('data-' + kfanimA2, 'left' + animType +':' + (curPos-move) + '%;opacity:1');
            arrow.setAttribute('data-' + (kfanimA2a), 'left' + animType +':' + (curPos-move*2) + '%;opacity:0');
        }
        var ib = i+3;
        var curPosb = (lvalue+(ib-1)*dist);
        arrowb = document.getElementById('arrowb' + i);
        arrowb.setAttribute('data-' + kfanimA2, 'opacity:0');
        arrowb.setAttribute('data-' + (kfanimA2+1), 'opacity:1;left' + animType +':' + (curPosb-move) + '%;height:100%;opacity:1');
        arrowb.setAttribute('data-' + kfanimA3, 'left' + animType +':' + (curPosb-moveFaster) + '%;height:200%;opacity:0');
    }
    
    var btn_get_holder = document.getElementById('claim_btn_holder');
    var btn_learnmore_holder = document.getElementById('learnmore_btn_holder');
    
    btn_get_holder.setAttribute('data-' + kfzero, 'opacity:0');
    btn_get_holder.setAttribute('data-' + kfanim4, 'opacity:0;right:-50%');
    btn_get_holder.setAttribute('data-' + kfanim5, 'opacity:1;right:-2%');
    btn_get_holder.setAttribute('data-' + kfanimAfterStop1, 'opacity:1;right:-2%');
    btn_get_holder.setAttribute('data-' + kfanimAfterStop2, 'opacity:0;right:-50%');
    btn_learnmore_holder.setAttribute('data-' + kfzero, 'opacity:0');
    btn_learnmore_holder.setAttribute('data-' + kfanimAfterStop4, 'opacity:0;right:-50%');
    btn_learnmore_holder.setAttribute('data-' + kfanimAfterStop5, 'opacity:1;right:-2%');
    
    setTimeout( function(){ 
        Core.autoresizeText(document.getElementById('txt_btn_get_holder'));
        Core.verticalAlignMiddle(document.getElementById('txt_btn_get_holder'));
    }, kfanimAfterStop3);
}
