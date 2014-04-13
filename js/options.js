function save_options(e) {

	var arrayOfLines = $('#AllowSites').val().split('\n');
	var urls = [];

	for (var i = arrayOfLines.length - 1; i >= 0; i--) {
		if(arrayOfLines[i].trim() === "") continue;
		urls[i] = arrayOfLines[i];
	};

	if(urls.length < 1) {
		show_status('Minimum one site', 'red');
		return false;
	}

	chrome.runtime.sendMessage({storeSet: 'urls', val: JSON.stringify(urls)});

	var fbcb = $('#facebook');
	var facebookValue = fbcb.is(':checked') ? true : false;

	chrome.runtime.sendMessage({storeSet: 'facebook', val: facebookValue});

	show_status('Settings saved', 'green');
}
 
function show_status(text, color) {
	var status = $('#Settings_Status');
	status.css('display', 'inline-block');
	status.css('color', color);
	status.text(text);
	setTimeout(function(){
		status.hide('slow');
	}, 2000);
}

function restore_options() {

	chrome.runtime.sendMessage({storeGet: 'urls'}, function(response) {
		var urls = JSON.parse(response.answer);
		var textarea = $('#AllowSites');
		textarea.text(urls.join("\n"));
	});

	chrome.runtime.sendMessage({storeGet: 'facebook'}, function(response) {
 		var facebookValue = response.answer;
 		var fbcb = $('#facebook');
		if(facebookValue === "true") {
			fbcb.prop('checked', true)
		} else {
			fbcb.prop('checked', false);
		}
	});
	
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('Settings_Button_Save').addEventListener('click', save_options);

