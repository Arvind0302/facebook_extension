const output = document.getElementById('output');
document.getElementById("fetchData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const url = new URL(tabs[0].url);
      if (url.hostname.includes('facebook.com')) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: fetchAllFacebookData
        },
        (results) => {
          output.innerHTML = '';
          if (results && results.length > 0) {
            const friends = results[0].result;
            friends?.forEach(friend => {
              const li = document.createElement('li');
              const a = document.createElement('a');
              a.href = friend.url;
              a.textContent = friend.name;
              a.target = '_blank'; // Open link in a new tab
              const span = document.createElement('span');
              span.textContent = friend.mutual;
              li.appendChild(a);
              li.appendChild(document.createTextNode(' - ')); // Add separator
              li.appendChild(span);
              output.appendChild(li);
            });
          } else {
            const li = document.createElement('li');
            li.textContent = 'No friends found or unable to fetch data.';
            output.appendChild(li);
          }
        }
      );
    } else {
      output.innerHTML = '<li>This extension can only be used on Facebook pages.</li>';
    }
  }
  else
  {
    console.error("No active tab found");

  }
  });
});

function fetchAllFacebookData() {
  let friends = [];
  const data = document.querySelectorAll('div[data-visualcompletion="ignore-dynamic"]');
  
  for (let i = 1; i < data.length; i++) {
    
    var anchorTag = data[i].getElementsByTagName("a")[0];
    const spanElements = anchorTag?.querySelectorAll('span');
    if(spanElements)
    {
      const url = anchorTag.getAttribute("href");
      const name = spanElements[2].innerText;
      const mutual = spanElements.length==6 ? spanElements[5].innerText : "No mutual friends";
      console.log(url, name, mutual);
      friends.push({name, url, mutual});
    }
    else
  {
    console.log("account deactivated");
  }

    }
  return friends;
}










    // const name = data[i + 1].getAttribute("aria-label");
    // let mutual = "No mutual friends";
    // if(spanElements)
    // {
    //   console.log("span", spanElements[2], spanElements[5]);
    // }
    // friends.push({ name, url});