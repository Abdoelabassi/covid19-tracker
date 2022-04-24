import './table.css'
import { prettyPrintStat } from "../../utils"
const Table = ({ countries }) =>{


	return (

		<div className="table">

			{countries.map(({country, cases}) =>(
				<tr>
					<td>{country}</td>
					<td><strong>{prettyPrintStat(cases)}</strong></td>

				</tr>
			))}
			
		</div>



		)
}



export default Table;