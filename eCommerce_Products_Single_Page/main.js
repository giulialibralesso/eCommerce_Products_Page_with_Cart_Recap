//Selectors
const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
const asideNav = document.querySelector(".sidenav");
const pTotalPriceInCartRecap = document.getElementById("total-price");

//Event Listeners
for (var i = 0; i < addToCartButtons.length; i++) {
    addToCartButtons[i].addEventListener("click", updateCart);
}

//Functions
function updateCart(event) {
    item = event.target;
    
    const imageToAdd = item.parentElement.firstElementChild;
    const cloneImageToAdd = imageToAdd.cloneNode(true);
    
    const priceToAdd = item.parentElement.children.item(2);
    const clonePriceToAdd = priceToAdd.cloneNode(true);
    clonePriceToAdd.classList.add('added-product-price');
    
    //Get updated list of products already in cart
    let addedProductList = document.querySelectorAll('.added-product');
    
    //Check if the product has already been added
    if (checkIfProductAlreadyInCart(addedProductList, cloneImageToAdd.getAttribute("src").slice(14, 15))) {
        //increase quantity (use same function as if plus button is clicked)
        incrementProductQuantity(addedProductList, cloneImageToAdd.getAttribute("src").slice(14, 15));
    } else {
        createElementAndAddItToCart(cloneImageToAdd, clonePriceToAdd);
    }
    
    priceCalculator()
}

function createElementAndAddItToCart(cloneImageToAdd, clonePriceToAdd) {
    //Create div to add a product to the aside recap
    const divAddedProduct = document.createElement('div');
    divAddedProduct.classList.add('added-product');
    
    //Append image to the specific added product div
    divAddedProduct.appendChild(cloneImageToAdd);
    cloneImageToAdd.classList.add('img-added-product');
    
    //Append price paragraph to the specific added product div
    divAddedProduct.appendChild(clonePriceToAdd);
    
    //Create plus quantity button
    const plusButton = document.createElement('button');
    plusButton.setAttribute('type', 'button');
    plusButton.classList.add('btn');
    plusButton.classList.add('btn-outline-dark');
    plusButton.classList.add('plus-btn');
    plusButton.innerHTML = "<i class='fas fa-plus'></i>";
    
    //If plus button is clicked, increment relevant product quantity
    plusButton.addEventListener('click', plusButtonIncrementRelevantProduct);
    
    //Create minus quantity button
    const minusButton = document.createElement('button');
    minusButton.setAttribute('type', 'button');
    minusButton.classList.add('btn');
    minusButton.classList.add('btn-outline-dark');
    minusButton.classList.add('minus-btn');
    minusButton.innerHTML = "<i class='fas fa-minus'></i>";
    
    //If minus button is clicked, decrease relevant product quantity
    minusButton.addEventListener('click', minusButtonDecreaseRelevantProduct);
    
    //Create quantity card main div
    const quantityCardBtn = document.createElement('button');
    quantityCardBtn.setAttribute('type', 'button');
    quantityCardBtn.classList.add('btn');
    quantityCardBtn.classList.add('btn-outline-dark');
    quantityCardBtn.classList.add('quantity-recap-btn');
    quantityCardBtn.innerText = 1; //update
    
    //Create quantity div
    const quantityDiv = document.createElement('div');
    
    //Append quantity buttons and relevant quantity card main div to quantity div
    quantityDiv.appendChild(plusButton);
    quantityDiv.appendChild(quantityCardBtn);
    quantityDiv.appendChild(minusButton);
    
    //Append quantity div to the specific added product div
    divAddedProduct.appendChild(quantityDiv);
    
    //Create remove from cart button with relevant text
    const removeFromCartButton = document.createElement('button');
    removeFromCartButton.setAttribute('type', 'button');
    removeFromCartButton.classList.add('btn');
    removeFromCartButton.classList.add('btn-outline-danger');
    removeFromCartButton.innerText = "Remove from cart";
    
    //Add event listener to remove from cart button and delete its div parent
    removeFromCartButton.addEventListener('click', removeFromCart);
    
    //Append remove button to the specific added product div
    divAddedProduct.appendChild(removeFromCartButton);
    
    //Append the specific added product div to the aside div
    asideNav.appendChild(divAddedProduct);
}

function removeFromCart (event) {
    item = event.target;
    item.parentElement.remove();
    
    priceCalculator();
}

function checkIfProductAlreadyInCart (listProducts, imageNumber) {
    if (listProducts !== undefined) {
        for (var i = 0; i < listProducts.length; i++) {
            
            imageInListNumber = listProducts[i].firstElementChild.getAttribute("src").slice(14, 15);
            
            if (imageInListNumber === imageNumber) {
                return true; //do not add product
            }
        }
    }
    return false; //add product
}

//Implement quantity increment counter + add event for added-product div
function incrementProductQuantity(listProducts, imageNumber) {
    for (var i = 0; i < listProducts.length; i++) {
        
        imageInListNumber = listProducts[i].firstElementChild.getAttribute("src").slice(14, 15);
        
        if (imageInListNumber === imageNumber) {
            let quantityBtn = listProducts[i].querySelector(".quantity-recap-btn");
            quantityBtnValue = parseInt(quantityBtn.innerText);
            quantityBtnValue = quantityBtnValue + 1;
            quantityBtn.innerText = quantityBtnValue;
        }
    }
}

//Increment product quantity when plus button is clicked
function getQuantityButtonFromPlus(element) {
    if (element.tagName === 'BUTTON') {
        return element.nextSibling; //i.e. plus button
    }
    else
    {
        return element.parentElement.nextSibling; //i.e. if the plus icon is clicked, then plus button is returned
    }
}

function plusButtonIncrementRelevantProduct(event) {
    item = event.target;
    let quantityBtn = getQuantityButtonFromPlus(item);
    quantityBtnValue = parseInt(quantityBtn.innerText);
    quantityBtnValue = quantityBtnValue + 1;
    quantityBtn.innerText = quantityBtnValue;
    
    priceCalculator()
}

//Decrease product quantity when minus button is clicked
function  getQuantityButtonFromMinus (element) {
    if (element.tagName === 'BUTTON') {
        return element.previousSibling; //i.e. minus button
    }
    else
    {
        return element.parentElement.previousSibling; //i.e. if the minus icon is clicked, then minus button is returned
    }
}

function minusButtonDecreaseRelevantProduct(event) {
    item = event.target;
    let quantityBtn = getQuantityButtonFromMinus(item);
    quantityBtnValue = parseInt(quantityBtn.innerText);
    
    //Add 'if' to prevent going under 0 products
    if(quantityBtnValue > 1) {
        quantityBtnValue = quantityBtnValue - 1;
        quantityBtn.innerText = quantityBtnValue;
    } else if (quantityBtnValue === 1) {
        quantityBtn.parentElement.parentElement.remove();   
    }
    
    priceCalculator()
}

//Do final $$ recap
function priceCalculator() {
    let cart = document.querySelectorAll('.added-product');
    let counterPrice = 0;
    for (var i = 0; i < cart.length; i++) {
        
        //Get innerText of p price
        let stringPrice = cart[i].children.item(1).innerText;
        stringPrice = stringPrice.replace('$', '');
        stringPrice = parseInt(stringPrice);
        
        //Get innerText of quantity button
        let quantityPrice = cart[i].children.item(2);
        quantityPrice = quantityPrice.children.item(1).innerText;
       
        singlePrice = stringPrice * quantityPrice;
        counterPrice += singlePrice;
    }
    pTotalPriceInCartRecap.innerText = "Total: " + counterPrice + "$";
    return counterPrice;
}