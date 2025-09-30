const attractionsContainer=document.getElementById("attractions-container"),visitMessage=document.getElementById("visit-message"),STORAGE_KEY="lastVisitDate";async function loadAttractions(){try{let t=await fetch("data/attractions.json");if(!t.ok)throw Error(`HTTP error! status: ${t.status}`);let a=await t.json(),e=a.attractions;if(!e||0===e.length)throw Error("No attractions data available");displayAttractions(e)}catch(n){console.error("Error loading attractions:",n),displayError("Failed to load attractions. Please try again later.")}}function displayAttractions(t){attractionsContainer.innerHTML="",t.forEach(t=>{let a=createAttractionCard(t);attractionsContainer.appendChild(a)})}function createAttractionCard(t){let a=document.createElement("article");a.className="attraction-card",a.innerHTML=`
    <h2>${t.name}</h2>
    <figure>
        <img src="${t.image}" alt="${t.name}" class="attraction-image" loading="lazy" 
             onerror="this.onerror=null; this.src='images/placeholder.jpg'; this.alt='Image coming soon'; this.style.backgroundColor='#f0f0f0'; this.style.padding='2rem';">
        <figcaption style="display: none;">${t.name}</figcaption>
    </figure>
    <div class="attraction-address">${t.address}</div>
    <p class="attraction-description">${t.description}</p>
    <button class="learn-more-btn" data-id="${t.id}">Learn More</button>
`;let e=a.querySelector(".learn-more-btn");return e.addEventListener("click",()=>{console.log("Learn More clicked for:",t.name),showAttractionDetails(t)}),a}function showAttractionDetails(t){console.log("showAttractionDetails called with:",t),alert(`More information about: ${t.name}

Address: ${t.address}

Description: ${t.description}`)}function updateVisitMessage(){let t=Date.now(),a=localStorage.getItem(STORAGE_KEY),e=visitMessage.querySelector("p");if(a){let n=parseInt(a),o=Math.floor((t-n)/864e5);0===o?e.textContent="Back so soon! Awesome!":1===o?e.textContent="You last visited 1 day ago.":e.textContent=`You last visited ${o} days ago.`}else e.textContent="Welcome! Let us know if you have any questions.";localStorage.setItem(STORAGE_KEY,t.toString())}function displayError(t){attractionsContainer.innerHTML=`
    <div class="error-message">
        <p>${t}</p>
        <button onclick="loadAttractions()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
    </div>
`}document.addEventListener("DOMContentLoaded",async function(){await loadAttractions(),updateVisitMessage()});