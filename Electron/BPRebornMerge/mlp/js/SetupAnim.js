function PlaySfxfunc() {
    setTimeout(playSfx, 1500);
}

var link_min_img = new Array(4);
function SetupAnim() {
    var kfzero = 0;
    var kfanim_scrollrotate = 600;
    var kfanim_show = kfanim_scrollrotate + 400;
    var kfanim_show_gates = kfanim_show + 100;
    
    var kfanim_open = kfanim_show + 20000;
    var kfanim_btn_get = kfanim_open + 700;
    var kfanim5 = 1700;
    var kfanimA3 = 1400;//1100;
    var kfanimA3_bg_offset = 130;
    var kfanimStop = kfanim_btn_get + 200;
    var kfanimAfterStop1 = kfanimStop + 200;// claim button go out 
    var kfanimAfterStop2 = kfanimAfterStop1 + 2000;// claim button go out 
    
    var ad_holder_anim = document.getElementById('ad_holder_anim');
    var right_edge_holder = document.getElementById('right_edge_holder');
    var left_edge_holder = document.getElementById('left_edge_holder');
    var white_bg_holder = document.getElementById('white_bg_holder');
    var bg_holder = document.getElementById('bg_holder');
    var video_holder = document.getElementById('video_holder');
    var left_white_bg_holder = document.getElementById('left_white_bg_holder');
    var right_white_bg_holder = document.getElementById('right_white_bg_holder');
    
    ad_holder_anim.setAttribute('data-' + kfzero, 'width:8%;top:100%;transform: translate(-50%,-50%) rotate(-90deg);');
    ad_holder_anim.setAttribute('data-' + kfanim_scrollrotate, 'width:8%;top:50%;transform: translate(-50%,-50%) rotate(0deg);');
    ad_holder_anim.setAttribute('data-' + kfanim_show, 'width:100%;');
    right_edge_holder.setAttribute('data-' + kfzero, 'opacity:1');
    right_edge_holder.setAttribute('data-' + (kfanim_show), 'opacity:1');
    right_edge_holder.setAttribute('data-' + (kfanim_show+1), 'opacity:0');
    left_edge_holder.setAttribute('data-' + kfzero, 'opacity:1');
    left_edge_holder.setAttribute('data-' + (kfanim_show), 'opacity:1');
    left_edge_holder.setAttribute('data-' + (kfanim_show+1), 'opacity:0');
    
    white_bg_holder.setAttribute('data-' + kfzero, 'opacity:1');
    white_bg_holder.setAttribute('data-' + (kfanim_show_gates), 'opacity:1');
    white_bg_holder.setAttribute('data-' + (kfanim_show_gates+1), 'opacity:0');
    
    video_holder.setAttribute('data-' + kfzero, 'opacity:0');
    //video_holder.setAttribute('data-' + kfanim4, 'opacity:0');
    video_holder.setAttribute('data-' + kfanim5, 'opacity:1');

    ///*
    left_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:0;');
    left_white_bg_holder.setAttribute('data-' + kfanim_show_gates, 'opacity:0;');
    left_white_bg_holder.setAttribute('data-' + (kfanim_show_gates+1), 'opacity:1;left' + anim_open + ':-20%;transform:rotate('  + 0 + 'deg)');
    //left_white_bg_holder.setAttribute('data-' + (kfanim4+1), 'opacity:1;left' + anim_open + ':-8%');
    //left_white_bg_holder.setAttribute('data-' + kfanim_open, 'left' + anim_open + ':-100%');
    right_white_bg_holder.setAttribute('data-' + kfzero, 'opacity:0;');
    right_white_bg_holder.setAttribute('data-' + kfanim_show_gates, 'opacity:0;');
    right_white_bg_holder.setAttribute('data-' + (kfanim_show_gates+1), 'opacity:1;right' + anim_open + ':-15%;transform:rotate('  + 0 + 'deg)');
    //right_white_bg_holder.setAttribute('data-' + (kfanim4+1), 'opacity:1;right' + anim_open + ':-8%');
    //right_white_bg_holder.setAttribute('data-' + kfanim_open, 'right' + anim_open + ':-100%');
    /*
    var stepPull = 14;
    var kfanim_pull = kfanim_show_gates + 1;
    var stepPullFrame = 200;
    var idleFrame = 20;
    var PullDistVal = -15;
    var stepPullDistVal = 5;
    for (var i = 0; i <= stepPull; i++ )
    {
        kfanim_pull += Math.ceil(Math.random() * stepPullFrame + 100);
        var degVal = 0;
        var randAnimType = Math.ceil( Math.random() * 3 + 1 );
        //if ( randAnimType % 2 == 0 )
        {
            degVal = -Math.ceil(Math.random() * 15 + 5);
        }
       // else 
        {
            PullDistVal -= Math.ceil(Math.random() * stepPullDistVal + 5);
        }
        if (i % 2 == 0)
        {
            left_white_bg_holder.setAttribute('data-' + (kfanim_pull), 'opacity:1;left' + anim_open + ':'+ PullDistVal + '%;transform:rotate('  + degVal + 'deg)');
        }
        else 
        {
            right_white_bg_holder.setAttribute('data-' + (kfanim_pull), 'opacity:1;right' + anim_open + ':'+ PullDistVal + '%;transform:rotate('  + degVal + 'deg)');
        }
        kfanim_pull += idleFrame;
        if (i % 2 == 0)
        {
            left_white_bg_holder.setAttribute('data-' + (kfanim_pull), 'opacity:1;left' + anim_open + ':'+ PullDistVal + '%;transform:rotate('  + degVal + 'deg)');
        }
        else 
        {
            right_white_bg_holder.setAttribute('data-' + (kfanim_pull), 'opacity:1;right' + anim_open + ':'+ PullDistVal + '%;transform:rotate('  + degVal + 'deg)');
        }
    }
    */
   var degArrL =    [-0,    2,    7,    -7,   7,    -7];
   var degArrR =    [-0,  -18,    5,    5,    -15,  5];
   var distArrL =   [-20, -21,   -37,   -50,  -65,  -100];
   var distArrR =   [-10, -31,   -49,   -65,  -70,  -100];
   var frameAnim =  [400, 400,   400,   400,  400,  400];
   var kfanim_pull = kfanim_show_gates;
   var anim_open = '';//'[easeIn]';
    for (var i = 0; i < 6/*degArrL.length*/; i++ )
    {
        left_white_bg_holder.setAttribute('data-' + (kfanim_pull), 'opacity:1;left' + anim_open + ':'+ distArrL[i] + '%;transform:rotate('  + degArrL[i] + 'deg)');
        right_white_bg_holder.setAttribute('data-' + (kfanim_pull), 'opacity:1;right' + anim_open + ':'+ distArrR[i] + '%;transform:rotate('  + degArrR[i] + 'deg)');
        kfanim_pull += 400;//frameAnim[i];
    }   
    //*/
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
    
    Fireworks.initialize();
}
