$(function(){
	var canvasS=600;
	var row=15;
	var blocks=canvasS/row;
	$('#canvas').get(0).height=canvasS;
	$('#canvas').get(0).width=canvasS;
	var ctx = $('#canvas').get(0).getContext('2d');
	var starRadius=5;
	var drow=function(){
		var img = new Image();
		img.src = '1.jpg';
		img.onload = function(){
			ctx.clearRect(0,0,canvasS,canvasS);
			var ptrn = ctx.createPattern(img,'repeat');
			ctx.fillStyle = ptrn;
			ctx.fillRect(0,0,canvasS,canvasS);
			var jianju=blocks/2+0.5;
			var lineW=canvasS-blocks;
			ctx.save();
    	// 横向
    	ctx.translate(jianju,jianju);
    	ctx.beginPath();
    	for(var i=0;i<row;i++){
    		ctx.moveTo(0,0);
    		ctx.lineTo(lineW,0);
    		ctx.translate(0,blocks);
    	}
    	ctx.stroke();
    	ctx.closePath();
    	ctx.restore();
        // 纵向
        ctx.save();
        ctx.beginPath();
        ctx.translate(jianju,jianju);
        for(var i=0;i<row;i++){
        	ctx.moveTo(0,0);
        	ctx.lineTo(0,lineW);
        	ctx.translate(blocks,0);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        var poins=[3.5*blocks+0.5,11.5*blocks+0.5];
        for(var i=0;i<2;i++){
        	for(var j=0;j<2;j++){
        		ctx.save();
        		ctx.beginPath();
        		var x=poins[i];
        		var y=poins[j];
        		ctx.translate(Number(x),Number(y));
        		ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
        		ctx.fillStyle="#000";
        		ctx.fill();
        		ctx.closePath();
        		ctx.restore();
        	}
        }
        ctx.save();
        ctx.beginPath();
        ctx.translate(7.5*blocks+0.5,7.5*blocks+0.5);
        ctx.arc(0,0,starRadius,0,(Math.PI/180)*360);
        ctx.fillStyle="#000";
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
}

drow();
// 画棋子
drop=function(qizi){
	ctx.save();
	ctx.beginPath();
	ctx.translate((qizi.x+0.5)*blocks,(qizi.y+0.5)*blocks);
	ctx.arc(0,0,blocks/2*0.7,0,Math.PI/180*360);
	if(qizi.color===1){
		var st = ctx.createRadialGradient(5,-5,4,0,0,15);
		st.addColorStop(0,'#ccc');
		st.addColorStop(0.7,'black')
		st.addColorStop(1,'black');
		ctx.fillStyle=st;	
	}else{
		var rd = ctx.createRadialGradient(0,-5,2,0,0,15);
		rd.addColorStop(0.1,'#FFF');
		rd.addColorStop(0.35,'#F1F1F1');
		rd.addColorStop(0.5,'#E9E5E5');
		rd.addColorStop(0.7,'#E0DBE0');
		rd.addColorStop(1,'#C6C3C3');
		ctx.fillStyle = rd;
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 3;
		ctx.shadowColor = 'rgba(47,47,47,0.74)';
	}
	ctx.fill();
	ctx.closePath();
	ctx.restore();
}
 // 点击播放音乐
 var all={};
 var kaiguan=true;
 var step=0;
 $('#canvas').on('click',function(e){
 	var x=Math.floor(e.offsetX/blocks);
 	var y=Math.floor(e.offsetY/blocks);
 	step += 1;
 	if(all[x+'-'+y]){
 		return;
 	};
 	if(kaiguan){
 		var qizi={x:x,y:y,color:1,step:step};
 		all[x+'-'+y]=qizi;
 		drop(qizi);
 		if(panduan(qizi)){
 			$('.cartel').show();
 			$('.tips #tishi').text('黑赢');
 			return;
 		}
 		kaiguan=false;
 		$('#black_play').get(0).play();
 	}else{
 		var qizi={x:x,y:y,color:0,step:step};
 		all[x+'-'+y]=qizi;
 		drop(qizi);
 		if(panduan(qizi)){
 			$('.cartel').show();
 			$('.tips #tishi').text('白赢');
 			return;
 		}
 		
 		kaiguan=true;
 		$('#white_play').get(0).play();
 	}
 }) 

// 判断输赢

// 竖向判断
var panduan=function(qizi){
	var shuju={};
	$.each(all,function(k,v){
		if(v.color===qizi.color){
			shuju[k]=v;
		}
	})
	var shu=1,heng=1,zuoxie=1,youxie=1;

	var tx=qizi.x;
	var ty=qizi.y;
	while(shuju[tx+'-'+(ty+1)]){
		shu++;
		ty++;
	}
	var tx=qizi.x;
	var ty=qizi.y;
	while(shuju[tx+'-'+(ty-1)]){
		shu++;
		ty--;
	}

// 横向判断
var tx=qizi.x;
var ty=qizi.y;
while(shuju[(tx+1)+'-'+ty]){
	heng++;
	tx++;
}
var tx=qizi.x;
var ty=qizi.y;
while(shuju[(tx-1)+'-'+ty]){
	heng++;
	tx--;
}

    // 左斜判断
    var tx=qizi.x;
    var ty=qizi.y;
    while(shuju[(tx+1)+'-'+(ty+1)]){
    	zuoxie++;
    	tx++;
    	ty++;
    }
    var tx=qizi.x;
    var ty=qizi.y;
    while(shuju[(tx-1)+'-'+(ty-1)]){
    	zuoxie++;
    	tx--;
    	ty--;
    }
     // 右斜判断
     var tx=qizi.x;
     var ty=qizi.y;
     while(shuju[(tx+1)+'-'+(ty-1)]){
     	youxie++;
     	tx++;
     	ty--;
     }
     var tx=qizi.x;
     var ty=qizi.y;
     while(shuju[(tx-1)+'-'+(ty+1)]){
     	youxie++;
     	tx--;
     	ty++;
     }
     if(shu>=5||heng>=5||zuoxie>=5||youxie>=5){
     	return true;
     }
 }

 // 点击消失
 $('.cartel').on('click',function(){
 	 $(this).hide();
 })
 $('.tips').on('click',false);
 $('#close').on('click',function(){
 	$('.cartel').hide();
 })
 // 再来一局
 $('#restart').on('click',function(){
 	$('.cartel').hide();
 	ctx.clearRect(0,0,600,600);
 	drow();
 	kaiguan=true;
 	all={};
 	step=0;
 })
 // 生成棋谱
 $('#qipu').on('click',function(){
 	$('.cartel').hide();
 	$('#save').show();
     ctx.save();
     ctx.font="15px consolas";
     for(var i in all){
     	if(all[i].color===1){
     		ctx.fillStyle="#fff"
     	}else{
     		 ctx.fillStyle = '#000';
     	}
     	ctx.textAlign = 'center';
      	ctx.textBaseline = 'middle';
      	ctx.fillText(all[i].step,(all[i].x+0.5)*blocks,(all[i].y+0.5)*blocks);
     }
     // $('#canvas').off();
     ctx.restore();
     var image = $('#canvas').get(0).toDataURL('image/jpg',1);
      $('#save').attr('href',image);
      $('#save').attr('download','qipu.png');
 })
});




// $('#qipu').on('click',function(){
//     $('.cartel').hide();
//     $('#save').show();
//     ctx.save();
//     ctx.font = "20px consolas";
//     for( var i in all){
//       if( all[i].color === 1){
//         ctx.fillStyle = '#fff';
//       }else{
//         ctx.fillStyle = 'black';
//       }
//       ctx.textAlign = 'center';
//       ctx.textBaseline = 'middle';
//       ctx.fillText(all[i].step,
//         (all[i].x+0.5)*blockS,
//         (all[i].y+0.5)*blockS);
//       }
//       ctx.restore();
//       var image = $('#canvas').get(0).toDataURL('image/jpg',1);
//       $('#save').attr('href',image);
//       $('#save').attr('download','qipu.png');
//     })
