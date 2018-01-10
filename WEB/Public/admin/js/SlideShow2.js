/**
 * @property {Number} index
 * @property {Tween} tween
 * 
 */
var SlideFrame = elf.util.Class.create({
	/**
	 * @param {String} args.frameId
	 * @param {Number} args.index
	 * @param {Function} args.onFadeout
	 */
	initialize: function (args) {
		var that = this;
		
		elf.util.extend(this, this.constructor.option);
		elf.util.extend(this, args);
		
		var frame = this.getFrame();
		
		this.lastTimer = new elf.transition.Tween(
			elf.util.extend(
				elf.util.extend({}, this.lastOption),
				{
					element: frame,
					onComplete: function () {
						that.running = that.fadeoutTimer;
						that.start();
					}
				}
			)
		);
		
		this.fadeoutTimer = new elf.transition.Tween(
			elf.util.extend(
				elf.util.extend({}, this.fadeoutOption),
				{
					element: frame,
					onComplete: function () {
						var forward = elf.transition.Tween.DIRECTION_FORWARD;
						if (this.getDirection() == forward) {
							elf.dom.Style.set(this.element, {
								opacity: 1
							});
							
							elf.dom.ClassName.remove(this.element, [that.currentClipClass, that.nextClipClass]);
							
							that.onFadeout && that.onFadeout();
						} else {
							this.turn(elf.transition.Tween.DIRECTION_FORWARD);
						}
						that.running = null;
					}
				}
			)
		);
		
//		elf.dom.Event.add(frame, 'mouseover', function (ev) {
//			that.stop();
//		});
//		
//		elf.dom.Event.add(frame, 'mouseout', function (ev) {
//			that.lastTimer.resume();
//		});
		
		this.frame = null;
	},
	
	/**
	 * 开始运行
	 * @public
	 * 
	 * @param {Number} time
	 */
	start: function (time) {
		var frame = this.getFrame();
		elf.dom.ClassName.remove(frame, this.nextClipClass);
		elf.dom.ClassName.add(frame, this.currentClipClass);
		
		if (!this.running) {
			this.running = this.lastTimer;
		}
		this.running.start({
			startOffset: time
		});
	},
	
	/**
	 * 暂停运行
	 * @public
	 */
	stop: function () {
		if (this.lastTimer.running) {
			this.lastTimer.stop();
		}
		if (this.fadeoutTimer.running) {
			this.fadeoutTimer.turn(elf.transition.Tween.DIRECTION_BACKWARD);
		}
	},
	
	/**
	 * 恢复运行
	 * @public
	 */
	resume: function () {
		this.lastTimer.running.resume();
	},
	
	/**
	 * 准备在位置，作为下一个要运动的
	 */
	standBy: function () {
		elf.dom.ClassName.add(this.getFrame(), this.nextClipClass);
	},
	
	/**
	 * 强制淡出
	 * @public
	 */
	fadeout: function () {
//		if (elf.dom.ClassName.has(this.getFrame(), [this.nextClipClass, this.currentClipClass])) {
			var running = this.running;
			switch (running) {
				case this.lastTimer:
					running.stop();
					running.onComplete();
					break;
					
				case this.fadeoutTimer:
					running.turn(elf.transition.Tween.DIRECTION_FORWARD);
					running.resume();
					break;
					
				default:
					this.fadeoutTimer.onComplete();
					break;
			}
//		}
	},
	
	/**
	 * 获取图片容器元素
	 * @public
	 * 
	 * @return {HTMLElement}
	 */
	getFrame: function () {
		return document.getElementById(this.frameId);
	}
});

SlideFrame.option = {
	currentClipClass: 'current',
	nextClipClass: 'next',
	
	lastOption: {
		duration: 5000
	},
	fadeoutOption: {
		duration: 500,
		property: {
			opacity: {from: 1, to: 0}
		}
	}
};



/**
 * 
 * @property {String} wrapId
 */
var SlideShow = elf.util.Class.create({
	/**
	 * 
	 * @param {String} args.wrapId
	 * @param {String} args.clipClass
	 */
	initialize: function (args) {
		var that = this;
		
		elf.util.extend(this, this.constructor.option);
		elf.util.extend(this, args);
		
		var clip = this.getClip();
		var pagerWrap = this.getPagerWrap();
		var pagerHTML = [];
		
		this.frameGroup = [];
		for (var i = clip.length - 1; i >= 0; i--) {
			var frameId = clip[i].id;
			if (!frameId) {
				frameId = clip[i].id = elf.util.guid(this.wrapId + '_' + this.clipClass + '_');
			}
			this.frameGroup.unshift(new SlideFrame({
				frameId: frameId,
				index: i,
				onFadeout: function () {
					that.next();
				}
			}));
			
			if (pagerWrap) {
				pagerHTML.unshift(elf.util.template(this.constructor.TPL_PAGER, {
					pagerClass: this.pagerClass,
					page: i + 1,
					index: i
				}));
			}
		}
		
		this.currentIndex = 0;
		this.nextIndex = this.frameGroup.length > 1 ? 1 : 0;
		this.appointedIndex = -1;
		this.tempIndex = -1;
		
		if (pagerWrap) {
			pagerWrap.innerHTML = pagerHTML.join('');
			
			elf.dom.Event.add(pagerWrap, 'click', function(ev){
				var index = this.getAttribute('index') - 0;
				if (index != that.currentIndex) {
					that.jump(index);
				}
			}, function(node){
				return elf.dom.ClassName.has(node, that.pagerClass);
			});
			
			elf.dom.ClassName.toggle(pagerWrap, this.hidePagerClass, pagerHTML.length < 2);
		}
		
		//如果只有一张图片就静止不动
		if (this.frameGroup.length > 1) {
			this.start();
		} else if (this.frameGroup.length) {
			var frame = this.frameGroup[0];
			frame.start();
			frame.stop();
		}
		
		pagerWrap = null;
	},
	
	/**
	 * 启动
	 * @param {Number} n
	 */
	start: function (n) {
		var index = this.currentIndex = n || 0;
		var next = this.getNextIndex();
		this.frameGroup[index].start();
		this.frameGroup[next].standBy();
		
		var pager = this.getPagerButton();
		for (var i = pager.length - 1; i >= 0; i--) {
			elf.dom.ClassName.remove(pager[i], this.currentPagerClass);
		}
		elf.dom.ClassName.add(pager[index], this.currentPagerClass);
	},
	
	/**
	 * 单张自然播放完成切换到下一张
	 */
	next: function () {
		var group = this.frameGroup;
		var nextIndex = this.getNextIndex();
		if (this.appointedIndex >= 0) {
			var nextClip = group[nextIndex], currentClip = group[this.currentIndex];
			if (nextClip.running || currentClip.running) {
				if (nextClip.running) {
					nextClip.fadeout();
				}
				if (currentClip.running) {
					currentClip.fadeout();
				}
			} else {
				this.start(this.appointedIndex);
				this.appointedIndex = -1;
			}
		} else {
			this.start(nextIndex);
		}
	},
	
	/**
	 * 未播放完成切换到指定图片
	 * @param {Number} index
	 */
	jump: function (index) {
		this.frameGroup[this.currentIndex].fadeout();
		var next = this.getNextIndex();
		if (next != index) {
			this.appointedIndex = index;
			this.frameGroup[next].fadeout();
			this.frameGroup[index].standBy();
		}
	},
	
	/**
	 * 获取当前在播放的图片控制器
	 */
	getCurrentFrame: function () {
		return this.frameGroup[this.currentIndex];
	},
	
	/**
	 * 获取当前的下一张图片索引
	 * @private
	 * 
	 * @return {Number}
	 */
	getNextIndex: function () {
		var next = this.currentIndex + 1;
		if (next >= this.frameGroup.length) {
			next = 0;
		}
		return next;
	},
	
	getWrap: function () {
		return document.getElementById(this.wrapId);
	},
	
	/**
	 * 获取要播放的图片
	 * @public
	 * 
	 * @param {Number} index
	 * 
	 * @return {HTMLElement}
	 */
	getClip: function (index) {
		var group = this.getElementsByClassName(this.clipClass);
		return elf.util.Type.isDefined(index) ? group[index] : group;
	},
	
	/**
	 * 获取页码外围
	 * @private
	 * 
	 * @return {HTMLElement|null}
	 */
	getPagerWrap: function () {
		var pagerWrap = this.getElementsByClassName(this.pagerWrapClass);
		return pagerWrap.length ? pagerWrap[0] : null;
	},
	
	/**
	 * 获取页码按钮
	 * @param {Number} index
	 * 
	 * @return {Array|HTMLElement|null}
	 */
	getPagerButton: function (index) {
		var pager = this.getElementsByClassName(this.pagerClass);
		return pager.length ? elf.util.Type.isDefined(index) ? pager[index] : pager : null;
	},
	
	/**
	 * 
	 * @param {Object} className
	 */
	getElementsByClassName: function (className) {
		return elf.dom.query('.' + className, this.getWrap());
	}
	
});

SlideShow.option = {
	clipClass: 'clip',
	pagerWrapClass: 'controller',
	pagerClass: 'pager',
	currentPagerClass: 'current',
	hidePagerClass: 'hidden'
};

SlideShow.TPL_PAGER = '<span class="#{pagerClass}" index="#{index}"><span>#{page}</span></span>';
