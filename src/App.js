import {useState, useEffect} from "react"
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent

} from "@material-ui/core";

import InfoBox from "./Components/InfoBox/InfoBox"
import Mapp from "./Components/Map/Map"



//api: https://disease.sh/v3/covid19/countries

function App() {

  const [countries, setContries]  = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});


//for worldwide cases

useEffect(()=>{

  fetch("https://disease.sh/v3/covid-19/all")
  .then(res=>res.json())
  .then(data=>{

    setCountryInfo(data);
  });
},[])



  const fetchCovid = async ()=>{

    await fetch("https://disease.sh/v3/covid-19/countries")

    .then((res)=>res.json())
    .then((data)=>{

      const countries = data.map((country)=>({

        name: country.country, 
        value: country.countryInfo.iso2, 
      }));
      setContries(countries);
    })



    

  }

  useEffect(()=>{

    fetchCovid();

  },[])

  const onChangeCountry = async (event)=>{

    const countryCode = event.target.value;

    

    const url = countryCode === "Worldwide" ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(res=>res.json())
    .then(data=>{
      setCountry(countryCode);

      setCountryInfo(data);


    })
  }

  console.log("Country info >>>> :", countryInfo)

  return (
    <div className="app"> {/*BEM convention of classeNames*/}
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">

            <Select variant="outlined" value={country} onChange={onChangeCountry} >
              <MenuItem value="Worldwide">Worldwide</MenuItem>

        {countries.map((country)=>(
          <MenuItem value={country.value} >{country.name}</MenuItem>


        ))}

          
          </Select>
          </FormControl>
          </div>

          <div className="app__stats">

            <InfoBox title="CoronaVirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
            <InfoBox title="Recovered cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
            <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}  />

          </div>

          <Mapp/>
          </div>

          <Card className="app__right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <h3>Worldwide new cases </h3>
            </CardContent>
            </Card>



    
    </div>
  );
}

export default App;
