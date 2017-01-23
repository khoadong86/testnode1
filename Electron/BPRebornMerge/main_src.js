/*!
 * anim core
 */
(function(window, document, undefined) {
	'use strict';

	/*
	 * Global api.
	 */
        var s_now, s_time, s_fps, s_dt;
        var s_data = new Date();
        var fps_limit 			= 60;
        var s_interval 			= 1000 / fps_limit;
        var total_fps 			= 0;
        var average_fps 		= 0;
        var s_frame_counter		= 0;
        var total_time_spent 	= 0;
        var ingame_time_spent	= 0;
        var s_delta_time        = 0;
        var s_interrupt = false;

        var SetLimitFps = function(value)
        {
            fps_limit = value;
            s_interval = 1000 / fps_limit;
        }

        var run = function()
        {
                if (!s_interrupt)
                {
                s_now   = Date.now();
                s_dt 	= s_now - (s_time || s_now);
                s_fps 	= 1000 / s_dt;
                s_time 	= s_now;

                if (s_dt < 0)
                {
                    s_dt = 0;
                }
                else if(s_dt > 100)
                {
                    s_dt = 100;
                }

                s_delta_time = s_dt/3*2; // 1000;
                s_frame_counter++;
                
                if (_isStop)
                {
                    
                }
                else
                    m_timer+= s_delta_time;
                
                s_now = Date.now();
                s_dt = s_now - s_time;

                if(s_dt < s_interval)
                {
                    s_dt = s_interval - s_dt;
                }
                else
                {
                    s_dt = 0;
                }

                setTimeout(run, s_dt);

            }

                else setTimeout(run, 0);
        }

	var anim = {
		get: function() {
			return _instance;
		},
		//Main entry point.
		init: function(options) {
                    //run();
                    return _instance || new CoreAnim(options);
		},
                restart: function(){
                    m_timer = 0;
                    _isStop = false;
                },
                resume: function() {
                    _isStop = false;
                    m_timer += 100;
                },
		VERSION: '0.6.30'
	};
        
        var MaxTimeLine = 12000;

	//Minify optimization.
	var hasProp = Object.prototype.hasOwnProperty;
	var Math = window.Math;
	var getStyle = window.getComputedStyle;

	//They will be filled when anim gets initialized.
	var documentElement;
	var body;

	var EVENT_TOUCHSTART = 'touchstart';
	var EVENT_TOUCHMOVE = 'touchmove';
	var EVENT_TOUCHCANCEL = 'touchcancel';
	var EVENT_TOUCHEND = 'touchend';

	var SKROLLABLE_CLASS = 'skrollable';
	var SKROLLABLE_BEFORE_CLASS = SKROLLABLE_CLASS + '-before';
	var SKROLLABLE_BETWEEN_CLASS = SKROLLABLE_CLASS + '-between';
	var SKROLLABLE_AFTER_CLASS = SKROLLABLE_CLASS + '-after';

	var SKROLLR_CLASS = 'anim';
	var NO_SKROLLR_CLASS = 'no-' + SKROLLR_CLASS;
	var SKROLLR_DESKTOP_CLASS = SKROLLR_CLASS + '-desktop';
	var SKROLLR_MOBILE_CLASS = SKROLLR_CLASS + '-mobile';

	var DEFAULT_EASING = 'linear';
	var DEFAULT_DURATION = 1000;//ms
	var DEFAULT_MOBILE_DECELERATION = 0.004;//pixel/ms²

	var DEFAULT_SKROLLRBODY = 'anim-body';

	var DEFAULT_SMOOTH_SCROLLING_DURATION = 200;//ms

	var ANCHOR_START = 'start';
	var ANCHOR_END = 'end';
	var ANCHOR_CENTER = 'center';
	var ANCHOR_BOTTOM = 'bottom';

	//The property which will be added to the DOM element to hold the ID of the skrollable.
	var SKROLLABLE_ID_DOM_PROPERTY = '___skrollable_id';

	var rxTouchIgnoreTags = /^(?:input|textarea|button|select)$/i;

	var rxTrim = /^\s+|\s+$/g;

	//Find all data-attributes. data-[_constant]-[offset]-[anchor]-[anchor].
	var rxKeyframeAttribute = /^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/;

	var rxPropValue = /\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi;

	//Easing function names follow the property in square brackets.
	var rxPropEasing = /^(@?[a-z\-]+)\[(\w+)\]$/;

	var rxCamelCase = /-([a-z0-9_])/g;
	var rxCamelCaseFn = function(str, letter) {
		return letter.toUpperCase();
	};

	//Numeric values with optional sign.
	var rxNumericValue = /[\-+]?[\d]*\.?[\d]+/g;

	//Used to replace occurences of {?} with a number.
	var rxInterpolateString = /\{\?\}/g;

	//Finds rgb(a) colors, which don't use the percentage notation.
	var rxRGBAIntegerColor = /rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g;

	//Finds all gradients.
	var rxGradient = /[a-z\-]+-gradient/g;

	//Vendor prefix. Will be set once anim gets initialized.
	var theCSSPrefix = '';
	var theDashedCSSPrefix = '';

	//Will be called once (when anim gets initialized).
	var detectCSSPrefix = function() {
		//Only relevant prefixes. May be extended.
		//Could be dangerous if there will ever be a CSS property which actually starts with "ms". Don't hope so.
		var rxPrefixes = /^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;

		//Detect prefix for current browser by finding the first property using a prefix.
		if(!getStyle) {
			return;
		}

		var style = getStyle(body, null);

		for(var k in style) {
			//We check the key and if the key is a number, we check the value as well, because safari's getComputedStyle returns some weird array-like thingy.
			theCSSPrefix = (k.match(rxPrefixes) || (+k == k && style[k].match(rxPrefixes)));

			if(theCSSPrefix) {
				break;
			}
		}

		//Did we even detect a prefix?
		if(!theCSSPrefix) {
			theCSSPrefix = theDashedCSSPrefix = '';

			return;
		}

		theCSSPrefix = theCSSPrefix[0];

		//We could have detected either a dashed prefix or this camelCaseish-inconsistent stuff.
		if(theCSSPrefix.slice(0,1) === '-') {
			theDashedCSSPrefix = theCSSPrefix;

			//There's no logic behind these. Need a look up.
			theCSSPrefix = ({
				'-webkit-': 'webkit',
				'-moz-': 'Moz',
				'-ms-': 'ms',
				'-o-': 'O'
			})[theCSSPrefix];
		} else {
			theDashedCSSPrefix = '-' + theCSSPrefix.toLowerCase() + '-';
		}
	};

	var polyfillRAF = function() {
		var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + 'RequestAnimationFrame'];

		var lastTime = _now();

		if(_isMobile || !requestAnimFrame) {
			requestAnimFrame = function(callback) {
				//How long did it take to render?
				var deltaTime = _now() - lastTime;
				var delay = Math.max(0, 1000 / 60 - deltaTime);

				return window.setTimeout(function() {
					lastTime = _now();
					callback();
				}, delay);
			};
		}

		return requestAnimFrame;
	};

	var polyfillCAF = function() {
		var cancelAnimFrame = window.cancelAnimationFrame || window[theCSSPrefix.toLowerCase() + 'CancelAnimationFrame'];

		if(_isMobile || !cancelAnimFrame) {
			cancelAnimFrame = function(timeout) {
				return window.clearTimeout(timeout);
			};
		}

		return cancelAnimFrame;
	};

	//Built-in easing functions.
	var easings = {
		begin: function() {
			return 0;
		},
		end: function() {
			return 1;
		},
		linear: function(p) {
			return p;
		},
		quadratic: function(p) {
			return p * p;
		},
		cubic: function(p) {
			return p * p * p;
		},
		swing: function(p) {
			return (-Math.cos(p * Math.PI) / 2) + 0.5;
		},
		sqrt: function(p) {
			return Math.sqrt(p);
		},
                outsqrt: function(p) {
                    return Math.sqrt(p-1);
                },
		outCubic: function(p) {
			return (Math.pow((p - 1), 3) + 1);
		},
		//see https://www.desmos.com/calculator/tbr20s8vd2 for how I did this
		bounce: function(p) {
			var a;

			if(p <= 0.5083) {
				a = 3;
			} else if(p <= 0.8489) {
				a = 9;
			} else if(p <= 0.96208) {
				a = 27;
			} else if(p <= 0.99981) {
				a = 91;
			} else {
				return 1;
			}

			return 1 - Math.abs(3 * Math.cos(p * a * 1.028) / a);
		},
                laggy: function(p) {
                    var calc = p * 100;
                    calc = Math.floor(calc/10);
                    
                    return Math.floor(p/0.07)*0.2;
                    //return p;
                }, 
                easeIn: function(t){
                     return Math.pow(t, 5);
                }
	};

	/**
	 * Constructor.
	 */
	function CoreAnim(options) {
		documentElement = document.documentElement;
		body = document.body;

		detectCSSPrefix();

		_instance = this;

		options = options || {};

		_constants = options.constants || {};

		//We allow defining custom easings or overwrite existing.
		if(options.easing) {
			for(var e in options.easing) {
				easings[e] = options.easing[e];
			}
		}

		_edgeStrategy = options.edgeStrategy || 'set';

		_listeners = {
			//Function to be called right before rendering.
			beforerender: options.beforerender,

			//Function to be called right after finishing rendering.
			render: options.render,

			//Function to be called whenever an element with the `data-emit-events` attribute passes a keyframe.
			keyframe: options.keyframe
		};

		//forceHeight is true by default
		_forceHeight = options.forceHeight !== false;

		if(_forceHeight) {
			_scale = options.scale || 1;
		}

		_mobileDeceleration = options.mobileDeceleration || DEFAULT_MOBILE_DECELERATION;

		_smoothScrollingEnabled = options.smoothScrolling !== false;
		_smoothScrollingDuration = options.smoothScrollingDuration || DEFAULT_SMOOTH_SCROLLING_DURATION;

		//Dummy object. Will be overwritten in the _render method when smooth scrolling is calculated.
		_smoothScrolling = {
			targetTop: _instance.getScrollTop()
		};

		//A custom check function may be passed.
		_isMobile = ((options.mobileCheck || function() {
			return (/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera);
		})());

		if(_isMobile) {
			_animBody = document.getElementById(options.animBody || DEFAULT_SKROLLRBODY);

			//Detect 3d transform if there's a anim-body (only needed for #anim-body).
			if(_animBody) {
				_detect3DTransforms();
			}

			_initMobile();
			_updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_MOBILE_CLASS], [NO_SKROLLR_CLASS]);
		} else {
			_updateClass(documentElement, [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS], [NO_SKROLLR_CLASS]);
		}

		//Triggers parsing of elements and a first reflow.
		_instance.refresh();
                /*
		_addEvent(window, 'resize orientationchange', function() {
			var width = documentElement.clientWidth;
			var height = documentElement.clientHeight;

			//Only reflow if the size actually changed (#271).
			if(height !== _lastViewportHeight || width !== _lastViewportWidth) {
				_lastViewportHeight = height;
				_lastViewportWidth = width;

				_requestReflow = true;
			}
		});
                */

		var requestAnimFrame = polyfillRAF();

		//Let's go.
		(function animloop(){
			_render();
			_animFrame = requestAnimFrame(animloop);
		}());

		return _instance;
	}

	/**
	 * (Re)parses some or all elements.
	 */
	CoreAnim.prototype.refresh = function(elements) {
		var elementIndex;
		var elementsLength;
		var ignoreID = false;

		//Completely reparse anything without argument.
		if(elements === undefined) {
			//Ignore that some elements may already have a skrollable ID.
			ignoreID = true;

			_skrollables = [];
			_skrollableIdCounter = 0;

			elements = document.getElementsByTagName('*');
		} else if(elements.length === undefined) {
			//We also accept a single element as parameter.
			elements = [elements];
		}

		elementIndex = 0;
		elementsLength = elements.length;

		for(; elementIndex < elementsLength; elementIndex++) {
			var el = elements[elementIndex];
			var anchorTarget = el;
			var keyFrames = [];

			//If this particular element should be smooth scrolled.
			var smoothScrollThis = _smoothScrollingEnabled;

			//The edge strategy for this particular element.
			var edgeStrategy = _edgeStrategy;

			//If this particular element should emit keyframe events.
			var emitEvents = false;
                        
                        var isStopKeyframe = false;

			//If we're reseting the counter, remove any old element ids that may be hanging around.
			if(ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
				delete el[SKROLLABLE_ID_DOM_PROPERTY];
			}

			if(!el.attributes) {
				continue;
			}

			//Iterate over all attributes and search for key frame attributes.
			var attributeIndex = 0;
			var attributesLength = el.attributes.length;

			for (; attributeIndex < attributesLength; attributeIndex++) {
				var attr = el.attributes[attributeIndex];

				if(attr.name === 'data-anchor-target') {
					anchorTarget = document.querySelector(attr.value);

					if(anchorTarget === null) {
						throw 'Unable to find anchor target "' + attr.value + '"';
					}

					continue;
				}

				//Global smooth scrolling can be overridden by the element attribute.
				if(attr.name === 'data-smooth-scrolling') {
					smoothScrollThis = attr.value !== 'off';

					continue;
				}

				//Global edge strategy can be overridden by the element attribute.
				if(attr.name === 'data-edge-strategy') {
					edgeStrategy = attr.value;

					continue;
				}

				//Is this element tagged with the `data-emit-events` attribute?
				if(attr.name === 'data-emit-events') {
					emitEvents = true;

					continue;
				}
                                
                                // khoa.dinhdong added to stop and start 
                                if (attr.name === 'data-stop') {
                                    isStopKeyframe = true;
                                }
                                
                                if (attr.name === 'data-resume') {
                                    isStopKeyframe = false;
                                }

				var match = attr.name.match(rxKeyframeAttribute);

				if(match === null) {
					continue;
				}

				var kf = {
					props: attr.value,
					//Point back to the element as well.
					element: el,
					//The name of the event which this keyframe will fire, if emitEvents is
					eventType: attr.name.replace(rxCamelCase, rxCamelCaseFn)
				};

				keyFrames.push(kf);

				var constant = match[1];

				if(constant) {
					//Strip the underscore prefix.
					kf.constant = constant.substr(1);
				}

				//Get the key frame offset.
				var offset = match[2];

				//Is it a percentage offset?
				if(/p$/.test(offset)) {
					kf.isPercentage = true;
					kf.offset = (offset.slice(0, -1) | 0) / 100;
				} else {
					kf.offset = (offset | 0);
				}

				var anchor1 = match[3];

				//If second anchor is not set, the first will be taken for both.
				var anchor2 = match[4] || anchor1;

				//"absolute" (or "classic") mode, where numbers mean absolute scroll offset.
				if(!anchor1 || anchor1 === ANCHOR_START || anchor1 === ANCHOR_END) {
					kf.mode = 'absolute';

					//data-end needs to be calculated after all key frames are known.
					if(anchor1 === ANCHOR_END) {
						kf.isEnd = true;
					} else if(!kf.isPercentage) {
						//For data-start we can already set the key frame w/o calculations.
						//#59: "scale" options should only affect absolute mode.
						kf.offset = kf.offset * _scale;
					}
				}
				//"relative" mode, where numbers are relative to anchors.
				else {
					kf.mode = 'relative';
					kf.anchors = [anchor1, anchor2];
				}
			}

			//Does this element have key frames?
			if(!keyFrames.length) {
				continue;
			}

			//Will hold the original style and class attributes before we controlled the element (see #80).
			var styleAttr, classAttr;

			var id;

			if(!ignoreID && SKROLLABLE_ID_DOM_PROPERTY in el) {
				//We already have this element under control. Grab the corresponding skrollable id.
				id = el[SKROLLABLE_ID_DOM_PROPERTY];
				styleAttr = _skrollables[id].styleAttr;
				classAttr = _skrollables[id].classAttr;
			} else {
				//It's an unknown element. Asign it a new skrollable id.
				id = (el[SKROLLABLE_ID_DOM_PROPERTY] = _skrollableIdCounter++);
				styleAttr = el.style.cssText;
				classAttr = _getClass(el);
			}

			_skrollables[id] = {
				element: el,
				styleAttr: styleAttr,
				classAttr: classAttr,
				anchorTarget: anchorTarget,
				keyFrames: keyFrames,
				smoothScrolling: smoothScrollThis,
				edgeStrategy: edgeStrategy,
				emitEvents: emitEvents,
                                isStopKeyframe: isStopKeyframe,
				lastFrameIndex: -1
			};

			_updateClass(el, [SKROLLABLE_CLASS], []);
		}

		//Reflow for the first time.
		_reflow();

		//Now that we got all key frame numbers right, actually parse the properties.
		elementIndex = 0;
		elementsLength = elements.length;

		for(; elementIndex < elementsLength; elementIndex++) {
			var sk = _skrollables[elements[elementIndex][SKROLLABLE_ID_DOM_PROPERTY]];

			if(sk === undefined) {
				continue;
			}

			//Parse the property string to objects
			_parseProps(sk);

			//Fill key frames with missing properties from left and right
			_fillProps(sk);
		}

		return _instance;
	};

	/**
	 * Transform "relative" mode to "absolute" mode.
	 * That is, calculate anchor position and offset of element.
	 */
	CoreAnim.prototype.relativeToAbsolute = function(element, viewportAnchor, elementAnchor) {
		var viewportHeight = MaxTimeLine;//documentElement.clientHeight; // khoa.dinhdong
		var box = element.getBoundingClientRect();
		var absolute = box.top;

		//#100: IE doesn't supply "height" with getBoundingClientRect.
		var boxHeight = box.bottom - box.top;

		if(viewportAnchor === ANCHOR_BOTTOM) {
			absolute -= viewportHeight;
		} else if(viewportAnchor === ANCHOR_CENTER) {
			absolute -= viewportHeight / 2;
		}

		if(elementAnchor === ANCHOR_BOTTOM) {
			absolute += boxHeight;
		} else if(elementAnchor === ANCHOR_CENTER) {
			absolute += boxHeight / 2;
		}

		//Compensate scrolling since getBoundingClientRect is relative to viewport.
		absolute += _instance.getScrollTop();

		return (absolute + 0.5) | 0;
	};

	/**
	 * Animates scroll top to new position.
	 */
	CoreAnim.prototype.animateTo = function(top, options) {
		options = options || {};

		var now = _now();
		var scrollTop = _instance.getScrollTop();
		var duration = options.duration === undefined ? DEFAULT_DURATION : options.duration;

		//Setting this to a new value will automatically cause the current animation to stop, if any.
		_scrollAnimation = {
			startTop: scrollTop,
			topDiff: top - scrollTop,
			targetTop: top,
			duration: duration,
			startTime: now,
			endTime: now + duration,
			easing: easings[options.easing || DEFAULT_EASING],
			done: options.done
		};

		//Don't queue the animation if there's nothing to animate.
		if(!_scrollAnimation.topDiff) {
			if(_scrollAnimation.done) {
				_scrollAnimation.done.call(_instance, false);
			}

			_scrollAnimation = undefined;
		}

		return _instance;
	};

	/**
	 * Stops animateTo animation.
	 */
	CoreAnim.prototype.stopAnimateTo = function() {
		if(_scrollAnimation && _scrollAnimation.done) {
			_scrollAnimation.done.call(_instance, true);
		}

		_scrollAnimation = undefined;
	};

	/**
	 * Returns if an animation caused by animateTo is currently running.
	 */
	CoreAnim.prototype.isAnimatingTo = function() {
		return !!_scrollAnimation;
	};

	CoreAnim.prototype.isMobile = function() {
		return _isMobile;
	};

	CoreAnim.prototype.setScrollTop = function(top, force) {
		_forceRender = (force === true);

		if(_isMobile) {
			_mobileOffset = Math.min(Math.max(top, 0), _maxKeyFrame);
		} else {
			window.scrollTo(0, top);
		}

		return _instance;
	};

        var m_timer = 0;
	CoreAnim.prototype.getScrollTop = function() {
            return m_timer;
            /* khoa.dinhdong
		if(_isMobile) {
			return _mobileOffset;
		} else {
			return window.pageYOffset || documentElement.scrollTop || body.scrollTop || 0;
		}
            */
	};

	CoreAnim.prototype.getMaxScrollTop = function() {
		return _maxKeyFrame;
	};

	CoreAnim.prototype.on = function(name, fn) {
		_listeners[name] = fn;

		return _instance;
	};

	CoreAnim.prototype.off = function(name) {
		delete _listeners[name];

		return _instance;
	};

	CoreAnim.prototype.destroy = function() {
		var cancelAnimFrame = polyfillCAF();
		cancelAnimFrame(_animFrame);
		_removeAllEvents();

		_updateClass(documentElement, [NO_SKROLLR_CLASS], [SKROLLR_CLASS, SKROLLR_DESKTOP_CLASS, SKROLLR_MOBILE_CLASS]);

		var skrollableIndex = 0;
		var skrollablesLength = _skrollables.length;

		for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
			_reset(_skrollables[skrollableIndex].element);
		}

		documentElement.style.overflow = body.style.overflow = '';
		documentElement.style.height = body.style.height = '';

		if(_animBody) {
			anim.setStyle(_animBody, 'transform', 'none');
		}

		_instance = undefined;
		_animBody = undefined;
		_listeners = undefined;
		_forceHeight = undefined;
		_maxKeyFrame = 0;
		_scale = 1;
		_constants = undefined;
		_mobileDeceleration = undefined;
		_direction = 'down';
		_lastTop = -1;
		_lastViewportWidth = 0;
		_lastViewportHeight = 0;
		_requestReflow = false;
		_scrollAnimation = undefined;
		_smoothScrollingEnabled = undefined;
		_smoothScrollingDuration = undefined;
		_smoothScrolling = undefined;
		_forceRender = undefined;
		_skrollableIdCounter = 0;
		_edgeStrategy = undefined;
		_isMobile = false;
		_mobileOffset = 0;
		_translateZ = undefined;
	};

	/*
		Private methods.
	*/

	var _initMobile = function() {
		var initialElement;
		var initialTouchY;
		var initialTouchX;
		var currentElement;
		var currentTouchY;
		var currentTouchX;
		var lastTouchY;
		var deltaY;

		var initialTouchTime;
		var currentTouchTime;
		var lastTouchTime;
		var deltaTime;

		_addEvent(documentElement, [EVENT_TOUCHSTART, EVENT_TOUCHMOVE, EVENT_TOUCHCANCEL, EVENT_TOUCHEND].join(' '), function(e) {
                    /*
			var touch = e.changedTouches[0];

			currentElement = e.target;

			//We don't want text nodes.
			while(currentElement.nodeType === 3) {
				currentElement = currentElement.parentNode;
			}

			currentTouchY = touch.clientY;
			currentTouchX = touch.clientX;
			currentTouchTime = e.timeStamp;

			if(!rxTouchIgnoreTags.test(currentElement.tagName)) {
				e.preventDefault();
			}

			switch(e.type) {
				case EVENT_TOUCHSTART:
					//The last element we tapped on.
					if(initialElement) {
						initialElement.blur();
					}

					_instance.stopAnimateTo();

					initialElement = currentElement;

					initialTouchY = lastTouchY = currentTouchY;
					initialTouchX = currentTouchX;
					initialTouchTime = currentTouchTime;

					break;
				case EVENT_TOUCHMOVE:
					//Prevent default event on touchIgnore elements in case they don't have focus yet.
					if(rxTouchIgnoreTags.test(currentElement.tagName) && document.activeElement !== currentElement) {
						e.preventDefault();
					}

					deltaY = currentTouchY - lastTouchY;
					deltaTime = currentTouchTime - lastTouchTime;

					_instance.setScrollTop(_mobileOffset - deltaY, true);

					lastTouchY = currentTouchY;
					lastTouchTime = currentTouchTime;
					break;
				default:
				case EVENT_TOUCHCANCEL:
				case EVENT_TOUCHEND:
					var distanceY = initialTouchY - currentTouchY;
					var distanceX = initialTouchX - currentTouchX;
					var distance2 = distanceX * distanceX + distanceY * distanceY;

					//Check if it was more like a tap (moved less than 7px).
					if(distance2 < 49) {
						if(!rxTouchIgnoreTags.test(initialElement.tagName)) {
							initialElement.focus();

							//It was a tap, click the element.
							var clickEvent = document.createEvent('MouseEvents');
							clickEvent.initMouseEvent('click', true, true, e.view, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
							initialElement.dispatchEvent(clickEvent);
						}

						return;
					}

					initialElement = undefined;

					var speed = deltaY / deltaTime;

					//Cap speed at 3 pixel/ms.
					speed = Math.max(Math.min(speed, 3), -3);

					var duration = Math.abs(speed / _mobileDeceleration);
					var targetOffset = speed * duration + 0.5 * _mobileDeceleration * duration * duration;
					var targetTop = _instance.getScrollTop() - targetOffset;

					//Relative duration change for when scrolling above bounds.
					var targetRatio = 0;

					//Change duration proportionally when scrolling would leave bounds.
					if(targetTop > _maxKeyFrame) {
						targetRatio = (_maxKeyFrame - targetTop) / targetOffset;

						targetTop = _maxKeyFrame;
					} else if(targetTop < 0) {
						targetRatio = -targetTop / targetOffset;

						targetTop = 0;
					}

					duration = duration * (1 - targetRatio);

					_instance.animateTo((targetTop + 0.5) | 0, {easing: 'outCubic', duration: duration});
					break;
			}
                */
		});
		//Just in case there has already been some native scrolling, reset it.
		window.scrollTo(0, 0);
		documentElement.style.overflow = body.style.overflow = 'hidden';
	};

	/**
	 * Updates key frames which depend on others / need to be updated on resize.
	 * That is "end" in "absolute" mode and all key frames in "relative" mode.
	 * Also handles constants, because they may change on resize.
	 */
	var _updateDependentKeyFrames = function() {
		var viewportHeight = MaxTimeLine;//documentElement.clientHeight; // khoa.dinhdong
		var processedConstants = _processConstants();
		var skrollable;
		var element;
		var anchorTarget;
		var keyFrames;
		var keyFrameIndex;
		var keyFramesLength;
		var kf;
		var skrollableIndex;
		var skrollablesLength;
		var offset;
		var constantValue;

		//First process all relative-mode elements and find the max key frame.
		skrollableIndex = 0;
		skrollablesLength = _skrollables.length;

		for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
			skrollable = _skrollables[skrollableIndex];
			element = skrollable.element;
			anchorTarget = skrollable.anchorTarget;
			keyFrames = skrollable.keyFrames;

			keyFrameIndex = 0;
			keyFramesLength = keyFrames.length;

			for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
				kf = keyFrames[keyFrameIndex];

				offset = kf.offset;
				constantValue = processedConstants[kf.constant] || 0;

				kf.frame = offset;

				if(kf.isPercentage) {
					//Convert the offset to percentage of the viewport height.
					offset = offset * viewportHeight;

					//Absolute + percentage mode.
					kf.frame = offset;
				}

				if(kf.mode === 'relative') {
					_reset(element);

					kf.frame = _instance.relativeToAbsolute(anchorTarget, kf.anchors[0], kf.anchors[1]) - offset;

					_reset(element, true);
				}

				kf.frame += constantValue;

				//Only search for max key frame when forceHeight is enabled.
				if(_forceHeight) {
					//Find the max key frame, but don't use one of the data-end ones for comparison.
					if(!kf.isEnd && kf.frame > _maxKeyFrame) {
						_maxKeyFrame = kf.frame;
					}
				}
			}
		}

		//#133: The document can be larger than the maxKeyFrame we found.
		_maxKeyFrame = Math.max(_maxKeyFrame, MaxTimeLine);// Math.max(_maxKeyFrame, _getDocumentHeight()); // khoa.dinhdong

		//Now process all data-end keyframes.
		skrollableIndex = 0;
		skrollablesLength = _skrollables.length;

		for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
			skrollable = _skrollables[skrollableIndex];
			keyFrames = skrollable.keyFrames;

			keyFrameIndex = 0;
			keyFramesLength = keyFrames.length;

			for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
				kf = keyFrames[keyFrameIndex];

				constantValue = processedConstants[kf.constant] || 0;

				if(kf.isEnd) {
					kf.frame = _maxKeyFrame - kf.offset + constantValue;
				}
			}

			skrollable.keyFrames.sort(_keyFrameComparator);
		}
	};

	/**
	 * Calculates and sets the style properties for the element at the given frame.
	 * @param fakeFrame The frame to render at when smooth scrolling is enabled.
	 * @param actualFrame The actual frame we are at.
	 */
	var _calcSteps = function(fakeFrame, actualFrame) {
		//Iterate over all skrollables.
		var skrollableIndex = 0;
		var skrollablesLength = _skrollables.length;

		for(; skrollableIndex < skrollablesLength; skrollableIndex++) {
			var skrollable = _skrollables[skrollableIndex];
			var element = skrollable.element;
			var frame = skrollable.smoothScrolling ? fakeFrame : actualFrame;
			var frames = skrollable.keyFrames;
			var framesLength = frames.length;
			var firstFrame = frames[0];
			var lastFrame = frames[frames.length - 1];
			var beforeFirst = frame < firstFrame.frame;
			var afterLast = frame > lastFrame.frame;
			var firstOrLastFrame = beforeFirst ? firstFrame : lastFrame;
			var emitEvents = skrollable.emitEvents;
                        var isStopKeyframe = skrollable.isStopKeyframe;
			var lastFrameIndex = skrollable.lastFrameIndex;
			var key;
			var value;


                        var inStopFrames = false;
                        if ( frame - lastFrame.frame < 50 && frame - lastFrame.frame > 0)
                            inStopFrames = true;
                        if (isStopKeyframe && inStopFrames)
                        {
                            _isStop = true;
                            return;
                        }
			//If we are before/after the first/last frame, set the styles according to the given edge strategy.
			if(beforeFirst || afterLast) {
				//Check if we already handled this edge case last time.
				//Note: using setScrollTop it's possible that we jumped from one edge to the other.
				if(beforeFirst && skrollable.edge === -1 || afterLast && skrollable.edge === 1) {
					continue;
				}

				//Add the anim-before or -after class.
				if(beforeFirst) {
					_updateClass(element, [SKROLLABLE_BEFORE_CLASS], [SKROLLABLE_AFTER_CLASS, SKROLLABLE_BETWEEN_CLASS]);

					//This handles the special case where we exit the first keyframe.
					if(emitEvents && lastFrameIndex > -1) {
						_emitEvent(element, firstFrame.eventType, _direction);
						skrollable.lastFrameIndex = -1;
					}
				} else {
					_updateClass(element, [SKROLLABLE_AFTER_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_BETWEEN_CLASS]);

					//This handles the special case where we exit the last keyframe.
					if(emitEvents && lastFrameIndex < framesLength) {
						_emitEvent(element, lastFrame.eventType, _direction);
						skrollable.lastFrameIndex = framesLength;
					}
				}

				//Remember that we handled the edge case (before/after the first/last keyframe).
				skrollable.edge = beforeFirst ? -1 : 1;

				switch(skrollable.edgeStrategy) {
					case 'reset':
						_reset(element);
						continue;
					case 'ease':
						//Handle this case like it would be exactly at first/last keyframe and just pass it on.
						frame = firstOrLastFrame.frame;
						break;
					default:
					case 'set':
						var props = firstOrLastFrame.props;

						for(key in props) {
							if(hasProp.call(props, key)) {
								value = _interpolateString(props[key].value);

								//Set style or attribute.
								if(key.indexOf('@') === 0) {
									element.setAttribute(key.substr(1), value);
								} else {
									anim.setStyle(element, key, value);
								}
							}
						}

						continue;
				}
			} else {
				//Did we handle an edge last time?
				if(skrollable.edge !== 0) {
					_updateClass(element, [SKROLLABLE_CLASS, SKROLLABLE_BETWEEN_CLASS], [SKROLLABLE_BEFORE_CLASS, SKROLLABLE_AFTER_CLASS]);
					skrollable.edge = 0;
				}
			}

			//Find out between which two key frames we are right now.
			var keyFrameIndex = 0;

			for(; keyFrameIndex < framesLength - 1; keyFrameIndex++) {
				if(frame >= frames[keyFrameIndex].frame && frame <= frames[keyFrameIndex + 1].frame) {
					var left = frames[keyFrameIndex];
					var right = frames[keyFrameIndex + 1];

					for(key in left.props) {
						if(hasProp.call(left.props, key)) {
							var progress = (frame - left.frame) / (right.frame - left.frame);

							//Transform the current progress using the given easing function.
							progress = left.props[key].easing(progress);

							//Interpolate between the two values
							value = _calcInterpolation(left.props[key].value, right.props[key].value, progress);

							value = _interpolateString(value);

							//Set style or attribute.
							if(key.indexOf('@') === 0) {
								element.setAttribute(key.substr(1), value);
							} else {
								anim.setStyle(element, key, value);
							}
						}
					}

					//Are events enabled on this element?
					//This code handles the usual cases of scrolling through different keyframes.
					//The special cases of before first and after last keyframe are handled above.
					if(emitEvents) {
						//Did we pass a new keyframe?
						if(lastFrameIndex !== keyFrameIndex) {
							if(_direction === 'down') {
								_emitEvent(element, left.eventType, _direction);
							} else {
								_emitEvent(element, right.eventType, _direction);
							}

							skrollable.lastFrameIndex = keyFrameIndex;
						}
					}

					break;
				}
			}
		}
	};

	/**
	 * Renders all elements.
	 */
	var _render = function() {
		if(_requestReflow) {
			_requestReflow = false;
			_reflow();
		}

		//We may render something else than the actual scrollbar position.
                if (_isStop)
                {
                    
                }
                else
                    m_timer+= 20;
                

		var renderTop = _instance.getScrollTop();

		//If there's an animation, which ends in current render call, call the callback after rendering.
		var afterAnimationCallback;
		var now = _now();
		var progress;

		//Before actually rendering handle the scroll animation, if any.
		if(_scrollAnimation) {
			//It's over
			if(now >= _scrollAnimation.endTime) {
				renderTop = _scrollAnimation.targetTop;
				afterAnimationCallback = _scrollAnimation.done;
				_scrollAnimation = undefined;
			} else {
				//Map the current progress to the new progress using given easing function.
				progress = _scrollAnimation.easing((now - _scrollAnimation.startTime) / _scrollAnimation.duration);

				renderTop = (_scrollAnimation.startTop + progress * _scrollAnimation.topDiff) | 0;
			}

			_instance.setScrollTop(renderTop, true);
		}
		//Smooth scrolling only if there's no animation running and if we're not forcing the rendering.
		else if(!_forceRender) {
			var smoothScrollingDiff = _smoothScrolling.targetTop - renderTop;

			//The user scrolled, start new smooth scrolling.
			if(smoothScrollingDiff) {
				_smoothScrolling = {
					startTop: _lastTop,
					topDiff: renderTop - _lastTop,
					targetTop: renderTop,
					startTime: _lastRenderCall,
					endTime: _lastRenderCall + _smoothScrollingDuration
				};
			}

			//Interpolate the internal scroll position (not the actual scrollbar).
			if(now <= _smoothScrolling.endTime) {
				//Map the current progress to the new progress using easing function.
				progress = easings.sqrt((now - _smoothScrolling.startTime) / _smoothScrollingDuration);

				renderTop = (_smoothScrolling.startTop + progress * _smoothScrolling.topDiff) | 0;
			}
		}

		//Did the scroll position even change?
		if(_forceRender || _lastTop !== renderTop) {
			//Remember in which direction are we scrolling?
			_direction = (renderTop > _lastTop) ? 'down' : (renderTop < _lastTop ? 'up' : _direction);

			_forceRender = false;

			var listenerParams = {
				curTop: renderTop,
				lastTop: _lastTop,
				maxTop: _maxKeyFrame,
				direction: _direction
			};

			//Tell the listener we are about to render.
			var continueRendering = _listeners.beforerender && _listeners.beforerender.call(_instance, listenerParams);

			//The beforerender listener function is able the cancel rendering.
			if(continueRendering !== false) {
				//Now actually interpolate all the styles.
				_calcSteps(renderTop, _instance.getScrollTop());

				//That's were we actually "scroll" on mobile.
				if(_isMobile && _animBody) {
					//Set the transform ("scroll it").
					anim.setStyle(_animBody, 'transform', 'translate(0, ' + -(_mobileOffset) + 'px) ' + _translateZ);
				}

				//Remember when we last rendered.
				_lastTop = renderTop;

				if(_listeners.render) {
					_listeners.render.call(_instance, listenerParams);
				}
			}

			if(afterAnimationCallback) {
				afterAnimationCallback.call(_instance, false);
			}
		}

		_lastRenderCall = now;
	};

	/**
	 * Parses the properties for each key frame of the given skrollable.
	 */
	var _parseProps = function(skrollable) {
		//Iterate over all key frames
		var keyFrameIndex = 0;
		var keyFramesLength = skrollable.keyFrames.length;

		for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
			var frame = skrollable.keyFrames[keyFrameIndex];
			var easing;
			var value;
			var prop;
			var props = {};

			var match;

			while((match = rxPropValue.exec(frame.props)) !== null) {
				prop = match[1];
				value = match[2];

				easing = prop.match(rxPropEasing);

				//Is there an easing specified for this prop?
				if(easing !== null) {
					prop = easing[1];
					easing = easing[2];
				} else {
					easing = DEFAULT_EASING;
				}

				//Exclamation point at first position forces the value to be taken literal.
				value = value.indexOf('!') ? _parseProp(value) : [value.slice(1)];

				//Save the prop for this key frame with his value and easing function
				props[prop] = {
					value: value,
					easing: easings[easing]
				};
			}

			frame.props = props;
		}
	};

	/**
	 * Parses a value extracting numeric values and generating a format string
	 * for later interpolation of the new values in old string.
	 *
	 * @param val The CSS value to be parsed.
	 * @return Something like ["rgba(?%,?%, ?%,?)", 100, 50, 0, .7]
	 * where the first element is the format string later used
	 * and all following elements are the numeric value.
	 */
	var _parseProp = function(val) {
		var numbers = [];

		//One special case, where floats don't work.
		//We replace all occurences of rgba colors
		//which don't use percentage notation with the percentage notation.
		rxRGBAIntegerColor.lastIndex = 0;
		val = val.replace(rxRGBAIntegerColor, function(rgba) {
			return rgba.replace(rxNumericValue, function(n) {
				return n / 255 * 100 + '%';
			});
		});

		//Handle prefixing of "gradient" values.
		//For now only the prefixed value will be set. Unprefixed isn't supported anyway.
		if(theDashedCSSPrefix) {
			rxGradient.lastIndex = 0;
			val = val.replace(rxGradient, function(s) {
				return theDashedCSSPrefix + s;
			});
		}

		//Now parse ANY number inside this string and create a format string.
		val = val.replace(rxNumericValue, function(n) {
			numbers.push(+n);
			return '{?}';
		});

		//Add the formatstring as first value.
		numbers.unshift(val);

		return numbers;
	};

	/**
	 * Fills the key frames with missing left and right hand properties.
	 * If key frame 1 has property X and key frame 2 is missing X,
	 * but key frame 3 has X again, then we need to assign X to key frame 2 too.
	 *
	 * @param sk A skrollable.
	 */
	var _fillProps = function(sk) {
		//Will collect the properties key frame by key frame
		var propList = {};
		var keyFrameIndex;
		var keyFramesLength;

		//Iterate over all key frames from left to right
		keyFrameIndex = 0;
		keyFramesLength = sk.keyFrames.length;

		for(; keyFrameIndex < keyFramesLength; keyFrameIndex++) {
			_fillPropForFrame(sk.keyFrames[keyFrameIndex], propList);
		}

		//Now do the same from right to fill the last gaps

		propList = {};

		//Iterate over all key frames from right to left
		keyFrameIndex = sk.keyFrames.length - 1;

		for(; keyFrameIndex >= 0; keyFrameIndex--) {
			_fillPropForFrame(sk.keyFrames[keyFrameIndex], propList);
		}
	};

	var _fillPropForFrame = function(frame, propList) {
		var key;

		//For each key frame iterate over all right hand properties and assign them,
		//but only if the current key frame doesn't have the property by itself
		for(key in propList) {
			//The current frame misses this property, so assign it.
			if(!hasProp.call(frame.props, key)) {
				frame.props[key] = propList[key];
			}
		}

		//Iterate over all props of the current frame and collect them
		for(key in frame.props) {
			propList[key] = frame.props[key];
		}
	};

	/**
	 * Calculates the new values for two given values array.
	 */
	var _calcInterpolation = function(val1, val2, progress) {
		var valueIndex;
		var val1Length = val1.length;

		//They both need to have the same length
		if(val1Length !== val2.length) {
			throw 'Can\'t interpolate between "' + val1[0] + '" and "' + val2[0] + '"';
		}

		//Add the format string as first element.
		var interpolated = [val1[0]];

		valueIndex = 1;

		for(; valueIndex < val1Length; valueIndex++) {
			//That's the line where the two numbers are actually interpolated.
			interpolated[valueIndex] = val1[valueIndex] + ((val2[valueIndex] - val1[valueIndex]) * progress);
		}

		return interpolated;
	};

	/**
	 * Interpolates the numeric values into the format string.
	 */
	var _interpolateString = function(val) {
		var valueIndex = 1;

		rxInterpolateString.lastIndex = 0;

		return val[0].replace(rxInterpolateString, function() {
			return val[valueIndex++];
		});
	};

	/**
	 * Resets the class and style attribute to what it was before anim manipulated the element.
	 * Also remembers the values it had before reseting, in order to undo the reset.
	 */
	var _reset = function(elements, undo) {
		//We accept a single element or an array of elements.
		elements = [].concat(elements);

		var skrollable;
		var element;
		var elementsIndex = 0;
		var elementsLength = elements.length;

		for(; elementsIndex < elementsLength; elementsIndex++) {
			element = elements[elementsIndex];
			skrollable = _skrollables[element[SKROLLABLE_ID_DOM_PROPERTY]];

			//Couldn't find the skrollable for this DOM element.
			if(!skrollable) {
				continue;
			}

			if(undo) {
				//Reset class and style to the "dirty" (set by anim) values.
				element.style.cssText = skrollable.dirtyStyleAttr;
				_updateClass(element, skrollable.dirtyClassAttr);
			} else {
				//Remember the "dirty" (set by anim) class and style.
				skrollable.dirtyStyleAttr = element.style.cssText;
				skrollable.dirtyClassAttr = _getClass(element);

				//Reset class and style to what it originally was.
				element.style.cssText = skrollable.styleAttr;
				_updateClass(element, skrollable.classAttr);
			}
		}
	};

	/**
	 * Detects support for 3d transforms by applying it to the anim-body.
	 */
	var _detect3DTransforms = function() {
		_translateZ = 'translateZ(0)';
		anim.setStyle(_animBody, 'transform', _translateZ);

		var computedStyle = getStyle(_animBody);
		var computedTransform = computedStyle.getPropertyValue('transform');
		var computedTransformWithPrefix = computedStyle.getPropertyValue(theDashedCSSPrefix + 'transform');
		var has3D = (computedTransform && computedTransform !== 'none') || (computedTransformWithPrefix && computedTransformWithPrefix !== 'none');

		if(!has3D) {
			_translateZ = '';
		}
	};

	/**
	 * Set the CSS property on the given element. Sets prefixed properties as well.
	 */
	anim.setStyle = function(el, prop, val) {
		var style = el.style;

		//Camel case.
		prop = prop.replace(rxCamelCase, rxCamelCaseFn).replace('-', '');

		//Make sure z-index gets a <integer>.
		//This is the only <integer> case we need to handle.
		if(prop === 'zIndex') {
			if(isNaN(val)) {
				//If it's not a number, don't touch it.
				//It could for example be "auto" (#351).
				style[prop] = val;
			} else {
				//Floor the number.
				style[prop] = '' + (val | 0);
			}
		}
		//#64: "float" can't be set across browsers. Needs to use "cssFloat" for all except IE.
		else if(prop === 'float') {
			style.styleFloat = style.cssFloat = val;
		}
		else {
			//Need try-catch for old IE.
			try {
				//Set prefixed property if there's a prefix.
				if(theCSSPrefix) {
					style[theCSSPrefix + prop.slice(0,1).toUpperCase() + prop.slice(1)] = val;
				}

				//Set unprefixed.
				style[prop] = val;
			} catch(ignore) {}
		}
	};

	/**
	 * Cross browser event handling.
	 */
	var _addEvent = anim.addEvent = function(element, names, callback) {
		var intermediate = function(e) {
			//Normalize IE event stuff.
			e = e || window.event;

			if(!e.target) {
				e.target = e.srcElement;
			}

			if(!e.preventDefault) {
				e.preventDefault = function() {
					e.returnValue = false;
					e.defaultPrevented = true;
				};
			}

			return callback.call(this, e);
		};

		names = names.split(' ');

		var name;
		var nameCounter = 0;
		var namesLength = names.length;

		for(; nameCounter < namesLength; nameCounter++) {
			name = names[nameCounter];

			if(element.addEventListener) {
				element.addEventListener(name, callback, false);
			} else {
				element.attachEvent('on' + name, intermediate);
			}

			//Remember the events to be able to flush them later.
			_registeredEvents.push({
				element: element,
				name: name,
				listener: callback
			});
		}
	};

	var _removeEvent = anim.removeEvent = function(element, names, callback) {
		names = names.split(' ');

		var nameCounter = 0;
		var namesLength = names.length;

		for(; nameCounter < namesLength; nameCounter++) {
			if(element.removeEventListener) {
				element.removeEventListener(names[nameCounter], callback, false);
			} else {
				element.detachEvent('on' + names[nameCounter], callback);
			}
		}
	};

	var _removeAllEvents = function() {
		var eventData;
		var eventCounter = 0;
		var eventsLength = _registeredEvents.length;

		for(; eventCounter < eventsLength; eventCounter++) {
			eventData = _registeredEvents[eventCounter];

			_removeEvent(eventData.element, eventData.name, eventData.listener);
		}

		_registeredEvents = [];
	};

	var _emitEvent = function(element, name, direction) {
		if(_listeners.keyframe) {
			_listeners.keyframe.call(_instance, element, name, direction);
		}
	};

	var _reflow = function() {
                // khoa.dinhdong reset time frame 
                m_timer = 0;
		var pos = _instance.getScrollTop();
                
		//Will be recalculated by _updateDependentKeyFrames.
		_maxKeyFrame = 0;

		if(_forceHeight && !_isMobile) {
			//un-"force" the height to not mess with the calculations in _updateDependentKeyFrames (#216).
			//body.style.height = ''; // khoa.dinhdong
		}

		_updateDependentKeyFrames();

		if(_forceHeight && !_isMobile) {
			//"force" the height.
			//body.style.height = (_maxKeyFrame + documentElement.clientHeight) + 'px';
		}

		//The scroll offset may now be larger than needed (on desktop the browser/os prevents scrolling farther than the bottom).
		if(_isMobile) {
			_instance.setScrollTop(Math.min(_instance.getScrollTop(), _maxKeyFrame));
		} else {
			//Remember and reset the scroll pos (#217).
			_instance.setScrollTop(pos, true);
		}

		_forceRender = true;
	};

	/*
	 * Returns a copy of the constants object where all functions and strings have been evaluated.
	 */
	var _processConstants = function() {
		var viewportHeight = MaxTimeLine;//documentElement.clientHeight; // khoa.dinhdong
		var copy = {};
		var prop;
		var value;

		for(prop in _constants) {
			value = _constants[prop];

			if(typeof value === 'function') {
				value = value.call(_instance);
			}
			//Percentage offset.
			else if((/p$/).test(value)) {
				value = (value.slice(0, -1) / 100) * viewportHeight;
			}

			copy[prop] = value;
		}

		return copy;
	};

	/*
	 * Returns the height of the document.
	 */
	var _getDocumentHeight = function() {
		var animBodyHeight = 0;
		var bodyHeight;

                // khoa.dinhdong
                return MaxTimeLine;
                /*
		if(_animBody) {
			animBodyHeight = Math.max(_animBody.offsetHeight, _animBody.scrollHeight);
		}

		bodyHeight = Math.max(animBodyHeight, body.scrollHeight, body.offsetHeight, documentElement.scrollHeight, documentElement.offsetHeight, documentElement.clientHeight);

		return bodyHeight - documentElement.clientHeight;
            */
	};

	/**
	 * Returns a string of space separated classnames for the current element.
	 * Works with SVG as well.
	 */
	var _getClass = function(element) {
		var prop = 'className';

		//SVG support by using className.baseVal instead of just className.
		if(window.SVGElement && element instanceof window.SVGElement) {
			element = element[prop];
			prop = 'baseVal';
		}

		return element[prop];
	};

	/**
	 * Adds and removes a CSS classes.
	 * Works with SVG as well.
	 * add and remove are arrays of strings,
	 * or if remove is ommited add is a string and overwrites all classes.
	 */
	var _updateClass = function(element, add, remove) {
		var prop = 'className';

		//SVG support by using className.baseVal instead of just className.
		if(window.SVGElement && element instanceof window.SVGElement) {
			element = element[prop];
			prop = 'baseVal';
		}

		//When remove is ommited, we want to overwrite/set the classes.
		if(remove === undefined) {
			element[prop] = add;
			return;
		}

		//Cache current classes. We will work on a string before passing back to DOM.
		var val = element[prop];

		//All classes to be removed.
		var classRemoveIndex = 0;
		var removeLength = remove.length;

		for(; classRemoveIndex < removeLength; classRemoveIndex++) {
			val = _untrim(val).replace(_untrim(remove[classRemoveIndex]), ' ');
		}

		val = _trim(val);

		//All classes to be added.
		var classAddIndex = 0;
		var addLength = add.length;

		for(; classAddIndex < addLength; classAddIndex++) {
			//Only add if el not already has class.
			if(_untrim(val).indexOf(_untrim(add[classAddIndex])) === -1) {
				val += ' ' + add[classAddIndex];
			}
		}

		element[prop] = _trim(val);
	};

	var _trim = function(a) {
		return a.replace(rxTrim, '');
	};

	/**
	 * Adds a space before and after the string.
	 */
	var _untrim = function(a) {
		return ' ' + a + ' ';
	};

	var _now = Date.now || function() {
		return +new Date();
	};

	var _keyFrameComparator = function(a, b) {
		return a.frame - b.frame;
	};

	/*
	 * Private variables.
	 */

	//Singleton
	var _instance;

	/*
		A list of all elements which should be animated associated with their the metadata.
		Exmaple skrollable with two key frames animating from 100px width to 20px:
		skrollable = {
			element: <the DOM element>,
			styleAttr: <style attribute of the element before anim>,
			classAttr: <class attribute of the element before anim>,
			keyFrames: [
				{
					frame: 100,
					props: {
						width: {
							value: ['{?}px', 100],
							easing: <reference to easing function>
						}
					},
					mode: "absolute"
				},
				{
					frame: 200,
					props: {
						width: {
							value: ['{?}px', 20],
							easing: <reference to easing function>
						}
					},
					mode: "absolute"
				}
			]
		};
	*/
	var _skrollables;

	var _animBody;

	var _listeners;
	var _forceHeight;
	var _maxKeyFrame = 0;

	var _scale = 1;
	var _constants;

	var _mobileDeceleration;

	//Current direction (up/down).
	var _direction = 'down';

	//The last top offset value. Needed to determine direction.
	var _lastTop = -1;

	//The last time we called the render method (doesn't mean we rendered!).
	var _lastRenderCall = _now();

	//For detecting if it actually resized (#271).
	var _lastViewportWidth = 0;
	var _lastViewportHeight = 0;

	var _requestReflow = false;

	//Will contain data about a running scrollbar animation, if any.
	var _scrollAnimation;

	var _smoothScrollingEnabled;

	var _smoothScrollingDuration;

	//Will contain settins for smooth scrolling if enabled.
	var _smoothScrolling;

	//Can be set by any operation/event to force rendering even if the scrollbar didn't move.
	var _forceRender;

	//Each skrollable gets an unique ID incremented for each skrollable.
	//The ID is the index in the _skrollables array.
	var _skrollableIdCounter = 0;

	var _edgeStrategy;


	//Mobile specific vars. Will be stripped by UglifyJS when not in use.
	var _isMobile = false;

	//The virtual scroll offset when using mobile scrolling.
	var _mobileOffset = 0;

	//If the browser supports 3d transforms, this will be filled with 'translateZ(0)' (empty string otherwise).
	var _translateZ;

	//Will contain data about registered events by anim.
	var _registeredEvents = [];

	//Animation frame id returned by RequestAnimationFrame (or timeout when RAF is not supported).
	var _animFrame;
        
        var _isStop = false;

	//Expose anim as either a global variable or a require.js module.
	if(typeof define === 'function' && define.amd) {
		define([], function () {
			return anim;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = anim;
	} else {
		window.anim = anim;
	}

}(window, document));

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
var txtData = {
	"author": "SA2 MIG R&D TEAM",

        //Sniper Fury
        "FWHM" : "SF",  //android
        "MCFW" : "SF",	//iphone
        "MCFI" : "SF",	//ipad

        //Asphalt 8 
        "A8HM" : "A8",
        "ASP8" : "A8",
        "AS8I" : "A8",

        //MC5
        "M5HM" : "MC5",
        "MCO5" : "MC5",
        "MC5I" : "MC5",

        //Dragon Manila
        "DOHM" : "DML",
        "DAMA" : "DML",
        "DAMI" : "DML",
        
        //GLLegacy 
        "LLHM" : "MC5",
        "GLLS" : "MC5",
        
        "ggi_bp" : {
            "A8"    : 62497,
            "DML"   : 63203,
            "SF"    : 63488, 
            "MC5"   : 63485
        },

        // MC5
        "Interst_Buddy_Winner" : "reward",
        "Interst_Buddy_3Stars" : "reward",
        "Interst_Buddy_Looser" : "rescue",
        "Interst_Buddy_Revive" : "rescue",
        "Interst_Buddy_Event" : "rescue",

        // SF 
        "Interst_Buddypack_Win_PvP_Mission_Time" : "reward",
        "Interst_Buddypack_Mission_Stat_Accuracy" : "reward",
        "Interst_Buddypack_Mission_Stat_Headshots" : "reward",
        "Interst_Buddypack_Mission_Stat_Explosive_Kills" : "reward",
        "Interst_Buddypack_Mission_Stat_Multikills_Assault_Mission" : "reward",
        "Interst_Buddypack_Mission_Fail" : "rescue",

        // test GLLegacy 
        "ActionPhase" : "rescue",
		"enter_section_options" : "reward",
	
        "fr" : "fr", 
        "en" : "en",
        "de" : "de",
        "it" : "it",
        "es" : "es",
        "jp" : "jp",
        "ko" : "ko",
        "cn" : "zh",
        "ru" : "ru",
        "en" : "en",
        
        "rescue":
        {
            "languages": {
                    "en" : {
                            "txt_header": {
                                            "SF": "NEED SOME SUPPORT?",
                                            "A8": "NEED A HAND?",
                                            "MC5": "NEED A HAND?",
                                            "DML": "NEED SOME BACKUP, TRAINER?"
                                            },
                            "txt_help": "<b>Lego</b> can help !",
                            "txt_getfree": "<b>Lego</b> can help !<br>Watch a promo video <b>to get </b>%reward_icon%",
                            "txt_rewardcount": "Reward in %timer_count_down%s ...",
                            "txt_rewardreceived": "Reward received!",
                            "txt_claim": "<b> GET  %reward_amount% </b>",
                            "txt_learnmore": "<b>LEARN MORE</b>",
                            "txt_gogetthem": "Now back to the game!",
                            "txt_receiving_reward": "Receiving reward...", 
                            "txt_skip_reward": "Skip reward?", 
                            "txt_skip_reward_body": "You are about to quit and lose your reward. Close the ad?",
                            "txt_close_btn": "Close",
                            "txt_resume_btn": "Resume"
                    },
                    "fr" : {
                            "txt_header": "Besoin d'un coup de main ?",
                            "txt_help": "<b>GodOfEgypt</b> peut vous aider !",
                            "txt_getfree": "Regardez une vidéo promo pour obtenir %reward_icon%",
                            "txt_rewardcount": "%reward_count% Récompense dans %ds ...",
                            "txt_claim": "Obtenir boost %next_icon%",
                            "txt_gogetthem": "Et maintenant, en voiture !",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Passer la récompense ?", 
                            "txt_skip_reward_body": "Vous êtes sur le point de quitter et de perdre votre récompense. Fermer la publicité ?",
                            "txt_close_btn": "Fermer",
                            "txt_resume_btn": "Reprendre"
                    },
                    "de" : {
                            "txt_header": "Brauchst du Hilfe?",
                            "txt_help": "<b>GodOfEgypt</b> kann helfen!",
                            "txt_getfree": "Sieh dir ein Werbevideo an und erhalte %reward_icon%",
                            "txt_rewardcount": "%reward_count% Belohnung in %d Sekunden ...",
                            "txt_claim": "Booster erhalten %next_icon%",
                            "txt_gogetthem": "Und jetzt zurück zum Spiel!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Belohnung aufgeben?", 
                            "txt_skip_reward_body": "Deine Belohnung geht beim Scließen des Fensters verloren. Trotzdem schließen?",
                            "txt_close_btn": "Schließen",
                            "txt_resume_btn": "Fortfahren"
                    },
                    "it" : {
                            "txt_header": "Ti serve una mano?",
                            "txt_help": "<b>GodOfEgypt</b> può aiutarti!",
                            "txt_getfree": "Guarda un video promozionale per ottenere %reward_icon%",
                            "txt_rewardcount": "%reward_count% Premio tra %ds ...",
                            "txt_claim": "Ottieni bonus %next_icon%",
                            "txt_gogetthem": "Ora torniamo a giocare!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Vuoi saltare il premio?", 
                            "txt_skip_reward_body": "Stai per uscire e perdere il tuo premio. Vuoi chiudere la pubblicità?",
                            "txt_close_btn": "Chiudi",
                            "txt_resume_btn": "Continua"
                    },
                    "es" : {
                            "txt_header": "¿Necesitas una mano?",
                            "txt_help": "¡<b>Renault</b>  puede ayudarte!",
                            "txt_getfree": "Ve un vídeo promocional para recibir %reward_icon%",
                            "txt_rewardcount": "Recompensa en %timer_count_down%s ...",
                            "txt_rewardreceived": "Recompensa en recibida!",
                            "txt_claim": "<b>Obtiene %reward_amount% %reward_icon_btn%</b>",
                            "txt_learnmore": "<b>Más información</b>",
                            "txt_gogetthem": "¡Ahora vuelve al juego!",
                            "txt_receiving_reward": "Recompensa en...",
                            "txt_skip_reward": "¿Saltar recompensa?", 
                            "txt_skip_reward_body": "Estás a punto de salir y perder tu recompensa. ¿Cerrar el anuncio?",
                            "txt_close_btn": "Cerrar",
                            "txt_resume_btn": "Reanudar"
                    },
                    "jp" : {
                            "txt_header": "助けが必要？",
                            "txt_help": "ファンタに助けてもらおう！",
                            "txt_getfree": "動画広告を見て %reward_icon% をゲット",
                            "txt_rewardcount": "%reward_count% 報酬獲得まで%d秒...",
                            "txt_claim": "ブースターをゲット %next_icon%",
                            "txt_gogetthem": "ゲームに戻る",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "報酬をスキップ？", 
                            "txt_skip_reward_body": "今終了すると報酬を失います。広告を閉じますか？",
                            "txt_close_btn": "閉じる",
                            "txt_resume_btn": "再開する"
                    },
                    "pt" : {
                            "txt_header": "Precisa de uma mãozinha?",
                            "txt_help": "<b>GodOfEgypt</b> pode ajudar!",
                            "txt_getfree": "Assista a um vídeo promocional para receber %reward_icon%",
                            "txt_rewardcount": "%reward_count% Recompensa em %d segundos ...",
                            "txt_claim": "Receber impulso %next_icon%",
                            "txt_gogetthem": "Agora, vamos voltar ao jogo!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Pular recompensa?", 
                            "txt_skip_reward_body": "Você está prestes a sair e perder sua recompensa. Fechar o anúncio?",
                            "txt_close_btn": "Fechar",
                            "txt_resume_btn": "Retornar"
                    },
                    "ko" : {
                            "txt_header": "도움이 필요하세요?",
                            "txt_help": "환타가 도와드릴께요!",
                            "txt_getfree": "홍보 영상을 시청하시면 %reward_icon% 증정",
                            "txt_rewardcount": "%reward_count% %d초 후 보상 ...",
                            "txt_claim": "부스터 받기 %next_icon%",
                            "txt_gogetthem": "게임으로 돌아가기!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Skip reward?", 
                            "txt_skip_reward_body": "You are about to quit and lose your reward. Close the ad?",
                            "txt_close_btn": "Close",
                            "txt_resume_btn": "Resume"
                    },
                    "zh" : {
                            "txt_header": "需要帮忙吗？",
                            "txt_help": "让芬达来帮您吧！",
                            "txt_getfree": "观看一段推广视频即可获得%reward_icon%",
                            "txt_rewardcount": "%reward_count% %d秒后获得奖励 ...",
                            "txt_claim": "我要奖励 %next_icon%",
                            "txt_gogetthem": "现在返回游戏！",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Skip reward?", 
                            "txt_skip_reward_body": "You are about to quit and lose your reward. Close the ad?",
                            "txt_close_btn": "Close",
                            "txt_resume_btn": "Resume"
                    },
                    "ru" : {
                            "txt_header": "Не стоит расстраиваться!",
                            "txt_help": "<b>БОГИ ЕГИПТА</b> помогут стать первым!",
                            "txt_getfree": "Посмотрите видео и получите ускорение %reward_icon%",
                            "txt_rewardcount": "%reward_count% Награда через %d сек....",
                            "txt_claim": "Получить бонус %next_icon%",
                            "txt_gogetthem": "Продолжайте играть!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Пропустить награду?", 
                            "txt_skip_reward_body": "Вы потеряете награду, если выйдете. Закрыть рекламу?",
                            "txt_close_btn": "Закрыть",
                            "txt_resume_btn": "Продолжить"
                    },
                    "tr" : {
                            "txt_header": "Başın mı sıkıştı?",
                            "txt_help": "<b>GodOfEgypt</b> yardım edebilir!",
                            "txt_getfree": "%reward_icon% kazanmak için bir tanıtım videosu izle",
                            "txt_rewardcount": "%reward_count% Ödüle %d saniye...",
                            "txt_claim": "Artırıcı al %next_icon%",
                            "txt_gogetthem": "Şimdi oyuna geri dönelim!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Ödülü geç?", 
                            "txt_skip_reward_body": "Buradan çıkıp ödülünü kaybetmek üzeresin. Reklamı kapat?",
                            "txt_close_btn": "Kapat",
                            "txt_resume_btn": "Sürdür"
                    },
                    "ar" : {
                            "txt_header": "هل أنت بحاجة للمساعدة؟",
                            "txt_help": "يمكن لـGodOfEgypt أن تساعدك!",
                            "txt_getfree": "شاهد فيديو الإعلان لكي تحصل على %reward_icon%",
                            "txt_rewardcount": "%reward_count% الجائزة خلال %d ثانية...",
                            "txt_claim": "احصل على التعزيز %next_icon%",
                            "txt_gogetthem": "والآن عد للعبة!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Skip reward?", 
                            "txt_skip_reward_body": "You are about to quit and lose your reward. Close the ad?",
                            "txt_close_btn": "Close",
                            "txt_resume_btn": "Resume"
                    }
            }
        },
        "reward":
        {
            "languages": {
                    "en" : {
                            "txt_header": {
                                            "SF": "GOOD JOB, SNIPER!",
                                            "A8": "CONGRATULATIONS, GREAT DRIVING!",
                                            "MC5": "GREAT JOB, SOLDIER!",
                                            "DML": "GREAT WORK, TRAINER!"                                            
                                            },
                            "txt_help": "<b>Lego</b> is rewarding you!",
                            "txt_getfree": "Lego is rewarding you!<br>Watch a promo video to get %reward_icon%",
                            "txt_rewardcount": "Reward in %timer_count_down%s ...",
                            "txt_rewardreceived": "Reward received!",
                            "txt_claim": "<b> GET %reward_amount% </b>",
                            "txt_learnmore": "<b>LEARN MORE</b>",
                            "txt_gogetthem": "Now back to the game!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Skip reward?", 
                            "txt_skip_reward_body": "You are about to quit and lose your reward. Close the ad?",
                            "txt_close_btn": "Close",
                            "txt_resume_btn": "Resume"
                    },
                    "fr" : {
                            "txt_header": "Félicitations, vous êtes un as du volant !",
                            "txt_help": "<b>GodOfEgypt</b> vous récompense !",
                            "txt_getfree": "Regardez une vidéo promo pour obtenir %reward_icon%",
                            "txt_rewardcount": "%reward_count% Récompense dans %ds ...",
                            "txt_claim": "Récupérer récompense %next_icon%",
                            "txt_gogetthem": "GodOfEgypt vous récompense !",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Passer la récompense ?", 
                            "txt_skip_reward_body": "Vous êtes sur le point de quitter et de perdre votre récompense. Fermer la publicité ?",
                            "txt_close_btn": "Fermer",
                            "txt_resume_btn": "Reprendre"
                    },
                    "de" : {
                            "txt_header": "Glückwunsch, ein tolles  Rennen!",
                            "txt_help": "<b>GodOfEgypt</b> belohnt dich!",
                            "txt_getfree": "Sieh dir ein Werbevideo an und erhalte %reward_icon%",
                            "txt_rewardcount": "%reward_count% Belohnung in %d Sekunden ...",
                            "txt_claim": "Belohnung erhalten %next_icon%",
                            "txt_gogetthem": "GodOfEgypt belohnt dich!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Belohnung aufgeben?", 
                            "txt_skip_reward_body": "Deine Belohnung geht beim Scließen des Fensters verloren. Trotzdem schließen?",
                            "txt_close_btn": "Schließen",
                            "txt_resume_btn": "Fortfahren"
                    },
                    "it" : {
                            "txt_header": "Complimenti, ottima corsa!",
                            "txt_help": "<b>GodOfEgypt</b> ti premia!",
                            "txt_getfree": "Guarda un video promozionale per ottenere %reward_icon%",
                            "txt_rewardcount": "%reward_count% Premio tra %ds ...",
                            "txt_claim": "Ritira il premio %next_icon%",
                            "txt_gogetthem": "Ora torniamo a giocare!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Vuoi saltare il premio?", 
                            "txt_skip_reward_body": "Stai per uscire e perdere il tuo premio. Vuoi chiudere la pubblicità?",
                            "txt_close_btn": "Chiudi",
                            "txt_resume_btn": "Continua"
                    },
                    "es" : {
                            "txt_header": "¡Enhorabuena, gran conducción!",
                            "txt_help": "¡RENAULT te quiere dar una recompensa!",
                            "txt_getfree": "Ve un vídeo promocional para recibir %reward_icon%",
                            "txt_rewardcount": "Recompensa en %timer_count_down%s ...",
                            "txt_rewardreceived": "Recompensa en recibida!",
                            "txt_claim": "<b>Obtiene %reward_amount% </b>",
                            "txt_learnmore": "<b>Más información</b>",
                            "txt_gogetthem": "¡Ahora vuelve al juego!",
                            "txt_receiving_reward": "Recompensa en...",
                            "txt_skip_reward": "¿Saltar recompensa?", 
                            "txt_skip_reward_body": "Estás a punto de salir y perder tu recompensa. ¿Cerrar el anuncio?",
                            "txt_close_btn": "Cerrar",
                            "txt_resume_btn": "Reanudar"
                    },
                    "jp" : {
                            "txt_header": "CONGRATULATIONS!すごい走りだった!",
                            "txt_help": "ファンタから報酬を受け取ろう！",                            "txt_getfree": "動画広告を見て%reward_icon%をゲット",
                            "txt_rewardcount": "%reward_count% 報酬獲得まで%d秒...",
                            "txt_claim": "報酬を受け取る %next_icon%",
                            "txt_gogetthem": "ゲームに戻る",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "報酬をスキップ？", 
                            "txt_skip_reward_body": "今終了すると報酬を失います。広告を閉じますか？",
                            "txt_close_btn": "閉じる",
                            "txt_resume_btn": "再開する"
                    },
                    "pt" : {
                            "txt_header": "Parabéns! Você pilota bem!",
                            "txt_help": "<b>GodOfEgypt</b> está te dando prêmios.",
                            "txt_getfree": "Assista a um vídeo promocional para receber %reward_icon%",
                            "txt_rewardcount": "%reward_count% Recompensa em %d segundos ...",
                            "txt_claim": "Receber recompensa %next_icon%",
                            "txt_gogetthem": "Agora, vamos voltar ao jogo!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Pular recompensa?", 
                            "txt_skip_reward_body": "Você está prestes a sair e perder sua recompensa. Fechar o anúncio?",
                            "txt_close_btn": "Fechar",
                            "txt_resume_btn": "Retornar"
                    },
                    "ko" : {
                            "txt_header": "축하합니다, 대단한 실력이군요!",
                            "txt_help": "환타에서 보상을 드립니다!",
                            "txt_getfree": "홍보 영상을 시청하시면 %reward_icon% 증정",
                            "txt_rewardcount": "%reward_count% %d초 후 보상 ...",
                            "txt_claim": "보상 받기 %next_icon%",
                            "txt_gogetthem": "게임으로 돌아가기!",
                            "txt_receiving_reward": "Receiving reward..."
                    },
                    "zh" : {
                            "txt_header": "干得好，很棒的驾驶技术！",
                            "txt_help": "恭喜您获得了芬达为您提供的奖励！",
                            "txt_getfree": "观看一段推广视频来获得%reward_icon%吧",
                            "txt_rewardcount": "%reward_count% %d秒后获得奖励 ...",
                            "txt_claim": "领取奖励%next_icon%",
                            "txt_gogetthem": "现在返回游戏！",
                            "txt_receiving_reward": "Receiving reward..."
                    },
                    "ru" : {
                            "txt_header": "Поздравляем! Прекрасный заезд!",
                            "txt_help": "<b>БОГИ ЕГИПТА</b> даруют вам награду за превосходную гонку!",
                            "txt_getfree": "Посмотрите видео и получите %reward_icon%",
                            "txt_rewardcount": "%reward_count% Награда через %d сек....",
                            "txt_claim": "Забрать награду %next_icon%",
                            "txt_gogetthem": "Продолжайте играть!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Пропустить награду?", 
                            "txt_skip_reward_body": "Вы потеряете награду, если выйдете. Закрыть рекламу?",
                            "txt_close_btn": "Закрыть",
                            "txt_resume_btn": "Продолжить"
                    },
                    "tr" : {
                            "txt_header": "Tebrikler, harika sürdün!",
                            "txt_help": "<b>GodOfEgypt</b>'nın sana bir ödülü var!",
                            "txt_getfree": "%reward_icon% kazanmak için bir tanıtım videosu izle",
                            "txt_rewardcount": "%reward_count% Ödüle %d saniye...",
                            "txt_claim": "Ödülü al %next_icon%",
                            "txt_gogetthem": "Şimdi oyuna geri dönelim!",
                            "txt_receiving_reward": "Receiving reward...",
                            "txt_skip_reward": "Ödülü geç?", 
                            "txt_skip_reward_body": "Buradan çıkıp ödülünü kaybetmek üzeresin. Reklamı kapat?",
                            "txt_close_btn": "Kapat",
                            "txt_resume_btn": "Sürdür"
                    },
                    "ar" : {
                            "txt_header": "تهانينا! قيادتك مميزة!",
                            "txt_help": "ستكافئك <b>GodOfEgypt</b>!",
                            "txt_getfree": "شاهد فيديو الإعلان لكي تحصل على %reward_icon%",
                            "txt_rewardcount": "%reward_count% الجائزة خلال %d ثانية...",
                            "txt_claim": "استلم الجائزة%next_icon%",
                            "txt_gogetthem": "والآن عد للعبة!",
                            "txt_receiving_reward": "Receiving reward..."
                    }
            }
        }
};

var linkResourceURL;
var VIDEO_SRC_LINK;
var DEBUG = false;
var PRODUCT_LINK = "http://www.youtube.com/watch?v=2WDzHYcYyMo";
var font_list =   {font_main:'Source Sans Pro', font_sub:'Arial'};

var reward_icon_define = "<img id='reward_icon' rsrc='data/reward_item.png'>";
var reward_icon_btn_define = "<img id='reward_icon_btn' rsrc='data/reward_item.png'>";
var reward_count_define = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABGlBMVEUAAAD///////8AAAD///////8AAAD////7+/v///93d3f///////////8AAAAAAAADAwP///+Xl5cAAAD///8JCQn///////8AAAD////////////////////////5+fn+/v79/f3///////+AgIBwcHAQEBDExMTHx8cQEBCVlZX///9QUFAQEBD29vZQUFDBwcH////t7e0AAADY2Njw8PAAAAD////h4eH////BwcFAQEDy8vLj4+NAQEAAAADZ2dnMzMyQkJAQEBDq6uoQEBCJiYnR0dEwMDDd3d3m5uZAQEC+vr4AAAD////AwMDw8PBAQEDQ0NDg4OCQkJAAAACAgIAwMDCwsLBgYGBQUFAQEBCgoKAgICAEfZ0XAAAATnRSTlMAXPUQVxFArnvXUUXr4cCQUAaX4LiASzQwLigjDM2koHBmPxfw8PDd1dDHwsGwlJCNhXtwZ2ZgUUY68+DX19DQwsLAwKSgiICAe3BAJiApBgFwAAABw0lEQVQ4y22TZ3uqQBSEZwGB3IDgtcXe0nsvt/earJoYTf3/fyM5g49E4vuBcmbYs2XAS0xbMDGbiyB73xfus8HCa3kh/Ti40hFXg1E6acmPuvol3VF+qnd6qJMM02asr40/93KO4+S88SBrE8fPS1Zqropwa3y/3ELEwYO8GntKnRRLpVLxRKk9Q0o3B1GDJequaqe4mgCptnLpWGKTfI+61aH9T3dgAx2Ljh6XsijehpUC+aX1fwApqyHlRQChDOCJTt5q/QZ0eDJECOyI80cZCQPK2yLsAOtyP8QrAw5FWAfeyRTLMwwV6dEFZAofqjMM1Y8yBCDXVVaC62eGNJDV2LDCwjctxIaVyDAnu84d+z1HaueIkBPyga/iC6UwryI6IKEIX4BduW9y2vOknQHZFGEXOOXZ20hiMyOnQGVDHt4no2x+kvJGBcj8Y06/JwxbDNFfaXeWY5PP5lRIb6SYO+OOHfkM2PLxRD9e5gT8o+iMi/uMT+82G4Q27DDI3vYYsv0iSKbgGuMf5q5/3b+TH4ghK3DBDEfL10n8poRo4lB1Y0o2HBXr7KJa9XgUr95ShSqmKFtKNbcdodFUyiphzBMKXoF3l9W32gAAAABJRU5ErkJggg==' style='height:30%;'>";
var next_icon_define = "<img id='char_next_img'  rsrc='data/char_next.png' style='width:5%;'>";
var timer_count_down_define = '30';
var game_igp_code_define = 'A8';
if (DEBUG || (typeof reward_amount) == 'undefined')
    var reward_amount_define = 5;
else 
{
    var reward_amount_define = Core.GetRewardAmount();
}
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


