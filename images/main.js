(function($) {
	
var $body = $('body');
var setting = {

	activeCate: true,    //현재카테고리위치 표기 
	autoLink: true,      //댓글,방명록 자동링크
	extendThumb: false,  //썸네일 확장
	newIcon: true,    	 //new 아이콘 변경여부
	preloader: false,    //프리로드 활성화
	searchTag: true,  	 //검색시에 우선순위태그를 보여줌
	searchTagCount: 8,   //보여줄 우선순위태그 갯수
	tbHide: true,        //트랙백숨기기
	timeChange: true    //포스트,댓글,방명록 날짜표기 변경 
	
}

var initObj = {
	targetElem: {
		ttCate: $('.tt-cate'),        //카테고리영역에 클래스추가
		curCate: $('.cur-cate'),      //현재카테고리표기에 이용
		toggleBtn: $('.btn-toggle'),  //토글버튼
		closeBtn: $('.btn-close')     //닫기버튼
	},
	scrollEvent: {
		btnTarget: $('.go-top'),
		topPos: 0,
		interval: 400
	}
};

var funcObj = {

	initFunc: function(){
		//카테고리초기화
		initObj.targetElem.ttCate.children('ul').addClass('tt-ul').children().children('a').addClass('tt-cate-name').next('ul').addClass('tt-ul-two').children().children('ul').addClass('tt-ul-three');
		$('.tt-ul-three').closest('li').addClass('tt-has-sub').append('<span class="tt-cate-toggle"><i class="icon icon-angle-down"></i></span>');

		// bread replace
		var bd = $('.bread'),
			tb = $('.target-bread').eq(0).html();
		bd.html(tb);

		if (setting.activeCate) {  //현재카테고리표기
			var curCate = initObj.targetElem.curCate;

			if (curCate.length > 0) {
				var ctext = curCate.text();
				var cateName = $('.expand-tt-cate .tt-cate-name').text().split(' ')[0];

				if(ctext !== cateName) {
					ctext = "/category/"+ctext;
				} else {
					ctext = "/category";
				}
				
				var $a = $('.tt-cate').find('a');
				$a.each(function(){
					var $this = $(this);
					if(ctext == decodeURIComponent($this.attr('href'))) {
						$this.addClass('active');

						if($this.closest('ul').hasClass('tt-ul-three')) {
							$this.closest('.tt-has-sub').addClass('tt-has-active');
						}

						return;
					}
				});
			}
		};

		//category change
		var cl = $('.change-lv'),
			clt= cl.text(),
			cls = clt.split('/'),
			lv;

		if(cls.length > 1) {
			lv = '<span class="lv-one has-sub-lv">'+cls[0]+'</span><span class="lv-two">'+cls[1]+'</span>';
		} else {
			lv = '<span class="lv-one">'+cls[0]+'</span>';
		}
		cl.html(lv);

		//로그인, 로그아웃 체크 : http://devsomnus.tistory.com/19 
		var userState,
			userClass = 'no-tuser',
			$ttbar = $('#tistorytoolbarid');
		//userState - 0: not log in = no-tuser, 1: logged-in = tuser, 2: admin = tadmin 
		//length - 3: not log in, 4: logged-in
		userState = $ttbar.find('.tt_menubar_logout').children('.tt_menubar_link_tit').text().length - 3;
		if (userState){
			userClass = 'tuser';
			var check = location.href.split('.com')[0] + ".com";
			$ttbar.find('.tt_menubar_link').each(function(){
				if ($(this).attr('href') == check) {
					userState = 2;
					userClass = 'tadmin';
				}
			});
		};
		$body.addClass(userClass);

		//페이지네이션 interword wrap, slected 클래스 위치조정, 모바일용 클래스추가
		var pn = $('.pagination');
		pn.find('.interword').wrap('<li />');
		pn.find('.selected').removeClass('selected').parents('li').addClass('selected');  
		pn.find('li').eq(-2).addClass('lastpage');

		//카테고리다른글 변경
		if($('.another_category').length > 0) {
			var $ac = $('.another_category');
			var $acHead = $ac.find('h4');

			$acHead.each(function(){
				var $this = $(this);
				var $achLink = $this.find('a');
				var acText = '<span class="txt-bar"></span><span class="lv-txt">카테고리의 다른글</span>';

				if($achLink.length > 1) {
					$achLink.eq(0).addClass('alv-one has-sub-alv');
					$achLink.eq(1).addClass('alv-two');
				} else {
					$achLink.addClass('alv-one');
				};

				$this.empty().append($achLink).append(acText);
			});

			$ac.find('.current').removeClass('current').closest('tr').addClass('current');
			$('.point-another').before($ac);
			
		};

		//메뉴너비설정
		funcObj.getMenuWidth($('.scrollable-x'));

		//댓글 has-reply
		$('.reply-list').parent().addClass('has-reply');

		//youtube iframe z-index bugFix
		$('iframe[src*="//www.youtube.com/embed"]').each(function(){
		    var url = $(this).attr("src");
		    var separator = (url.indexOf('?') > 0) ? '&' : '?';
		    $(this).attr('src', url + separator + 'wmode=transparent');
		});

		//최근댓글
		$('.btn-rcomment').on('click', function(){
			var rAuthor = $('.rcomment-meta .author');
			rAuthor.each(function(){
				if($(this).text() == blogger) {
					$(this).closest('li').addClass('admin-comment');
				}
			});
		});
	},

	headerScroll: function (){
		var didScroll;
		var lastScrollTop = 0;
	},

	toggleBtn: function (target) {
		var targetElem = target.attr('href');
		$(targetElem).toggleClass('on');
		target.toggleClass('on');
	},

	closeBtn: function (target) {
		var targetElem = target.attr('href');
		$(targetElem).trigger('click');
	},

	searchTag: function (target, count) {
		var t = 0;
		target.each(function() {
			if (t < count) {
				var cli = $(this).clone();
				cli.find('a').removeClass();
				$('#search-tag .scrollable').append(cli);
				t++;
			} else {
				return false;
			}
		});
	},

	getMenuWidth: function(target) {
		var rwd = 0;
		var item = target.find('li');
		item.each(function(){
			var wd = parseInt(($(this).outerWidth()));
			rwd = rwd + wd;
		});
		target.css('width',rwd+30);
	},

	getAspectRatio: function (width, height) {
	    var ratio = width / height;
	    return ( Math.abs( ratio - 4 / 3 ) < Math.abs( ratio - 16 / 9 ) ) ? '4by3' : '16by9';
	},

	imageRaito: function (target) {
		target.each(function(){
			var $this = $(this),
				realImg = new Image();
			
			realImg.src = $this.attr('src');
			var realWidth = realImg.width;
			var realHeight = realImg.height;
			$this.addClass(realWidth > realHeight ? 'landscape' : 'portrait');
		});
	}

};

var thumbObj = {  //이미지 추출을 위한
  sizing: {

  	//유투브: 0(480x360), 1~3(120x90), hqdefault(480x360), mqdefault(320x180), default(120x90) 
    youtube: "/hqdefault.jpg",

    //비메오: thumbnail_[small(100x75), medium(200x150), large(640)]
    vimeo: "thumbnail_large",  

    //데일리모션(세로기준): thumbnail_[60, 120, 180, 240, 360, 480, 720]_url :숫자가 없다면 전체크기  
    daily: "thumbnail_240_url",

    //사운드클라우드: original, mini(16x16), tiny(20x20), small(32x32), badge(47x47), t67x67, large(100x100=default), t300x300, crop(400x400), t500x500  
    sound: "t500x500"
  },

  regExr: {
    posCon: /<article.*>([\s\S]+)<\/article>/, //본문범위
    youtube: /youtube(?:|-nocookie).com\/(?:(?:v|embed)\/)?([a-zA-Z0-9-_]+)/i,
    vimeo: /player.vimeo.com\/video\/?([0-9]+)/i,
    video: /<video.*>/i,
    sound: /api.soundcloud.com\/tracks\/?([0-9]+)/i,
    daily: /dailymotion.com\/embed\/video\/([a-zA-Z0-9_]+)/i,
    daum: /videofarm.daum.net\/controller\/video\/viewer\/Video.html\?vid=([0-9a-zA-Z]+)/i,

    pandora: /(?:flvr|channel).pandora.tv\/(?:flv2pan|php)\/(?:embed.fr1.ptv\?|flvmovie.dll\/).*?userid=([(a-zA-Z0-9)]+).*?\&(?:|amp;)prgid=([(0-9)]+)/i,
    naver: /serviceapi.rmcnmv.naver.com\/flash\/outKeyPlayer.nhn\?vid=([(A-Za-z0-9)]+)*.+outKey=([(A-Za-z0-9)]+)*/i
  }
};

/* 이미지, 동영상, 분류처리 함수
 * 소스 참조 : http://ishaiin.com (비공개 라이센스이기에 재사용을 금함) 
 */
function checkSort(target, data) {

    var loadData = data,
     	classTarget = target,
        targetHref = target.find(".list-link").attr('href'),
        exrCon = thumbObj.regExr.posCon,
        conData = loadData.match(exrCon) ? loadData.match(exrCon)[0] : "none";

    if (conData != "none") {
    	var youtubeExr = thumbObj.regExr.youtube,
    		vimeoExr = thumbObj.regExr.vimeo,
    		videoExr = thumbObj.regExr.video,
    		daumExr = thumbObj.regExr.daum,
    		dailyExr = thumbObj.regExr.daily,
    		exrSound = thumbObj.regExr.sound,
        	totalDefarticle = $.Deferred(),
        	stringPre = '<a class="has-object ext-photo" href="'+targetHref+'"><div class="thumbnail"><div class="cropzone">',
        	stringEnd = '</div></div></a>';

        var youtubeData = conData.match(youtubeExr) ? conData.match(youtubeExr)[0] : "none";
        if (youtubeData != "none") {
        	var thumb = thumbObj.sizing.youtube, 
        		matching = youtubeData.indexOf("embed/"),
        	    vid = youtubeData.slice(matching+6),
            	vsrc = "http://img.youtube.com/vi/"+vid+thumb;
            
            classTarget.prepend(stringPre+'<img src="'+vsrc+'" class="landscape">'+stringEnd);
            totalDefarticle.resolve();
            return;
        }

        var vimeoData = conData.match(vimeoExr) ? conData.match(vimeoExr)[0] : "none";
        if (vimeoData != "none") {
        	var matching = vimeoData.indexOf("video/"),
        	    vid = vimeoData.slice(matching+6),
        	    ajaxUrl = 'http://vimeo.com/api/v2/video/'+vid+'.json';
        	
        	var resolveVimeo = $.ajax({
        	    url: ajaxUrl,
        	    dataType: "jsonp",
        	    jsonp: "callback",
        	    timeout: 1000

        	}).done(function (data) {
        	    var thumb = thumbObj.sizing.vimeo,
        	    	vsrc = data[0][thumb];

        	    classTarget.prepend(stringPre+'<img src="'+vsrc+'" class="landscape">'+stringEnd);
        	    totalDefarticle.resolve();

        	}).fail(function (data) {
        	    totalDefarticle.resolve();
        	});
        	return;
        }

        var videoData = conData.match(videoExr) ? conData.match(videoExr)[0] : "none";
        if (videoData != "none") {
          	var matching = videoData.indexOf('poster="'),
          		matchingEnd = videoData.indexOf('"', matching+8),
          		vsrc = videoData.slice(matching+8, matchingEnd);
          	classTarget.prepend(stringPre+'<img src="'+vsrc+'" class="landscape">'+stringEnd);
          	totalDefarticle.resolve();
          	return;
        } 

        var daumData = conData.match(daumExr) ? conData.match(daumExr)[0] : "none";
        if (daumData != "none") {
        	var matching = daumData.indexOf("vid="),
        		vid = daumData.slice(matching+4),
        		vsrc = 'http://i1.daumcdn.net/svc/image/U03/tvpot_thumb/'+vid+'/thumb.png';

        	classTarget.prepend(stringPre+'<img src="'+vsrc+'" class="landscape">'+stringEnd);
        	totalDefarticle.resolve();
        	return;
			// var ajaxUrl = 'http://tvpot.daum.net/clip/ClipInfoXml.do?vid='+vid;
        }

        var dailyData = conData.match(dailyExr) ? conData.match(dailyExr)[0] : "none";
        if (dailyData != "none") {
        	var thumb = thumbObj.sizing.daily,
        		matching = dailyData.indexOf("video/"),
        		vid = dailyData.slice(matching+6),
        		ajaxUrl = 'https://api.dailymotion.com/video/'+vid+'?fields='+thumb;

          	var resolveDaily = $.ajax({
          	    url: ajaxUrl,
          	    dataType: "jsonp",
          	    jsonp: "callback",
          	    timeout: 1000

          	}).done(function (data) {
         	    var vsrc = data[thumb];
          	    classTarget.prepend(stringPre+'<img src="'+vsrc+'" class="landscape">'+stringEnd);
          	    totalDefarticle.resolve();

          	}).fail(function (data) {
          	    totalDefarticle.resolve();
          	});
          	return;
        } 

        var soundData = conData.match(exrSound) ? conData.match(exrSound)[0] : "none";
        if (soundData != "none") {
        	var ajaxUrl = 'http://'+soundData+'.json?client_id=70e58aa048aff8cfc1c7914bc73268eb';

          	var resolveDaily = $.ajax({
          	    url: ajaxUrl,
          	    dataType: "json",
          	    timeout: 1000

          	}).done(function (data) {
         	    var thumb = thumbObj.sizing.sound,
         	    	vsrc = data.artwork_url.replace('large', thumb);

          	    classTarget.prepend(stringPre+'<img src="'+vsrc+'">'+stringEnd);
          	    totalDefarticle.resolve();

          	}).fail(function (data) {
          	    totalDefarticle.resolve();
          	});
          	return;
        } 

	    return totalDefarticle;
    };
};

$(document).ready(function() {
	//초기화
	funcObj.initFunc();

	//옵션수행
	if (setting.preloader) { //프리로드
		var htmlStr = '<div class="loading-wrap"><div class="loading-fixed"></div></div>';
		$body.prepend(htmlStr);
	}

	if (setting.searchTag) {  //태그를검색이용
		var tagTarget = $('.module-tag').find('li');
		var tagCount = setting.searchTagCount;
		funcObj.searchTag(tagTarget, tagCount); 

		//hideseek plugin init
		$('#search-input').hideseek({
			list: '#search-tag',
			navigation: true,
			highlight: true
		});
	};

	if (setting.newIcon){  //NEW아이콘대체
		$('img[alt="N"]').each(function(){
			$(this).replaceWith('<i class="icon icon-new"></i>');
		});
	};

	if (setting.timeChange){
		$('.timeago').timeago();  //날짜표기형식변경
	};

	if (setting.autoLink) {  //댓글,방명록 자동링크
		$('.speech').each(function(){
	        var str = $(this).html();
	        var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig
	        var replaced_text = str.replace(regex, "<a href='$1' target='_blank' class='autolink'>$1</a>");
		    $(this).html(replaced_text);
    	});
	};

	if (setting.tbHide) {  //트랙백숨기기
		$('.tbs').hide();
	};

	if (setting.extendThumb) { //썸네일확장
		var ajaxData = [],
		    data,
		    target = $('.list-row').filter(function(){
		    	return $(this).children().length == 1;
		    });

		target.each(function() {
		    var $this = $(this),
		        link = $this.find('.list-link').attr('href');

		    ajaxData.push(
		        $.ajax({
		            url: link,
		            dataType: "html"
		        })
		        .done(function (data) {
		            var defin = new $.Deferred();
		            checkSort($this, data);
		        })        
		    );

		});
	};

	//이미지오버랩 및 동영상반응형
	if($('#tt-body-page').length) {
		var $eCon = $('.e-content');

		var eConW = $eCon.width();
		$eCon.each(function(){
			var imgContain = $(this).find('.imageblock');

			imgContain.each(function(){
				var $this = $(this);

				if (parseInt($this.width()) == (parseInt(eConW))) {
					$this.parent('p').addClass('over-padding');
				}
			});
		});

		$('.e-content iframe[src*="player.vimeo.com"], .e-content iframe[src*="//www.youtube.com"], .e-content iframe[src*="//videofarm.daum.net"], .e-content .iframe-player').each(function(){
			var $this = $(this);

			if (!($this.parent().hasClass('embed-responsive'))){
				if ($this.attr('width')) {
					var ewd = parseInt($this.attr('width'));
				} else {
					var ewd = $this.width();
				}

				if ($this.attr('height')) {
					var eht = parseInt($this.attr('height'));
				} else {
					var eht = $this.height();
				}
				
				var ratio = funcObj.getAspectRatio(ewd, eht);
				$this.wrap('<div class="embed-wrapper" style="max-width:'+ewd+'px"><div class="over-padding embed-responsive embed-responsive-'+ratio+'"></div></div>');
			}
		});
	};

	//EventHandler
	var tb = initObj.targetElem.toggleBtn;
	tb.on('click',function(){
		var target = $(this);
		funcObj.toggleBtn(target);
		return false;
	});

	var bc = initObj.targetElem.closeBtn;
	bc.on('click',function(){
		var target = $(this);
		funcObj.closeBtn(target);
		return false;
	});

	$('.call-control').on('click',function(){
		var $this = $(this);
		$this.toggleClass('on');
		$this.next().toggleClass('on');
		return false;
	});

	$('.dropdown-close').on('click',function(){
		$(this).closest('.dropdown').removeClass('open');
		return false;
	});

	$('.tt-has-active').addClass('open');
	$('.tt-cate-toggle').on('click',function(){
		$(this).closest('.tt-has-sub').toggleClass('open');
		setTimeout(function(){
			myScroll.refresh();
		}, 500);
	});

	//폼액션
	var focusWrap = $('.focus-wrap');
	var focusTarget = $('.focus-target');

	focusTarget.on('focus', function(){
		$(this).closest('.focus-wrap').addClass('focus');
	});
	focusTarget.on('focusout', function(){
	    $(this).closest('.focus-wrap').removeClass('focus');
	});

	var textareaTarget = $('.textboxs textarea');
	textareaTarget.on('focus', function(){
		$('.write-form').addClass('active');
	    $(this).siblings('label').fadeOut('fast');
	});
	textareaTarget.on('focusout', function(){
	    if($(this).val() == ''){
	        $(this).siblings('label').fadeIn('fast');
	    }
	});

	//goToTop
	var bt = initObj.scrollEvent.btnTarget;
	bt.on('click',function() {
		$('html,body').animate({scrollTop: initObj.scrollEvent.topPos}, initObj.scrollEvent.interval);
		return false;
	});

	//modal
	var btnMenu = $('#call-exmenu'),
		btnSearch = $('#call-search'),
		modalMenu = $('#expand-wrap'),
		modalSearch = $('#tt-search');

	btnMenu.on('click',function(){
		if(btnSearch.hasClass('on')) {
			btnSearch.trigger('click');
		}
		modalMenu.toggleClass('on');
		$(this).toggleClass('on');
		return false;
	});

	btnSearch.on('click',function(){
		if(btnMenu.hasClass('on')) {
			btnMenu.trigger('click');
		}
		modalSearch.toggleClass('on');
		$('#search-input').focus();
		if($(this).hasClass('on')){
			$('#search-input').blur();
		}
		$(this).toggleClass('on');
		return false;
	});

	//scroll fixed
	$('.btn-close').on('touchmove',function(e){e.preventDefault()});
	$('#call-search, #call-exmenu').on('click',function(){
		$('body').toggleClass('fixed');
	});
});

// 헤더 스크롤
var didScroll;
var lastScrollTop = 0;
var delta = 100;
var navbarHeight = $('#site-header').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();
    
    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta){return;}
    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('#site-header').removeClass('nav-down').addClass('nav-up');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('#site-header').removeClass('nav-up').addClass('nav-down');
        }
    }
    
    lastScrollTop = st;
};

$(window).load(function(){
	funcObj.imageRaito($('.ratio-fixed .t-photo').find('img'));
	if ($('#tt-body-page').length) {
		funcObj.imageRaito($('.dual').find('img'));
		funcObj.imageRaito($('.triple').find('img'));
	}
	
	if (setting.preloader) { 
		setTimeout(function(){
	    	$('.loading-fixed').fadeOut();
		}, 1000);
	}
	
	$body.removeClass('loading');
});

}(jQuery));