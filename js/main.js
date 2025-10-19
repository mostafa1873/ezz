//  NAVBAR SCROLL EFFECT 
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

//  LANGUAGE DROPDOWN 
const langBtn = document.getElementById("langBtn");
const langMenu = document.getElementById("langMenu");

if (langBtn && langMenu) {
    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!langMenu.contains(e.target) && !langBtn.contains(e.target)) {
            langMenu.classList.remove("active");
        }
    });
}

//  DROPDOWN (NAVBAR)
const dropdownLink = document.querySelector('.dropdown-link');
if (dropdownLink) {
    const dropdownBtn = dropdownLink.querySelector('.dropdown-btn');
    const dropdownMenu = dropdownLink.querySelector('.dropdown-menu');
    let isDropdownOpen = false;

    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
        isDropdownOpen = dropdownMenu.classList.contains('active');
    });

    document.addEventListener('click', (e) => {
        if (isDropdownOpen && !dropdownLink.contains(e.target)) {
            dropdownMenu.classList.remove('active');
            isDropdownOpen = false;
        }
    });
}

//  SIDE MENU 
const productsDropdownSide = document.getElementById("productsDropdownSide");
if (productsDropdownSide) {
    const productsBtnSide = productsDropdownSide.querySelector('.dropdown-btn-side');
    const productsMenuSide = productsDropdownSide.querySelector('.dropdown-menu-side');

    productsBtnSide.addEventListener("click", (e) => {
        e.stopPropagation();
        productsMenuSide.classList.toggle("active");
    });
}

const dropdownBtnSide = document.querySelector('.dropdown-btn-side');
const dropdownMenuSide = document.querySelector('.dropdown-menu-side');

if (dropdownBtnSide && dropdownMenuSide) {
    dropdownBtnSide.addEventListener('click', () => {
        dropdownMenuSide.classList.toggle('active');
        dropdownBtnSide.classList.toggle('active');
    });
}

const menuIcon = document.getElementById("menuIcon");
const sideMenu = document.getElementById("sideMenu");

if (menuIcon && sideMenu) {
    menuIcon.addEventListener("click", () => {
        sideMenu.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!sideMenu.contains(e.target) && !menuIcon.contains(e.target)) {
            sideMenu.classList.remove("active");
        }
    });
}

const langBtnSide = document.getElementById("langBtnSide");
const langMenuSide = document.getElementById("langMenuSide");

if (langBtnSide && langMenuSide) {
    langBtnSide.addEventListener("click", (e) => {
        e.stopPropagation();
        langMenuSide.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!langMenuSide.contains(e.target) && !langBtnSide.contains(e.target)) {
            langMenuSide.classList.remove("active");
        }
    });
}

//  SCROLL ANIMATIONS 
document.addEventListener('DOMContentLoaded', () => {
    const missionSection = document.getElementById('missionSection') || document.querySelector('.mission');
    if (missionSection) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(missionSection);
    }
});

//  JOURNEY ANIMATION 
document.addEventListener('DOMContentLoaded', () => {
    const journeyItems = document.querySelectorAll('.journey-item');
    if (journeyItems.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        journeyItems.forEach(item => observer.observe(item));
    }
});

//  PRELOADER 
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 600);
    }
});

//  ANIMATIONS
document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll(
        '.about-hero h1, .about-hero p, .about-company .about-text, .about-company .about-img, .mission-box, .why-us h2, .why-us .section-description, .why-us .reason-point, .global-reach-map h2, .global-reach-map p, .global-reach-map .map-container img, .global-reach-map .stats-bar'
    );

    const checkAnimation = () => {
        elementsToAnimate.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
                el.classList.add('show-animation');
            }
        });
    };

    let boxIndex = 0;
    elementsToAnimate.forEach(el => {
        if (el.classList.contains('mission-box') || el.classList.contains('reason-point')) {
            el.style.transitionDelay = `${boxIndex * 0.1}s`;
            boxIndex = (boxIndex + 1) % 6;
        } else if (el.closest('.about-hero') && (el.tagName === 'H1' || el.tagName === 'P')) {
            el.style.transitionDelay = '0.5s';
        }
    });

    window.addEventListener('scroll', checkAnimation);
    checkAnimation();
});

//  WHATSAPP TOOLTIP 
setTimeout(() => document.querySelector('.whatsapp-wrapper')?.classList.add('show-tooltip'), 2000);
setTimeout(() => document.querySelector('.whatsapp-wrapper')?.classList.remove('show-tooltip'), 7000);

//  MULTI-LANGUAGE SYSTEM 
const supportedLangs = ["EN", "AR", "IT"];
let currentLang = localStorage.getItem("lang") || "EN";

// 🔥 تحديد المسارات الديناميكية
function getBasePath() {
    return window.location.pathname.includes("/pages/")
        ? "../"
        : "./";
}

async function loadLanguage(lang) {
    try {
        const base = getBasePath();
        const response = await fetch(`${base}lang/${lang.toLowerCase()}.json`);
        const translations = await response.json();
        applyTranslations(translations);

        document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
        document.body.style.textAlign = lang === "AR" ? "right" : "left";

        document.getElementById("langBtn").textContent = lang;
        const sideBtn = document.getElementById("langBtnSide");
        if (sideBtn) sideBtn.textContent = lang;

        localStorage.setItem("lang", lang);
        currentLang = lang;

        langMenu.classList.remove("active");
        langMenuSide?.classList.remove("active");

        refreshProductsLanguage();
        refreshProductDetailsLanguage();
    } catch (error) {
        console.error(`Error loading ${lang} language:`, error);
    }
}

function applyTranslations(translations) {
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.getAttribute("data-lang");
        if (translations[key]) el.textContent = translations[key];
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadLanguage(currentLang);
    document.querySelectorAll("#langMenu button, #langMenuSide button").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedLang = btn.textContent.trim().toUpperCase();
            if (supportedLangs.includes(selectedLang)) loadLanguage(selectedLang);
        });
    });
});

//  PRODUCTS
async function loadProducts() {
    const productGrid = document.querySelector(".product-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    if (!productGrid) return;

    const base = getBasePath();
    const response = await fetch(`${base}products.json`);
    const data = await response.json();
    const products = data.products;

    function displayProducts(list) {
        productGrid.innerHTML = "";
        list.forEach(product => {
            const name = product[`name_${currentLang.toLowerCase()}`] || product.name_en;
            const card = document.createElement("div");
            card.classList.add("product-card");
            card.setAttribute("data-category", product.category);
            card.innerHTML = `
        <div class="product-img-box">
            <img src="${product.image}" alt="${name}">
        </div>
        <h3 class="product-title">${name}</h3>
      `;
            card.addEventListener("click", () => {
                window.location.href = `${base}pages/productdetails.html?id=${product.id}`;
            });
            productGrid.appendChild(card);
        });
    }

    displayProducts(products);

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.textContent.trim().toLowerCase();
            if (["all products", "كل المنتجات", "tutti i prodotti"].includes(filter)) {
                displayProducts(products);
            } else {
                const filtered = products.filter(p =>
                    Array.isArray(p.status)
                        ? p.status.includes(filter.replace(" ", "_"))
                        : p.status === filter.replace(" ", "_") || p.category === filter
                );
                displayProducts(filtered);
            }
        });
    });
}

function refreshProductsLanguage() {
    if (document.querySelector(".product-grid")) loadProducts();
}

//  PRODUCT DETAILS 
async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    if (!productId) return;

    const base = getBasePath();
    const response = await fetch(`${base}products.json`);
    const data = await response.json();
    const products = data.products;
    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    const name = currentProduct[`name_${currentLang.toLowerCase()}`] || currentProduct.name_en;
    const desc = currentProduct[`description_${currentLang.toLowerCase()}`] || currentProduct.description_en;

    document.querySelector(".product-image img").src = currentProduct.image;
    document.querySelector(".product-info h2").textContent = name;
    document.querySelector(".product-desc").textContent = desc;

    const bestGrid = document.querySelector(".best-sellers .product-grid");
    if (!bestGrid) return;

    const bestSellers = products.filter(p => p.id !== currentProduct.id).slice(0, 4);
    bestGrid.innerHTML = "";
    bestSellers.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        const name = p[`name_${currentLang.toLowerCase()}`] || p.name_en;
        card.innerHTML = `
      <img src="${p.image}" alt="${name}">
      <h3>${name}</h3>
    `;
        card.addEventListener("click", () => {
            window.location.href = `${base}pages/productdetails.html?id=${p.id}`;
        });
        bestGrid.appendChild(card);
    });
}

function refreshProductDetailsLanguage() {
    if (document.querySelector(".product-details")) loadProductDetails();
}

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadProductDetails();
});
