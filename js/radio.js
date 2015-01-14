$(function(){

	//浏览器支持性检测
	if("ie"==getExplorerType()){
		$("#songInfoMask").css("display", "table");
		$("#worningMsg").text("你的浏览器(ie内核)不支持播放功能哦。");
		return;
	}else{
		var media = document.getElementById("media");
		if("safari"==getExplorerType() && 0!=media.currentTime ){
			$("#songInfoMask").css("display", "table");
			$("#worningMsg").html("你的safari还没有安装<a style='text-decoration: underline;' target='_blank' "+
				" href='http://www.apple.com.cn/quicktime/download/' >QuickTime</a>哦。");
		}
		randomMedia(media);	//开机即随机选择一首歌进行播放。
	}

	//暂停按钮
	var pauseBtnSrc = $("#pauseBtn").attr("src");
	$("#pauseBtn").mouseover(function(){
		$(this).attr("src", $(this).attr("src2"));
	});
	$("#pauseBtn").mouseout(function(){
		$(this).attr("src", pauseBtnSrc);
	});
	$("#pauseBtn").click(pause);
	$("#songInfoMask").click(continuePlay);
	
	
	//“喜欢”，“不喜欢”，“下一首”
	var iconImgSrc;
	var iconTimeoutId;
	$(".icon_pic").mouseover(function(){
		if(!isRedHeart){
			iconImgSrc = $(this).attr("src");
			$(this).attr("src", $(this).attr("src2"));
		}
		var thisIndex = $.inArray(this, $(".icon_pic"));
		iconTimeoutId = window.setTimeout(function(){
			$(".icon_text").eq(thisIndex).css("visibility", "visible").hide().animate({opacity: 'show'}, { duration: 200 });
		}, 300);
	});
	$(".icon_pic").mouseout(function(){
		if(!isRedHeart){
			$(this).attr("src", iconImgSrc);
		}
		var thisIndex = $.inArray(this, $(".icon_pic"));
		$(".icon_text").eq(thisIndex).css("visibility", "hidden");
		window.clearTimeout(iconTimeoutId);
	});
	
	//红心点击事件
	$(".icon_pic:first").click(function(){changeHeart(this);});
	
	//垃圾箱和下一首都仅进行简单的切歌
	$(".icon_pic:not(:first)").click(function(){
		randomMedia(document.getElementById("media"));
	});
	
	
	//关于音量
	//鼠标划至音量按钮时。隐藏剩余时间，滑动音量按钮，弹出音量拖动条
	$("#volIcon").bind("mouseenter", function(){
		if("Microsoft Internet Explorer" == navigator.appName){
			$("#lastTime").css("visibility", "hidden");	//即使是fadeOut，也不支持ie。所以只能生硬的隐藏。
		}
		$("#lastTime").animate({opacity: '0.0'}, "fast");	//使用改变透明度的方式进行隐藏，避免排版错误
		$("#volIcon").animate({paddingRight: '50px'}, "fast");
		$("#progressVol").fadeIn("fast");
	});
	$("#restTime").bind("mouseleave", function(){
		$("#lastTime").animate({opacity: '1.0'}, "fast", function(){
			$(this).css("visibility", "visible");
		});
		$("#volIcon").animate({paddingRight: '0px'}, "fast");
		$("#progressVol").fadeOut("fast");
	});
	//音量滑块控制方法
	var isMouseDown = false;
	$("#progressVol").bind("mousedown mouseup mousemove", function(e){
		if("mousedown" == e.type){
			isMouseDown = true;
			setVolume(e);
		}else if("mouseup" == e.type){
			isMouseDown = false;
		}else if("mousemove" == e.type){
			if(isMouseDown){
				setVolume(e);
			}
		}
	});
	
	//对左侧专辑信息的样式弥补
	$("#albumInfoMask,#albumMsg").mouseover(function(){
		$("#albumMsg").animate({opacity: '0.8'}, "normal");
	}).mouseout(function(){
		$("#albumMsg").animate({opacity: '0.0'}, "fast");
	});
});


//计算百分比来改变音量条位置。
function setVolume(e){
	var x_former = getOffsetX(e);
	var p = (1 - x_former / $(e.currentTarget).width())*100;
	document.getElementById("media").volume = (100-p)/100;
	$(e.currentTarget).css("backgroundPosition", p+"% 0%");
}
//工具方法，FF不支持offsetX。
function getOffsetX(e){
	if(e.offsetX){
		return e.offsetX;
	}else{
		var o = e.target;
		var x=0;
		while( o.offsetParent ){
			x += o.offsetLeft;
			o=o.offsetParent;        
		}
		return e.pageX - x;
	}
}



//点击红心变换
var isRedHeart = false;
function changeHeart(thiss){
	isRedHeart = !isRedHeart;
	var tempSrc = $(thiss).attr("src3");
	$(thiss).attr("src3", $(thiss).attr("src"));
	$(thiss).attr("src", tempSrc);
}
//暂停
function pause(){
	document.getElementById("media").pause();
	var songInfoMask = $("#songInfoMask");
	songInfoMask.css("display", "table");
	if("none" == songInfoMask.css("display")){		//ie不支持display=block
		songInfoMask.css("display", "block");
	}
}
//继续播放
function continuePlay(){
	document.getElementById("media").play();
	$("#songInfoMask").css("display", "none");
}







/**播放功能**/
//音频加载完毕
var durationTime = 0;	//当前音频时间总长度
function audioLoadComplete(media){
	var songSrc = decodeURIComponent(media.currentSrc);
	//获得音频文字信息
	var fontSrc = songSrc.substring(0, songSrc.lastIndexOf("."));
	getSongInfo(fontSrc);
	
	//更改放机图片
	$("img.radioLeftBlock").attr("src", fontSrc+".jpg");
	
	//获得音频总时间
	durationTime = media.duration;
	//解决时间数字加载过慢
	var lastSecond = durationTime-media.currentTime;
	var lastTime = secondToMin(lastSecond);
	$("#lastTime").html(lastTime);
}
//音频播放中
function audioRunning(media){
	//计算剩余时间
	var lastSecond = durationTime-media.currentTime;
	var lastTime = secondToMin(lastSecond);
	$("#lastTime").html(lastTime);
	
	//更改滚动条位置
	var percent = lastSecond/durationTime;
	$("#progressBar").css("backgroundPosition", (Math.round(percent*10000)/100).toString()+"% 0%");
}
//工具方法。将秒数格式化为 -mm:ss 形式
function secondToMin(num){
	var minStr = (num/60).toString();
	var min = minStr.substring(0, minStr.lastIndexOf("."));
	min = ""==min?"0":min;
	var sec = Math.round(num%60).toString();
	sec = sec.length==1?("0"+sec):sec;
	return "-"+min+":"+sec;
}


//根据code获得音频的文字信息
function getSongInfo(fontSrc){
	//$.getScript(fontSrc+"/info.js");
	var jsLoader = new JsLoader();
	jsLoader.load(fontSrc+".js");
	jsLoader.onsuccess=function(){
		if("function" == typeof songInfo){		//for safari
			var temp = new songInfo();
			songInfo = temp;
		}
		$("#songInfo #artistName").html(songInfo.artistName);	//艺术家
		$("#songInfo #songName").html(songInfo.songName);	//歌曲名称
		$("#songInfo #albumName").html(songInfo.albumName);	//专辑名称
		$("#songInfo #albumYear").html(songInfo.publishYear);	//专辑年份
		//读完js文件后立即将其删除
		songInfo = null;  delete songInfo;
		$("#songInfoJs").remove();
	};
	jsLoader.onfailure=function(){
		$("#songInfoJs").remove();
		return;
	}
}

/**
 *	随机选取歌曲进行播放
 *	传入audio的dom对象
 **/
function randomMedia(media){
	if(!media){
		media = document.getElementById("media");
	}
	var thisSrc = media.currentSrc;
	var formerMediaId = thisSrc.substring(thisSrc.lastIndexOf("/")+1, thisSrc.lastIndexOf("."));
	var ranNum = (Math.random()*5).toString();
	var mediaId = "00"+ranNum.substring(0, ranNum.lastIndexOf("."));
	if(parseInt(formerMediaId) == parseInt(mediaId)){	//规定选出的歌曲必须与上一首不同
		randomMedia(media);
		return ;
	}
	$("source:eq(0)").attr("src", "./music/"+mediaId+".mp3");
	$("source:eq(1)").attr("src", "./music/"+mediaId+".ogg");
	media.load();

	if(!formerMediaId.length==0 && "safari"===getExplorerType()){		//for safari	不支持media.load();
		window.location.reload();
	}
}

/**使用方法 
 *  var jsLoader=new JsLoader(); 
 *	jsLoader.onsuccess=function(){}成功时执行的方法 
 *	jsLoader.onfailure=function(){}失败时执行的方法 
 * 	jsLoader.load("hello.js"); 
**/ 
function JsLoader(){
	this.load=function(url){
		//获取所有的<script>标记
		var ss=document.getElementsByTagName("script");
		//判断指定的文件是否已经包含，如果已包含则触发onsuccess事件并返回
		for (i=0;i<ss.length;i++){
		    if (ss[i].src && ss[i].src.indexOf(url)!=-1){
		        this.onsuccess();
		        return;
		    }
		}
		//创建script结点,并将其属性设为外联JavaScript文件
		s=document.createElement("script");
		s.type="text/javascript";
		s.charset="utf-8";
		s.src=url;
		s.id="songInfoJs"
		//获取head结点，并将<script>插入到其中
		var head=document.getElementsByTagName("head")[0];
		head.appendChild(s);
		  
		//获取自身的引用
		var self=this;
		//对于IE浏览器，使用readystatechange事件判断是否载入成功
		//对于其他浏览器，使用onload事件判断载入是否成功
		//s.onload=s.onreadystatechange=function(){
		s.onload=s.onreadystatechange=function(){
		    //在此函数中this指针指的是s结点对象，而不是JsLoader实例,
		    //所以必须用self来调用onsuccess事件，下同。
		    if (this.readyState && this.readyState=="loading") return;
		    self.onsuccess();
		}
		s.onerror=function(){
			head.removeChild(s);
		    self.onfailure();
		}
	}
}


/**
 *	将背景图的横坐标从100%缓慢更改为0%，即实现了进度条的效果。
 *	@Deprecated 	这只是个模拟滚动
 **/
function progressRun(){
	var thisPosition = $("#progressBar").css("backgroundPosition");		//在ie中获得undefined
	var thisPositionX = 100;
	try{
		thisPositionX = parseInt(thisPosition.substring(0, thisPosition.indexOf("%")));
	}catch(e){}
	var timeoutId = window.setInterval(function(){
		thisPositionX -= 1;
		$("#progressBar").css("backgroundPosition", thisPositionX+"% 0%");
		if(thisPositionX<=0){
			window.clearTimeout(timeoutId);
		}
	},100);
}




/**
 *	判断浏览器类型
 **/
function getExplorerType() {
	var explorer = window.navigator.userAgent ;
	if (explorer.indexOf("MSIE") >= 0) {
		return "ie";
	}else if (explorer.indexOf("Firefox") >= 0) {
		return "firefox";
	}else if(explorer.indexOf("Chrome") >= 0){
		return "chrome";
	}else if(explorer.indexOf("Opera") >= 0){
		return "opera";
	}else if(explorer.indexOf("Safari") >= 0){
		return "safari";
	}
}

