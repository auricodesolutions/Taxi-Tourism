
  AOS.init({ duration: 1000, once: true });

// Rates for calculation
const rates = {
  Car: { km: 100, day: 2000 },
  Van: { km: 150, day: 3000 },
  SUV: { km: 200, day: 4000 }
};
const packagePrices = {
  "Colombo → Kandy Tour": 25000,
  "Colombo → Galle Tour": 18000,
  "Colombo → Sigiriya Tour": 27000
};

function calculatePrice() {
  const serviceType = document.getElementById('serviceType').value;
  const vehicleType = document.getElementById('vehicleType').value;
  const days = parseInt(document.getElementById('days').value) || 1;
  const km = parseInt(document.getElementById('km').value) || 50;
  const packageName = document.getElementById('packageName').value;
  let price = 0;

  if (serviceType === "Tour Package" && packagePrices[packageName]) {
    price = packagePrices[packageName];
  } else if (vehicleType && rates[vehicleType]) {
    price = (days * rates[vehicleType].day) + (km * rates[vehicleType].km);
    if (serviceType === "Airport Pickup") price += 500;
  }
  document.getElementById('totalPrice').value = price ? "Rs. " + price.toLocaleString() : "";
}

// Live calculator
document.querySelectorAll('#serviceType, #vehicleType, #days, #km').forEach(el => {
  el.addEventListener('input', calculatePrice);
});

// === Auto-fill booking form if query params exist ===
const urlParams = new URLSearchParams(window.location.search);
const packageParam = urlParams.get('package');
const vehicleParam = urlParams.get('vehicle');

if (packageParam) {
  document.getElementById('serviceType').value = "Tour Package";
  document.getElementById('packageNameWrapper').style.display = "block";
  document.getElementById('packageName').value = decodeURIComponent(packageParam);
}
if (vehicleParam) {
  document.getElementById('vehicleType').value = decodeURIComponent(vehicleParam);
}
calculatePrice();


AOS.init();

// === i18n Translations ===
const resources = {
  en: { translation: {
    rate_title: "Rate Our Service",
    add_review: "Add Your Review",
    name: "Name",
    review: "Review",
    submit: "Submit",
    reviews: "Customer Reviews"
  }},
  
};

i18next.init({ lng: "en", resources }, () => updateTexts());

function updateTexts() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerText = i18next.t(el.getAttribute("data-i18n"));
  });
}

function changeLang(lang) {
  i18next.changeLanguage(lang, updateTexts);
}

// === Star Rating ===
let selectedRating = 0;
const starContainer = document.getElementById("ratingStars");

// Add stars dynamically
for (let i = 1; i <= 5; i++) {
  const span = document.createElement("span");
  span.className = "star";
  span.dataset.value = i;
  span.textContent = "★";
  span.addEventListener("click", () => {
    selectedRating = i;
    document.querySelectorAll(".star").forEach(s => s.classList.remove("selected"));
    for (let j = 1; j <= i; j++) {
      document.querySelector(`.star[data-value="${j}"]`).classList.add("selected");
    }
  });
  starContainer.appendChild(span);
}

// === Review Submission ===
document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll("#ratingStars .star");
  stars.forEach((star, i) => {
    star.addEventListener("click", () => {
      stars.forEach(s => s.classList.remove("active"));
      for (let j = 0; j <= i; j++) {
        stars[j].classList.add("active");
      }
    });
  });
});




document.querySelectorAll("#ratingStars .star").forEach(star => {
  star.addEventListener("click", () => {
    selectedRating = star.getAttribute("data-value");

    // Reset all
    document.querySelectorAll("#ratingStars .star").forEach(s => s.classList.remove("selected"));

    // Highlight up to clicked star
    for (let i = 1; i <= selectedRating; i++) {
      document.querySelector(`#ratingStars .star[data-value="${i}"]`).classList.add("selected");
    }
  });
});

document.getElementById("reviewForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("reviewerName").value;
  const text = document.getElementById("reviewText").value;

  const card = document.createElement("div");
  card.className = "col-md-6";
  card.innerHTML = `
    <div class="card review-card shadow-sm p-3" data-aos="fade-up">
      <h6>${name}</h6>
      <p class="mb-1">${text}</p>
      <small>⭐ ${selectedRating || 0}/5</small>
    </div>
  `;

  document.getElementById("reviewsContainer").appendChild(card);
  AOS.refresh();

  // Reset
  e.target.reset();
  selectedRating = 0;
  document.querySelectorAll("#ratingStars .star").forEach(s => s.classList.remove("selected"));
});

// JS for slider auto-change
let slides = document.querySelectorAll(".slide");
let index = 0;
setInterval(() => {
  slides[index].classList.remove("active");
  index = (index + 1) % slides.length;
  slides[index].classList.add("active");
}, 5000);

