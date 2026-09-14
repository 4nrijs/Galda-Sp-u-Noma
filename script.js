// Simple search demo: filters cards by title text (client-side)
const searchForm = document.querySelector(".search");
const searchInput = document.getElementById("searchInput");
const cards = Array.from(document.querySelectorAll(".card"));

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyFilter(searchInput.value);
});

searchInput.addEventListener("input", () => applyFilter(searchInput.value));

function applyFilter(q) {
  const query = (q || "").trim().toLowerCase();
  cards.forEach(card => {
    const title = card.querySelector(".card__title").textContent.toLowerCase();
    card.style.display = title.includes(query) ? "" : "none";
  });
}

// Carousel auto-scroll to the right every few seconds
const track = document.getElementById("carouselTrack");
const viewport = document.getElementById("carouselViewport");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

let slides = Array.from(track.querySelectorAll(".slide"));
let index = 1; // because we will clone ends
let timer = null;

function setupInfiniteCarousel() {
  slides = Array.from(track.querySelectorAll(".slide"));

  // Remove old clones if any
  track.querySelectorAll("[data-clone='1']").forEach(el => el.remove());

  const realSlides = Array.from(track.querySelectorAll(".slide"));

  const first = realSlides[0];
  const last = realSlides[realSlides.length - 1];

  const firstClone = first.cloneNode(true);
  firstClone.dataset.clone = "1";
  const lastClone = last.cloneNode(true);
  lastClone.dataset.clone = "1";

  track.insertBefore(lastClone, first);
  track.appendChild(firstClone);

  // Jump to the first real slide
  index = 1;
  requestAnimationFrame(() => jumpToIndex(index));
}

function slideWidth() {
  return viewport.getBoundingClientRect().width;
}

function jumpToIndex(i) {
  viewport.scrollLeft = i * slideWidth();
}

function animateToIndex(i) {
  viewport.scrollTo({ left: i * slideWidth(), behavior: "smooth" });
}

function next() {
  index += 1;
  animateToIndex(index);
}

function prev() {
  index -= 1;
  animateToIndex(index);
}

// After animation ends, if we are on a clone slide, jump instantly to the matching real slide
viewport.addEventListener("scroll", () => {
  // debounce-ish: only check after scrolling stops
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    const total = track.querySelectorAll(".slide").length; // includes clones
    const realCount = total - 2;

    const current = Math.round(viewport.scrollLeft / slideWidth());

    // If at clone after last real slide -> jump to first real
    if (current === realCount + 1) {
      index = 1;
      jumpToIndex(index);
      return;
    }

    // If at clone before first real slide -> jump to last real
    if (current === 0) {
      index = realCount;
      jumpToIndex(index);
      return;
    }

    index = current;
  }, 120);
});

nextBtn.addEventListener("click", () => next());
prevBtn.addEventListener("click", () => prev());

// Auto-advance every few seconds
setInterval(() => next(), 3500);

// Recalculate on resize (important because width changes)
window.addEventListener("resize", () => jumpToIndex(index));

setupInfiniteCarousel();