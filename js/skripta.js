let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const slideTexts = ["Posebna ponuda 3 za 2 - kupite dvije silikonske maske, dobijte treću besplatno", 
"Sniženje - tripod + selfie štap", "Posebna ponuda - kupite dvije flip maske, dobijte kemijsku za mobitel besplatno"];
let dots = []; 

let selectedCase = null;
let selectedPhone = null;
let selectedColor = null;
let selectedPrice = null;

function initializeDots() {
    dots = document.querySelectorAll('.dot');
}

function showSlide(n) {
    slides.forEach(slide => slide.style.display = 'none');
    
    if (dots.length > 0) {
        dots[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (n + slides.length) % slides.length;
        slides[currentSlideIndex].style.display = 'block';
        dots[currentSlideIndex].classList.add('active');
        document.getElementById('slide-text').innerText = slideTexts[currentSlideIndex];
    }
}

function changeSlide(n) {
    showSlide(currentSlideIndex - n); 
}

function updateSelectedCase() {
    document.getElementById('selected-case').innerText = `Vrsta maske: ${selectedCase}`;
}

function updateSelectedColor() {
    document.getElementById('selected-color').innerText = `Boja: ${selectedColor}`;
}

function updateSelectedPhone() {
    document.getElementById('selected-phone').innerText = `Tip mobitela: ${selectedPhone}`;
}

function updateSelectedPrice() {
    document.getElementById('selected-price').innerText = `Cijena: ${selectedPrice}`;
}

function selectPanel(panelId) {
    const panels = document.querySelectorAll('.case-panel');
    panels.forEach(panel => panel.classList.remove('active'));

    const selectedPanel = document.getElementById(panelId);
    selectedPanel.classList.add('active');

    selectedCase = panelId.substr(0, panelId.length - 5) + ' ' + panelId.substr(-5);
    updateSelectedCase();
    
    selectedPrice = document.querySelector(`#${panelId} h3`).innerText;
    updateSelectedPrice();

    event.preventDefault();
    return false;
}

function selectColor(color) {
    const selectedDot = event.target;
    selectedDot.classList.add('selected');

    selectedColor = color;
    updateSelectedColor();
}

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("select");
    if (dropdown) {
        dropdown.addEventListener("change", function () {
            selectedPhone = dropdown.options[dropdown.selectedIndex].text;
            updateSelectedPhone();
        });
    }
    
    initializeDots(); 
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => changeSlide(-1));
        nextButton.addEventListener('click', () => changeSlide(1));
    }
    showSlide(currentSlideIndex);
});

const ikona = document.getElementById('shopping-card');
ikona.addEventListener('click', () => {
    const sideMenu = document.getElementById('shopping-side-menu');
    sideMenu.classList.toggle('active');
});

function setShopIconCount() {
    const countCircle = document.getElementById('shopping-count');
    let totalCount = 0;
    document.querySelectorAll('#shopping-side-menu .shopping-item .amount-box p').forEach((item) => {
        totalCount += parseInt(item.textContent);
    });
    countCircle.textContent = totalCount;
}

document.querySelectorAll('#add').forEach((button) => {
    button.addEventListener('click', handleButtonClick);
});

function handleButtonClick() {
    const productItem = findProductItem();
    const name = productItem.querySelector('.product-item h2').textContent;
    const price = productItem.querySelector('.product-item h3').textContent;
    const onlyPrice = price.split(' ')[0];

    const data = {
        name: name,
        price: onlyPrice
    };

    const getCurrent = document.querySelector(
        `#side-menu-items .shopping-item#${name.toLowerCase()}`
    );

    if (!getCurrent) {
        createNewShopItem(data);
    } else {
        const amountItem = getCurrent.querySelector('.amount-box > p');
        amountItem.textContent = parseInt(amountItem.textContent) + 1;
    }

    setShopIconCount();
    calculateTotalPrice();

    showPopup('Predmet dodan u košaricu');
}

function findProductItem() {
    return document.getElementById('product-item') || event.currentTarget.closest('.product-item');
}

function addToCart() {
    if (selectedCase && selectedPhone && selectedColor) {
        const selectedPanel = document.querySelector('.case-panel.active');
        const panelId = selectedPanel.id;
        const panelPrice = selectedPanel.querySelector('h3').innerText;
        
        const data = {
            name: panelId,
            price: panelPrice
        };

        const getCurrentPanel = document.querySelector(
            `#side-menu-items .shopping-item`
        );

        if (!getCurrentPanel) {
            createNewShopItem(data);
        } else {
            const amountItem = getCurrentPanel.querySelector('.amount-box > p');
            amountItem.textContent = parseInt(amountItem.textContent) + 1;
        }

        setShopIconCount();
        calculateTotalPrice();

        showPopup('Predmet dodan u košaricu');
    } 
}

function addToCart2() {
    const currentSlideText = slideTexts[currentSlideIndex];

    if (currentSlideText.includes("silikonske maske")) {
        const pData = {
            name: "3 Silikonske maske",
            price: "24"
        };
        createNewShopItem(pData);
    } else if (currentSlideText.includes("tripod + selfie štap")) {
        const pData = {
            name: "Tripod + Selfie štap",
            price: "28 €"
        };
        createNewShopItem(pData);
    } else {
        const pData = {
            name: "Kemijska za mobitel + 2 Flip maske",
            price: "28 €"
        };
        createNewShopItem(pData);
    }

    setShopIconCount();
    calculateTotalPrice();

    showPopup('Predmet dodan u košaricu');
}

document.querySelectorAll('.button').forEach((button) => {
    button.addEventListener('click', addToCart);
});

function createNewShopItem(pData) {
    const shopItem = document.createElement('div');
    shopItem.classList.add('shopping-item');
    shopItem.id = pData.name.toLowerCase();

    const modifiedCaseName = pData.name.endsWith("maska")
  ? pData.name.substr(0, pData.name.length - 5) + ' ' + pData.name.substr(-5)
  : pData.name;


    const shopItemHeading = document.createElement('h3');
    shopItemHeading.textContent = modifiedCaseName;
    shopItem.appendChild(shopItemHeading);

    const shopItemDescription = document.createElement('div');
    shopItemDescription.classList.add('description');
    shopItemDescription.innerHTML = `
        <div class="cijena">
            <small>Cijena:</small>
            <p>${pData.price}</p>
        </div>
        <div class="kolicina">
            <small>Količina:</small>
            <div class="amount-box">
                <button class="minus"><i class="fas fa-minus"></i></button>
                <p>1</p>
                <button class="plus"><i class="fas fa-plus"></i></button>
            </div>
        </div>`;
    shopItem.appendChild(shopItemDescription);

    const shopItemCloseIcon = document.createElement('i');
    shopItemCloseIcon.classList.add('fas', 'fa-times', 'close');
    shopItem.appendChild(shopItemCloseIcon);
    shopItemCloseIcon.addEventListener('click', removeShopItem);
    shopItemDescription.querySelector('button.plus').addEventListener('click', handlePlusButtonClick);
    shopItemDescription.querySelector('button.minus').addEventListener('click', handleMinusButtonClick);

    addNewItemToShopList(shopItem);
}

function addNewItemToShopList(newItem) {
    document.getElementById('side-menu-items').appendChild(newItem);
}

function calculateTotalPrice() {
    let totalPrice = 0;
    document.querySelectorAll('#side-menu-items .shopping-item').forEach((item) => {
        const itemPrice = item.querySelector('.cijena > p').textContent;
        const itemAmount = item.querySelector('.amount-box > p').textContent;
        totalPrice += parseFloat(itemPrice) * parseInt(itemAmount);
    });
    document.querySelector('#side-menu-action > .total-price > em').textContent = totalPrice.toFixed(2);
}

function removeShopItem(e) {
    const shopItem = e.currentTarget.parentElement;
    shopItem.remove();
    setShopIconCount();
    calculateTotalPrice();
}

function handlePlusButtonClick(e) {
    const amountBox = e.currentTarget.parentElement;
    amountBox.querySelector('p').textContent = parseInt(amountBox.querySelector('p').textContent) + 1;
    setShopIconCount();
    calculateTotalPrice();
}

function handleMinusButtonClick(e) {
    const amountBox = e.currentTarget.parentElement;
    const amountItem = amountBox.querySelector('p');
    let amountItemInt = parseInt(amountItem.textContent);

    if (amountItemInt > 1) {
        amountItem.textContent = amountItemInt - 1;
        setShopIconCount();
        calculateTotalPrice();
    }
}



function showPopup(message) {
    const popup = document.getElementById('popup');
    popup.textContent = message;
    popup.style.display = 'block';
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2000);
  }

