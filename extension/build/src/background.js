"use strict";
chrome.runtime.onMessage.addListener(function (message, sender, reply) {
    if (message == "initial") {
        chrome.storage.local.get(function (saved) {
            const savedData = saved.f1;
            if (savedData) {
                console.log(`from saved`);
                reply(savedData);
            }
            else {
                console.log(`from api`);
                fetchFromApi(reply);
            }
        });
    }
    else if (message == "refresh") {
        fetchFromApi(reply);
    }
    else {
        reply(null);
    }
    return true;
});
function fetchFromApi(reply) {
    fetch(`https://us-central1-als-site-test.cloudfunctions.net/schedule`)
        .then((resp) => resp.json())
        .then((data) => {
        chrome.storage.local.set({ f1: data }, function () {
            reply(data);
        });
    });
}
