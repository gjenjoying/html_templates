//缓慢出现JS
(function($){

function scrollShowCell(o){
		if(!(o instanceof Object)) var o={};
		var delayTime = o.delayTime || 500,
			distance = o.distance || 100;
		return this.each(function(){
			var $this = $(this),
				offset_top = $(this).offset().top,
				cur_bottom = 0;
			$this.css({position:"relative",top:distance,opacity:0});
			function showAnimate(){
				$this.stop(false,false).animate({top:0,opacity:1},delayTime);
			}
			function hideAnimate(){
				$this.stop(false,false).animate({top:distance,opacity:0},delayTime);
			}
			function exec(){
				cur_bottom = $(window).scrollTop() + $(window).height();
				if(offset_top <= cur_bottom){
					showAnimate();
				}else{
					hideAnimate();
				}
			}
			exec();
			$(window).scroll(function(){
				exec();
			})
			
		})
		
	}
	$.fn.scrollShowCell = scrollShowCell;
// JavaScript Document
}(jQuery));


$(function(){
	$(".scrool-top").scrollShowCell({distance:150});
//	aside();
});