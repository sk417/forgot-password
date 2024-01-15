var passwordField = document.getElementById("new_password");
var confirmPasswordField = document.getElementById("confirm_password");
var messageElement = document.getElementById("passwordMatchMessage");

function checkPassword() {
    var password = passwordField.value;
    var confirmPassword = confirmPasswordField.value;

    if (password === confirmPassword) {
        messageElement.textContent = "Password Match!";
        messageElement.style.color = "green";
    } else {
        messageElement.textContent = "Passwords do not match!";
        messageElement.style.color = "red";
    }
}
confirmPasswordField.addEventListener("input", checkPassword);

function showLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'block';
}

function hideLoadingOverlay() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function getUrlParams() {
    var params = {};
    var queryString = window.location.search.substring(1);
    var urlParams = new URLSearchParams(queryString);

    urlParams.forEach(function(value, key) {
        params[key] = value;
    });
    var tokens= params['token'];

    sessionStorage.setItem('token',tokens);

    return params;
}

function openNewUrlWithoutQueryParams() {
    var currentUrl = window.location.href;
    var baseUrl = currentUrl.split('?')[0];
    window.location.href = baseUrl;
}

function handleGetApiResponse(data) {
    console.log(data);
    if (data.status === 'BAD_REQUEST') {
        alert(data.message);
    } else {
        sessionStorage.setItem('expired', 'true');
        openNewUrlWithoutQueryParams();
    }
}

function handlePostApiResponse(data) {
    if (data.status === 'BAD_REQUEST' ) {
        alert(data.message);
    } else {
        alert(data.message);
    }
}

async function makeApiCall(){
    try{
        if(sessionStorage.getItem('expired') !== 'true'){
            showLoadingOverlay();
            var params = getUrlParams();
            var headers = new Headers();
            headers.append('Content-type', 'application/json');
            headers.append('token',params['token']);
            var response = await fetch('https://qa.api.trsthealth.com/api/v1/users/login/validate-token/', {
                method: 'GET',
                headers: headers
            })
            .then(response => {
                if(response.status === 200){
                    console.log("Verified");
                }
                else{
                    console.log("Unverified");
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                handleGetApiResponse(data);
            })
            .catch((error) => {
                console.log(error);
            });
            sessionStorage.setItem('expired', 'true');
        }
    }catch (error) {
        console.error('API call error:', error);
    } finally {
        hideLoadingOverlay();
    }
}


makeApiCall();


function postData() {
    var formData = new FormData(document.getElementById("formData"));
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    var token = sessionStorage.getItem('token');
    headers.append('token',token);
    var jsonData = {};
    formData.forEach((value, key) => {
        jsonData[key] = value;
    });
    fetch('https://qa.api.trsthealth.com/api/v1/users/login/forgot-reset-password/', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(jsonData)
    })
    .then(response => {
        if(response.status===200){
            console.log("success");
        }
        else{
            console.log("Fail");
        }
        return response.json();
    })
    .then(data => {
        handlePostApiResponse(data);
    })
    .catch((error) => {
        console.log(error);
    });
}