chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getData') {
    const scripts = Array.from(document.scripts).map(script => script.src).filter(src => src);
    const uniqueScripts = [...new Set(scripts)];
    sendResponse(uniqueScripts);
  }
});