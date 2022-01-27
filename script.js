let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
let [store] = await chrome.cookies.getAllCookieStores();
if(store.tabIds.indexOf(tab.id) !== -1){
    let storeId = store.id;
    chrome.cookies.get({
        name: "70a7c28f3de",
        storeId: storeId,
        url: tab.url
    }, function(cookie) {
        console.log(cookie);
    })
} else {
    console.log("No Cookie Stoe Found");
}