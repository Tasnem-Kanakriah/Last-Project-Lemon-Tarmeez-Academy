setupUI() // to restart the last case in Local Storage

// ! Infinite Scroll
let currentPage = 1
let lastPage = 1
window.addEventListener("scroll", () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight
    if (endOfPage && currentPage < lastPage) {
        currentPage += 1
        getPosts(mainURL, currentPage)
    }
})


// ! Start Add A New Post ...
function startAddNewPost() {
    document.getElementById("new-post").addEventListener("click", () => {
        // ! how i can focus on username Input when open modal
        const titleInputPost = document.getElementById("post-title-input")
        const bodyInputPost = document.getElementById("post-body-input")
        const imgInputPost = document.getElementById("post-img-input")
        const post = document.getElementById("addPost-btn-addPostModal")

        titleInputPost.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                bodyInputPost.focus()
            }
        })
        bodyInputPost.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                imgInputPost.focus()
            }
        })
        imgInputPost.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                post.focus()
            }
        })
    })
}
startAddNewPost()


// ! Get Posts From Api ...
function getPosts(url, page = 1) {
    toggleLoader(true)
    axios.get(`${url}/posts?limit=15&page=${page}`)
        .then((response) => {
            toggleLoader(false)
            // console.log(response);
            const posts = response.data.data
            lastPage = response.data.meta.last_page
            for (post of posts) {
                // console.log(post);
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

                let content = `
                <div class="card border border-black rounded-4 shadow">
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
                    <div class="card-body" onclick="showPost(${post.id})">
                        <img src="${post.image}" style="height: 500px; width: 100%;" class="img-fluid border border-black rounded-2"
                            alt="">
                        <h6 class="text-body-tertiary mt-1">${post.created_at}</h6>
                        <h5>${postTitle}</h5>
                        <p>${post.body}</p>
                        <hr>
                        <div class="comments">
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
                    </div>
                </div>
                `

                document.getElementById("posts").innerHTML += content

                let currentPostTagId = `post-tags-${post.id}`
                for (tag of post.tags) {
                    let tagsContent = `<span class="rounded-5 ">${tag.name}</span>`
                    document.getElementById(currentPostTagId).innerHTML += tagsContent
                }
            }
        })
}
getPosts(mainURL)
// getPosts(mainURL, 2273)