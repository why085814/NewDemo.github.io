window.onload = function(){
	//找到元素
	var btn = $('#btn');	//开始按钮
	var view = $('#view');	//可视框
	var look = $('#look');	//表情图
	var add = $('#add');	//得分项
	var law = $('#law');	//失分项
	
	//定义变量记录开始按钮的状态
	var onOff = true;
	//定义变量记录图片的状态
	look.onOff = true;
	//定义变量lose记录失分
	var lose = 0;
	//定义变量win记录得分
	var win = 0;
	//定义变量speed	通过他的递减来控制图片下降速度越来越快
	var speed = 5000;
	
	//点击开始按钮
	btn.onclick = function(){
		//判断按钮的状态为以点击，则不执行后面代码
		if(!onOff) return;
		//设置按钮状态为不能点击
		onOff = false;
		//设置按钮显示为游戏中
		this.value = '游戏中...';
		//调用函数
		moveLook();
	}
	//点击图片
	look.onmousedown = function(){
		//当图片为点击过，则不执行后面的代码
		if(!look.onOff) return;
		//设置look.onOff值为false 不能再点击
		look.onOff = false;
		//改变图片的src
		look.src = 'img/qq.png';
		//点中时，图片停止运动,关闭使他运动的定时器
		clearInterval(look['top']);
		//图片震动,震动完成后调用函数
		//让win自增
		win++;
		//设置得分项的值
		add.innerHTML = win;
		//判断win的值超出
		if(win >= 10){
			alert('恭喜通关！获得快枪手称号！！！');
			pro();
		}else{
			shake(look,'left',20,function(){
				//将图片的top值置为最顶部
				look.style.top = '-24px';
				//调用自己，实现重复运动
				moveLook();
				//振动完成后设置图片状态为可点击
				look.onOff = true;
			})
		}
	}
	
	function moveLook(){
		//生成一个随机数 0~776
		var m = Math.round(Math.random() * 776);
		//设置图片出现的位置为随机
		look.style.left = m + 'px';
		//生成一个随机数 1~11
		var n = Math.round(Math.random() * 10 + 1);
		//设置图片出现的位置为随机
		look.src = 'img/'+ n +'.png';
		//让SPEED自减，控制速度
		speed -= 400
		//判断speed的值，控制最小为1000；
		if(speed <= 1000){
			speed = 1000;
		}
		//调用move函数使图片动起来
		move(400,speed,30,look,'top','linear',function(){
			//让lose自增
			lose++;
			//设置失分项的显示
			law.innerHTML = lose;
			//判断失分超出
			if(lose >= 10){
				pro();
				alert('失败了~~~再接再厉吧~~！！！')
			}else{
				//将图片的top值置为最顶部
				look.style.top = '-24px';
				//运动到最底部，可视框震动,震动完成后调用自己
				shake(view,'top',20,function(){
					//调用自己，实现重复运动
					moveLook();
				})
			}
		})
	}
	
	//设置初始值
	function pro(){
		//将图片的top值置为最顶部
		look.style.top = '-24px';
		//重置lose
		lose = 0;
		//设置失分项的显示
		law.innerHTML = lose;
		//重置win
		win = 0;
		//设置得分项的值
		add.innerHTML = win;
		//设置图片状态为可点击
		look.onOff = true;
		//设置按钮状态为可点击
		onOff = true;
		//设置按钮显示为开始游戏
		btn.value = '开始游戏';
		//设置SPEED为最初值
		speed = 5000;
	}
}
