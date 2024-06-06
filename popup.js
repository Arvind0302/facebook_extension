document.getElementById("fetchData").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: fetchAllFacebookData,
        },
        (results) => {
          console.log("output is ", results);
        }
      );
    });
  });
  
function fetchAllFacebookData() {
    let friends = [];
    let count = 1;
    document
      .querySelectorAll('div.x135pmgq a')
      .forEach((item) => {
        const url = item.getAttribute('href');
        console.log(url, count);
        count++;
        //   friends.push({ name, mutualFriends, profileUrl });
        // }
      });
    return friends;
  }

