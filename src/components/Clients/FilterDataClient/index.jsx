import { useState } from 'react'
import './style.css'
import checkboxGreenFilter from '../../../assets/checkboxFilterData.svg';
import set from "../../../assets/Set.svg";

export default function FilterDataClient({setOpenModalFilterDataClient}){
    const [verifyCheckboxFilterData, setVerifyCheckboxFilterData] = useState(true)
    return(
        <div className='container-modal-filter-data'>
            <img className='set-Filter-Data' src={set} alt="" />
            <div>
            <label htmlFor=""><h1>Status</h1></label>
         <div className='input-Filter-Data mouse-pointer' onClick={() => setVerifyCheckboxFilterData(true)}>
         <div className='input-Check-Filter-Data' onClick={() => setVerifyCheckboxFilterData(true)}>
             {verifyCheckboxFilterData && <img src={checkboxGreenFilter} alt="" />}
         </div>
         <h1>Inadiplementes</h1>
        </div>
        <div className='input-Filter-Data mouse-pointer' onClick={() => setVerifyCheckboxFilterData(false)}>
         <div className='input-Check-Filter-Data' onClick={() => setVerifyCheckboxFilterData(false)}>
             {!verifyCheckboxFilterData && <img src={checkboxGreenFilter} alt="" />}
         </div>
         <h1>Em Dia</h1>
        </div>
        </div>
        <div className='container-button-filter-data'>
     <button>Aplicar</button>
     <button onClick={() => setOpenModalFilterDataClient(false)}>Cancelar</button>
     </div>
     </div>
    )
}