document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("categorizedBookmarks", (data) => {
        let bookmarks = data.categorizedBookmarks || {};
        let bookmarkList = document.getElementById("bookmarkList");
        bookmarkList.innerHTML = "";

        for (let category in bookmarks) {
            let section = document.createElement("div");
            section.classList.add("category");
            section.innerText = category;
            bookmarkList.appendChild(section);

            bookmarks[category].forEach(bookmark => {
                let link = document.createElement("a");
                link.href = bookmark.url;
                link.innerText = bookmark.title;
                link.target = "_blank";
                bookmarkList.appendChild(link);
            });
        }
    });
});
