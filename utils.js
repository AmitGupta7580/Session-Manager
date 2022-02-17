function get_unique_id() {
    return 'id' + (new Date()).getTime();
}

function sanity_check(text) {
    if(text === "" || text === undefined || text === null) {
        return false;
    }
    return true;
}

function get_host(url) {
    var host = url.split("/")[2];
    return host;
}

function valid_json(payload) {
    try {
        let data = JSON.parse(payload);
        return true;
    } catch (e) {
        return false;
    }
}

function valid_session(session) {
    if(!session.hasOwnProperty('session_id')){
        return false;
    }
    return true;
}

function filter_cookies(cookies) {
    for(var i=0;i<cookies.length;i++){
        const cookie = cookies[i];
        console.log(cookie.name);
    }
    return cookies
}