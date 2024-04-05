document.getElementById("username").innerHTML = localStorage.getItem("userName")
document.getElementById("user-img").src = localStorage.getItem("userImg")


let mainURL = "https://tarmeezacademy.com/api/v1"
let successPath = "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
let primaryPath = "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
let warningPath = "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"


// ! Button In Navbar  ...
function setupUI() {
    const token = localStorage.getItem("token")
    const userInfo = document.getElementById("user-info")
    const newPost = document.getElementById("new-post")
    const loginBtn = document.getElementById("login-btn")
    const logoutBtn = document.getElementById("logout-btn")
    const registerBtn = document.getElementById("register-btn")
    const sendComment = document.getElementById("send-comment")
    const profilePage = document.getElementById("profile-page")

    if (token != null) {
        loginBtn.style.display = "none"
        registerBtn.style.display = "none"
        logoutBtn.style.display = "inline"

        userInfo.setAttribute('style', 'display:flex !important');
        profilePage.setAttribute('style', 'display:flex !important');

        if (newPost != null) {
            newPost.setAttribute('style', 'display:flex !important');
        }
        if (sendComment != null) {
            sendComment.setAttribute('style', 'display:flex !important');
        }
    }
}


// ! Start Login ...
function startLogIn() {
    document.getElementById("login-btn").addEventListener("click", () => {
        // ! how i can focus on username Input when open modal

        const usernameInputLogin = document.getElementById("username-login")
        const passwordInputLogin = document.getElementById("password-login")
        const login = document.getElementById("login-btn-loginModal")


        usernameInputLogin.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                passwordInputLogin.focus()
            }
        })
        passwordInputLogin.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                login.focus()
            }
        })
        logInUser()
    })
}
startLogIn()

// ! Login User ...
function logInUser() {
    const login = document.getElementById("login-btn-loginModal")
    const usernameInputLogin = document.getElementById("username-login")
    const passwordInputLogin = document.getElementById("password-login")

    login.addEventListener("click", () => {
        const usernameLogin = usernameInputLogin.value
        const passwordLogin = passwordInputLogin.value
        const params = {
            "username": usernameLogin,
            "password": passwordLogin
        }
        if (usernameLogin != "" & passwordLogin != "") {
            toggleLoader(true)
            axios.post(`${mainURL}/login`, params)
                .then(function (response) {
                    if (response.status == 200) {
                        // console.log(response);
                        // console.log(response.data.user);
                        // console.log(response.data.user.profile_image);
                        // console.log(response.data.token);
                        localStorage.setItem("token", response.data.token)
                        localStorage.setItem("userName", response.data.user.username)
                        localStorage.setItem("userImg", response.data.user.profile_image)
                        localStorage.setItem("user", JSON.stringify(response.data.user))

                        document.getElementById("username").innerHTML = localStorage.getItem("userName")
                        document.getElementById("user-img").src = localStorage.getItem("userImg")
                        setupUI()
                        usernameInputLogin.value = ""
                        passwordInputLogin.value = ""
                        document.getElementById("close-btn-loginModal").click()
                        showAlert("Logged In Successfully.", "success", successPath)
                        closeAlert()
                    }
                })
                .catch(function (error) {
                    // console.log(error.response.data.message);
                    showAlert("Username Or Password Is Incorrect.", "warning", warningPath)
                    closeAlert()
                    usernameInputLogin.value = ""
                    passwordInputLogin.value = ""
                })
                .finally(() => {
                    toggleLoader(false)
                })
        } else if (usernameLogin == "" & passwordLogin == "") {
            alert("Username and Password is empty")
        } else if (usernameLogin == "") {
            alert("Username is empty")
        } else if (passwordLogin == "") {
            alert("Password is empty")
        }

    })
}


// ! Empty the User and Password field after pressing the Close button in Modal ...
function emptyInputsInLoginModal() {
    document.getElementById("close-btn-loginModal").addEventListener("click", () => {
        document.getElementById("username-login").value = ""
        document.getElementById("password-login").value = ""
    })
}
emptyInputsInLoginModal()


// ! Logout User ...
function logOut() {
    const logout = document.getElementById("logout-btn")
    logout.addEventListener("click", () => {
        toggleLoader(true)
        if (confirm("Are you sure you want to log out?") == true) {
            if (window.location.pathname == "/profile.html") {
                setTimeout(() => {
                    toggleLoader(false)
                    window.location = "index.html"
                }, 1500)
            }
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            localStorage.removeItem("userName")
            localStorage.removeItem("userImg")
            showAlert("Logged Out Successfully.", "primary", primaryPath)
            closeAlert()
        }
    })
}
logOut()


// ! Start Register ...
function startRegister() {
    document.getElementById("register-btn").addEventListener("click", () => {
        // ! how i can focus on username Input when open modal
        console.log("true");
        const nameInputRegister = document.getElementById("name-register")
        const usernameInputRegister = document.getElementById("username-register")
        const passwordInputRegister = document.getElementById("password-register")
        const imageInputRegister = document.getElementById("profile-image-register")
        const emailInputRegister = document.getElementById("email-register")
        const register = document.getElementById("register-btn-registerModal")

        nameInputRegister.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                usernameInputRegister.focus()
            }
        })
        usernameInputRegister.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                passwordInputRegister.focus()
            }
        })
        passwordInputRegister.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                imageInputRegister.focus()
            }
        })
        imageInputRegister.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                emailInputRegister.focus()
            }
        })
        emailInputRegister.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                register.focus()
            }
        })
        registerUser()
    })
}
startRegister()


// ! Register A New User ...
function registerUser() {
    const register = document.getElementById("register-btn-registerModal")
    const nameInputRegister = document.getElementById("name-register")
    const usernameInputRegister = document.getElementById("username-register")
    const passwordInputRegister = document.getElementById("password-register")
    const imageInputRegister = document.getElementById("profile-image-register")
    const emailInputRegister = document.getElementById("email-register")

    register.addEventListener("click", () => {
        const nameRegister = nameInputRegister.value
        const usernameRegister = usernameInputRegister.value
        const passwordRegister = passwordInputRegister.value
        const imageRegister = imageInputRegister.files[0]
        const emailRegister = emailInputRegister.value

        // * this is json can't use image with it * //
        // const params = {
        //     "username": usernameRegister,
        //     "password": passwordRegister,
        //     "name": nameRegister
        // }

        // * so i should turn json to form data for axios * //
        let formData = new FormData()
        formData.append("name", nameRegister)
        formData.append("username", usernameRegister)
        formData.append("password", passwordRegister)
        formData.append("image", imageRegister)
        formData.append("email", emailRegister)


        if (nameRegister != "" & usernameRegister != "" & passwordRegister != "") {
            toggleLoader(true)
            axios.post(`${mainURL}/register`, formData)
                .then(function (response) {
                    // console.log(response);
                    // console.log(response.data.token);
                    // console.log(response.data.user.username);
                    if (response.status == 200) {
                        localStorage.setItem("token", response.data.token)
                        localStorage.setItem("userName", response.data.user.username)
                        localStorage.setItem("userImg", response.data.user.profile_image)
                        localStorage.setItem("user", JSON.stringify(response.data.user))

                        document.getElementById("username").innerHTML = localStorage.getItem("userName")
                        setupUI()
                        nameInputRegister.value = ""
                        usernameInputRegister.value = ""
                        passwordInputRegister.value = ""
                        document.getElementById("close-btn-registerModal").click()
                        showAlert("Sign In Successfully.", "success", successPath)
                        closeAlert()
                    }
                })
                .catch(function (error) {
                    // console.log(error.response.data.message);
                    showAlert(`${error.response.data.message}`, "warning", warningPath)
                    closeAlert()
                    nameInputRegister.value = ""
                    usernameInputRegister.value = ""
                    passwordInputRegister.value = ""
                })
                .finally(() => {
                    toggleLoader(false)
                })
            // console.log(nameRegister, usernameRegister, passwordRegister);
        } else if (nameRegister == "" & usernameRegister == "" & passwordRegister == "") {
            alert("Name and Username and Password is empty")
        } else {
            alert("Name or Username or Password is empty")
        }

    })
}


// ! Show Alert ...
function showAlert(message, type, path) {
    const alertPlaceholder = document.getElementById('show-alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML =
            `
            <div class="alert alert-${type} alert-dismissible d-flex align-items-center show fade" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" style="width: 20px;" viewBox="0 0 16 16" role="img">
                    <path
                        d="${path}" />
                </svg>
                <div>
                    ${message}
                </div>
                <button type="button" id="close-message-success" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `
        alertPlaceholder.append(wrapper)
    }
    appendAlert(message, type, path)
}


// ! Close Alert ...
function closeAlert() {
    setTimeout(() => {
        document.getElementById("close-message-success").click()
        location.reload()
    }, 2000)
}


// ! Show The Current Post ...
function showPost(postId) {
    window.location = `post-details.html?postId=${postId}`
}


// ! Edit Post ...
function editPost(postObject) {
    let post = JSON.parse(decodeURIComponent(postObject))

    document.getElementById("post-id-input").value = post.id

    document.getElementById("addPostModalLabel").innerHTML = "Edit Post"
    document.getElementById("addPost-btn-addPostModal").innerHTML = "Edit"

    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body

    let postEditModal = new bootstrap.Modal(document.getElementById("addPostModal"), {})
    postEditModal.toggle()
}


// ! Add Post ...
function addPost() {
    document.getElementById("post-id-input").value = ""

    document.getElementById("addPostModalLabel").innerHTML = "Create A New Post"
    document.getElementById("addPost-btn-addPostModal").innerHTML = "Post"

    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""

    let postEditModal = new bootstrap.Modal(document.getElementById("addPostModal"), {})
    postEditModal.toggle()
}


// ! Send A New Post ...
function sendNewPost() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""

    const titleInputPost = document.getElementById("post-title-input")
    const bodyInputPost = document.getElementById("post-body-input")
    const imgInputPost = document.getElementById("post-img-input")


    const titlePost = titleInputPost.value
    const bodyPost = bodyInputPost.value
    const imgPost = imgInputPost.files[0]
    // console.log(titlePost, bodyPost, imgPost);

    // * this is json can't use image with it * //
    // const params = {
    //     "title": titlePost,
    //     "body" : bodyPost,
    //     "image" : imgPost 
    // }

    // * so i should turn json to form data for axios * //
    let formData = new FormData()
    formData.append("title", titlePost)
    formData.append("body", bodyPost)
    formData.append("image", imgPost)

    const token = localStorage.getItem("token")
    const headers = {
        "authorization": `Bearer ${token}`
    }

    if (isCreate) {
        toggleLoader(true)
        url = `${mainURL}/posts`
        axios.post(url, formData, {
                headers: headers
            })
            .then(function (response) {
                // console.log(response);
                if (response.status == 201) {
                    document.getElementById("close-btn-addPostModal").click()
                    showAlert("Post Published Successfully", "success", successPath)
                    closeAlert()
                }
            })
            .catch(function (error) {
                // console.log(error.response.data.message);
                showAlert(`${error.response.data.message}`, "warning", warningPath)
                closeAlert()
                titleInputPost.value = ""
                bodyInputPost.value = ""
                imgInputPost.value = ""
            })
            .finally(() => {
                toggleLoader(false)
            })
    } else {
        toggleLoader(true)
        formData.append("_method", "put")
        url = `${mainURL}/posts/${postId}`
        axios.post(url, formData, {
                headers: headers
            })
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    document.getElementById("close-btn-addPostModal").click()
                    showAlert("Post Edited successfully", "success", successPath)
                    closeAlert()
                }
            })
            .catch(function (error) {
                showAlert(`${error.response.data.error_message}`, "warning", warningPath)
                closeAlert()
            })
            .finally(() => {
                toggleLoader(false)
            })
    }


}


// ! Delete Post ...
function deletePost(postId) {
    // console.log(postId);
    const token = localStorage.getItem("token")
    const headers = {
        "authorization": `Bearer ${token}`
    }
    let confirmDelete = confirm("are you sure")
    if (confirmDelete == true) {
        toggleLoader(true)
        axios.delete(`${mainURL}/posts/${postId}`, {
                headers: headers
            })
            .then((response) => {
                // console.log(response);
                showAlert("Post Deleted successfully", "success", successPath)
                closeAlert()
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                toggleLoader(false)
            })
    }
}


// ! Get User Id
function getUserId(userId) {
    // alert(userId)
    window.location = `profile.html?userid=${userId}`
}


// ! Get Current User
function getCurrentUserId() {
    const urlParams = new URLSearchParams(window.location.search)
    // console.log(urlParams);
    const id = urlParams.get("userid")
    // console.log(id);
    return id
}


// ! Profile Clicked
function profileClicked() {
    if (localStorage.getItem("token") != null) {
        const user = JSON.parse(localStorage.getItem("user"))
        console.log(user);
        console.log(user.id);
        window.location = `profile.html?userid=${user.id}`
    }
}


// ! Toggle Loader
function toggleLoader(show = true) {
    if (show) {
        document.getElementById("loader").style.visibility = "visible"
    } else {
        document.getElementById("loader").style.visibility = "hidden"
    }
}