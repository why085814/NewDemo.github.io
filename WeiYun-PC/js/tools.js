/*
 * $方法
 * @param v [string] 根据class写法，获取元素
 * 			[function] 作为window.onload使用
 * @param p [element] 从p中获取
 */
function $( v,p ) {
	
	var t = typeof v,
		s = '',
		doc = document;
		
	if( t === 'string' ) {
		
		s = v.charAt();
		
		p = p && $(p).length ? $(p)[0] : $(p);
		
		if( s === '#' ) {
			return doc.getElementById( v.substring(1) );
		}
		
		if( s === '.' ) {
			return getByClass( v.substring(1), p||doc );
		}
			
		if( s === '<' ) {
			return doc.createElement( v.slice(1,-1) );
		}
			
		return (p||doc).getElementsByTagName( v );
		
	}
	
	if( t === 'function' ) {
		window.onload = v;
	}
		
	return v;
	
}
function getByClass(s,p) {
	
	var aEles,
		arr,
		arr2,
		doc = document;
	
	if(doc.getElementsByClassName) {
		arr = (p||doc).getElementsByClassName(s);
		return arr.length == 1 ? arr[0] : arr;
	}
	
	aEles = (p||doc).getElementsByTagName('*');
	arr2 = [];
	
	for(var i=0; i<aEles.length; i++) {
		var aClass = aEles[i].className.split(' ');
		for(var j=0; j<aClass.length; j++) {
			if(aClass[j]===s)arr2.push(aEles[i]);	
		}	
	}
	
	return arr2;
}

/*
 * DOM操作
 * @param o [element] 作为子元素
 * @param p [element](可选) 作为父元素，若无p，则默认为document下操作
 */
function creat(o) {
	return document.createElement(o);
}

function append(o,p) {
	o = $(o).length ? $(o)[0] : $(o);
	p = $(p).length ? $(p)[0] : $(p);
	(p||document).appendChild(o);
}

function insert(o1,o2,p) {
	o1 = $(o1).length ? $(o1)[0] : $(o1);
	o2 = $(o2).length ? $(o2)[0] : $(o2);
	p = $(p).length ? $(p)[0] : $(p);
	(p||document).insertBefore(o1,o2);
}

function remove(o,p) {
	o = $(o).length ? $(o)[0] : $(o);
	(p||document).removeChild($(o));
}

//获取元素的boundtop
function getEleBoundTop(ele) {
	var t = ele.getBoundingClientRect().top;
	return t;
}
