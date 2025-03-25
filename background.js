// Define getCategory BEFORE any logic uses it
function getCategory(bookmark) {
    const categories = {
        "Work": ["docs", "slack", "notion", "jira", "trello"],
        "News": ["news", "bbc", "cnn", "nytimes", "guardian"],
        "Shopping": ["amazon", "ebay", "shopify", "bestbuy"],
        "Social Media": ["facebook", "twitter", "instagram", "linkedin"],
        "Entertainment": ["youtube", "netflix", "spotify", "twitch"],
        "Education": ["wikipedia", "khanacademy", "coursera", "udemy"]
    };

    const url = bookmark.url?.toLowerCase() || "";
    const title = bookmark.title?.toLowerCase() || "";

    let category = "Uncategorized";
    let maxMatches = 0;

    for (let cat in categories) {
        let matches = categories[cat].filter(keyword =>
            url.includes(keyword) || title.includes(keyword)
        ).length;

        if (matches > maxMatches) {
            maxMatches = matches;
            category = cat;
        }
    }

    return category;
}

// When a bookmark is created in Chrome
chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    categorizeBookmark(bookmark);
});

// Handle messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "recategorize_bulk" && message.bookmarks) {
        chrome.storage.local.get({ categorizedBookmarks: {} }, (data) => {
            let categorizedBookmarks = data.categorizedBookmarks;

            message.bookmarks.forEach(bookmark => {
                const category = getCategory(bookmark);
                if (!categorizedBookmarks[category]) {
                    categorizedBookmarks[category] = [];
                }

                const exists = categorizedBookmarks[category].some(b => b.url === bookmark.url);
                if (!exists) {
                    categorizedBookmarks[category].push({
                        title: bookmark.title,
                        url: bookmark.url
                    });
                }
            });

            chrome.storage.local.set({ categorizedBookmarks }, () => {
                console.log("All bookmarks saved via bulk recategorization.");
                sendResponse({ success: true });
            });
        });

        return true; // Keep message channel open
    }

    if (message.action === "recategorize" && message.bookmark) {
        categorizeBookmark(message.bookmark);
    }
});

// Single-bookmark categorization function
function categorizeBookmark(bookmark) {
    chrome.storage.local.get({ categorizedBookmarks: {} }, (data) => {
        let categorizedBookmarks = data.categorizedBookmarks;
        const category = getCategory(bookmark);

        if (!categorizedBookmarks[category]) {
            categorizedBookmarks[category] = [];
        }

        const exists = categorizedBookmarks[category].some(b => b.url === bookmark.url);
        if (!exists) {
            categorizedBookmarks[category].push({
                title: bookmark.title,
                url: bookmark.url
            });

            chrome.storage.local.set({ categorizedBookmarks }, () => {
                console.log(`Saved "${bookmark.title}" under category "${category}"`);
            });
        }
    });
}
