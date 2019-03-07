export function findPlayer() {
    let findUser = document.querySelector("#user");
    let findPassword = document.querySelector("#password");
    let user = findUser.value;
    let password = findPassword.value;
    console.log(user + " " + password);
    if (!user || !password) {
        alert('Please enter email and password!');
        document.querySelector("#user").style.borderColor = "red";
        document.querySelector("#password").style.borderColor = "red";
        return false;
    }
    if (user && password) {formValidation(user, password)}
}

function formValidation(user, password) {
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (reg.test(user) == false) {
        document.querySelector("#user").style.borderColor = "red";
        alert('Invalid email address');
        return false;
    }
    if (password.length < 2) {
        document.querySelector("#password").style.borderColor = "red";
        alert('Invalid password');
        return false;
    }
    if (reg.test(user) == true && password.length >= 2) {loginPlayer(user, password)}
}

function loginPlayer(user, password) {
    fetch("/api/login", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: 'userName='+ user + '&password='+ password,
    })
    .then((data) => {
        console.log('Request success: ', data);
        checkLogin(data, user);
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    });
}

function checkLogin(item, user) {
    if (item.status == 200) {
        loginNow(user);
        location.reload();
        alert("You are logged in");
    }
    else {alert("Invalid email or password"); return false;}
}

function loginNow(user) {
    document.getElementById('loginForm').style.visibility = 'hidden';
    document.getElementById('logoutForm').style.visibility = 'visible';
    document.getElementById('loggedUser').style.visibility = 'visible';
    document.getElementById('loggedUser').innerHTML = user;
    localStorage.setItem('showLogin', 'hidden');
    localStorage.setItem('showLogout', 'visible');
    localStorage.setItem('loggedUser', 'visible');
    localStorage.setItem('userName', user);
}

export function logoutPlayer() {
    console.log("logout");

    fetch("/api/logout", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    })
    .then((data) => {
        console.log('Request success: ', data);
        location.reload();
        logoutNow();
        alert("You are logged out");
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    })
}

function logoutNow () {
    document.getElementById('logoutForm').style.visibility = 'hidden'
    document.getElementById('loginForm').style.visibility = 'visible'
    document.getElementById('loggedUser').style.visibility = 'hidden';
    localStorage.setItem('showLogin', 'visible');
    localStorage.setItem('showLogout', 'hidden');
    localStorage.setItem('loggedUser', 'hidden');
    localStorage.setItem('userName', null);
}

export function getSignPlayer() {
    console.log("result_signin");
    let findUser = document.querySelector("#user");
    let findPassword = document.querySelector("#password");
    let user = findUser.value;
    let password = findPassword.value;
    console.log(user + " " + password);
    let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!user || !password) {
        alert('Please enter email and password!');
        document.querySelector("#user").style.borderColor = "red";
        document.querySelector("#password").style.borderColor = "red";
        return false;
    }
    console.log("validation");
    if (reg.test(user) == false) {
        document.querySelector("#user").style.borderColor = "red";
        alert('Invalid email address');
        return false;
    }
    if (password.length < 2) {
        document.querySelector("#password").style.borderColor = "red";
        alert('Invalid password');
        return false;
    }
    if (user && password && reg.test(user) == true && password.length >= 2) { signInPlayer(user, password)}
}

function signInPlayer(user, password) {
    fetch("/api/players", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    body: 'userName='+ user + '&password='+ password,
    })
    .then((data) => {
        console.log('Request success: ', data);
        checkSignIn(data);
    }).then(() => {
        loginUser(user, password);
    })
    .catch((error) => {
        console.log('Request failure: ', error);
    });
}

function checkSignIn(item) {
    let myStatus = item.status.toString();
    localStorage.setItem('status', myStatus);
    if (item.status == 201) {
        alert("You are signed in");
    }
}

function loginUser(user, password) {
    let signStatus = localStorage.getItem('status');
    if (signStatus == 409) {alert("Username already exists"); return false;}
    else if (signStatus != 201 && signStatus != 409) { return false;}
    else if (signStatus == 201) {loginPlayer(user, password)}
}
