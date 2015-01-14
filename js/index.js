$(function(){
	//分享抽出
	var isOpen = false;
	$("#shareTab").click(function(){
		if(isOpen){
			$("#shareTab").animate({ left: "+400px"}, {duration: 500 });
			$("#shareIcons").animate({opacity:'toggle'}, { duration: 300 });
			isOpen = false;
		}else{
			$("#shareTab").animate({ left: "+200px"}, { duration: 500 });
			$("#shareIcons").animate({opacity: 'show'}, {duration: 300 });
			isOpen = true;
		}
	});
	
	//分享图标加亮
	$(".shareIcon").mouseover(function(){
		var thisPosition = $(this).css("backgroundPosition");
		if(thisPosition){
			var positionX = thisPosition.substring(0, thisPosition.indexOf("%"));
			$(this).css("backgroundPosition", positionX+"% 105%");
		}else{
			$(this).css("backgroundPositionY", "115%");
		}
	});
	$(".shareIcon").mouseout(function(){
		var thisPosition = $(this).css("backgroundPosition");		//在ie中将会失败
		if(thisPosition){
			var positionX = thisPosition.substring(0, thisPosition.indexOf("%"));
			$(this).css("backgroundPosition", positionX+"% 0%");
		}else{
			$(this).css("backgroundPositionY", "0%");
		}
	});
	
	//var a = document.getElementsByClassName("shareIcon");		js新增的类别选择器 
	//来来来，借过借过，啤酒饮料八宝粥，花生瓜子火腿肠了
	
	/*有关于电台列表的事件*/
	//弹出选择框事件
	var mhzPopBox = $("#mhzPopBox");
	$(".jumpingGif").bind("mouseenter", function(e){		//出发弹出图片并记录当前频道页面位置
		$(this).append(mhzPopBox);
		mhzPopBox.show(200);
	});
	$("#mhzPopBox").bind("mouseleave", function(e){		//出发弹出图片并记录当前频道页面位置
		$("#mhzPopBox").hide();
	});
	$(".popBox").click(function(e){
		e.stopPropagation();	//阻止事件冒泡至mhz块
	});
	//用户弹出框
	var userPopBox = $("#userPopBox");
	$(".userInfo:first").bind("mouseenter", function(e){
		$(this).append(userPopBox);
		userPopBox.fadeIn(200);
	});
	$("#userPopBox").bind("mouseleave", function(e){
		$("#userPopBox").hide();
	});
	
	
	//点击换台事件
	var selectedColor = $(".mhz:first").css("backgroundColor");
	var commonColor = $(".mhz:eq(1)").css("backgroundColor");
	$(".mhz").click(function(){
	
		window.frames['radioFrame'].location.reload()
	
		//更换跳跃图标
		var jumpingGif = $("#jumpingGif").clone();
		$("#jumpingGif").remove();
		$(this).find(".jumpingGif").eq(0).append(jumpingGif);
		//更换背景颜色
		$(".mhz:not(:first)").css("backgroundColor", commonColor);
		$(this).css("backgroundColor", selectedColor);
	});
	
	
	
	
	
	/*阻止空格原有事件*/
	document.onkeypress = function(e){
		var keyC = null;
		try{
			keyC = e.keyCode;				//这一步ie会错，ff一直是0
		}catch(ee){
			keyC = window.event.keyCode;	//ie这样可以取到正确的值
		}
		if(0 == keyC){	//适用于ff
			keyC = arguments[0].which;
		}
 		if(32 == keyC){
			return false;				//适用于ie和ff
 			//e.returnValue=false;		//这一步ie会错，ff无效
		}
	};
});






/*获得页面元素纵向绝对位置*/
function getElementTop(element){
	var actualTop = element.offsetTop;
	var current = element.offsetParent;
	while (current !== null){
		actualTop += current.offsetTop;
		current = current.offsetParent;
	}
	return actualTop;
}
/*获得页面元素横向绝对位置*/
function getElementLeft(element){
	var actualLeft = element.offsetLeft;
	var current = element.offsetParent;
	while (current !== null){
		actualLeft += current.offsetLeft;
		current = current.offsetParent;
	}
	return actualLeft;
}