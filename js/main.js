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


//  NAVBAR DROPDOWN
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


const langBtnSide = document.getElementById("langBtnSide");
const langMenuSide = document.getElementById("langMenuSide");
const langBtnMobile = document.getElementById("langBtnMobile");
const langMenuMobile = document.getElementById("langMenuMobile");
const menuIcon = document.getElementById('menuIcon');
const mobileDropdown = document.getElementById('mobileDropdown');

//mobile menu

menuIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    menuIcon.classList.toggle('active');
    mobileDropdown.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!mobileDropdown.contains(e.target) && !menuIcon.contains(e.target)) {
        mobileDropdown.classList.remove('active');
        menuIcon.classList.remove('active');
    }
});

// language dropdown

langBtnMobile.addEventListener("click", (e) => {
    e.stopPropagation();
    langMenuMobile.classList.toggle("active");
});

//language dropdown

document.addEventListener("click", (e) => {
    if (!langMenuMobile.contains(e.target) && !langBtnMobile.contains(e.target)) {
        langMenuMobile.classList.remove("active");
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


//  BASE PATH DETECTOR
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) return '../';
    if (path.includes('/work/')) return '/work/';
    return './';
}


// ✅ GO TO CATEGORY FUNCTION (NEW)
function goToCategory(category) {
    window.location.href = `${getBasePath()}pages/products.html?category=${category}`;
}


//  MULTI LANGUAGE SYSTEM

const supportedLangs = ["EN", "AR", "IT"];
let currentLang = localStorage.getItem("lang") || "EN";

async function loadLanguage(lang) {
    try {
        const response = await fetch(`${getBasePath()}lang/${lang.toLowerCase()}.json`);
        const translations = await response.json();
        applyTranslations(translations);

        document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
        document.body.style.textAlign = lang === "AR" ? "right" : "left";

        if (langBtn) langBtn.textContent = lang;
        if (langBtnSide) langBtnSide.textContent = lang;
        if (langBtnMobile) langBtnMobile.textContent = lang;

        localStorage.setItem("lang", lang);
        currentLang = lang;

        langMenu?.classList.remove("active");
        langMenuSide?.classList.remove("active");
        langMenuMobile?.classList.remove("active");

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

async function reapplyTranslations() {
    try {
        const response = await fetch(`${getBasePath()}lang/${currentLang.toLowerCase()}.json`);
        const translations = await response.json();
        applyTranslations(translations);
    } catch (error) {
        console.error("Error reapplying translations:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadLanguage(currentLang);
    document.querySelectorAll("#langMenu button, #langMenuSide button, #langMenuMobile button").forEach(btn => {
        btn.addEventListener("click", () => {
            const selectedLang = btn.textContent.trim().toUpperCase();
            if (supportedLangs.includes(selectedLang)) loadLanguage(selectedLang);
        });
    });
});


//  FILTER TRANSLATION MAP
const filterMap = {
    "all products": "all",
    "fruit": "fruit",
    "fresh": "fresh",
    "frozen": "iqf",
    "pickled": "pickled",
    "in brine": "in_brine",

    "جميع المنتجات": "all",
    "فواكة": "fruit",
    "طازجة": "fresh",
    "مجمدة": "iqf",
    "مخلل": "pickled",
    "في محلول ملحي": "in_brine",

    "tutti i prodotti": "all",
    "frutta": "fruit",
    "fresco": "fresh",
    "surgelati (iqf)": "iqf",
    "sottaceto": "pickled",
    "in salamoia": "in_brine"
};


//  PRODUCTS SECTION
async function loadProducts() {
    const productGrid = document.querySelector(".product-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    if (!productGrid) return;

    const response = await fetch(`${getBasePath()}products.json`);
    const data = await response.json();
    const products = data.products;

    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");

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
                window.location.href = `${getBasePath()}pages/productdetails.html?id=${product.id}`;
            });
            productGrid.appendChild(card);
        });
    }

    // ✅ فلترة المنتجات لو فيه فئة محددة
    let filteredProducts = products;
    if (selectedCategory) {
        filteredProducts = products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    displayProducts(filteredProducts);
    await reapplyTranslations();

    filterButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterText = btn.textContent.trim().toLowerCase();
            const normalizedFilter = filterMap[filterText] || filterText;

            if (normalizedFilter === "all") {
                displayProducts(products);
            } else {
                const filtered = products.filter(p => {
                    const statuses = Array.isArray(p.status)
                        ? p.status.map(s => s.toLowerCase())
                        : [p.status?.toLowerCase()];
                    return statuses.includes(normalizedFilter) || p.category?.toLowerCase() === normalizedFilter;
                });
                displayProducts(filtered);
            }
            await reapplyTranslations();
        });
    });
}

function refreshProductsLanguage() {
    if (document.querySelector(".product-grid")) loadProducts();
}


//  PRODUCT DETAILS PAGE
async function loadProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get("id"));
    if (!productId) return;

    const response = await fetch(`${getBasePath()}products.json`);
    const data = await response.json();
    const products = data.products;
    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    const name = currentProduct[`name_${currentLang.toLowerCase()}`] || currentProduct.name_en;
    const desc = currentProduct[`description_${currentLang.toLowerCase()}`] || currentProduct.description_en;

    document.querySelector(".product-image img").src = currentProduct.image;
    document.querySelector(".product-info h2").textContent = name;
    document.querySelector(".product-desc").textContent = desc;

    //  Variants Section
    const variantSection = document.querySelector(".variant-grid");
    if (variantSection) {
        variantSection.innerHTML = "";
        if (currentProduct.variants && currentProduct.variants.length > 0) {
            currentProduct.variants.forEach(v => {
                const vName = v[`name_${currentLang.toLowerCase()}`] || v.name_en;
                const div = document.createElement("div");
                div.classList.add("variant-item");
                div.innerHTML = `<h4>${vName}</h4>`;
                variantSection.appendChild(div);
            });
        }
    }

    //  Best Sellers 
    const bestGrid = document.querySelector(".best-sellers .product-grid");
    if (bestGrid) {
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
                window.location.href = `${getBasePath()}pages/productdetails.html?id=${p.id}`;
            });
            bestGrid.appendChild(card);
        });
    }

    await reapplyTranslations();
}

function refreshProductDetailsLanguage() {
    if (document.querySelector(".product-details")) loadProductDetails();
}


//  INIT
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    loadProductDetails();
});


// SCROLL ANIMATIONS
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


// JOURNEY ANIMATION
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


// ANIMATIONS
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


// WHATSAPP TOOLTIP
setTimeout(() => document.querySelector('.whatsapp-wrapper')?.classList.add('show-tooltip'), 2000);
setTimeout(() => document.querySelector('.whatsapp-wrapper')?.classList.remove('show-tooltip'), 7000);
