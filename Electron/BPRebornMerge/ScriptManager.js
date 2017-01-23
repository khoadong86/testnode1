var DEBUG = true;
linkResourceURL = './mlp/';
function embedHtml() {
	//var html = document.open('main_view.html');
	//document.body.innerHTML = html.toString();
	$("#main_body").load(linkResourceURL + "main_view.html", doAfterEmbed);
}
function doAfterEmbed() {
	Core.setupFirstTime = true;
	Core.replaceLink();
        SetupAnim();
        configTxt = txtData;
        Core.replaceText("en", PointcutType, configTxt);
        
	setTimeout( function(){ showMyAd();}, 2000);
        //main();
}
window.onload = function(e) {
  //load_home();
	embedHtml();
};
  
