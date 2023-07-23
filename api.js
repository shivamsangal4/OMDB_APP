let result = fetch("https://www.omdbapi.com/?i=tt3896198&apikey=eb812924&s=har&page=2")
result.then((response)=>{
    return response.json()
}).then((value)=>{
    console.log(value);
})