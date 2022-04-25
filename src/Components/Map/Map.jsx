import {MapContainer as LeafletMap, TileLayer} from "react-leaflet"
import "./map.css"
import { showDataOnMap } from "../../utils"
const Mapp  = ({ countries, casesType ,center, zoom })=>{


	return (

		<div className="map">

			<LeafletMap center={center} zoom={zoom}>
        		<TileLayer
          			url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
          			attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        		/>
        		{showDataOnMap(countries, casesType)}
      </LeafletMap>
			
		</div>


		)
}

export default Mapp
