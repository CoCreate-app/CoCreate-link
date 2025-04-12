/*global CoCreate*/
import Action from "@cocreate/actions";
import { queryElements } from "@cocreate/utils";

function init() {
	document.link = { islink: "true" };
	document.addEventListener("click", linkEvent, true);
}

function linkEvent(event) {
	const target = event.target.closest("[href], [target]");
	if (target && target.download) return;

	if (
		!target &&
		(event.target.tagName === "A" ||
			event.target.closest("button" && event.target.type !== "submit"))
	) {
		event.preventDefault();
	}

	if (!target || target.closest("[actions]")) return;

	open(target, event);
}

function open(target, event) {
	if (!target || !document.link.islink || document.link.islink == "false")
		return;
	// navigator.registerProtocolHandler('web+tea', './?tea=%s')
	const href = target.getAttribute("href");
	if (href) {
		if (event) event.preventDefault();
		openLink(target);
	}
}

function openLink(link) {
	let href = link.getAttribute("href");
	let target = link.getAttribute("target");

	if (!target || target === "_self") {
		// Normalize both URLs to compare paths in a uniform way
		const currentUrl = new URL(location.href);
		const targetUrl = new URL(href, location.href);

		const currentPath = currentUrl.pathname.replace("/index.html", "/");
		const targetPath = targetUrl.pathname.replace("/index.html", "/");

		if (currentPath !== targetPath || currentUrl.hash !== targetUrl.hash) {
			location.href = href; // Open in the same tab
		}
	} else if (target === "_window") {
		window.open(
			href,
			"_blank",
			"location=yes,height=570,width=520,scrollbars=yes,status=yes"
		); // Open in a window
	} else {
		window.open(href, target); // Open in a new tab or specified target
	}
}

// TODO: Document should be element and attribute link="true | false" should be used
function disableLinks(btn) {
	let Document = [];
	if (element.hasAttribute("link-query")) {
		Document = queryElements({ element: btn, prefix: "link" });
	} else {
		Document = [document];
	}

	for (let i = 0; i < Document.length; i++) {
		if (Document.nodeType !== 9) Document = Document.document;
		Document.link = { link: "false" };
		Document.removeEventListener("click", linkEvent, true);
		Document.addEventListener("click", preventDefault, true);
	}
}

function enableLinks(btn) {
	let Document = [];
	if (element.hasAttribute("link-query")) {
		Document = queryElements({ element: btn, prefix: "link" });
	} else {
		Document = [document];
	}

	for (let i = 0; i < Document.length; i++) {
		Document.link = { link: "true" };
		Document.removeEventListener("click", preventDefault, true);
		Document.addEventListener("click", linkEvent, true);
	}
}

function preventDefault(e) {
	e.preventDefault();
}

Action.init(
	{
		name: "disableLinks",
		endEvent: "disableLinks",
		callback: (data) => {
			disableLinks(data.element);
		}
	},
	{
		name: "enableLinks",
		endEvent: "enableLinks",
		callback: (data) => {
			enableLinks(data.element);
		}
	}
);

init();

export default { open };
