const userTab = document.getElementById('userWeather');
const  searchTab = document.getElementById('searchWeather');
 
const  weatherContainer = document.getElementById('weatherContainer');
 
const  grantLocationContainer = document.getElementById('grantLocationContainer');
const  searchForm = document.getElementById('searchForm');
const  loadingScreen = document.getElementById('loadingScreen');
const  userInfoContainer = document.getElementById('userInfoContainer');

const grantAcessBtn = document.getElementById('grantAcessBtn');
const searchInput = document.getElementById('searchInput');

let currentTab = userTab;
const API_KEY = "657029e276eb575a8439d5c4c026f510";
currentTab.classList.add('bg-[#BA73D9]', 'rounded-md', 'text-white');
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove('bg-[#BA73D9]', 'rounded-md', 'text-white');
        currentTab = clickedTab;
        currentTab.classList.add('bg-[#BA73D9]', 'rounded-md', 'text-white');

        if(!searchForm.classList.contains('flex')){
            userInfoContainer.classList.remove('flex');
            userInfoContainer.classList.add('hidden');
            grantLocationContainer.classList.remove('flex');
            grantLocationContainer.classList.add('hidden');
            searchForm.classList.remove('hidden');
            searchForm.classList.add('flex');
        }
        else{
            searchForm.classList.remove('flex');
            searchForm.classList.add('hidden');
            userInfoContainer.classList.remove('flex');
            userInfoContainer.classList.add('hidden');

            getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantLocationContainer.classList.add('flex');
        grantLocationContainer.classList.remove('hidden');
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;
    grantLocationContainer.classList.remove('flex');
    grantLocationContainer.classList.add('hidden');
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('flex');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove('flex');
        loadingScreen.classList.add('hidden');
        userInfoContainer.classList.remove('hidden');
        userInfoContainer.classList.add('flex');

        renderWeatherInfo(data);
        
    }
    catch(err){
        loadingScreen.classList.remove('flex');
        loadingScreen.classList.add('hidden');
    }
}

function renderWeatherInfo(weatherInfo){

    const cityName = document.getElementById('cityName');
    const countryIcon = document.getElementById('countryIcon');
    const weatherDesc = document.getElementById('weatherDesc');
    const weatherIcon = document.getElementById('weatherIcon');
    const tempInfo = document.getElementById('tempInfo');
    const windSpeed = document.getElementById('windSpeed');
    const humidity = document.getElementById('humidity');
    const clouds = document.getElementById('clouds');

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}.png`;
    tempInfo.innerText = weatherInfo?.main?.temp;
    windSpeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    clouds.innerText = weatherInfo?.clouds?.all;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

grantAcessBtn.addEventListener("click", getLocation);

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }
});

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.remove('hidden');
    loadingScreen.classList.add('flex');
    userInfoContainer.classList.remove('flex');
    userInfoContainer.classList.add('hidden');
    grantLocationContainer.classList.remove('flex');
    grantLocationContainer.classList.add('hidden');

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        loadingScreen.classList.remove('flex');
        loadingScreen.classList.add('hidden');
        userInfoContainer.classList.remove('hidden');
        userInfoContainer.classList.add('flex');

        renderWeatherInfo(data);
    }
    catch(err){

    }
}