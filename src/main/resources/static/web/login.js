export function findUser(item) {
    const findUser = document.querySelector("#user");
    const findPassword = document.querySelector("#password");
    const user = findUser.value;
    const password = findPassword.value;
    if (formValidation(user, password) === true) {
    if (item === "login") {loginPlayer(user, password)}
    else if (item === "signIn") {signInPlayer(user, password)}
    }
}


function formValidation(user, password) {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (!user || !password) {
        document.querySelector("#user").style.borderColor = "red";
        document.querySelector("#password").style.borderColor = "red";
        alert('Please enter email and password!');
        return false;
    }
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
    if (reg.test(user) == true && password.length >= 2) {return true}
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
    sessionStorage.setItem('showLogin', 'hidden');
    sessionStorage.setItem('showLogout', 'visible');
    sessionStorage.setItem('loggedUser', 'visible');
    sessionStorage.setItem('userName', user);

}

export function logoutPlayer() {
    fetch("/api/logout", {
    credentials: 'include',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    })
    .then((data) => {
        console.log('Request success: ', data);
        logoutNow();
        location.reload();
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
    sessionStorage.setItem('showLogin', 'visible');
    sessionStorage.setItem('showLogout', 'hidden');
    sessionStorage.setItem('loggedUser', 'hidden');
    sessionStorage.setItem('userName', null);
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
    const myStatus = item.status.toString();
    sessionStorage.setItem('status', myStatus);
    if (item.status == 201) {
        alert("You are signed in");
    }
}

function loginUser(user, password) {
    const signStatus = sessionStorage.getItem('status');
    if (signStatus == 409) {alert("Username already exists"); return false;}
    else if (signStatus != 201 && signStatus != 409) { return false;}
    else if (signStatus == 201) {loginPlayer(user, password)}
}
