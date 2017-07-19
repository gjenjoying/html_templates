/**************简单插件*******************/
/*tab切换*/
(function ($) {
  $.fn.zTab=function(options) {
   var dft={
      tabnav:'.tabnav',          //导航按钮元素
      tabcon:'.tabcon',          //被切换元素
      trigger:'mouseenter', //触发方式，默认点击触发
      curName:'current', //给高亮设置类名
      removeMod:null,     //改为触发时移除导航的类名
      cur:0,                //初始高亮的顺序，默认第一个
      delay:0,              //触发延时
      auto:null,           //是否自动改变
      animation:null,       //动画效果
      callback : null ,      //回调
      load:null,             //首次加载时执行
      cssmod: false
    };

    var ops=$.extend(dft,options);
    return this.each(function () {
      var self=$(this),      
      nav=self.find(ops.tabnav),
      con=self.find(ops.tabcon),
      navBtn=nav.children(),
      num=navBtn.length,
      timer=null,
      timer2=null,
      isInit=false;

      //初始化执行
      init();

      navBtn.on(ops.trigger,function () {
        ops.cur=$(this).index();
        clearTimeout(timer);
        clearTimeout(timer2);
        timer=setTimeout(run,ops.delay); 
        return false;
      });

      navBtn.on('mouseleave',function () {
        clearTimeout(timer);
        if (ops.auto) {
          timer2=setInterval(auto,ops.auto.interval);
        }
      });
      //
      function init () {
        ops.trigger=='c'?ops.trigger='click':ops.trigger='mouseenter'; //导航触发方式判定
        run();
        if (ops.auto) {
          timer2=setInterval(auto,ops.auto.interval);
        }
        else {
          run(); 
        }

        if(ops.load){
          ops.load(self,ops.cur,num);
        }
        
        isInit=true;        
      }
      //
      function run () {
        if (ops.removeMod) {
          navBtn.addClass(ops.curName).eq(ops.cur).removeClass(ops.curName); //
        }
        else {
          navBtn.removeClass(ops.curName).eq(ops.cur).addClass(ops.curName); //
        }
        
        if (ops.animation) {
         switch(ops.animation.type) {
            // 结构必须符合要求，目前还不完善
            case 'slideY':
            var conH=con.outerHeight();
            if (isInit) {
              con.parent().animate({marginTop:-conH*ops.cur},{duration:400,queue:false})
            }
            else {
              con.parent().height(conH*num);
            }
            break;
            case 'slideX' :
            var conW=con.outerWidth();
            if (isInit) {
              con.parent().animate({marginLeft:-conW*ops.cur},{duration:400,queue:false})
            }
            else {
              con.parent().width(conW*num);
            } 
            break;               
          }
        }
        else {
          if (ops.cssmod) {
            con.eq(ops.cur).addClass(ops.cssmod).siblings(ops.tabcon).removeClass(ops.cssmod); //
           }
           else {
            con.hide().eq(ops.cur).show(); //
           }
         } 
         if(ops.callback&&isInit){
          ops.callback(self,ops.cur,num);
        }
      }
      //
      function auto () {
        ops.cur+=1;
        if (ops.cur==num) {ops.cur=0;}
        run();
      }

    });
}   
})(jQuery); 

/*高亮自动切换*/
(function ($) {
   $.fn.autoHilight=function(options) {
    var dft={
        tarEle: '.item',
        curName:'current',
        delay:0,
        speed: 5000
    }
    var ops=$.extend(dft,options);
    return this.each(function () {
        var self=$(this),      
        item=self.find(ops.tarEle),
        cur=0,
        timer=null,
        timer2=null,
        num=item.length;

        run();
        auto ();

        item.on('mouseenter',function () {
            clearTimeout(timer);
            clearTimeout(timer2);
            cur=$(this).index();
            timer2=setTimeout(run,ops.delay);
            run();
        });
        item.on('mouseleave',function () {
            auto(); 
        });

        function run () {
            item.eq(cur).addClass(ops.curName).siblings().removeClass(ops.curName);
        }
        function auto () {
            timer=setInterval(function () {
                cur+=1;
                if (cur>=num) {
                    cur=0
                }
                run();
            },ops.speed);
        }
    });
}    
})(jQuery); 


function pageResponse(opt) {
    //getElementsByClassName
    function getElementsByClassName(cl) {
        if(document.getElementsByClassName){
            return  document.getElementsByClassName(cl)
        }
        else{    
            var ele = [],
                els =  document.getElementsByTagName("*"),
                i = els.length;
            cl = cl.replace(/\-/g, "\\-");
            var pa = new RegExp("(^|\\s)" + cl + "(\\s|$)");
            while(--i >= 0){
                if (pa.test(els[i].className)){
                    ele.push(els[i]);
                }
            }
            return ele;
        }
    }
    //模板
    function template(mode, obj, num){
        var s = obj.style; 
            s.width = pw + "px";
            s.height = ph + "px";
            s.webkitTransformOrigin = "left top 0";
            s.transformOrigin = "left top 0";
            s.webkitTransform = "scale(" + num + ")";
            s.transform = "scale(" + num + ")";
        if(mode == "auto"){
            document.body.style.height = ph * num + "px";// 兼容android2.3.5系统下body高度不自动刷新的bug
        }
        else if(mode == "contain" || mode == "cover"){
            s.position = "absolute";
            s.left = "50%";
            s.top = "50%";
            s.marginLeft = pw / -2 + "px";
            s.marginTop = ph / -2 + "px";
            s.webkitTransformOrigin = "center center 0px";
            s.transformOrigin = "center center 0px";
            document.body.style.msTouchAction = "none";// 阻止默认滑屏事件
           // document.ontouchmove = function(e){e.preventDefault()}
        }
    }
    var dw = document.documentElement.clientWidth,
        dh = document.documentElement.clientHeight,
        ds = dw / dh,// 设备宽高初始比例
        pw = opt.width || 320,
        ph = opt.height || 504,
        ps = pw / ph,// 页面宽高初始比例
        pd = getElementsByClassName(opt.class),
        sm = opt.mode || "auto",
        sn = (sm == "contain") ? (ds > ps ? dh / ph : dw / pw) : (sm == "cover") ? (ds < ps ? dh / ph : dw / pw) : dw / pw;// 页面缩放比例，默认模式为auto
    for(i = 0;i < pd.length;i++){
        template(sm, pd[i], sn);
    }
}
/**************全局调用*******************/
$(function () {
    /*全部导航触发效果*/
    $('.header-bar .trigger').on('click',function (e) {
        openSide();
        e.stopPropagation();
         $('body').on('click.sidenav',function () {
          closeSide();
          $('body').off('click.sidenav');
        });
    });

    $('.nav').on('click',function (e) {
      e.stopPropagation();
    })
    
  
   var ele=document.getElementsByTagName('body')[0];
    var mc = new Hammer(ele);
    mc.on('pan',function(e){
      if (e.deltaX<-120) {
        if ($('.imgzoom_pack').is(':visible')==false) {
          openSide();
        }
      }
      if (e.deltaX>120) {
        closeSide();
      }

    });
  
    function openSide () {
    	var win=window.innerWidth;
      $('.nav').addClass('on');
      $('html,body').addClass('holding');
      $('body').addClass('slide-left holding-right');
      $('.header-ctent').width(win);
    }
    function closeSide () {
     $('body').removeClass('slide-left');
     setTimeout(function () {
       $('.nav').removeClass('on');
       $('body').removeClass('holding-right');
       $('html,body').removeClass('holding');
       $('.header-ctent').removeAttr('style')
     },300);
   }

/*图片触摸弹出缩放层*/
if ($('.zoompic').length>0) {
$('<section class="imgzoom_pack">'+
            '<div class="imgzoom_x">X</div>'+
            '<div class="imgzoom_img"><img src="" /></div>'+
    '</section>').appendTo('body');
  ImagesZoom.init({
    "elem": ".zoompic"
  });
};

});