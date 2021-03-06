/*global CoCreate*/
import action from '@cocreate/actions';
import pass from "@cocreate/pass";

function init() {
	document.link = {islink: 'true'};
	document.addEventListener('click', linkEvent, true);
}

function linkEvent() {
		const target = event.target.closest('[href], [target], [pass_to]');
		if (event.target.closest('button') && !target) {
			event.preventDefault();
		}
		if (!target) return;
		if (target.hasAttribute('actions')) return;
		if (target.closest('[actions]')) return;
		runLink(target);
}


function runLink(target) {
	if (!target) return;
	if (document.link.link) return;
	const href = target.getAttribute('href');
	pass._setPassAttributes(target);			

	if (target.getAttribute('target') === 'modal') {
		event.preventDefault();
		if (typeof CoCreate.modal !== 'undefined') {
			CoCreate.modal.open(target);
		}
		else if (href) {
			openLink(target);
		}
	}
	else if (href) {
		event.preventDefault();
		openLink(target);
	}

}

function openLink(link) {
	var href = link.getAttribute('href');
	var target = link.getAttribute('target');

	if (target == "_blank") {
		window.open(href, "_blank");
	}
	else if (target == "_window") {
		window.open(href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
	}
	else {
		window.open(href, "_self");
	}
}

function getDocument(btn) {
	let Document = document;
	let targetSelector = btn.getAttribute('link-target');
	if (targetSelector) {
		if(targetSelector.indexOf(';') !== -1) {
			let documentSelector;
			[documentSelector, targetSelector] = targetSelector.split(';');
			let frame = document.querySelector(documentSelector);
			Document = frame.contentDocument;
		}
	}
	return Document;
}

function disableLinks(btn) {
	let document = getDocument(btn);
	document.link = {link: 'false'};
	document.removeEventListener("click", linkEvent, true);
	document.addEventListener("click", preventDefault, true);
}

function enableLinks(btn) {
	let document = getDocument(btn);
	document.link = {link: 'true'};
	document.removeEventListener("click", preventDefault, true);
	document.addEventListener("click", linkEvent, true);
}

function preventDefault(e) {
	e.preventDefault();
}

action.init({
	name: "disableLinks",
	endEvent: "disableLinks",
	callback: (btn, data) => {
		disableLinks(btn);
	}
});

action.init({
	name: "enableLinks",
	endEvent: "enableLinks",
	callback: (btn, data) => {
		enableLinks(btn);
	}
});

init();

export default {runLink};
