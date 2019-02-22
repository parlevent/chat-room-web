let baseUrl = "http://localhost:7777";

let endpoints = {
    "login": baseUrl + "/auth/login",
    "onlineUsers": baseUrl + "/onlineUsers",

    "socket": baseUrl + "/socket"
};

let convertSetStrToList = function (strArr) {
    strArr = strArr.substr(1, strArr.length - 2);
    let arr = strArr.split(',');
    return arr.map(item => {
        return item.substr(1, item.length - 2);
    });
};

export default {
    endpoints,
    convertSetStrToList
}