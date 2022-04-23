import {useState, useEffect} from "react"
import './App.css';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent

} from "@material-ui/core";



//api: https://disease.sh/v3/covid19/countries

function App() {

  const [countries, setContries]  = useState([]);
  const [country, setCountry] = useState('Worldwide');

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

    setCountry(countryCode)
  }

  return (
    <div className="app"> {/*BEM convention of classeNames*/}

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



    
    </div>
  );
}

export default App;
