/* ================= LOGIN / REGISTER ================= */

const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const user = {
            name: regName.value,
            email: regEmail.value,
            password: regPassword.value
        };

        localStorage.setItem("civicUser", JSON.stringify(user));
        alert("Registration successful!");
        window.location.href = "login.html";
    });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem("civicUser"));

        if (
            storedUser &&
            storedUser.email === loginEmail.value &&
            storedUser.password === loginPassword.value
        ) {
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid credentials!");
        }
    });
}

/* ================= LOGOUT ================= */

function logout() {
    window.location.href = "login.html";
}

/* ================= SECTION SWITCH ================= */

function showSection(id, event) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    document.querySelectorAll(".sidebar li").forEach(li => li.classList.remove("active"));
    event.target.classList.add("active");
}

/* ================= COUNTERS ================= */

function animateCounter(id, target) {
    let count = 0;
    const element = document.getElementById(id);
    const interval = setInterval(() => {
        count += Math.ceil(target / 100);
        if (count >= target) {
            count = target;
            clearInterval(interval);
        }
        element.innerText = count;
    }, 20);
}

/* ================= LOAD DASHBOARD ================= */

if (document.getElementById("myChart")) {

    new Chart(document.getElementById("myChart"), {
        type: "bar",
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May"],
            datasets: [{
                label: "Complaints",
                data: [12, 19, 8, 15, 22],
                backgroundColor: "#00c6ff"
            }]
        }
    });

    animateCounter("complaints", 128);
    animateCounter("users", 540);
    animateCounter("resolved", 95);

    const table = document.getElementById("reportData");
    const data = [
        {id:1, issue:"Water Leakage", status:"Resolved"},
        {id:2, issue:"Street Light Issue", status:"Pending"},
        {id:3, issue:"Garbage Delay", status:"In Progress"}
    ];

    data.forEach(d => {
        table.innerHTML += `<tr>
            <td>${d.id}</td>
            <td>${d.issue}</td>
            <td>${d.status}</td>
        </tr>`;
    });

    setInterval(() => {
        document.getElementById("notification").style.display = "block";
        setTimeout(() => {
            document.getElementById("notification").style.display = "none";
        }, 3000);
    }, 10000);
}

/* ================= PREMIUM PARTICLES ================= */

const canvas = document.getElementById("bgCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    for (let i = 0; i < 120; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x > canvas.width || p.x < 0) p.speedX *= -1;
            if (p.y > canvas.height || p.y < 0) p.speedY *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = "#00c6ff";
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
async function loadPetitions() {
  const location = document.getElementById("filterLocation")?.value || "";
  const category = document.getElementById("filterCategory")?.value || "";
  const status = document.getElementById("filterStatus")?.value || "";

  let query = [];

  if (location) query.push(`location=${location}`);
  if (category) query.push(`category=${category}`);
  if (status) query.push(`status=${status}`);

  let url = "http://localhost:5000/api/petitions";
  if (query.length > 0) {
    url += "?" + query.join("&");
  }

  const res = await fetch(url);
  const data = await res.json();

  const list = document.getElementById("petitionList");
  list.innerHTML = "";

  data.forEach(p => {
    list.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px;">
        <h3>${p.title}</h3>
        <p>${p.category} | ${p.location}</p>
        <p>Status: ${p.status}</p>
        <button onclick="viewPetition('${p._id}')">View Details</button>
      </div>
    `;
  });
}

function viewPetition(id) {
  window.location.href = `petition-detail.html?id=${id}`;
}

window.onload = loadPetitions;