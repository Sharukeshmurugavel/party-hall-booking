// ===== LOGIN PAGE =====
const loginForm = document.getElementById('loginForm');
const roleSelect = document.getElementById('role');
const registerLink = document.getElementById('registerLink');
const registerBox = document.getElementById('registerBox');
const loginBox = document.getElementById('loginBox');
const backToLogin = document.getElementById('backToLogin');

// Load users from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let halls = JSON.parse(localStorage.getItem('halls')) || [
    { name: "Royal Palace", city: "Chennai", locality: "T Nagar", capacity: 250 },
    { name: "Sunshine Hall", city: "Bangalore", locality: "MG Road", capacity: 200 },
];
let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

// Show register link only for user role
if(roleSelect){
    roleSelect.addEventListener('change', function(){
        registerLink.style.display = (this.value === 'user') ? 'block' : 'none';
    });
}

// Handle login
if(loginForm){
    loginForm.addEventListener('submit', function(e){
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;

        if(role === 'admin'){
            if(username === 'admin' && password === 'admin'){
                alert("Admin Login Successful!");
                window.location.href = 'admin.html';
            } else {
                alert("Invalid Admin Credentials!");
            }
        } else if(role === 'user'){
            const user = users.find(u => u.username === username && u.password === password);
            if(user){
                alert("User Login Successful!");
                window.location.href = 'index.html';
            } else {
                alert("Invalid Username or Password!");
            }
        }
    });
}

// Show Register Form
document.getElementById('showRegister')?.addEventListener('click', function(e){
    e.preventDefault();
    loginBox.style.display = 'none';
    registerBox.style.display = 'block';
});

// Back to Login
backToLogin?.addEventListener('click', function(e){
    e.preventDefault();
    registerBox.style.display = 'none';
    loginBox.style.display = 'block';
});

// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const regUsername = document.getElementById('regUsername').value;
    const regPassword = document.getElementById('regPassword').value;

    if(users.some(u => u.username === regUsername)){
        alert("Username already exists!");
        return;
    }

    users.push({ username: regUsername, password: regPassword });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Account Created Successfully!");
    registerBox.style.display = 'none';
    loginBox.style.display = 'block';
});

// ===== USER PAGE =====
function searchHalls(){
    let city = document.getElementById('city').value.toLowerCase();
    let locality = document.getElementById('locality').value.toLowerCase();
    let tableBody = document.querySelector('#hallTable tbody');
    tableBody.innerHTML = '';

    halls.forEach(hall => {
        if(hall.city.toLowerCase().includes(city) && hall.locality.toLowerCase().includes(locality)){
            let row = `<tr>
                <td>${hall.name}</td>
                <td>${hall.city}</td>
                <td>${hall.locality}</td>
                <td>${hall.capacity}</td>
                <td><button onclick="bookHall('${hall.name}')">Book</button></td>
            </tr>`;
            tableBody.innerHTML += row;
        }
    });
}

function bookHall(hallName){
    let date = prompt("Enter Function Date (YYYY-MM-DD):");
    let purpose = prompt("Enter Purpose:");
    let people = prompt("Enter Number of People:");
    if(!date || !purpose || !people){
        alert("Please fill all booking details!");
        return;
    }

    let booking = { user: "User", hallName, date, purpose, people };
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert("Hall booked successfully!");
}

// ===== ADMIN PAGE =====
document.getElementById('addHallForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    let hallName = document.getElementById('hallName').value;
    let city = document.getElementById('city').value;
    let locality = document.getElementById('locality').value;
    let capacity = document.getElementById('capacity').value;

    halls.push({ name: hallName, city, locality, capacity });
    localStorage.setItem('halls', JSON.stringify(halls));
    alert("Hall added successfully!");
    this.reset();
    displayBookings();
});

function displayBookings(){
    let tableBody = document.querySelector('#bookingTable tbody');
    if(!tableBody) return;
    tableBody.innerHTML = '';
    bookings.forEach(b => {
        let row = `<tr>
            <td>${b.user}</td>
            <td>${b.hallName}</td>
            <td>${b.date}</td>
            <td>${b.purpose}</td>
            <td>${b.people}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

if(document.querySelector('#bookingTable')) displayBookings();
