const output = document.getElementById("output");
// added eventListener to button to scrape data
document.getElementById("fetchData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const url = new URL(tabs[0].url);
      if (url.hostname.includes("facebook.com")) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: fetchAllFacebookData,
          },
          (results) => {
            // make a list of returned array and populate the list in HTML
            output.innerHTML = "";
            if (results && results.length > 0) {
              const friends = results[0].result;
              friends?.forEach((friend) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = friend.url;
                a.textContent = friend.name;
                a.target = "_blank";
                const span = document.createElement("span");
                span.textContent = friend.mutual;
                li.appendChild(a);
                li.appendChild(document.createTextNode(" - "));
                li.appendChild(span);
                output.appendChild(li);
              });
            } else {
              const li = document.createElement("li");
              li.textContent = "No friends found or unable to fetch data.";
              output.appendChild(li);
            }
          }
        );
      } else {
        output.innerHTML =
          "<li>This extension can only be used on Facebook pages.</li>";
      }
    } else {
      console.error("No active tab found");
    }
  });
});

async function fetchAllFacebookData() {
  let friends = [];
  const container = document.querySelector(
    'div[aria-label="All friends"][role="navigation"]>div>div:nth-child(2)'
  );
  console.log("container", container);
  console.log("before scrolling", container.scrollTop);

  // function to scroll page 
  async function scrollPage() {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 500;
      const scrollInterval = setInterval(() => {
        const scrollHeight = container.scrollHeight;
        container.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
      }, 1000);
    });
  }

  // wait until data is being loaded and then scroll again
  async function scrollAndWait() {
    while (true) {
      const beforeScroll = container.scrollY;
      await scrollPage();
      const afterScroll = container.scrollY;
      if (beforeScroll === afterScroll) {
        break;
      }
    }
  }

  await scrollAndWait();

  console.log("after scrolling", container.scrollTop);

  // scrape the required data from HTML elements
  const data = document.querySelectorAll(
    'div[data-visualcompletion="ignore-dynamic"]'
  );
  for (let i = 1; i < data.length; i++) {
    var anchorTag = data[i].getElementsByTagName("a")[0];
    const spanElements = anchorTag?.querySelectorAll("span");
    if (spanElements) {
      const url = anchorTag.getAttribute("href");
      const name = spanElements[2].innerText;
      const mutual =
        spanElements.length == 6
          ? spanElements[5].innerText
          : "No mutual friends";
      friends.push({ name, url, mutual });
    }
  }
  console.log("friends Data", friends);
  return friends;
}
