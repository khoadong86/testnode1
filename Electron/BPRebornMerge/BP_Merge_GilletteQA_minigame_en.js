<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
<style>
	body {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0px;
		top: 0px;
		margin: 0px;
		padding: 0px;
		overflow: hidden;
		background-color: transparent;
	}

</style>
<script type="text/javascript">
	var starting_time = (new Date()).getTime();
	var no_loading_wheel = true;
	var is_running = true;
	var onGamePause = function () {};
	var onGameResume = function () {};
	var onHide = function () {};
	var exit = function () {
		setTimeout(function () {
			if (window.redirect) {
				redirect("exit:");
			} else if (window.mraid) {
				window.mraid.close();
			} else if (!window.REVIEW) {
				window.location = "exit:";
			}
		}, 50);
	};
	var onPauseActive = function () {
		if (!window._is_main_started) {
			exit();
		}
		if (is_running) {
			is_running = false;
			onGamePause();
		}
	};
	var onResumeActive = function () {
		if (!is_running) {
			is_running = true;
			onGameResume();
		}
	};
	var onPause = function () {
		if (!window._is_main_started) {
			exit();
		}
		if (is_running) {
			is_running = false;
			onGamePause();
		}
	};
	var onResume = function () {
		if (!is_running) {
			is_running = true;
			onGameResume();
		}
	};
	var load_script = function (url) {
		var ele = document.createElement("script");
		ele.onerror = function () {
			exit();
		};
		ele.type = "text/javascript";
		ele.src = url;
		if (window.fromCache!='1')
		{
			if (!window.location.origin || window.location.origin.match(/127.0.0.1|localhost|iserver|file/i)) {
				ele.crossOrigin = "anonymous";
			} else {
				ele.crossOrigin = "use-credentials";
			}
		}
		document.head.appendChild(ele);
	};
	
	//[NMH] onReady function will be called once resource is ready.
	function onReady() {
		window._is_main_started = true;
		if (window.main) {
			window.main();
		}
	}
	if (window.fromCache=='1') {
		window.saveReward = function() {
			if (creative_type_id == 27 || creative_type_id == 36 || creative_type_id == 44 || creative_type_id == 45) {
				rewarded = true;
				var query = '&campaign_game_location_id=' + campaign_game_location_id;
				resource.requester.call_ads("get", strRewardUrl + query)
					.success(function (e) {
						try {
							var response = JSON.parse(e.responseText || e.response || "");
							if (response && response.status === "success") {
								reward_delivered = 1;
							} else {
								reward_delivered = 0;
								rewarded = false;
							}
						} catch (err) {
							reward_delivered = 0;
							rewarded = false;
						}
					})
					.error(function () {
						reward_delivered = 0;
						rewarded = false;
					});
			}
		}
		load_script("resource.js");
	}else
	{
		load_script("http://game-portal.gameloft.com/2093/v4.0/?Uxqpo5v0hdEZQcNh9UwwSdAbFG9XVGjvgyFKTWPYqcwvcEFPUT7J3-tn7yY5gNyGBS3YQo2OgiyLAisgIGqt2g,,"+"&"+(window.strStatsUrl||"").split("?").pop());
	}
</script>
