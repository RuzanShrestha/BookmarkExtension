chrome.bookmarks.onCreated.addListener((id, bookmark) => {
    let categories = {
        "Work": ["docs", "slack", "notion", "jira", "trello"],
        "News": ["news", "bbc", "cnn", "nytimes", "guardian"],
        "Shopping": ["amazon", "ebay", "shopify", "bestbuy"],
        "Social Media": ["facebook", "twitter", "instagram", "linkedin"],
        "Entertainment": ["youtube", "netflix", "spotify", "twitch"],
        "Education": ["wikipedia", "khanacademy", "coursera", "udemy"]
    };

    let url = bookmark.url.toLowerCase();
    let title = bookmark.title.toLowerCase();
    let category = "Uncategorized";
    let maxMatches = 0; // Track most keyword matches

    // Improved categorization logic
    for (let cat in categories) {
        let matches = categories[cat].filter(keyword => url.includes(keyword) || title.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            category = cat;
        }
    }

    // Save categorized bookmark
    chrome.storage.local.get({ categorizedBookmarks: {} }, (data) => {
        let categorizedBookmarks = data.categorizedBookmarks;
        if (!categorizedBookmarks[category]) {
            categorizedBookmarks[category] = [];
        }
        categorizedBookmarks[category].push({ title: bookmark.title, url: bookmark.url });

        chrome.storage.local.set({ categorizedBookmarks });
    });
});
