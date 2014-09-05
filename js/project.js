/**
 * 	scripting
 */



(function ($) {

	/* navigation: dropdown menu's */
	$(function() {

		$('body').on('click', function (e) {

			var eventObject = $(e.target);
			var navMenu = eventObject.closest(".appheader-nav--list.is-open");
			var navIsOpen = false;
			var myPanelButton = false; // CR0006 added myPanelButton

			/* layout: make panes float or inline */
			if ( eventObject.is("[data-pane-pin]") ) {
				e.preventDefault();
				$(document.getElementById( eventObject.data("pane-pin") )).toggleClass("grid-layout--float");
			}

			/* layout: extend or collapse panes */
			if ( eventObject.is("[data-pane-toggle]") ) {
				e.preventDefault();
				$(document.getElementById( eventObject.data("pane-toggle") )).toggleClass("grid-layout--folded");
			}

			/* layout: double width of panes */
			if ( eventObject.is("[data-pane-double]") ) {
				e.preventDefault();
				$(document.getElementById( eventObject.data("pane-double") )).toggleClass("grid-layout--double");
			}

			/* main navigation: open dropdown or close what is opened */
			/* clicking in dropdown or link with an open dropdown? */
			if ( navMenu.length == 0 || eventObject.is("[data-dropdown].is-active") ) {
				if (eventObject.is("[data-dropdown].is-active")) {
					navIsOpen=true;
				}
				$("[data-dropdown].is-active")
					.removeClass("is-active")
					.next()
						.removeClass("is-open");
			}
				if ( eventObject.is("[data-dropdown]:not('.is-active')") && !navIsOpen && eventObject.is("[data-dropdown]:not([disabled])")) {
					e.preventDefault();
					eventObject.addClass("is-active");
					$(document.getElementById( eventObject.data("dropdown") )).addClass("is-open");
				}

			/* open and close panel buttons */
			/* CR0006: get the right panel button, even when clicked on nested object */
			if ( eventObject.is("[data-panel]:not('[disabled]')") ) {
				myPanelButton = eventObject;
			} else {
				if ( eventObject.closest("[data-panel]:not('[disabled]')").length > 0 ) {
					myPanelButton = eventObject.closest("[data-panel]:not('[disabled]')");
				}
			}
			/* open or close the associated panel CR0006: uses myPanelButton var now */
			if ( myPanelButton ) {
				if ( myPanelButton.hasClass("is-open") ) {
					togglePanel( $(document.getElementById( myPanelButton.data("panel") )), "close" );
				} else {
					togglePanel( $(document.getElementById( myPanelButton.data("panel") )), "open" );
				}
			}

		});
	});


	/* custom dropdown behaviour -> replaces <select> in hmtl */

	$.fn.extend({
		customSelectInput : function(options) {

			return this.each( function() {

				/* click function on all custom dropdowns */
				$(this).on('click', function (e) {

					/* data may have changed so we do this with every click */
					var mySelectors = $(this).find("a"),
						myFormInput = $(this).data("selectinput");

					e.preventDefault();

					var myTarget  = e.target;

					/* iterate through all options */
					for (var i = 0; i <= mySelectors.length - 1; i++) {
						if ( mySelectors[i] != myTarget ) {
							$( mySelectors[i] ).removeClass("is-marked");
						} else {
							/* make selection active and set correct value in input */
							$( mySelectors[i] ).addClass("is-marked");
							document.getElementById( myFormInput ).value = mySelectors[i].text;
						}

					};

				});
			});
		}

    });
	/* init dropdowns */
	$("[data-selectinput]").customSelectInput();



	/* autogrow textarea's on input, killed bc perf sucks on big forms */
	/*var autogrowOptions = {
	    onInitialize: true
	};*/
	//$("textarea").autogrow();


	/* let's read some mediaqueries... */
	/* if available screenspace is small, we should automatically fold a panel so the main content isn't blocked */
	(function(win){
		var doc=win.document,
			el,
			pseudo;
		if (win.getComputedStyle && doc.querySelector) {
			el = doc.querySelector('body');
			pseudo = win.getComputedStyle(el, '::after').getPropertyValue('content');
			// only FF returns the value with extra doublequotes around the content so we double up
			if (pseudo=="XL" || pseudo=='"XL"') {
				// on a smaller screen the right panel is folded on load
				$("#paneRight").addClass("grid-layout--folded");
			} else { // nested because "L" is in "XL"
				// on small screens both panels are folded on load
				if (pseudo=="L" || pseudo=='"L"' || pseudo=="M" || pseudo=='"M"') {
					$("#paneRight").addClass("grid-layout--folded");
					$("#paneLeft").addClass("grid-layout--folded");
				}
			}
		}
	})(this);


})(jQuery);


/* algemene functie voor open en sluiten van panels */

function togglePanel(objRef,action) {

	var myPanel = jQuery(objRef),
		myTogglers = jQuery("[data-panel='" + objRef.attr("id") + "']"),
		panelMaxHeight = myPanel.find(":first-child")[0].offsetHeight,
		// CR0006: if the panel is part of an accordeon group, get all open panels of that group minus the current one
		myAccordeonMates = objRef.is("[data-accordeon]") ? jQuery("[data-accordeon='" + objRef.data("accordeon") + "']").not(".is-closed").not(myPanel) : false;

	if (action == "open" && !myTogglers.hasClass("is-open") ) {

		myPanel
			.css("display","block")
			.removeClass("is-closed");// is only set on pageload
		/*	.css("height", panelMaxHeight)*/

		// set correct state of linked button
		myTogglers.addClass("is-open");

		// after the animation, set height to auto to accomodate nested panels
		/*setTimeout(function () {
			myPanel
				.addClass("no-transition")
				.css("height", "auto");
		}, 320);*/

		/* CR0006: accordeon stuff, in case panels are grouped by a data-accordeon attribute */
		if (myAccordeonMates.length > 0) {
			myAccordeonMates.each(function(){
				togglePanel( jQuery(this),"close");
			});
		}
	}

	if (action == "close" && myTogglers.hasClass("is-open") ) {

		// revert from auto to px
		myPanel
			.css("display","none");
		myTogglers.removeClass("is-open");
			/*.addClass("no-transition") // just in case, like after page-load
			.css("height", panelMaxHeight);*/
		// enable transition
		/*setTimeout(function () {
			myPanel
				.removeClass("no-transition")
				.css("height", 0);
			// set correct state of linked button
			myTogglers.removeClass("is-open");
		}, 12);*/

	}
}