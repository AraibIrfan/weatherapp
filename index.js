import express from 'express'
import axios from 'axios'
import bodyParser from "body-parser";

const app = express()
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



const API_KEY = "7d54b06b7f900b57f4efcf5a21672e43"
app.get("/", async (req, res) => {

    try {
        const [response1, response2] = await Promise.all([
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: req.query.city || "Karachi",
                    appid: API_KEY
                }
            }),
            axios.get('https://api.open-meteo.com/v1/forecast?latitude=33.5731&longitude=7.5898&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max')

           
        ]);


        const data = response1.data
        const weather = data.weather
        const main = data.main
        const temp = main.temp
        const feels_like = main.feels_like
        const humidity = main.humidity
        const country = data.sys.country
        const city = data.name;
        let sky;
        const forecastData = response2.data.daily

        let time = [];
        let Temp_max = [];
        forecastData.time.forEach(element => {
            time.push(element)
    
        });
        forecastData.temperature_2m_max.forEach(element=>{
            Temp_max.push(element)
        })
    
        weather.forEach(element => {
            sky = element.main
        });

        // console.log(response1.data,"\n")
        // console.log(response2.data.daily)
    
        res.render("index.ejs", {

            data: {
                weather: sky,
                temp: temp,
                feels_like: feels_like,
                humidity: humidity,
                country: country,
                city: city,
                forecast:forecastData
            }

        })

    } catch (error) {
        console.error('Error fetching data from APIs:', error);
    }



})

// function groupByDate(data){
//     const grouped = []
//     data.list.forEach(forecast => {
//     const date = forecast.dt_txt.split(' ')[0]

//        if(!grouped[date]){
//         grouped[date] = [];
//        } 

//        grouped[date].push(forecast)
//     });

//     return grouped;
// }


// app.get("/forecast",async(req,res)=>{
//     const city = req.query.city || 'Karachi'
//     const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`,{
//         params:{
//             q:city,
//             appid:API_KEY
//         }
//     })

//     const Result = response.data.list
//     const cityName = response.data.city.name 
//     console.log(Result)
//     res.render("index.ejs",{data:Result})
// })

app.post("/", async (req, res) => {
    
    try {
        const result = await axios.get('https://api.openweathermap.org/data/2.5/weather',{
            params:{
                q: req.body.city || "Karachi",
                appid: API_KEY
            }
        })
        const {coord} = result.data
        const lat = coord.lat
        const lon = coord.lon
        
        const [response1, response2] = await Promise.all([
            axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    q: req.body.city || "Karachi",
                    appid: API_KEY
                }
            }),
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`)
        ]);


        const data = response1.data
        const weather = data.weather
        const main = data.main
        const temp = main.temp
        const feels_like = main.feels_like
        const humidity = main.humidity
        const country = data.sys.country
        const city = data.name;
        let sky;
        const forecastData = response2.data.daily
        
        let time = [];
        let Temp_max = [];
        forecastData.time.forEach(element => {
            time.push(element)
    
        });
        forecastData.temperature_2m_max.forEach(element=>{
            Temp_max.push(element)
        })
    
        console.log(forecastData.precipitation_probability_max)
        weather.forEach(element => {
            sky = element.main
        });

        // console.log(response1.data,"\n")
        // console.log(response2.data.daily)
        // console.log(lon,lat)
    
        res.render("index.ejs", {

            data: {
                weather: sky,
                temp: temp,
                feels_like: feels_like,
                humidity: humidity,
                country: country,
                city: city,
                forecast:forecastData
            }

        })

    } catch (error) {
        console.error('Error fetching data from APIs:', error);
    }


})
app.listen(port, () => {
    console.error(`Server running on port ${port}`)
})