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
import Table from "./Components/Table/Table"
import LineGraph from "./Components/LineGraph/LineGraph"
import {sortData} from "./utils"
import "leaflet/dist/leaflet.css"
import { prettyPrintStat } from "./utils"
//api: https://disease.sh/v3/covid19/countries

function App() {

  const [countries, setContries]  = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:41, lng:20});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

//for worldwide cases

useEffect(()=>{

  fetch("https://disease.sh/v3/covid-19/all")
  .then(res=>res.json())
  .then(data=>{

    setCountryInfo(data);

    
  });
},[])

//fetch for countries

  const fetchCovid = async ()=>{

    await fetch("https://disease.sh/v3/covid-19/countries")

    .then((res)=>res.json())
    .then((data)=>{

      const countries = data.map((country)=>({

        name: country.country, 
        value: country.countryInfo.iso2, 
      }));

      const sorted = sortData(data)

      setTableData(sorted);
      setContries(countries);
      setMapCountries(data);
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



      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);

      setMapZoom(4);


    })
  }


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

            <InfoBox isRed active={casesType === "cases"} onClick={(e)=> setCasesType("cases")} title="CoronaVirus Cases" cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
            <InfoBox active={casesType === "recovered"} onClick={(e)=>setCasesType("recovered")} title="Recovered cases" cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)} />
            <InfoBox isRed active={casesType === "deaths"} onClick={(e)=>setCasesType("deaths")} title="Deaths" cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}  />

          </div>

          <Mapp casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
          </div>

          <Card className="app__right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries={tableData}/>
              <h3 className="app__graphTitle">Worldwide new {casesType} </h3>
              <LineGraph casesType={casesType} className="app__graph"/>
            </CardContent>
            </Card>



    
    </div>
  );
}

export default App;
