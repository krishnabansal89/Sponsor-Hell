console.log('Background script running');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request);
    if (request.action === 'getTimings') {
        fetch(`http://localhost:3000/api/caption` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({videoId: request.videoId})
        })
            .then(response => response.json())
            .then(data => sendResponse(data))
            .catch(error => console.log(error));
        return true;
    }
});
