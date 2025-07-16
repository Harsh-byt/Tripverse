let input = document.querySelector("input");
let btn = document.querySelector(".search img");
let welcome = document.querySelector(".welcome");
let detail = document.querySelector(".detail");
let weathering = document.querySelector(".textTemp");
let wind = document.querySelector(".wind")
let humidity = document.querySelector(".humidity")
let iconImage = document.querySelector(".weather img")
let weatherdes = document.querySelector(".weatherdes")
let descity = document.querySelector(".description h3")
let aboutcity = document.querySelector(".aboutcity")
let cityimg = document.querySelector(".image")
let attractioncard = document.querySelector(".attraction");
let menubtn=document.querySelector(".menu")
let menu=document.querySelector(".mobileopt")

menubtn.addEventListener("click",()=>{
menu.classList.toggle("translate")
})
// for search or get city name

function result() {
    let city = capitalize(input.value);
    welcome.classList.add("hide");
    detail.classList.remove("hide");
    main(city)
    input.value = ""
    attractioncard.innerHTML = ""
}

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter")
        result()
})

btn.addEventListener("click", result)

function capitalize(str) {
    if (str.length === 0) {
        return ""; // Handle empty strings
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

//api calls

async function main(city) {
    iconImage.classList.remove("anime")
    let cityname = city;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=21f28575c014b3be83e251f1790d9bbc&units=metric`;


   let  res = await fetch(url)
    let data = await res.json()

    try {
        weathering.innerText = data.main.temp + "°C"
        humidity.innerText = "Humidity : " + data.main.humidity + "%"
        wind.innerText = "Wind : " + data.wind.speed + "km/h"
        let iconimg = data.weather[0].icon
        let iconapi = `https://openweathermap.org/img/wn/${iconimg}@2x.png`
        iconImage.src = iconapi;
        weatherdes.innerHTML = `<h4><u>${data.weather[0].description}</u></h4>`
        descity.innerText = cityname.toUpperCase()
        cityDiscription(cityname)
        let latitude = data.coord.lat
        let longitude = data.coord.lon
        console.log(latitude, longitude)
        atr(latitude, longitude)
    }

    catch {
        weathering.innerText = ""
        iconImage.src = "assets/image/sun.png";
        humidity.innerText = "Humidity : City not found"
        wind.innerText = "Wind : City not found"
        iconImage.classList.add("anime")
        weatherdes.innerHTML = ""
        descity.innerText = "City not found!"
        aboutcity.innerHTML = "<h2>please Enter a valid city!</h2>";
        cityimg.src = "assets/image/error.png"

    }
}

//for description and atrractions
async function cityDiscription(city) {
    let cityname = city;
    let desapi = `https://en.wikipedia.org/api/rest_v1/page/summary/${cityname}`
    let res = await fetch(desapi);
    let data = await res.json();

    try {
        aboutcity.innerHTML = data.extract_html;
        cityimg.src = `${data.originalimage.source}`;
    }
    catch { }
}

async function atr(lat, lon) {
    let atrurl = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${lon},${lat},5000&limit=5&apiKey=ff80ddfd26be4bdaa2d6172d37e21e7b`
    let res = await fetch(atrurl);
    let data = await res.json();
    console.log(data)
    for (feature of data.features) {
        
        if (feature.properties["name"] ===undefined || feature === null) 
           break;

        console.log(feature.properties["name"])
        let attraction = feature.properties["name"]
        encodedPlace = encodeURIComponent(attraction);
        let imageapi = `https://api.unsplash.com/search/photos?query=${attraction}&per_page=1&orientation=landscape&client_id=8PcGOwS1cUJrxhXl17uQtt_xJ-psGDTgxI6KLtUY6k8`
        let res2 = await fetch(imageapi);
        let data2 = await res2.json();
        let attractionlink = document.createElement("a")
        let famous = document.createElement("div")
        let attractionimage = document.createElement("img")
        let attractionname = document.createElement("h5")
        try {
            attractioncard.append(famous);
            famous.classList.add("famous");
            famous.append(attractionlink)
            attractionlink.append(attractionimage);
            famous.append(attractionname);
            attractionlink.href=data2.results[0].urls.full;
            attractionimage.src = data2.results[0].urls.full;
            attractionname.innerText = attraction;
        }
        catch {
        }
    }
}
