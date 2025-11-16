console.log("SMP Creator modern website loaded!");

// ---------------------
// Server Status (dummy)
document.getElementById('server-status').innerText = 'Online';
document.getElementById('player-count').innerText = '12/50';

// ---------------------
// Discord online dummy
document.getElementById('discord-online').innerText = '12';
document.getElementById('discord-messages').innerHTML = `
<li>[Admin] Welkom op de server!</li>
<li>[Mod] Vergeet niet de regels te lezen.</li>
<li>[VIP] Nieuwe event start morgen!</li>
`;

// ---------------------
// Report Form
const webhookURL = "https://discordapp.com/api/webhooks/1439640247028945048/uKjEIqtAOZOoHAeWMU3hlITcf-N63y_BOghUUH71cZUO_jVA4bnXFi4IMz3kj5oaB8rT";
const reportForm = document.getElementById("report-form");
const feedback = document.getElementById("report-feedback");

reportForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const name = document.getElementById("player-name").value;
    const type = document.getElementById("report-type").value;
    const message = document.getElementById("report-message").value;
    if(!name||!type||!message){ feedback.innerText="Vul alle velden in!"; feedback.style.color="red"; return; }
    const payload={content:`**Nieuwe Report**\n**Speler:** ${name}\n**Type:** ${type}\n**Bericht:** ${message}`};
    try {
        const res = await fetch(webhookURL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
        if(res.ok){ feedback.innerText="Report succesvol verzonden!"; feedback.style.color="#2e7d32"; reportForm.reset(); }
        else{ feedback.innerText="Er is iets fout gegaan."; feedback.style.color="red"; }
    } catch(err){ feedback.innerText="Kan geen verbinding maken met Discord."; feedback.style.color="red"; }
});

// ---------------------
// Admin Login
const loginForm = document.getElementById("login-form");
const loginFeedback = document.getElementById("login-feedback");

loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const user = document.getElementById("login-name").value;
    const pass = document.getElementById("login-pass").value;
    if(user==="admin" && pass==="admin123"){
        loginFeedback.innerText=`Welkom, ${user}!`;
        loginFeedback.style.color="#2e7d32";
        loginForm.reset();
        document.getElementById("admin-news").style.display="block";
    } else{
        loginFeedback.innerText="Verkeerde gebruikersnaam of wachtwoord!";
        loginFeedback.style.color="red";
    }
});

// ---------------------
// Admin Nieuws
const adminNewsForm = document.getElementById("admin-news-form");
const adminFeedback = document.getElementById("admin-feedback");
const newsList = document.getElementById("news-list");

adminNewsForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const title = document.getElementById("news-title").value;
    const message = document.getElementById("news-message").value;
    if(title && message){
        const card = document.createElement("div");
        card.className="card";
        card.innerHTML=`<h3>${title}</h3><p>${message}</p>`;
        newsList.prepend(card);
        adminFeedback.innerText="Nieuws succesvol toegevoegd!";
        adminFeedback.style.color="#2e7d32";
        adminNewsForm.reset();
    } else{
        adminFeedback.innerText="Vul alle velden in!";
        adminFeedback.style.color="red";
    }
});

// ---------------------
// Minimapsysteem (dummy data)
const map = document.getElementById('minimap');
const ctx = map.getContext('2d');

function getColorByRank(rank){
    switch(rank){
        case 'Admin': return 'red';
        case 'VIP': return 'gold';
        case 'Builder': return 'green';
        default: return 'blue';
    }
}

async function fetchPlayers(){
    // Vervang later met echte API
    return [
        {name:"Steve", rank:"VIP", x:50, y:120},
        {name:"Alex", rank:"Builder", x:200, y:90},
        {name:"Nass", rank:"Admin", x:300, y:50}
    ];
}

async function updateMinimap(){
    const players = await fetchPlayers();
    ctx.clearRect(0,0,map.width,map.height);
    players.forEach(p=>{
        ctx.fillStyle=getColorByRank(p.rank);
        ctx.beginPath();
        ctx.arc(p.x,p.y,7,0,2*Math.PI);
        ctx.fill();

        // Tooltip bij hover
        map.addEventListener('mousemove', e=>{
            const rect = map.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            if(Math.hypot(mx-p.x,my-p.y)<7){
                map.title=`${p.name} (${p.rank})`;
            }
        });
    });
}
updateMinimap();
setInterval(updateMinimap,10000);
