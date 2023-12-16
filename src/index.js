/*global CoCreate*/
import Action from '@cocreate/actions';
import { queryElements } from '@cocreate/utils';

function init() {
    document.link = { islink: 'true' };
    document.addEventListener('click', linkEvent, true);
}

function linkEvent(event) {
    const target = event.target.closest('[href], [target]');
    if (target && target.download)
        return

    if (!target && (event.target.tagName === 'A' || event.target.closest('button'))) {
        event.preventDefault();
    }

    if (!target || target.closest('[actions]')) return;

    open(target, event);
}


function open(target, event) {
    if (!target || !document.link.islink || document.link.islink == 'false')
        return;
    // navigator.registerProtocolHandler('web+tea', './?tea=%s')
    const href = target.getAttribute('href');
    if (href) {
        if (event)
            event.preventDefault();
        openLink(target);
    }

}

function openLink(link) {
    let currentUrl = window.location.href;
    let href = link.getAttribute('href');
    let target = link.getAttribute('target');
    let title = link.getAttribute('title') || '';
    let statedAttributes = localStorage.getItem('statedAttributes') || '';

    // Push the current state, not the state we're navigating to
    history.pushState({ statedAttributes: statedAttributes, title: title, url: currentUrl }, title, currentUrl);

    if (!target || target === '_self') {
        if (currentUrl !== href)
            location.href = href; // Navigate within the same tab
    } else if (target === "_window") {
        window.open(href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    } else {
        window.open(href, target); // Open in a specified target
    }
}

window.addEventListener('popstate', function (event) {
    if (event.state) {
        if (event.state.statedAttributes) {
            localStorage.setItem('statedAttributes', event.state.statedAttributes);
            let elements = document.querySelectorAll('[state_id]')
            CoCreate.state.initElements(elements)
        }

        if (event.state.url && event.state.url !== window.location.href) {
            location.href = event.state.url; // Navigate if the URL is different
        } else if (event.state.title) {
            document.title = event.state.title; // Update the title if provided
        }
    }
});

// TODO: Document should be element and attribute link="true | false" should be used
function disableLinks(btn) {
    let Document = queryElements({ element: btn, prefix: 'link' });
    if (!Document)
        Document = [document]
    for (let i = 0; i < Document.length; i++) {
        if (Document.nodeType !== 9)
            Document = Document.document
        Document.link = { link: 'false' };
        Document.removeEventListener("click", linkEvent, true);
        Document.addEventListener("click", preventDefault, true);
    }
}

function enableLinks(btn) {
    let Document = queryElements({ element: btn, prefix: 'link' });
    if (!Document)
        Document = [document]
    for (let i = 0; i < Document.length; i++) {
        Document.link = { link: 'true' };
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
