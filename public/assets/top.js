const form = document.querySelector("form");
const gameName = document.querySelector("#gameName");
const winnerCount = document.querySelector("#winnerCount");
const count = document.querySelector("#count");
const submitBtn = document.querySelector("#submitBtn");
const urlBar = document.querySelector("#urlBar");

submitBtn.addEventListener("click", async () => {
    if (validation()) {
        try {
            const url = await fetch("/create-room", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    gameName: gameName.value,
                    winnerCount: winnerCount.value,
                    count: count.value,
                }),
            }).then((res) => res.json());

            // urlを表示
            urlBar.classList.remove("hidden");
            urlBar.textContent = window.origin + url;

            //formリセット
            form.reset();
        } catch (error) {
            alert(error.response.data);
        }
    }
});

function validation() {
    if (!gameName.value || !winnerCount || !count) {
        alert("入力されない項目があります。");
        return false;
    }
    return true;
}
