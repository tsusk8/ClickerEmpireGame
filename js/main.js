class User{
    constructor(name){
        this.name = name;
        this.days = 2;
        this.age = 20;
        this.money = 50000;
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
}
// 能力
class Ability extends Item{
    risePrice(quantity, perBurger){
        this.perPrice += 25 * quantity;
        perBurger.innerHTML = "one click ￥" + this.perPrice;
    }
    init(burgerTitle, perBurger){
        this.perPrice = 25;
        burgerTitle.innerHTML = this.count + " " + this.name;
        perBurger.innerHTML = "one click ￥" + this.perPrice;
    }
}
// 不動産
class　RealEstate extends Item{
    perSecond(){
        return this.perPrice * this.count;
    }
}
// 投資
class Investment extends Item{
    perSecond(){
        let perSecond = 0;

        switch(this.name){
            case "ETF Stock":
                perSecond = this.price * 0.001;
                break;
            case "ETF Bonds":
                perSecond = this.price * 0.0007;
                break;
        }
        return perSecond;
    }
}

function createGoodsHtml(items){
    const htmlItems = document.getElementsByClassName("items");

    config.concises.innerHTML = "";
    for(let i = 1; i < items.length; i++){
        conciseShow(items[i]);
    }

    for(let i = 0; i < htmlItems.length; i++){
        htmlItems[i].addEventListener("click", function(){
            displayNone(config.concises);
            displayShowInfo(config.infoItem, items[i+1]);
        });
    }

}
function reduceMoney(user, totalPrice){
    user.money -= totalPrice;
    userHtml.money.innerHTML = "¥ " + user.money;
}
function perSecond(user, items){

    setInterval(function(){
        if(user.days % 365 === 0) {
            user.age++;
            userHtml.age.innerHTML = user.age + " years old";
        }
        items.forEach( function (item) {
            if(item.type !== "ability" && item.count !== 0){
                user.money += parseInt(item.perSecond());
            }
        });
        userHtml.days.innerHTML = user.days + " days";
        userHtml.money.innerHTML = "¥ " + user.money;
        
        user.days++;
    },1000)
}
function conciseShow(item){
    let conciseHtml = document.createElement("div");
    conciseHtml.innerHTML += 
    `
        <div class="d-flex justify-content-between bg-navy text-white p-4 mt-2 items">
            <div class="col-3">
                <img class="img-fluid" src="${item.imgUrl}">
            </div>
            <div class="col-9">
                <div class="d-flex justify-content-between">
                    <h5>${item.name}</h5>
                    <p class="itemCount">${item.count}</p>
                </div>
                <div class="d-flex justify-content-between">
                    <h6 name="itemCount">¥ ${item.price}</h6>
                    <p class="text-green">¥${item.perPrice} /${item.type == "ability" ? "click" : "sec"}</p>
                </div>
            </div>
        </div>
    `;
    config.concises.append(conciseHtml);
}

function displayNone(ele){
    ele.classList.remove("d-block");
    ele.classList.add("d-none");
}
function displayShow(ele){
    ele.classList.remove("d-none");
    ele.classList.add("d-block");
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
function startGame(user, items){
    // 物件を表示
    displayNone(config.login);
    displayShow(config.home);
    createGoodsHtml(items);

    const burger = document.getElementById("leftItem");
    const save = document.getElementById("save");
    const purchase = document.getElementById("purchase");
    const reset = document.getElementById("reset");
    const goHome = document.getElementById("goHome");
    let burgerTitle = document.getElementById("leftTitle");
    let perBurger = document.getElementById("perBurger");

    document.getElementById("name").innerHTML = user.name;
    document.getElementById("age").innerHTML = user.age + " years old";
    document.getElementById("days").innerHTML = user.days + " days";
    document.getElementById("money").innerHTML = "¥ " + user.money;

    
    perSecond(user, items);

    burger.addEventListener("click", function(){
        items[0].count++;
        burgerTitle.innerHTML = items[0].count + " " + items[0].name;
        
        user.money += items[0].perPrice;
        userHtml.money.innerHTML = "¥ " + user.money;
    });

    purchase.addEventListener("click", function(){
        let item = items[0];
        for(let i = 0; i < items.length; i++){
            if(document.getElementById("itemName").innerHTML === items[i].name){
                item = items[i];
                break;
            }
        }
        // user, items[i], parseInt(document.getElementById("itemNum").value;
        let quantity = parseInt(document.getElementById("itemNum").value);

        if(item.price * quantity > user.money || (item.count + quantity > item.maxNum && item.maxNum != -1) ){
            alert("You don't have enough money.");
        }else{
            switch(item.type){
                case "ability":
                    item.risePrice(quantity, perBurger);
                    break;
                case "investment":
                    switch(item.name){
                        case "ETF Stock":
                            item.price = item.price * 1.1;
                            break;
                    }
                    item.perSecond();
                    break;
            }
            item.count += quantity;
            reduceMoney(user, item.price * quantity);
        }

        document.getElementById("itemNum").value = 0;
        document.getElementById("itemTotal").innerText = "total :¥0";
        displayNone(config.infoItem);
        displayShow(config.concises);
        createGoodsHtml(items);
    });
        
    goHome.addEventListener("click", function(){
        document.getElementById("itemNum").value = 0;
        document.getElementById("itemTotal").innerText = "total :¥0";
        displayNone(config.infoItem);
        displayShow(config.concises);
    });

    reset.addEventListener("click", function(){
        if(confirm("Reset All Data?")){
            user.money = 50000;
            user.days = 1;
            user.age = 20;
            userHtml.age.innerHTML = user.age + " years old";

            items.forEach( function (item) {
                item.count = 0;
            });
            // ハンバーガー、ETF Stockを初期化
            items[0].init(burgerTitle);
            items[2].price = 300000;

            createGoodsHtml(items);
        }
    });

    save.addEventListener("click", function(){
        alert("Saved your data. Please put the same name when you login.");
        localStorage.setItem(user.name, JSON.stringify({user, items}));
        location.reload();

    });
}

const newGameButton = document.getElementById("newGame");
const loginButton = document.getElementById("loginGame");

const config = {
    concises: document.getElementById("concise"),
    infoItem: document.getElementById("info"),
    login: document.getElementById("login"),
    home: document.getElementById("home")
}
const userHtml = {
    days: document.getElementById("days"),
    age: document.getElementById("age"),
    money: document.getElementById("money")
}

loginButton.addEventListener("click", function(){
    if(localStorage.getItem(document.getElementsByName("name").item(0).value) === null){
        alert("There is no data.");
        return;
    }
    const savedData = JSON.parse(localStorage.getItem(document.getElementsByName("name").item(0).value));
    const user = savedData.user;
    const items = savedData.items;
    startGame(user, items);
});
newGameButton.addEventListener("click", function(){
    if(document.getElementsByName("name").item(0).value == ""){
        alert("Please put your name");
        return;
    }

    const user = new User(document.getElementsByName("name").item(0).value);
    // name, type, maxNum, imgUrl, perPrice, price
    const items = 
    [
        // ability
        new Ability("Burgers", "ability", 500, "https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png", 25, 15000),
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

    startGame(user, items);
});