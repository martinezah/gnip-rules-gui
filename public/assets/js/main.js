/*
	Prologue by Pixelarity
	pixelarity.com @pixelarity
	License: pixelarity.com/license
*/

(function($) {

	skel.breakpoints({
		wide: '(min-width: 961px) and (max-width: 1880px)',
		normal: '(min-width: 961px) and (max-width: 1620px)',
		narrow: '(min-width: 961px) and (max-width: 1320px)',
		narrower: '(max-width: 960px)',
		mobile: '(max-width: 736px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on mobile.
			skel.on('+mobile -mobile', function() {
				$.prioritize(
					'.important\\28 mobile\\29',
					skel.breakpoint('mobile').active
				);
			});

		// Scrolly links.
			$('.scrolly').scrolly();

		// Nav.
			var $nav_a = $('#nav a');

			// Scrolly-fy links.
				$nav_a
					.scrolly()
					.on('click', function(e) {

						var t = $(this),
							href = t.attr('href');

						if (href[0] != '#')
							return;

						e.preventDefault();

						// Clear active and lock scrollzer until scrolling has stopped
							$nav_a
								.removeClass('active')
								.addClass('scrollzer-locked');

						// Set this link to active
							t.addClass('active');

					});

			// Initialize scrollzer.
				var ids = [];

				$nav_a.each(function() {

					var href = $(this).attr('href');

					if (href[0] != '#')
						return;

					ids.push(href.substring(1));

				});

				//$.scrollzer(ids, { pad: 200, lastHack: true });

		// Header (narrower + mobile).

			// Toggle.
				$(
					'<div id="headerToggle">' +
						'<a href="#header" class="toggle"></a>' +
					'</div>'
				)
					.appendTo($body);

			// Header.
				$('#header')
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'header-visible'
					});

			// Fix: Remove transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#headerToggle, #header, #main')
						.css('transition', 'none');
        $(function() {
            var app = {};

            //actions
            app.loadRuleset = function() {
                $("#main").load("ruleset/"+app.ruleset)
            };

            app.deleteRule = function(tag, val) {
                var _data = {
                    action: 'delete',
                    tag: tag,
                    value: val,
                };
                $.post("ruleset/"+app.ruleset+"/rule", _data, function(data) {
                    if (data.status == "ok") {
                        app.loadRuleset();
                    }
                });
            };

            app.addRule = function(tag, val) {
                var _data = {
                    action: 'add',
                    tag: tag,
                    value: val,
                };
                $.post("ruleset/"+app.ruleset+"/rule", _data, function(data) {
                    if (data.status == "ok") {
                        app.loadRuleset();
                    }
                });
            };

            app.filterRules = function(filter) {
                if (filter.length) {
                    $("tbody tr").each(function() {
                        var txt = $(this).text();
                        if (txt.indexOf(filter) > -1) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                } else {
                    $("tbody tr").show();
                }
            };

            //handlers
            $("#header").on("click", ".rulesets a", function() {
                app.ruleset = $(this).attr("data-ruleset");
                $("#main").empty();
                app.loadRuleset();
            });

            $("body").on("submit", "#search", function() {
                var filter = $("input[name='search']").val();
                app.filterRules(filter);
                return false;
            });

            $("body").on("click", "a.add-rule", function() {
                var tag = $("input[name='tag']").val();
                var value = $("input[name='val']").val();
                if (tag && tag.length && value && value.length) {
                    app.addRule(tag, value);
                }
                return false;
            });

            $("body").on("click", "a.delete-rule", function() {
                var $row = $(this).parents('tr');
                var tag = $row.children(".tag").text();
                var value = $row.children(".val").text();
                if (tag && tag.length && value && value.length) {
                    app.deleteRule(tag, value);
                }
                return false;
            });

            //init
            $(".rulesets a").first().click();
        });
	});

})(jQuery);
