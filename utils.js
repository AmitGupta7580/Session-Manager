function sanity_check(text) {
    if(text === "" || text === undefined || text === null) {
        return false;
    }
    return true;
}

function get_url(url) {
    console.log(url.split("/"));
    return url;
}

function valid_json(payload) {
    try {
        let data = JSON.parse(payload);
        return true;
    } catch (e) {
        return false;
    }
}

function filter_cookies(cookies) {
    for(var i=0;i<cookies.length;i++){
        const cookie = cookies[i];
        console.log(cookie.name);
    }
    return cookies
}