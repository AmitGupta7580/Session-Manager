let save_btn = document.getElementById("save-session");
let session_name_inp = document.getElementById("session-name");
let sessions_list = document.getElementById("sessions-list");
let clear_sessions_btn = document.getElementById("clear-all-sessions");
let logout_btn = document.getElementById("logout-sessions");

let tab, sessions = [], storeId = '0', baseUrl;

init();

async function init() {
    // current active tab
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log(tab);

    baseUrl = get_url(tab.url);

    // cookie-stores
    let stores = await chrome.cookies.getAllCookieStores();
    for(var store in stores){
        storeId = stores[store].tabIds.indexOf(tab.id) !== -1 ? stores[store].id : '0';
    }

    // stored session corrosponding to current website
    let items = await chrome.storage.local.get(baseUrl);
    if(valid_json(items[tab.url])){
        sessions = JSON.parse(items[tab.url]).sessions;
        console.log(sessions);
    }

    // listner for save new session
    save_btn.addEventListener("click", async () => {
        let session_name = session_name_inp.value;
        if(sanity_check(session_name)){  // sanity check over session_name
            let cookies = await list_cookies();
            await add_session(session_name, cookies);
        } else {
            log("Invalid session Name");
        }
    });

    clear_sessions_btn.addEventListener("click", async () => {
        clear_all_sessions();
    });

    logout_btn.addEventListener("click", async () => {
        await logout_sessions();
        reload();
    });
    
    render_sessions();
}

function render_sessions() {
    while (sessions_list.firstChild) {
        sessions_list.removeChild(sessions_list.firstChild);
    }
    /*
    
    <li>
        <div style="display: flexbox">
            session.sessionnaem
            <button id={i} class="restore-session">Restore Session</button>
        </div>
    </li>

    */
    if(sessions.length !== 0){
        for(var i=0;i<sessions.length;i++){
            const idx = i;
            const session = sessions[idx];

            var item = document.createElement("li");
            var div = document.createElement("div");
            div.setAttribute("style", "display: flexbox;");
            var heading = document.createTextNode(session.session_name);
            var res_btn = document.createElement("button");
            res_btn.setAttribute("id", idx);
            res_btn.setAttribute("class", "restore-session");
            var res_btn_text = document.createTextNode("Restore session");
            var del_btn = document.createElement("button");
            del_btn.setAttribute("id", idx);
            del_btn.setAttribute("class", "delete-session");
            var del_btn_text = document.createTextNode("Delete session");

            // add event listner to buttons
            res_btn.addEventListener("click", async () => {
                await restore_sessions(idx);
                reload();
            });
            del_btn.addEventListener("click", async () => {
                console.log(idx);
                delete_session(idx);
            })
            
            res_btn.appendChild(res_btn_text);
            del_btn.appendChild(del_btn_text);
            div.appendChild(heading);
            div.appendChild(res_btn);
            div.appendChild(del_btn);
            item.appendChild(div);

            sessions_list.appendChild(item);
        }
    }
    else {
        log("No Saved Session found")
    }
}

async function add_session(session_name, cookies) {
    sessions.push({
        "session_name": session_name,
        "cookies" : cookies
    });
    await update_storage();
}

async function delete_session(session_id) {
    sessions.splice(parseInt(session_id), 1);
    await update_storage();
}

async function restore_sessions(session_id) {
    const cookies = sessions[parseInt(session_id)].cookies;
    for(var i=0;i<cookies.length;i++){
        const cookie = cookies[i];
        await chrome.cookies.remove({
            name: cookie.name,
            url: tab.url,
        });
        await chrome.cookies.set({
            domain: cookie.domain,
            httpOnly: cookie.httpOnly,
            name: cookie.name,
            path: cookie.path,
            sameSite: cookie.sameSite,
            secure: cookie.secure,
            storeId: cookie.storeId,
            url: tab.url,
            value: cookie.value,
        });
    }
}

async function logout_sessions() {
    const cookies = await list_cookies();
    for(var i=0;i<cookies.length;i++){
        const cookie = cookies[i];
        await chrome.cookies.remove({
            name: cookie.name,
            url: tab.url,
        });
    }
}

async function clear_all_sessions() {
    sessions = [];
    await update_storage();
}

async function update_storage() {
    var data = {};
    data[tab.url] = JSON.stringify({
        "sessions": sessions
    })
    await chrome.storage.local.set(data);
    render_sessions();
}

async function list_cookies() {
    let cookies = await chrome.cookies.getAll({ url: tab.url, storeId: storeId });
    return cookies;
}

function reload() {
    chrome.tabs.reload(tab.id);
}

function log(text) {
    console.log(text);
    let logger = document.getElementById("logger");
    logger.innerHTML = text;
}