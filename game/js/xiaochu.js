//需求：
//1、点击开始游戏按钮，随机出现QQ表情往下掉；
//2、点击往下走的QQ表情，震动后，又随机从顶部出现QQ表情，在得分处分数加一；
//3、若表情掉出框，外框震动，失分处分数加一；
//4、失分达到限制后，弹出提示；
//5、小表情的掉下速度会越来越快。

window.onload = function(){
	//找到元素
	var btn = document.getElementById('btn');
	var view = document.getElementById('view');
	var add = document.getElementById('add');
	var law = document.getElementById('law');
	var look = document.getElementById('look');
	
	//定义一个布尔值变量存按钮的状态是否点击过
	var onOff = true;
	//给图片设置自定义属性记录状态是否能点
	look.onOff = true;
	//定义两个变量	up记录得分，down记录失分；
	var up = 0;
	var down = 0;
	//定义变量m	通过m自减来实现运动时间不断减小，增加运动速度的效果；
	var m = 14;
	
	//将图片地址存入数组
	var arrSrc = ['img/1.png','img/2.png','img/3.png','img/4.png','img/5.png',
	'img/6.png','img/7.png','img/8.png','img/9.png','img/10.png','img/11.png'];
	
	//判断按钮状态为未点击状态
	if(onOff){
		//设置onOff为false
		onOff = false;
		//点击开始游戏按钮
		btn.onclick = function(){
			//改变按钮的value为游戏中。。。
			this.value = '游戏中...';
			//调用change让小表情动起来
			change();
		}
	}
	//图片的点击事件，使用onmousedown
	
	look.onmousedown = function(){
		if(!look.onOff) return;
		this.onOff = false;
		//让变量up自增，记录点击成功的次数
		up++;
		//改变得分项的显示
		add.innerHTML = up;
		//判断得分超过限制
		if(up >= 10){
			//将条件置为初始值
			pro();
			look.onOff = true;
			//弹出提示
			alert('恭喜过关！！获得快枪手称号！！！');
		}else{
			this.src = 'img/qq.png';
			clearInterval(look['top']);
			shake(look,'left',20,function(){
				//得分没超限时，设置图片的top值为0
				look.style.top = 0;
				//调用函数
				change();
				look.onOff = true;
			});
		}
}
	
	//将条件重新设为初始值，以实现不断循环；
	function pro(){
		//设置图片高度为-24实现隐藏效果
		look.style.top = '-24px';
		//关掉定时器，停止递归
		clearInterval(look['top']);
		//设置按钮状态为false
		onOff = true;
		//设置按钮显示为开始游戏
		btn.value = '开始游戏';
		//将up和down变量置为初始值，并改变相应分数显示
		up = 0;
		add.innerHTML = up;
		down = 0;
		law.innerHTML = down;
		//设置变量m的值为最初值
		m = 14;
	}
	
	//使表情图片不断运动
	function change(){
		//使变量m自减
		m--;
		//生成0~10的随机整数
		var num = Math.round(Math.random()*10);
		//设置LOOK的SRC为随机
		look.src = arrSrc[num];
		//设置图片出现位置为随机
		look.style.left = num * 70 + 'px';
		//调用move函数，使表情图片动起来
		move(400,m * 300,30,look,'top','linear',function(){
			//当运动完毕，即图片运动到view框底部时，
			//设置图片高度为0，实现重复从顶部出现；
			look.style.top = 0;
			//让变量down自增，记录落到view框底部的数量
			down++;
			//设置失分项的显示
			law.innerHTML = down;
			//判断失分超出限制
			if(down >= 4){
				//条件重置为初始值
				pro();
				//弹出提示
				alert('失败了~~~再接再厉吧~！！~');
			}else{
				shake(view,'top',20);
				change();
			}
		})
	}
}
