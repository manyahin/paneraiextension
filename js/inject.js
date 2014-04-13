(function() {
	
	obj = {
		
		// TODO: make better
		'reg' : new RegExp(
			'\s*' +
			'([0-9]{3})' +
			'\s*',
			'gi'
		),
		
		initialize : function() {
			// console.log('Inject script running!')

			var host = window.location.host

			chrome.runtime.sendMessage({url: host}, function(response) {
			  if(response.rulez == true) {
			  	// console.log('url accept')
				// INIT EVENTS
				if(document && document.body) {
					obj.process(document.body);
				}
			  }
			});

			

		},	

		process : function(element) {
			// console.log('Running process function');

			this.dblclick();
			
			// this.parse(element);
				
		},

		disableBodyScroll : function(content) {
			$(content).hover(function(e) {
				alert(content);

				// iframe = content.getElementsByTagName('iframe')[0].document.body;
				content.addEventListener('DOMMouseScroll', function() {
					alert('scroll inside!');
			        var scrollTop = content.scrollTop;
			        var scrollHeight = content.scrollHeight;
			        var offsetHeight = content.offsetHeight;
			        var contentHeight = scrollHeight - offsetHeight;
			        if (contentHeight <= scrollTop)
			        {
			            console.log('scroll end');
			            content.onmousewheel = function(e) { 
			                if(e.wheelDelta < 0)
			                    e.preventDefault() 
			            }
			        }
			        else if(scrollTop <= 0) {
			            console.log('scroll start')
			            content.onmousewheel = function(e) { 
			                if(e.wheelDelta > 0)
			                    e.preventDefault() 
			            }
			        } else {
			            content.onmousewheel = function(e) {  }
			        }
			    }, false)
			}, function(){
				content.removeEventListener('scroll');
			})
		},

		getFacebook : function(callback) {

			chrome.runtime.sendMessage({need: 'facebook'}, function(response) {
			  callback(response.answer == "true");
			});

		},

		dblclick : function() {
			var selected = null;

			document.ondblclick = function(event) {

				var span = obj.getSeletedElm();
				if(!span) return;

				selected = span.textContent.trim();

				obj.getFacebook(function(ret){

					var url = "http://paneraiextension.com/?search=" + encodeURIComponent(selected) + "&fb=" + ret;

					var height = ret ? "400px" : "270px";

					var iframe = '<iframe style="border: none;" name="paneraiextension_iframe" width="490px" height="'+height+'" src="'+url+'">';

					Tipped.create(span, iframe, {
						skin: 'white',
						border: { size: 1 },
						hideOn: false,
						hook: 'topleft',
	  					closeButton: true,
	  					showOn: 'click',
	  					afterUpdate: function(content, element) {
							// obj.disableBodyScroll(content);

						}
					});

					obj.runTooltip(span);
				});

			}
		},
		
		runTooltip : function(element) {
			var evt = document.createEvent("MouseEvents");
			  evt.initMouseEvent("click", true, true, window,
			    0, 0, 0, 0, 0, false, false, false, false, 0, null); 
			  var canceled = !element.dispatchEvent(evt);
		},

		getSeletedElm : function() {
			var sel, elm;

			if (window.getSelection){
				sel = window.getSelection();
		    } else if (document.getSelection) {
		        sel = document.getSelection();
		    } else if (document.selection) {
		        sel = document.selection.createRange();
		    } 

		    var pattNumbers = /[0-9]+/g;
		    if(sel === null || sel.length < 1 || pattNumbers.test(sel) === false) 
		    	return false;

		    if(sel.baseNode.parentNode.id === 'paneraiextension_selected')
		    	return false;

		    elm = document.createElement('span');
		    elm.id = "paneraiextension_selected";
		    elm.style.backgroundColor = "yellow";

		    if(sel.rangeCount) {
		    	var range = sel.getRangeAt(0).cloneRange();
		    	range.surroundContents(elm);

		    	sel.removeAllRanges();
		    	sel.addRange(range)
		    }

		    return elm;
		},
		
		surroundSelection : function(element) {
		    if (window.getSelection) {
		        var sel = window.getSelection();
		        if (sel.rangeCount) {
		            var range = sel.getRangeAt(0).cloneRange();
		            range.surroundContents(element);
		            sel.removeAllRanges();
		            sel.addRange(range);
		        }
		    }
		},

		parse : function(parent) {
			var node, original, rep, fragment;
			if(!parent || parent._parsed || /^(G|CANVAS|PATH|IFRAME|CIRCLE|RECT|SVG|EMBED|OBJECT|VIDEO|AUDIO|CCC|IMG|STYLE|SCRIPT|IFRAME|CCC|PRE)$/.test(parent.nodeName) || parent.childNodes.length == 0) {
				return false;
			}
			
			parent._parsed = true;
			
			for (var i = 0, l = parent.childNodes.length; i < l; i++) {
				node = parent.childNodes[i];
				
				if(node.nodeType === 1 && node.innerHTML) {
					obj.parse(node);
					continue;
				}
				
				if(node.nodeType !== 3) {
					continue;
				}
				
				if(obj.reg.exec(node.textContent) === null) {
					continue;
				}
				
				original = node.textContent
				
				node.textContent = node.textContent.replace(obj.reg, function(match, content, offset, string) {
					// console.warn('----')
					// console.log(node)
					// console.log(match)
					// console.log(content)
					// console.log(offset)
					// console.log(string)
					// 
					var str = '<span class="showTip TooltipWatch" style="background-color: yellow;">' + content + '</span>';
					return str;
				})
				
				fragment = document.createDocumentFragment();
				rep = document.createElement('span');
				rep.innerHTML = node.textContent;
				fragment.appendChild(rep)
				
				node.parentNode.replaceChild(fragment, node)
				
				
			};
			
		}
	}
	
	
	obj.initialize();
	
})();