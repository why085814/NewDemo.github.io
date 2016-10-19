"use strict";
$(function(){
	var fileWarp = $('#file-warp'),
		checkAllBtn = $('.checkall-btn'),
		as = $('a'),
		weiyunBtn = $('.weiyun-btn'),
		breadcrumb = $('.breadcrumb'),
		newfileBtn = $('.newfile-btn'),
		movetoBtn = $('.moveto-btn'),
		moveMsg = $('#move-msg'),
		moveMsgInfo = $('.msg-info', moveMsg),
		deleteBtn = $('.delete-btn'),
		deleteMsg = $('#delete-msg'),
		moveMsg = $('#move-msg'),
		newFoldering = $('#newfoldering'),
		fileName = $('.file-name-in'),
		reNameBtn = $('.rename-btn'),
		reNameIn = $('.rename-in'),
		howShowBtn = $('.howshow-btn'),
		treeBtn = $('.tree-btn'),
		treeMenu = $('.tree-menu'),
		warpR = $('.warp-r'),
		dragImg = $('.dragimg'),
		ques = $('.ques'),
		contextMenu = $('.contextmenu'),
		selectBox = $('.selectbox');
/*
 * 初始化
 */
	var elements = [],	//用于存放当前页面的文件元素
		pidn = 0,	//当前文件夹的id
		fileWarpClass;	//当前文件显示模式
	render(0);
	
/*
 * 绑定事件
 */
	//点击howshow按钮，切换显示模式
	howShowBtn.onclick = function(e) {
		if(fileWarpClass != "file-warp-list") {
			fileWarpClass = "file-warp-list";
		}else {
			fileWarpClass = "file-warp";
		}
		fileWarp.className = fileWarpClass;
		render(pidn);
		e.cancelBubble = true;
	}
	
	//点击treebtn按钮，显示树状菜单
	treeBtn.onclick = function(e) {
		if(warpR.className == 'warp-r') {
			treeMenu.className = 'tree-menu-show';
			warpR.className = 'warp-r-ml';
			showTreeMenu();
		}else {
			treeMenu.className = 'tree-menu';
			warpR.className = 'warp-r';
		}
		e.cancelBubble = true;
	}
	
	//checkAllBtn点击全选按钮，选中全部文件
	checkAllBtn.onclick = function(e) {
		setAllStatus(!checkAllBtn.checked);
		e.cancelBubble = true;
	}
	
	//拖拽选择
	document.body.addEventListener('mousedown', function(e) {
		//获取到鼠标按下时的位置
		var bX = e.clientX,
			bY = e.clientY,
			disX,disY;
			
		document.body.onmousemove = function(e) {
			//获取当前鼠标位置
			var nX = e.clientX,
				nY = e.clientY;
			disX = nX - bX,
			disY = nY - bY;
			//显示扩选框&&设置其位置和大小
			selectBox.style.display = 'block';
			selectBox.style.left =  (disX >= 0 ? bX : nX) + 'px';
			selectBox.style.top =  (disY >= 0 ? bY : nY) + 'px';
			selectBox.style.width = Math.abs(disX) + 'px';
			selectBox.style.height = Math.abs(disY) + 'px';
			//碰撞检测
			for (var i = 0; i < elements.length; i++) {
				//获取boxs[i]的盒模型信息
				var oW = elements[i].offsetWidth,
					oH = elements[i].offsetHeight,
					oT = elements[i].getBoundingClientRect().top,
					oL = elements[i].getBoundingClientRect().left,
					sT = selectBox.getBoundingClientRect().top,
					sL = selectBox.getBoundingClientRect().left;
				//九宫格碰撞检测方法
				if( sL + Math.abs(disX) < oL || sL > oL + oW || sT + Math.abs(disY) < oT || sT > oT + oH ) {
					if( !e.ctrlKey ) {
						setStatus( elements[i], false );
					}
				}else {
					setStatus( elements[i], true );
				}
			}		
			setStatus( checkAllBtn, isAllChecked(), 'checkall-btn' );
			
			//阻止默认行为
			e.preventDefault();
			return false;
		}
		
		document.body.onmouseup = function(e) {
			selectBox.style.display = 'none';
			document.body.onmousemove = null;
		}
	});
	
	//点击新建文件夹按钮，创建文件夹
	newfileBtn.onclick = function(e) {
		if(!newfileBtn.clicked) {
			
			newfileBtn.clicked = true;
		
			//取消事件冒泡 && 拖拽
			newFoldering.addEventListener('click', function(e) {
				e.cancelBubble = true;
			});
			
			if(fileWarp.innerHTML != '') {
				insert(newFoldering, fileWarp.firstChild, fileWarp);
			}else {
				append(newFoldering, fileWarp);
			}
			
			newFoldering.style.display = 'block';
			
			document.onclick = function() {
				newFoldering.removeAttribute('autofocus');
				remove(newFoldering, fileWarp);
				newfileBtn.clicked = false;
				document.onclick = null;
			}
			
			e.cancelBubble = true;
			return false;
		}else {
			newfileBtn.clicked = false;
		}
		
	}
	//输入名字后，回车确定名字
	fileName.onkeydown = function(e) {
		if(e.keyCode == 13) {
			var val = fileName.value;
			if(val != '') {
				var newData = {
					id: getMaxId() + 1,
					pid: pidn,
					name: val,
					type: 'folder',
					creat_time: new Date
				}
				fileName.value = '';
				remove(newFoldering, fileWarp);
				datas.push(newData);
				render(pidn);
				showTreeMenu();
				showControlMsg('成功创建文件夹', true);
			}
			
			newfileBtn.clicked = false;
			document.onclick = null;
		}
	}
	
	//点击移动到按钮，选中的文件移动到指定
	movetoBtn.onclick = function(e) {
		
		moveMsgInfo.innerHTML = '';
		append(creatTree(-1, true), moveMsgInfo);
//		freshTreeItem(pidn);
		var len = getChecked().length;
		if(len != 0) {
			showMsgBg(moveMsg, function() {
				
				render(pidn);
//				showTreeMenu(true);
				showControlMsg('移动成功', true);
			});
		}else {
			showControlMsg('请选择文件', false);
		}
		
		e.cancelBubble = true;
	}
	
	//点击删除按钮，删除选中的文件
	deleteBtn.onclick = function(e) {
		var len = getChecked().length;
		if(len != 0) {
			ques.innerHTML = (len == 1) ? '确定要删除这个文件吗？' : '确定要删除这些文件吗？';
			showMsgBg(deleteMsg, function() {
				for(var i = 0; i < len; i++) {
					//所有被选中的文件，pid改为-10，即放入垃圾箱中
					var theId = getChecked()[i].dataId;
					getData(theId).oldPid = getData(theId).pid;
					getData(theId).pid = -10;
				}
				render(pidn);
				showTreeMenu();
				showControlMsg('删除成功', true);
			});
		}else {
			showControlMsg('请选择文件', false);
		}
		e.cancelBubble = true;
	}
	
	//点击重命名按钮，重命名
	reNameBtn.onclick = function(e) {
		var len = getChecked().length;
		if(len == 0) {
			showControlMsg('请选择文件', false);
		}else if(len == 1){
			var afile = $('.file', getChecked()[0]),
				fileName = $('.file-name', afile);
				
			append(reNameIn, afile);
			reNameIn.value = fileName.innerHTML;
			reNameIn.style.display = 'block';
			
			//输入名字后，回车确定
			reNameIn.onkeydown = function(e) {
				if(e.keyCode == 13) {
					var val = reNameIn.value;
					
					if(val != '') {
						fileName.innerHTML = val;
						getData(getChecked()[0].dataId).name = val;
					}
					remove(reNameIn, afile);
					setStatus( getChecked()[0], false );
					
					newfileBtn.clicked = false;
					document.onclick = null;
					
					showControlMsg('重命名成功', true);
				}
			}
			
			document.onclick = function(){
				var val = reNameIn.value;
				if(val != '') {
					fileName.innerHTML = val;
					getData(getChecked()[0].dataId).name = val;
				}
				remove(reNameIn, afile);
				setStatus( getChecked()[0], false );
				document.onclick = null;
			}
			
			reNameIn.onmousedown = function(e) {
				e.cancelBubble = true;
			}
			reNameIn.onclick = function(e) {
				e.cancelBubble = true;
			}
			
		}else if(len > 1){
			showControlMsg('只能对单个文件重命名', false);
		}
		
		e.cancelBubble = true;
	}
	
	//自定义右键菜单
	document.oncontextmenu = function() {
		return false;
	}
	
/*
 * 渲染数据
 */
	/* 创建文件
	 * @param data [obj] 传入的数据对象
	 * @return 创建的文件夹元素
	 */
	function CreatFile(data) {
		//创建的文件夹，占位置，存储状态等
		
		var fileBack = creat('div');
		fileBack.className = "file-back";
		fileBack.dataId = data.id;
		fileBack.dataPid = data.pid;
		fileBack.dataName = data.name;
		fileBack.dataType = data.type;
		fileBack.dataTime = data.creat_time;
		
		//取消事件冒泡 && 拖拽
		fileBack.addEventListener('mousedown', function(e) {
			e.cancelBubble = true;
		});
		//添加hover事件
		fileBack.onmouseover = function() {
			if( !this.checked ) {
				this.className = 'file-back hover';
			}
		}
		fileBack.onmouseout = function() {
			if( !this.checked ) {
				this.className = 'file-back';
			}
		}
		
		//文件上的鼠标事件，拖拽等
		fileBack.onmousedown = function(e) {
			var bX = e.clientX,
				bY = e.clientY,
				disX = 0, disY = 0;
			
			document.onmousemove = function(e) {
				var nX = e.clientX,
					nY = e.clientY;
				disX = nX - bX;
				disY = nY - bY;
					
				setStatus( fileBack, true );
				setStatus( checkAllBtn, isAllChecked(), 'checkall-btn' );
				
				
				if(dragImg.style.display != 'block') {
					var len = getChecked().length;
					(len > 5) && (len = 5);
					for (var i = 0; i < len; i++) {
						var dragico = creat('div');
						dragico.className = 'dragico';
						dragico.style.backgroundPosition = getBackImg(getChecked()[i].dataType, true);
						dragico.style.zIndex = len - i;
						dragico.style.top = i * 5 + 'px';
						dragico.style.left = i * 5 + 'px';
						append(dragico, dragImg);
					}
				}
				dragImg.style.top = nY + 20 + 'px';
				dragImg.style.left = nX + 15 + 'px';
				dragImg.style.display = 'block';
				
				return false;
			}
			
			document.onmouseup = function(e) {
				if(disX != 0 && disY != 0) {
					//拖拽
					var parentEle = e.target.parentElement;
					for (var i = 0, len = elements.length; i < len; i++) {
						if(elements[i].className == 'file-back hover' 
								&& elements[i].dataType == 'folder'
								&& elements[i].checked != true)
						{
							var index = i;
							for (var i = 0, len = getChecked().length; i < len; i++) {
								getData( getChecked()[i].dataId ).pid = elements[index].dataId;
							}
							render(pidn);
							showTreeMenu();
						}
					}
				}
				
				dragImg.style.display = 'none';
				dragImg.innerHTML = '';
				document.onmousemove = null;
				document.onmouseup = null;
			}
			
			//右键菜单
			fileBack.oncontextmenu = function(e) {
				
				//选中此文件夹
				setStatus( fileBack, true );
				setStatus( checkAllBtn, isAllChecked(), 'checkall-btn' );
				contextMenu.style.left = e.clientX + 5 + 'px';
				contextMenu.style.top = e.clientY + 5 + 'px';
				setTimeout(function(){
					contextMenu.className = 'contextmenu show';
				},100)
				
				contextMenu.onclick = function(e) {
					
					if( e.target == $('li', contextMenu)[0] ) {
						//打开
						if( isMove ) return;
						
						pidn = fileBack.fileid;
						render(pidn);
						showBreadcrumb(pidn);
						
					}if( e.target == $('li', contextMenu)[1] ) {
						//删除
						if( isReName ) return;
						
						if(getChecked().length){
							for (var i = 0; i < getChecked().length; i++) {
								datas[getChecked()[i].fileid - 1].pid = -1;
							}
						}else {
							fileBack.pid = -1;
						}
						render(pidn);
						
					}if( e.target == $('li', contextMenu)[2] ) {
						//重命名
						if( isReName ) return;
						
						setStatus( fileBack, true );
						
						if(getChecked().length != 1) return;
						
						reNameFun();
					}
					
				}
				
				document.onclick = function() {
				contextMenu.className = 'contextmenu';
				}
				
				e.cancelBubble = true;
				return false;
			}
			return false;
		}
		
		
		//点击进入文件夹
		//点击文件
		fileBack.onclick = function(e) {
			switch(fileBack.dataType) {
				//若是文件夹，则进入该文件夹
				case 'folder': 
					render(fileBack.dataId);
					showTreeMenu();
					break;
					
				//若不是文件夹，则提示文件类型
				default:
					console.log('这是一个' + fileBack.dataType + '格式的文件');
					showControlMsg('这是一个 ' + fileBack.dataType + ' 格式的文件', false);
					break;
			}
			e.cancelBubble = true;
			return false;
		}
		
		
		var files = creat('div');
		files.className = 'file';
		files.style.backgroundPosition = getBackImg(fileBack.dataType, (fileWarpClass == "file-warp-list"));
		
		var checkBox = creat('i');
		
		checkBox.onclick = function(e) {
			e.cancelBubble = true;
		}
		checkBox.onmousedown = function(e) {
			checkBox.onmouseup = function(e) {
				//改变该文件的选中状态
				setStatus( fileBack, !fileBack.checked );
				//判断是否全选，并给全选按钮设置状态
				setStatus( checkAllBtn, isAllChecked(), 'checkall-btn' );
				
				e.cancelBubble = true;
			}
			
			e.cancelBubble = true;
		}
		
		var fileName = creat('span');
		fileName.className = 'file-name';
		fileName.innerHTML = data.name;
		
		if(fileWarpClass == 'file-warp-list') {
			var fileTime = creat('span');
			fileTime.className = 'file-time';
			fileTime.innerHTML = getDataTime(data);
			append(fileTime, fileBack);
		}
		
		append(checkBox, files);
		append(fileName, files);
		append(files, fileBack);
		
		return fileBack;
	}
	
	/*
	 * 渲染指定数据到浏览器
	 */
	function render(pid) {
		//保证页面渲染的pid和当前pidn一致
		pidn = pid;
		//清空页面和elements和全选按钮
		fileWarp.innerHTML = '';
		elements = [];
		setStatus( checkAllBtn, false, 'checkall-btn' );
		showBreadcrumb(pid);
		
		for (var i = 0, len = datas.length; i < len; i++) {
			//传入pid为当前页面id的数据对象
			if(datas[i].pid == pid) {
				//根据传入数据创建文件
				var thisFile = CreatFile(datas[i]);
				elements.push( thisFile );
				//渲染到页面当中
				append(thisFile, fileWarp);
			}
		}
		
		//树状菜单的刷新渲染
		freshTreeItem(pidn);
	}
	
	/*
	 * 改变某个文件夹的状态
	 * @param fileElement [element object] 要设置状态的元素
	 * @param status [boolaen] 表示状态，true为已经选中，false为未选中
	 * @param classname [string] 设置选中与否的class
	 */
	function setStatus( fileElement, status, classname ) {
		var oldClassname = classname || 'file-back';
		fileElement.checked = status;
		fileElement.className = status ? oldClassname + ' checked' : oldClassname;
	}
	
	/*
	 * 改变所有文件夹和全选按钮的状态
	 * @param isCheck [boolean] 要设置的状态
	 */
	function setAllStatus(isCheck) {
		//给所有文件改变选中状态
		for (var i = 0, len = elements.length; i < len; i++) {
			setStatus( elements[i], isCheck  );
		}
		//改变全选按钮自己的状态
		setStatus( checkAllBtn, isCheck, 'checkall-btn' );
	}
	
	/*
	 * 显示面包屑导航
	 * @param pidn [number] 当前页面文件所在文件夹的id，也就是父级id
	 */
	function showBreadcrumb(pidn) {
		if( pidn ) {
			//清空导航内容
			breadcrumb.innerHTML = '';
			//获取到当前页面的所有父级元素 数组
			var parents = getParents(pidn);
			//通过遍历父级元素，生成面包屑导航
				//这里用了let，块作用域，ES6的写法
			for (let i = parents.length - 1; i >= 0 ; i--) {
				var bread = creat('a');
				bread.href = 'javascript:;';
				bread.innerHTML = parents[i].name;
				parents[i].id;
				
				//点击该面包屑导航按钮，跳转到该按钮文件夹下面
				bread.onclick = function() {
					render(parents[i].id);
				}
				
				//传入数据
				append(bread, breadcrumb);
			}
		}else {
			breadcrumb.innerHTML = '';
		}
	}
	
	/*
	 * 显示提示框
	 */
	function showMsgBg(whichMsg, callback) {
		
		var msgBg = $('.msg-bg'),
			closeBtn = $('.close-btn', whichMsg),
			okBtn = $('.ok-btn', whichMsg),
			cancleBtn = $('.cancle-btn', whichMsg),
			hideMsg = function() {
				msgBg.style.display = 'none';
				whichMsg.style.display = 'none';
			};
		
		msgBg.onmousedown = function(e) {
			e.cancelBubble = true;
		}
		
		closeBtn.onclick = cancleBtn.onclick = hideMsg;
		
		okBtn.onclick = function() {
			if(typeof callback == 'function') {
				callback();
				hideMsg();
			}
		}
		
		msgBg.style.display = 'block';
		whichMsg.style.display = 'block';
		
	}
	
	/*
	 * 显示顶部操作提示框
	 */
	function showControlMsg(info, boolean) {
		
		var controlMsg = $('.control-msg'),
			controlIco = $('.control-ico'),
			controlInfo = $('.control-info'),
			controlMsgHeight = controlMsg.clientHeight,
			timer = null;
		
		controlIco.style.backgroundPosition = boolean ? '-1px -41px' : '-1px -81px';
		controlInfo.innerHTML = info;
		
		//显示顶部操作提示框	
		controlMsg.style.top = 0;
		//隐藏顶部操作提示框		
		timer = setTimeout(function(){
			controlMsg.style.top = - controlMsgHeight + 'px';
		},2000);
	}
	
	/*
	 * 树状菜单
	 * @param isMsgBg [boolean] 是否用于提示框，若是用于提示框，则点击文件夹，不渲染页面
	 */
//	append(showTreeMenu(0, 0), treeMenu);
	function showTreeMenu() {
		treeMenu.innerHTML = '';
		append(creatTree(-1), treeMenu);
		
//		creatTree(-1);
		freshTreeItem(pidn);
	}

	function creatTree(pids, isMsgBg) {
		var topList = creat('div');
		for (var i = 0, len = datas.length; i < len; i++) {
			
			if(datas[i].pid == pids && datas[i].type == 'folder') {
				
				let list = creat('div');
				list.dataId = datas[i].id;
				list.dataPid = datas[i].pid;
				list.className = 'treeitem';
				list.style.marginLeft = 10 + 'px';
				let listHead = creat('header');
				let listHeadIco = creat('i');
				listHead.innerHTML = datas[i].name;
				append(listHeadIco, listHead);
				let listBody = creat('div');
				listBody.className = 'listContent';
				
				listHeadIco.onclick = function(e) {
					if(getChildren(list.dataId).length != 0) {
					
						if(!listHead.isClick) {
							listBody.className = 'listContent show';
							listHeadIco.className = 'opened-icon';
							listHead.isClick = true;
						}else {
							listBody.className = 'listContent';
							listHeadIco.className = 'closed-icon';
							listHead.isClick = false;
						}
					}
					e.cancelBubble = true;
				}
				
				listHead.onclick = function() {
					if(!isMsgBg) {
						render(list.dataId);
					}else {
						for (let k = 0; k < getChecked().length; k++) {
							//获取到被选中的数据，更改其pid为this.dataId
							var treeItem = $('.treeitem');
							for (var p = 0; p < treeItem.length; p++) {
								treeItem[p].className = 'treeitem';
							}
							list.className = 'treeitem checked';
							if( getData( getChecked()[k].dataId ).id == list.dataId ){
								showControlMsg('无法将文件放在此目录下', false);
								$('.ok-btn', moveMsg).style.display = 'none';
							}else {
								getData( getChecked()[k].dataId ).pid = list.dataId;
								$('.ok-btn', moveMsg).style.display = 'block';
							}
						}
					}
				}
				
				
				append(listHead, list);
				append(listBody, list);
				
				if(getChildren(list.dataId).length != 0) {
					listHeadIco.className = 'closed-icon';
					append(creatTree(list.dataId, isMsgBg), listBody);
				}
				
				//如果文件夹是当前页面的父级祖级，那么打开此文件夹
				for (var j = 0; j < getParents(pidn).length; j++) {
					if(getParents(pidn)[j].id == list.dataId) {
						if(getChildren(list.dataId).length != 0) {
							listBody.className = 'listContent show';
							listHeadIco.className = 'opened-icon';
						}
						listHead.isClick = false;
					}
				}

				append(list, topList);
			}
		}
		return topList;
	}
	
	//树状菜单的刷新渲染
	function freshTreeItem(pidn) {
		var treeItem = $('.treeitem');
		for (var i = 0, len = treeItem.length; i < len; i++) {
			//树状菜单的选中
			if(treeItem[i].dataId == pidn) {
				treeItem[i].className = 'treeitem checked';
			}else {
				treeItem[i].className = 'treeitem';
			}
		}
	}
	
	
	
	
	/*
	 * 获取数据
	 */
	
	//判断是否全选
	function isAllChecked() {
		var len = elements.length;
		if(len == 0) {
			return false;
		}
		for (var i = 0; i < len; i++) {
			if(!elements[i].checked) {
				return false;
			}
		}
		return true;
	}
	
	/*
	 * 获取数据
	 * 获取选中的文件
	 * @return [arr] 被选中文件的数组
	 */
	function getChecked() {
		var arr = [];
		for (var i = 0, len = elements.length; i < len; i++) {
			elements[i].checked && arr.push( elements[i] );
		}
		return arr;
	}
	
	/*
	 * 判断元素一是否为参数二或参数二的子元素
	 * @param ele1 [element] 元素一
	 * @param ele2 [element] 元素二
	 * return boolean
	 */
	function isChildren(ele1, ele2) {
		
	}
	
	
	
	
	
	
	
	/*
	 * 通过文件type判断文件icon图
	 * @param type [string] 文件类型
	 * @param isSmallIco [boolean] 文件类型
	 */
	function getBackImg(type, isSmallIco) {
		var Position, PositionSmall;
		switch (type){
			case 'folder':
				Position = '27px 8px';
				PositionSmall = '0 0';
				break;
			case 'pdf':
				Position = '27px -217px';
				PositionSmall = '0 -163px';
				break;
			case 'jpg':
				Position = '27px -331px';
				PositionSmall = '0 -245px';
				break;
			case 'avi':
				Position = '27px -445px';
				PositionSmall = '0 -328px';
				break;
			case 'mp3':
				Position = '27px -673px';
				PositionSmall = '0 -491px';
				break;
			case 'zip':
				Position = '27px -1129px';
				PositionSmall = '0 -819px';
				break;
			default:
				break;
		}
		return isSmallIco ? PositionSmall : Position;
	}





});