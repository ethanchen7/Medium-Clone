addEventListener("DOMContentLoaded", e => {

    handleModalPopUp();

    // handle comment creation
    const comment = document.getElementById("new-comment-box");
    const submit = document.getElementById("new-comment-submit");
    const cancel = document.getElementById("new-comment-cancel");

    let text;

    cancel.addEventListener("click", () => {
        comment.value = "";
        submit.style.backgroundColor = "rgba(27, 137, 23, 0.339)"
        toggleFooter();
    })

    comment.addEventListener("click", toggleFooter)

    comment.addEventListener("keyup", () => {
        text = comment.value;
        if (text) {
            submit.style.backgroundColor = "rgba(27, 137, 23)";
        } else {
            submit.style.backgroundColor = "rgba(27, 137, 23, 0.339)";
        };
    });

    submit.addEventListener("mouseover", () => {
        if (text) {
            submit.style.backgroundColor = "rgba(27, 137, 23, 0.80)";
        }
    })

    submit.addEventListener("mouseleave", () => {
        if (text) {
            submit.style.backgroundColor = "rgba(27, 137, 23)";
        }
    })

    submit.addEventListener("click", async () => {

        const url = window.location.href.split("/");
        const storyId = url[url.length - 1];

        if (text) {
            const res = await fetch("/comment", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text,
                    storyId,
                }),
            })

            const data = await res.json();

            const { message, user } = data;

            if (message === 'success') {
                comment.value = "";

                const userId = user.id;

                // comment container
                const newComment = document.createElement("div");
                newComment.setAttribute("class", "comment-container");
                // comment header
                const commentHeader = document.createElement("div");
                commentHeader.setAttribute("class", "comment-container-header");
                // comment user image container
                const commentUserImg = document.createElement("div");
                commentUserImg.setAttribute("class", "comment-user-img");
                // actual image
                const img = document.createElement("img");
                img.setAttribute("src", "/images/logo.png");
                // user info container
                const commentUserInfo = document.createElement("div");
                commentUserInfo.setAttribute("class", "comment-user-info");
                // author of comment
                const commentAuthor = document.createElement("a");
                commentAuthor.setAttribute("class", "comment-author");
                commentAuthor.setAttribute("href", `/users/${userId}`);
                commentAuthor.innerText = `${user.firstName} ${user.lastName}`;
                // days ago
                const commentDaysAgo = document.createElement("div");
                commentDaysAgo.setAttribute("class", "comment-daysAgo");
                commentDaysAgo.innerText = "posted just now.";
                // comment content
                const commentContent = document.createElement("div");
                commentContent.setAttribute("class", "comment-content");
                commentContent.innerText = text;

                // append children as necessary
                newComment.appendChild(commentHeader);
                newComment.appendChild(commentContent);
                commentHeader.appendChild(commentUserImg);
                commentHeader.appendChild(commentUserInfo);
                commentUserImg.appendChild(img);
                commentUserInfo.appendChild(commentAuthor);
                commentUserInfo.appendChild(commentDaysAgo);

                // put this new comment at top of list
                const commentList = document.getElementById("comment-list");
                const firstComment = commentList.children[0];
                if (firstComment) {
                    firstComment.insertAdjacentElement("beforebegin", newComment);
                } else {
                    commentList.appendChild(newComment);
                }

                removeWowEmpty();
                updateResponseNumber();
            };
        };
    });
});


const handleModalPopUp = () => {
    const commentModal = document.getElementById("comment-modal");

    // comment button toggle
    const commentButton = document.getElementById('commentButton');

    commentButton.addEventListener("click", () => {

        commentModal.classList.toggle("hideCommentModal");
        commentModal.classList.toggle("showCommentModal");

    })

    // cancel button
    const cancelButton = document.getElementById("new-comment-cancel")
    cancelButton.addEventListener("click", () => {

        commentModal.classList.toggle("hideCommentModal");
        commentModal.classList.toggle("showCommentModal");
    })

    // x out button
    const xOut = document.getElementById("comment-close-out");
    xOut.addEventListener("click", () => {

        commentModal.classList.toggle("hideCommentModal");
        commentModal.classList.toggle("showCommentModal");
    })
}

const updateResponseNumber = () => {
    const modalTitle = document.getElementById("comment-modal-title");
    const modalTitleText = modalTitle.innerText
    const openParen = modalTitleText.indexOf("(")
    const closeParen = modalTitleText.indexOf(")")
    const number = parseInt(modalTitle.innerText.slice(openParen + 1, closeParen)) + 1;

    modalTitle.innerText = `Responses (${number})`
}

const removeWowEmpty = () => {
    const wowEmpty = document.getElementById("wow-empty")

    if (wowEmpty) {
        wowEmpty.remove();
    }
}

let footerCount = 0;
const toggleFooter = () => {
    const footer = document.getElementById("new-comment-container-footer");
    console.log(footerCount)
    if (footerCount % 2 === 0) {
        footer.style.display = "flex";
        footerCount++;
    } else {
        footer.style.display = "none";
        footerCount++;
    }
}