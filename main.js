const API_URL = 'https://www.boredapi.com/api/activity/'





function getAPI(){
    fetch(API_URL)
    .then(response => response.json())
    .then(data => data.activity)
}

getAPI();