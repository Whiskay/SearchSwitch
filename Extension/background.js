chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message === 'openOptions') {
        chrome.runtime.openOptionsPage();
    }
});

const readLocalStorage = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([key], function (result) {
            resolve(result[key]);
        });
    });
};

var selectedSearchEngine = undefined

async function setupContextMenu() {
    selectedSearchEngine = await readLocalStorage('selectedSearchEngine');
    if (selectedSearchEngine === undefined) {
        selectedSearchEngine = "Google";
        chrome.storage.local.set({ "selectedSearchEngine": selectedSearchEngine });
    }
    selectedSearchEngine = selectedSearchEngine.charAt(0).toUpperCase() + selectedSearchEngine.slice(1); // Capitalize first letter
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "searchWithCustomEngine",
        title: "Search '%s' with " + selectedSearchEngine,
        contexts: ["selection"]
    });
}
setupContextMenu()

chrome.storage.onChanged.addListener(function (changes, namespace) {
    setupContextMenu()
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText;
    let searchUrl = '';
    switch (selectedSearchEngine.toLowerCase()) {
        case "google":
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedText)}`;
            break;
        case "duckduckgo":
            searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(selectedText)}`;
            break;
        case "bing":
            searchUrl = `https://www.bing.com/search?q=${encodeURIComponent(selectedText)}`;
            break;
        case "brave":
            searchUrl = `https://www.brave.com/search?q=${encodeURIComponent(selectedText)}`;
            break;
        case "yahoo":
            searchUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(selectedText)}`;
            break;
        case "yandex":
            searchUrl = `https://yandex.com/search/?text=${encodeURIComponent(selectedText)}`;
            break;
        case "baidu":
            searchUrl = `https://www.baidu.com/s?wd=${encodeURIComponent(selectedText)}`;
            break;
        case "naver":
            searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(selectedText)}`;
            break;
        case "qwant":
            searchUrl = `https://www.qwant.com/?q=${encodeURIComponent(selectedText)}`;
            break;
        case "startpage":
            searchUrl = `https://www.startpage.com/do/dsearch?query=${encodeURIComponent(selectedText)}`;
            break;
        case "ecosia":
            searchUrl = `https://www.ecosia.org/search?q=${encodeURIComponent(selectedText)}`;
            break;
        case "swisscows":
            searchUrl = `https://swisscows.com/web?query=${encodeURIComponent(selectedText)}`;
            break;
        case "mojeek":
            searchUrl = `https://www.mojeek.com/search?q=${encodeURIComponent(selectedText)}`;
            break;
        default:
            searchUrl = `https://www.google.com/search?q=${encodeURIComponent(selectedText)}`;
            break;
    }
    chrome.tabs.create({ url: searchUrl });

})
