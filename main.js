let iconCart = document.querySelector(".icon_cart");
let body = document.querySelector("body");
let close = document.querySelector(".close");
let productList = document.querySelector(".product_list");
let iconCartSpan = document.querySelector(".icon_cart span");
let listCarts = document.querySelector(".listCart");


let listofProduct = [];
let carts = [];



iconCart.addEventListener("click" , () => {
    body.classList.toggle("cartShow");
})

// close

close.addEventListener("click" , () => {
    body.classList.remove("cartShow");
})


//  Add product to product list

function addProductsToHtml() {
    let item = ``;
    listofProduct.forEach( product => {
            item += `<div class="item" id = ${product.id}>
                            <img src=${product.image} alt="">
                            <h2>${product.name}</h2>
                            <div class="price">$${product.price}</div>
                            <button class="addCart">
                                Add to card
                            </button>
                        </div>` 
            productList.innerHTML = item;
        });
}



productList.addEventListener("click" , (e) => {
    if(e.target.classList.contains("addCart")) {
        let productId = e.target.parentElement.id;
        addToCart(productId);
        
    };
});


function addToCart(product_id) {
    let positionProductCard = carts.findIndex((value) => value.productId == product_id);
    console.log(positionProductCard)
    if(carts.length <= 0) {
        carts = [{
            productId : product_id,
            quantity : 1
        }]
    } else if(positionProductCard < 0) {
        carts.push({
            productId : product_id,
            quantity : 1,
        });
    } else {
        carts[positionProductCard].quantity = carts[positionProductCard].quantity + 1 
    }

    addCartToHtml();
    addCartsToMemory();
}

function  addCartsToMemory() {
    localStorage.setItem("cart", JSON.stringify(carts));
}


// add carts in listCart
function addCartToHtml() {
    listCarts.innerHTML = '';
    totalQuantity = 0
    if(carts.length > 0) {
        carts.forEach((cart) => {
            totalQuantity += cart.quantity ;
            let positionProduct = listofProduct.findIndex((value) => value.id == cart.productId);
            let info = listofProduct[positionProduct];
            let div = document.createElement("div");
            div.classList.add("item");
            div.dataset.id = cart.productId;
            div.innerHTML = `
                            <div class="image">
                                <img src=${info.image} alt="">
                            </div>
                            <div class="product_name">
                                    ${info.name}
                            </div>
                            <div class="totalPrice">
                                    $${info.price * cart.quantity}
                            </div>
                            <div class="quantity">
                                    <span class="minus"><</span>
                                    <span>${cart.quantity}</span>
                                    <span class="plus">></span>
                            </div>
  
    `;
    listCarts.appendChild(div);
                                
        })
    }
    iconCartSpan.innerHTML = totalQuantity;
}

listCarts.addEventListener("click", (e) => {
   
    if(e.target.classList.contains("minus") || e.target.classList.contains("plus")) {
       let product_id = e.target.parentElement.parentElement.dataset.id;

       let type = "minus";
       if(e.target.classList.contains("plus")) {
           type = "plus"
       }
       changeQauntity(product_id, type);
    }

    
})

function changeQauntity(product_id, type) {
    let postion = carts.findIndex((value) => value.productId == product_id);
    if(postion >= 0) {
        if(type === "plus") {
            carts[postion].quantity += 1 
        } else {
            let valueChange = carts[postion].quantity - 1
            if(valueChange > 0) {
                carts[postion].quantity = valueChange;
            } else {
                carts.splice(postion, 1)
            }
        }
    }
    addCartsToMemory();
    addCartToHtml()
}

function initialApp() {
    fetch("product.json").then((response) => {
        return response.json();
    }).then((data) => {
        let item = ``;
        listofProduct = data;
        data.forEach( product => {
            item += `<div class="item" id = ${product.id}>
                            <img src=${product.image} alt=""
                            <h2>${product.name}</h2>
                            <div class="price">$${product.price}</div>
                            <button class="addCart">
                                Add to card
                            </button>
                        </div>` 
            productList.innerHTML = item;
        });
        addProductsToHtml();
        if(localStorage.getItem("cart")) {
            carts = JSON.parse(localStorage.getItem("cart"));
            iconCartSpan.innerHTML =  iconCartSpan.innerHTML
            addCartToHtml()

        } 
    }) 
}
initialApp();

