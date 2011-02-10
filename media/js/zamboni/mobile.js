$(function() {
    $(window).bind("orientationchange", function(e) {
        $("details").htruncate({textEl: ".desc"});
    });
    $("details").htruncate({textEl: ".desc"});

    $('form.go').change(function() { this.submit(); })
        .find('button').hide();

    $('span.emaillink').each(function() {
        $(this).find('.i').remove();
        var em = $(this).text().split('').reverse().join('');
        $(this).prev('a').attr('href', 'mailto:' + em);
    });

    $("#sort-menu").delegate("select", "change", function() {
        $el = $(this).find("option[selected]");
        if ($el.attr("data-url")) {
            window.location = $el.attr("data-url");
        }
    });

    $(".carousel").each(function() {
        var $self = $(this),
            $strip = $("ul", $self),
            $prev = $(".prev", $self),
            $next = $(".next", $self),
            currentPos = 0,
            maxPos = $("li", $strip).length/2-1;
        function render(pos) {
            currentPos = Math.min(Math.max(0, pos), maxPos);
            $strip.css("left", currentPos * -100 + "%");
            $prev.toggleClass("disabled", currentPos == 0);
            $next.toggleClass("disabled", currentPos == maxPos);
        }
        $self.bind("swipeleft", function() {
            render(currentPos+1);
        }).bind("swiperight", function() {
            render(currentPos-1);
        });
        $next.click(_pd(function() {
            render(currentPos+1);
            $next.blur();
        }));
        $prev.click(_pd(function() {
            render(currentPos-1);
            $prev.blur();
        }));
        render(0);
    });

    $(".expando").each(function() {
        var $trigger = $(this),
            $managed = $($trigger.attr("href"));
        $managed.addClass("expando-managed");
        $trigger.click(_pd(function () {
            $managed.toggleClass("expand");
            if ($managed.hasClass("expand")) {
                $managed.css("height", $managed[0].scrollHeight);
            } else {
                $managed.css("height", 0);
            }
            $trigger.toggleClass("expand").blur();
        }));
    });

    $(".tabs").each(function() {
        var $strip=$(this),
            $managed = $("#"+$strip.attr("data-manages")),
            isManaged = $managed.length,
            isSlider = isManaged && $managed.hasClass("slider"),
            current = $strip.find(".selected a").attr("href");
        if (isManaged) {
            if (isSlider)
                $managed.css("height", $managed.find(current).outerHeight() + "px");
        } else {
            $managed = $(document.body);
        }
        $strip.delegate("a", "click", function(e) {
            e.preventDefault();
            var $tgt = $(this),
                href = $tgt.attr("href"),
                $pane = $managed.find(href);
            if (current != href && $pane.length && $pane.is(".tab-pane")) {
                current = href;
                $managed.find(".tab-pane").removeClass("selected");
                $pane.addClass("selected");
                $strip.find("li").removeClass("selected");
                $tgt.parent().addClass("selected");
                $tgt.blur();
                if (isManaged && isSlider && $pane.index() >= 0) {
                    $managed.css({
                        "left": ($pane.index() * -100) + "%",
                        height: $pane.outerHeight() + "px"
                    });
                }
            }
        });
    });
    
});

$(".desktop-link").attr("href", window.location).click(function() {
    document.cookie = "mamo=off";
    window.location.refresh();
});

$(".moz-menu .tab a").click(_pd(function() {
    $(".moz-menu").toggleClass("expand");
    this.blur();
}));

$("#sort-menu .label").click(_pd(function() {
    $("#sort-menu").toggleClass("expand");
    this.blur();
}));

function _pd(func) {
    return function(e) {
        e.preventDefault();
        func.apply(this, arguments);
    };
}
