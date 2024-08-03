
const openOptionsButton = document.querySelector('#openOptions');
if (openOptionsButton) {
    openOptionsButton.addEventListener('click', function () {
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('options.html'));
        }
    });
}
const selectDropdown = document.querySelector('#search-engine');
if (selectDropdown !== null) {
    chrome.storage.local.get(["selectedSearchEngine"]).then((result) => {
        selectedEngine = result.selectedSearchEngine;

        if (selectedEngine !== null) {
            selectDropdown.value = selectedEngine;
        }
    });
    selectDropdown.addEventListener('change', function () {
        const selectedValue = selectDropdown.value;
        chrome.storage.local.set({ "selectedSearchEngine": selectedValue });
    });
}
