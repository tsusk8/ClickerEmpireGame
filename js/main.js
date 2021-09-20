class User{
    constructor(name){
        this.name = name;
        this.days = 2;
        this.age = 20;
        // this.money = 50000;
        this.money = 10000000000000;
    }
}
class Item{
    constructor(name, type, maxNum, imgUrl, perPrice, price){
        this.name = name;
        this.type = type;
        this.maxNum = maxNum;
        this.imgUrl = imgUrl;
        this.perPrice = perPrice;
        this.price = price;
        this.count = 0;
    }
    initQuantity(){
        document.getElementById("itemNum").value = 0;
    }
    changeHtml(i){
        document.getElementsByName("itemCount").item(i).innerHTML = parseInt(this.count);
        console.log(document.getElementsByName("itemCount").item(i).innerHTML);
        console.log(this);
    }
}
// 能力
class Ability extends Item{
    purchase(user, burger, quantity){
        if(this.price * quantity > user.money || this.count + quantity > this.maxNum){
            alert("You don't have enough money.");
            // quantity = 0;
        }else{
            this.count += quantity;
            this.risePrice(burger, quantity);
            reduceMoney(user, this.price * quantity);
        }
    }
    risePrice(burger, quantity){
        burger.perPrice += 25 * quantity;
        // perBurger
        const perBurger = document.getElementById("perBurger");
        perBurger.innerHTML = "one click ￥" + burger.perPrice;
        this.initQuantity();
        // console.log(burger);
    }
}
// 不動産
class　RealEstate extends Item{
    purchase(user, quantity, i){
        if(this.price * quantity > user.money || this.count + quantity > this.maxNum){
            alert("You don't have enough money.");
            // quantity = 0;
        }else{
            this.count += quantity;
            reduceMoney(user, this.price * quantity);
            this.changeHtml(i);
        }
    }
    perSecond(){
        return this.perPrice * this.count;
    }
    // override
}
// // 投資
class Investment extends Item{
    static total = 0;
    purchase(user, quantity, i){
        if(this.price * quantity > user.money){
            alert("You don't have enough money.");
            // quantity = 0;
        }else{
            this.count += quantity;
            reduceMoney(user, this.price * quantity);
            this.changeHtml(i);
            switch(this.name){
                case "ETF Stock":
                    total += this.price * quantity;
                    this.price = this.price * 1.1;
                    break;
                case "ETF Bonds":
                    total += this.price * quantity;
                    break;
            }
        }
    }
    perSecond(){
        let perSecond = 0;
        switch(this.name){
            case "ETF Stock":
                perSecond = this.total * 0.001;
                break;
            case "ETF Bonds":
                perSecond = this.total * 0.0007;
                break;
        }
        return perSecond;
    }
}
function reduceMoney(user, totalPrice){
    const userMoney = document.getElementById("userMoney");
    user.money -= totalPrice;
    userMoney.innerHTML = "¥ " + user.money;
}
function perSecond(user, items){
    const days = document.getElementById("days");
    const userAge = document.getElementById("age");
    const userMoney = document.getElementById("userMoney");

    setInterval(function(){
        days.innerHTML = user.days + " days";
        if(user.days % 365 === 0) {
            user.age++;
            userAge.innerHTML = user.age + " years old";
        }
        items.forEach( function (item) {
            if(item.type !== "ability" && item.count !== 0){
                user.money += item.perSecond();
                userMoney.innerHTML = "¥ " + user.money;
            }
        });
        user.days++;
    },1000)
}
function conciseShow(item){
    let concise = document.getElementById("concise");
    let conciseHtml = document.createElement("div");
    conciseHtml.innerHTML += 
    `<div class="d-flex justify-content-between concise bg-navy text-white p-4 m-1">
        <div class="col-4">
            <img class="img-fluid" src="${item.imgUrl}">
        </div>
        <div class="col-4">
            <p>${item.name}</p>
            <p>¥ ${item.price}</p>
        </div>
        <div class="col-4">
            <p name="itemCount">${item.count}</p>
            <p class="text-green">¥${item.perPrice} /${item.type == "ability" ? "click" : "sec"}</p>
        </div>
    </div>
    `;
    concise.append(conciseHtml);
}


// NewGame 
const newGame = document.getElementById("newGame");
const login = document.getElementById("login");
const home = document.getElementById("home");

newGame.addEventListener("click", function(){
    const user = new User(document.getElementsByName("name").item(0).value);
    // name, type, maxNum, imgUrl, perPrice, price
    const burger = new Ability("Burger", "ability", 500, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png", 25, 15000);
    const rightItems = 
    [
        // ability
        new Ability("Flip machine", "ability", 500, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png", 25, 15000),
        // invenstment
        new Investment("ETF Stock", "investment", -1, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png", 0.1, 300000),
        new Investment("ETF Ponds", "investment", -1, "https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png", 0.07, 300000),
        // realEstate
        new RealEstate("Lemonade Stand", "realEstate", 1000, "https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png", 30, 30000),
        new RealEstate("Ice Cream Truck", "realEstate", 500, "https://cdn.pixabay.com/photo/2020/01/30/12/37/ice-cream-4805333_960_720.png", 120, 100000),
        new RealEstate("House", "realEstate", 100, "https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png", 32000, 20000000),
        new RealEstate("Town House", "realEstate", 100, "https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png", 64000, 40000000),
        new RealEstate("Mansion", "realEstate", 20, "https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png", 500000, 250000000),
        new RealEstate("Industrial Space", "realEstate", 10, "https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png", 2200000, 1000000000),
        new RealEstate("Hotel Skyscraper", "realEstate", 5, "https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png", 25000000, 10000000000),
        new RealEstate("Bullet-Speed Sky Railway", "realEstate", 1, "https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png", 30000000, 10000000000000),
    ];

    rightItems.forEach( function (item) {
        conciseShow(item);
        if(item.type !== "ability" && item.count !== 0){
            user.money += item.perSecond();
        }
    });
    let concises = document.getElementsByClassName("concise");
    let leftItem = document.getElementById("leftItem");
    // let rightItem = document.getElementById("rightItem");
    let concise = document.getElementById("concise");
    let infoItem = document.getElementById("info");
    // console.log(document.getElementsByClassName("concise"));

    displayNone(login);
    displayShow(home);

    document.getElementById("name").innerHTML = user.name;
    perSecond(user, rightItems);
    
    leftItem.addEventListener("click", function(){
        let leftTitle = document.getElementById("leftTitle");
        let userMoney = document.getElementById("userMoney");
        
        burger.count++;
        leftTitle.innerHTML = burger.count + " " + burger.name;
        
        user.money += burger.perPrice;
        userMoney.innerHTML = "¥ " + user.money;
        // console.log(user);
    });

    for(let i = 0; i < concises.length; i++){
        concises[i].addEventListener("click", function(){
            displayNone(concise);
            displayShowInfo(infoItem, rightItems[i]);
            let purchase = document.getElementById("purchase");

            purchase.addEventListener("click", function(){
                switch(rightItems[i].type){
                    case "ability":
                        rightItems[i].purchase(user, burger, parseInt(document.getElementById("itemNum").value));
                        break;
                    case "realEstate":
                        rightItems[i].purchase(user, parseInt(document.getElementById("itemNum").value, i));
                        break;
                    case "investment":
                        rightItems[i].purchase(user, parseInt(document.getElementById("itemNum").value, i));
                        break;
                }
                // realEstamate
                
                // alert(document.getElementById("itemNum").value);
                displayNone(infoItem);
                displayShow(concise);
            });
        });
    }
        
    let goHome = document.getElementById("goHome");

    goHome.addEventListener("click", function(){
        displayNone(infoItem);
        displayShow(concise);
    });

    
});
function displayNone(ele){
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
    // console.log("displayNone");
}
function displayShow(ele){
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
    // console.log("displayShow");
}
function displayShowInfo(ele, item){
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
    
    document.getElementById("itemName").innerHTML = item.name;
    document.getElementById("itemMax").innerHTML = item.maxNum === -1 ? "Max purchases: ∞"　: "Max purchases:" + item.maxNum;
    document.getElementById("itemPrice").innerHTML = "Price: ￥" + item.price;
    document.getElementById("itemPerSec").innerHTML = "Get ￥" + item.perPrice + " /" + (item.type === "ability" ? "click" : "sec");
    document.getElementById("itemImg").setAttribute("src", item.imgUrl);

    let total = document.getElementById("itemTotal");
    let itemNum = document.getElementById("itemNum");
    itemNum.addEventListener("change", function(){
        total.innerHTML = "total :¥" + (item.price * itemNum.value);
    });
}