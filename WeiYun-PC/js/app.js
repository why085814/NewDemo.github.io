//app下面的方法用来处理数据

//获取id
function getId() {
	
}

//获取当前pid
function getPid() {
	
}

//获取所有的父级 返回值为数组
function getParents(pidn) {
	var arr = [];
	for(var i = 0; i < datas.length; i++) {
		if(pidn == datas[i].id) {
			arr.push(datas[i]);
			return arr = arr.concat(getParents( datas[i].pid ));
		}
	}
	return arr;
}

//获取子元素
function getChildren(pid) {
	var arr = [];
	for(var i = 0; i < datas.length; i++) {
		if(pid == datas[i].pid) {
			arr.push(datas[i]);
		}
	}
	return arr;
}

//获取最大id，返回值为maxId
function getMaxId() {
	var maxId = 0;
	for(var i = 0; i < datas.length; i++) {
		if(datas[i].id > maxId) {
			maxId = datas[i].id;
		}
	}
	return maxId;
}

//获取id为指定id的数据对象，返回值为
function getData(id) {
	for(var i = 0; i < datas.length; i++) {
		if(datas[i].id === id) {
			return datas[i];
		}
	}
	console.log('找不到id为'+id+'的数据');
}

//处理时间
function getDataTime(data) {
	var d = data.creat_time;
	var str = d.getFullYear() + '-' + 
	(d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : ('0' + (d.getMonth() + 1))) + '-' + 
	(d.getDate() >= 10 ? d.getDate() : ('0' + (d.getDate()))) + ' ' + 
	(d.getHours() >= 10 ? d.getHours() : ('0' + (d.getHours()))) + ':' + 
	(d.getMinutes() >= 10 ? d.getMinutes() : ('0' + (d.getMinutes())));
	
	return str;
}
