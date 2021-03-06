"use strict";
const upLoadForm = document.getElementById("upload-images-form");
var oUsername;
var oEmail;
var oPassword;
var oDisplayName;
var oAbout;

function uploadImages(e) {
    e.preventDefault();
    const imageUpload = document.querySelector('#image-upload');
    const formData = new FormData();

    for (let i = 0; i < imageUpload.files.length; i++) {
        formData.append("files", imageUpload.files[i]);
    }

    const options = {
        method: 'POST',
        body: formData,
    };
    fetch("/upload-images", options).catch(function (err) {
        ("Error:", err)
    });
}

document.getElementById("image-upload").onchange = (e) => {
    document.getElementById("profilePic").src = URL.createObjectURL(e.target.files[0]);
}



const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {

    const type = password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);

    this.classList.toggle("bi-eye");
});

const form = document.querySelector("form");
form.addEventListener('submit', function (e) {
    e.preventDefault();
});



// Update profile when save button is clicked
document.getElementById("updateSave").addEventListener("click", function (e) {
    e.preventDefault();
    let change;
    let formData = {
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value,
        displayName: document.getElementById("displayName").value,
        about: document.getElementById("about").value,
        username: document.getElementById("username").value.trim()
    };
    document.getElementById("displayName").value = "";
    document.getElementById("about").value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("username").value = "";
    
    if (oEmail != formData.email) {
        change = "email";
    } else if (oUsername != formData.username) {
        change = "username";
    }

    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {

            // 200 means everthing worked
            if (xhr.status === 200) {
                let data = JSON.parse(this.responseText);
                if (data.status == "success") {
                    window.location.assign("/profile");
                } else {
                    document.getElementById("displayName").value = oDisplayName;
                    document.getElementById("about").value = oAbout;
                    document.getElementById("email").value = oEmail;
                    document.getElementById("password").value = oPassword;
                    document.getElementById("username").value = oUsername;
                    let error = document.getElementById("errorMsg");
                    error.innerHTML = data.msg;
                    error.style.color = "red";
                    displayProfile();
                    displayUsername();
                }
            } else {

                // not a 200, could be anything (404, 500, etc.)
                console.log(this.status);

            }

        } else {
            console.log("ERROR", this.status);
        }
    }
    let queryString = "displayName=" + formData.displayName + "&about=" + formData.about + "&email=" + formData.email + "&password=" + formData.password + "&username=" + formData.username + "&change=" + change;
    xhr.open("POST", "/update-profile");
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(queryString);
    uploadImages(e);
});

document.getElementById("updateCancel").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.assign("/profile");
})



function displayUsername() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = JSON.parse(this.responseText);
                if (data.status == "success") {
                    let row = data.rows[0];
                    oUsername = row.username;
                    oPassword = row.password;
                    oEmail = row.email;
                    document.getElementById("username").setAttribute("value", row.username);
                } else {
                    console.log("Error!");
                }
            } else {
                console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-username");
    xhr.send();
}
displayUsername();

function displayProfile() {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                let data = JSON.parse(this.responseText);
                if (data.status == "success" && data.rows.length > 0) {
                    let row = data.rows[0];
                    let name = row.displayName;
                    let about = row.about;
                    oDisplayName = name;
                    oAbout = about;
                    document.getElementById("displayName").setAttribute("value", name);
                    document.getElementById("about").innerHTML = about;
                    document.getElementById("profilePic").src = row.profilePic;
                } else {
                    console.log("Error!");
                }
            } else {
                console.log(this.status);
            }
        } else {
            console.log("ERROR", this.status);
        }
    }
    xhr.open("GET", "/get-profile");
    xhr.send();
}

displayProfile();


// Logout Modal Functions
var modal = document.getElementById('simpleModal');
var modalBtn = document.getElementById('logout');
var goBack = document.getElementById('modal-return');

modalBtn.addEventListener('click', function () {
    modal.style.display = 'block';
});
goBack.addEventListener('click', function (e) {
    e.preventDefault();
    modal.style.display = 'none';
});
window.addEventListener('click', function (e) {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});