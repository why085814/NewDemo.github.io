$(function () {
    //搜索栏

    //获取焦点时
    $('#search').on('focus', function () {
        $('.search-words').hide();
    })

    //失去焦点时
    $('#search').on('blur', function () {
        $('.search-words').show();
    })

    //左边栏显示
    $('#categoryList .category-item').on('mouseover', function () {
        this.className = 'category-item category-item-active';
    });
    $('#categoryList .category-item').on('mouseout', function () {
        this.className = 'category-item';
    });

    //banner 轮播
    var banDiv = $('.ui-wrapper');
    var banLeight = $('.ui-wrapper div').length;
    var banItem = $('.ui-wrapper .slide');
    var BanNum = 0;
    var timer = null;
    $('.prevBtn').on('click', function () {
        BanNum--;
        if (BanNum < 0) {
            BanNum = banLeight - 1;
        }
        move();
    });
    $('.nextBtn').on('click', autoPlay);

    //自动播放
    function autoPlay() {
        BanNum++;
        BanNum %= banLeight;
        move();
    }

    //当前图片状态 小点点
    var ui_span = $('.ui-pager-item a');
    for (var i = 0; i < ui_span.length; i++) {
        ui_span[i].index = i;
        ui_span[i].onclick = function () {
            //同步num与按钮的状态
            BanNum = this.index;
            move();
        }
    }

    timer = setInterval(autoPlay, 3000);

    //鼠标移入box的时候，关掉定时器
    $('.ui-wrapper').on('mouseover', function () {
        clearInterval(timer);
    });

    //鼠标移出box的时候，打开定时器
    $('.ui-wrapper').on('mouseout', function () {
        timer = setInterval(autoPlay, 3000);
    });

    //图片切换并更新状态
    function move() {
        //清空所有span的className
        for (var i = 0; i < ui_span.length; i++) {
            ui_span[i].className = 'ui-pager-link';
        }
        //给点击当前的span添加className
        ui_span[BanNum].className = 'ui-pager-link active';
        //隐藏 图片切换 显示
        for (var i = 0; i < banItem.length; i++) {
            banItem[i].className = 'slide';
        }
        banItem[BanNum].className = 'slide show';
    }

    //明星单品轮播
    newStarfn1();
    function newStarfn1() {
        //每次调用清楚定时器
        var timer1 = null;
        var timer2 = null;
        timer1 = setInterval(function () {
            $('.item-wraper-list').addClass('item-wraper-list-active');
            timer2 = setTimeout(function () {
                $('.item-wraper-list').removeClass('item-wraper-list-active');
            }, 5000);
        }, 8000);
    }

    //搭配hover效果
    //var match = document.querySelector('#match');
    //var brickList = match.getElementsByClassName('brick-list');
    //console.log(brickList.length)
    //var lis = brickList[0].getElementsByTagName('li');
    //console.log($('#match .brick-list li').length)
})