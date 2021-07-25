// import socket from "./socket.js";

const title = document.querySelector("title");
const pageTopSection = document.querySelector(".top");
const userNameInput = pageTopSection.querySelector("input");
const pageBottomSection = document.querySelector(".bottom");
const paths = window.location.pathname.split("/");
const submitBtn = document.querySelector("#submitBtn");
const roomId = paths[paths.length - 1];
title.textContent = roomId;

submitBtn.addEventListener("click", async () => {
    try {
        const res = await axios.post("/room/" + roomId + "/add-user", {
            roomId,
            userName: userNameInput.value,
        });

        window.roomId = roomId;
        window.user = res.data;

        await import("./roomSocket.js");

        pageTopSection.remove();
        pageBottomSection.classList.remove("hidden");
    } catch (error) {
        alert("ユーザー追加に失敗しました！ \n" + error.response.data);
    }
});
