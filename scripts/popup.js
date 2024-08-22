document.addEventListener('DOMContentLoaded', function() {
    const dynamicContentUL = document.getElementById('linkList');
    
    // Send a message to the content script to get data
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getData' }, function(response) {
        if (response) {
          console.log(response);
          const newContent = document.createElement('p');
          let responseData = response;
          regex = /(?<=(\"|\'|\`))\/[a-zA-Z0-9_?&=\/\-\#\.]*(?=(\"|\'|\`))/g;
          const results = new Set;
          for (var i = 0; i < responseData.length; i++) {
              var t = responseData[i];
              "" != t && fetch(t).then(function(t) {
                  return t.text()
              }).then(function(t) {
                  var e = t.matchAll(regex);
                  for (let r of e) results.add(r[0])
              }).catch(function(t) {
                  console.log("An error occurred: ", t)
              })
          }
          var pageContent = document.documentElement.outerHTML,
              matches = pageContent.matchAll(regex);
          for (const match of matches) results.add(match[0]);
          
          function writeResults() {
              all_results = ""
              arr_results = Array.from(results)
              arr_results.sort()
              arr_results = new Set(arr_results)
              arr_results.forEach(function(t) {
                  all_results+='<li>'+t+'</li>'
              })
              newContent.innerHTML = all_results;
              dynamicContentUL.appendChild(newContent);

              // Get references to the input and the list
              const filterInput = document.getElementById('filterInput');
              const linkList = document.getElementById('linkList');
              const listItems = linkList.getElementsByTagName('li');

              // Add an event listener for the input
              filterInput.addEventListener('input', function() {
                const filterText = filterInput.value.toLowerCase();

                // Loop through all list items and filter them based on the input value
                for (let i = 0; i < listItems.length; i++) {
                  const itemText = listItems[i].textContent.toLowerCase();
                  if (itemText.includes(filterText)) {
                    listItems[i].style.display = ''; // Show the item
                  } else {
                    listItems[i].style.display = 'none'; // Hide the item
                  }
                }
              });
          }
          setTimeout(writeResults, 3e3);
        } else {
          const newContent = document.createElement('p');
          newContent.textContent = "Failed to get data from the webpage.";
          dynamicContentUL.appendChild(newContent);
        }
      });
    });
  });