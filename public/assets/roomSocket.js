import socket from "./socket.js";

const userList = document.querySelector("#users");
const gameNameEl = document.querySelector("#gameName");
const kujiItems = document.querySelector("#kujiItems");

//自分のuserIdを投げる;
socket.emit("join the room", roomId);

socket.on("room", ({ users, gameName, result }) => {
    userList.innerHTML = "";

    if (gameName) gameNameEl.textContent = gameName;

    if (result) console.log(result);

    let dataSrc = users || result;

    dataSrc.forEach((user) => {
        const li = document.createElement("li");

        li.innerHTML = `<span class="font-semibold ${resultUIexecute(
            user.status
        )} shadow rounded p-3 block">${user.name}
      </span>
      <br>
      <span>
        ${resultUIexecute(user.status, "text")}
      </span>
        `;

        userList.appendChild(li);
    });
});

function resultUIexecute(status, type = "class") {
    if (type === "class") {
        return status === "pending"
            ? "bg-white"
            : status === "win"
            ? "bg-blue-500 text-white"
            : status === "lose"
            ? "bg-red-500 text-white"
            : null;
    }

    if (type === "text") {
        return status === "pending"
            ? "準備中"
            : status === "win"
            ? "当たり"
            : status === "lose"
            ? "外れ"
            : "ユーザー待ち";
    }
}
