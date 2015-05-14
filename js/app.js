var router;

function app() {

    platformSpecific();

    var rendered_html = Mustache.to_html($('#templates .app-list').html(), {
        apps: apps
    });
    $('#app-list').html(rendered_html);
    $('body').on('click', '.btn-app-name', function(e) {
        console.log('btn-app-name')
        $(this).parent().toggleClass('open')
        e.preventDefault()
    });

    router = new Grapnel();
    router.get('', function(req) {
        $('section').hide();
        if($('#swipe-list').is(':empty')){
                    var rendered_html = Mustache.to_html($('#templates .swipe-list').html(), {
            apps: apps
        });
            $('#swipe-list,#swipe-list-2').html(rendered_html);
        $('#swipe-list,#swipe-list-2').slick({
            dots: false,
            arrows: false,
            infinite: false,
            mobileFirst: true,
            /*slidesToShow: 3,
            slidesToScroll: 3,*/
            adaptiveHeight: true,
            infinite: true,
            responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4
      }
    },
    {
      breakpoint: 320,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    }
  ]
        });
        }
        $('#app-list-page').show();
    });
router.get('/', function(req) {
        router.navigate('');
    })
    router.get('/apps/:name', function(req) {
        $('section').hide();
        $('#app-info-page').show();
        var appName = req.params.name;
        var findByName = $.grep(apps, function(e) {
            return e.name == appName;
        });
        var rendered_html = Mustache.to_html($('#templates .app-info').html(), {
            app: findByName[0]
        });
        $('#app-info-page').html(rendered_html);
        var req = 'app-info/' + findByName[0].name + '.html';
        $('.app-info-body').load(req, function() {
            console.log('did it')
            console.log(data)
        });
    });
}

var isMobile = {
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};

function platformSpecific() {
    if (isMobile.Android()) {
        for (i in apps) {
            if (apps[i]['link-download']) {
                apps[i]['link-download'] = apps[i]['link-download']['android'];
            }
        }
    } else if (isMobile.iOS()) {
        for (i in apps) {
            if (apps[i]['link-download']) {
                apps[i]['link-download'] = apps[i]['link-download']['ios'];
            }
        }
    } else {
        for (i in apps) {
            apps[i]['link-download'] = null;
        }
    }

    if (isMobile.any()) {
        for (i in apps) {
            if (typeof apps[i].link === 'object') {
                apps[i]['link'] = apps[i]['link']['mobile']
            }
        }
    } else {
        for (i in apps) {
            if (typeof apps[i].link === 'object') {
                apps[i]['link'] = apps[i]['link']['desktop']
            }
        }
    }
}
