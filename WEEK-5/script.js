document.getElementById("loginForm").addEventListener("submit", function(e){

    e.preventDefault();

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();
    let error = document.getElementById("error");

    error.innerHTML = "";

    if(username === ""){
        error.innerHTML = "Username is required";
        return;
    }

    if(password === ""){
        error.innerHTML = "Password is required";
        return;
    }

    if(password.length < 6){
        error.innerHTML = "Password must contain at least 6 characters";
        return;
    }

    if(username === "admin" && password === "admin123"){
        window.location.href = "success.html";
    }
    else{
        error.innerHTML = "Invalid Username or Password";
    }

});