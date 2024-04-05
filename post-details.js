const urlParams = new URLSearchParams(window.location.search)
const id = urlParams.get("postId")

setupUI()

function getPost() {
    toggleLoader(true)
    axios.get(`${mainURL}/posts/${id}`)
        .then((response) => {
            toggleLoader(false)
            // console.log(response);
            // console.log(response.data.data.author.profile_image);
            const post = response.data.data
            const comments = post.comments
            const userName = post.author.username

            if (response.status == 200) {
                document.querySelector("#user-name-post span").innerText = userName
            }

            let postTitle = ""
            if (post.title != null) {
                postTitle = post.title
            }

            let isMyPost = "d-none"

            if (localStorage.getItem("token") != null) {
                if (JSON.parse(localStorage.getItem("user")).id == post.author.id) {
                    isMyPost = "d-inline"
                }
            }

            const content = `
            <div class="card border border-black rounded-4 shadow" style="cursor: default;">
                <div class="card-header d-flex justify-content-between p-3">
                    <div onclick="getUserId(${post.author.id})" id="get-user-id">
                        <img style="border-color: #9671B0 !important; width: 30px; height: 30px;"
                            class="rounded-circle border border-2" src="${post.author.profile_image}" alt="">
                        <b>@${post.author.username}</b>
                    </div>
                    <div class="${isMyPost}" id="edit-or-delete-post">
                        <button class="border p-2  rounded-3 bg-secondary text-white" onclick="editPost('${encodeURIComponent(JSON.stringify(post))}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                        </button>
                        <button class="border p-2  rounded-3 bg-danger text-white" onclick="deletePost(${post.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <img src="${post.image}" style="height: 500px; width: 100%;"
                        class="border border-black img-fluid rounded-2" alt="">
                    <h6 class="text-body-tertiary mt-1">${post.created_at}</h6>
                    <h5>${postTitle}</h5>
                    <p>${post.body}</p>
                    <hr>
                    <div id="comments">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                            class="bi bi-chat-square-dots" viewBox="0 0 16 16">
                            <path
                                d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                            <path
                                d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
                        </svg>
                        <span>
                            (${post.comments_count}) comments
                        </span>
                        <div class="tags text-white" id="post-tags-${post.id}" style="display: inline;">
                
                        </div>
                    </div>
                    <div class="rounded-4 border border-black pt-4 ps-4 pe-4 pb-4 mt-4"
                        style="background-color: #f0ecff ;">
                        <div class="container">
                            <div id="comments-container">
                                
                            </div>
                            <div id="send-comment"
                                class="d-none justify-content-center align-items-center gap-2">
                                <input onclick="clickInput()" type="text" class="rounded-2 border border-black w-100 p-2 ps-3"
                                    id="input-comment" placeholder="send a comment">
                                <button onclick="sendComment(${post.id})" class="border border-black rounded-2 btn-primary text-white p-1 px-3"
                                    id="btn-send-comment" style="font-weight: 600; font-size: 21.5px;">send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `

            document.getElementById("post").innerHTML = content
            // console.log(post.tags);

            let currentPostTagId = `post-tags-${post.id}`
            for (tag of post.tags) {
                let tagsContent = `<span class="rounded-5">${tag.name}</span>`
                document.getElementById(currentPostTagId).innerHTML += tagsContent
            }
            // console.log("comments", comments);
            for (comment of comments) {
                // console.log(comment.author.username, ":", comment.body);
                let commentContent = `
                            <div class="users-comments mb-4">
                                <div id="user-info" class=" rounded-2 gap-2 mb-2">
                                    <img id="user-img" style="border-color: #9671B0 !important;"
                                        class="border border-2 rounded-circle me-1" src="${comment.author.profile_image}" alt="">
                                    <b id="username" class="pt-1">${comment.author.username}</b>
                                </div>
                                <h6 class="ms-1" id="comment">${comment.body}</h6>
                            </div>
                            `
                document.getElementById("comments-container").innerHTML += commentContent
            }
            if (localStorage.getItem("token") != null) {
                document.getElementById("send-comment").setAttribute("style", "display:flex !important;")
            }
        })
}
getPost()


function sendComment() {
    if (localStorage.getItem("token") != null) {
        let inputComment = document.getElementById("input-comment").value
        if (inputComment != "") {
            let params = {
                "body": inputComment
            }
            const token = localStorage.getItem("token")
            const headers = {
                "authorization": `Bearer ${token}`
            }
            toggleLoader(true)
            axios.post(`${mainURL}/posts/${id}/comments`, params, {
                    headers: headers
                })
                .then((response) => {
                    toggleLoader(false)
                    // console.log(response);
                    getPost()
                })
            inputComment = ""
            showAlert("Your comment sent successfully", "success", successPath)
            closeAlert()
        } else {
            showAlert("Please enter your comment", "warning", warningPath)
            closeAlert()
        }
    } else {
        showAlert("Login or Sign In to Send your comment", "danger", warningPath)
        closeAlert()
    }
}

function clickInput() {
    if (localStorage.getItem("token") != null) {
        let inputComment = document.getElementById("input-comment")
        inputComment.addEventListener("keypress", (event) => {
            if (event.key == "Enter") {
                event.preventDefault()
                document.getElementById("btn-send-comment").click()
            }
        })
    } else {
        showAlert("Login or Sign In to Send your comment", "danger", warningPath)
        closeAlert()
    }
}