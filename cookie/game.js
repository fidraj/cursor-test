let cookies = 0;
let autoClickers = 0;
let autoClickerCost = 10;
let clickMultiplier = 1;
let clickMultiplierCost = 50;

const cookieElement = document.getElementById('cookie');
const cookieCountElement = document.getElementById('cookieCount');
const cpsElement = document.getElementById('cps');
const buyAutoClickerButton = document.getElementById('buyAutoClicker');
const buyClickMultiplierButton = document.getElementById('buyClickMultiplier');

function updateDisplay() {
    cookieCountElement.textContent = Math.floor(cookies);
    cpsElement.textContent = autoClickers;
    buyAutoClickerButton.textContent = `Buy Auto Clicker (Cost: ${autoClickerCost} cookies)`;
    buyClickMultiplierButton.textContent = `Buy Click Multiplier (Cost: ${clickMultiplierCost} cookies)`;
    buyAutoClickerButton.disabled = cookies < autoClickerCost;
    buyClickMultiplierButton.disabled = cookies < clickMultiplierCost;
}

function clickCookie() {
    cookies += clickMultiplier;
    updateDisplay();
}

function buyAutoClicker() {
    if (cookies >= autoClickerCost) {
        cookies -= autoClickerCost;
        autoClickers++;
        autoClickerCost = Math.ceil(autoClickerCost * 1.15);
        updateDisplay();
    }
}

function buyClickMultiplier() {
    if (cookies >= clickMultiplierCost) {
        cookies -= clickMultiplierCost;
        clickMultiplier++;
        clickMultiplierCost = Math.ceil(clickMultiplierCost * 1.5);
        updateDisplay();
    }
}

function autoClick() {
    cookies += autoClickers;
    updateDisplay();
}

cookieElement.addEventListener('click', clickCookie);
buyAutoClickerButton.addEventListener('click', buyAutoClicker);
buyClickMultiplierButton.addEventListener('click', buyClickMultiplier);

setInterval(autoClick, 1000);
updateDisplay();
