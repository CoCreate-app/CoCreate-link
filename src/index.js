/*global CoCreate*/
import action from '@cocreate/actions';
import { queryDocumentSelector } from '@cocreate/utils';

function init() {
    document.link = { islink: 'true' };
    document.addEventListener('click', linkEvent, true);
}

function linkEvent(event) {
    const target = event.srcElement.closest('[href], [target]');
    if (target && target.download)
        return
    if (event.target.closest('button') && !target) {
        event.preventDefault();
    }
    if (!target) return;
    if (target.hasAttribute('actions')) return;
    if (target.closest('[actions]')) return;

    runLink(target, event);
}


function runLink(target, event) {
    if (!target || !document.link.islink || document.link.islink == 'false')
        return;
    navigator.registerProtocolHandler('web+tea', './?tea=%s')
    const href = target.getAttribute('href');
    if (href) {
        if (event)
            event.preventDefault();
        openLink(target);
    }

}

function openLink(link) {
    let href = link.getAttribute('href');
    let target = link.getAttribute('target');

    // TODO: attributes to set height, width, left, top, scrollbars, popup, noopener, noreferrer
    if (!target)
        window.open(href, '_self');
    else if (target == "_window")
        window.open(href, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
    else
        window.open(href, target);
}

// TODO: apply queryDocumentSelector
function getDocument(btn) {
    let Document = document;
    let targetSelector = btn.getAttribute('link-target');
    if (targetSelector) {
        if (targetSelector.indexOf(';') !== -1) {
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
    document.link = { link: 'false' };
    document.removeEventListener("click", linkEvent, true);
    document.addEventListener("click", preventDefault, true);
}

function enableLinks(btn) {
    let document = getDocument(btn);
    document.link = { link: 'true' };
    document.removeEventListener("click", preventDefault, true);
    document.addEventListener("click", linkEvent, true);
}

function preventDefault(e) {
    e.preventDefault();
}

action.init({
    name: "disableLinks",
    endEvent: "disableLinks",
    callback: (data) => {
        disableLinks(data.element);
    }
});

action.init({
    name: "enableLinks",
    endEvent: "enableLinks",
    callback: (data) => {
        enableLinks(data.element);
    }
});

init();

export default { runLink };
