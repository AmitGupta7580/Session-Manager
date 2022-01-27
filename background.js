// background.js

let color = 'green';

chrome.runtime.onInstalled.addListener( async () => {
    chrome.storage.sync.set({ color });
    console.log('Default background color set to %cgreen', `color: ${color}`);
});

// if(store.tabIds.indexOf(tab.id) !== -1){
//     let storeId = store.id;
    // chrome.cookies.get({
    //     name: "70a7c28f3de",
    //     storeId: storeId,
    //     url: tab.url
    // }, function(cookie) {
    //     console.log(cookie);
    // })
// } else {
//     console.log("No Cookie Stoe Found");
// }