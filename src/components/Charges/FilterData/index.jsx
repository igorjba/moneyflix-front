import { useState } from "react";
import set from "../../../assets/Set.svg";
import checkboxGreenFilter from "../../../assets/checkboxFilterData.svg";
import useUser from "../../../hooks/useUser";
import "./style.css";

export default function FilterData({ setOpenModalFilterData }) {
  const [verifyCheckboxFilterData, setVerifyCheckboxFilterData] = useState(1);
  const { setImageNavCharge, setListClientByStatus } = useUser();

  function ativedFilterDataCharges(){
    if(verifyCheckboxFilterData === 1){
      setListClientByStatus("Vencida")
    }
    if(verifyCheckboxFilterData === 2){
      setListClientByStatus("Pendente")
    }
    if(verifyCheckboxFilterData === 3){
      setListClientByStatus("Paga")
    }
    setOpenModalFilterData(false);
    setImageNavCharge(false);
  }


  return (
    <div className="container-modal-filter-data-charges">
      <img className="set-Filter-Data" src={set} alt="" />
      <div>
        <label htmlFor="">
          <h1>Status</h1>
        </label>
        <div
          className="input-Filter-Data mouse-pointer"
          onClick={() => setVerifyCheckboxFilterData(1)}
        >
          <div
            className="input-Check-Filter-Data"
            onClick={() => setVerifyCheckboxFilterData(1)}
          >
            {verifyCheckboxFilterData === 1 && (
              <img src={checkboxGreenFilter} alt="" />
            )}
          </div>
          <h1>Vencidas</h1>
        </div>
        <div
          className="input-Filter-Data mouse-pointer"
          onClick={() => setVerifyCheckboxFilterData(2)}
        >
          <div
            className="input-Check-Filter-Data"
            onClick={() => setVerifyCheckboxFilterData(2)}
          >
            {verifyCheckboxFilterData === 2 && (
              <img src={checkboxGreenFilter} alt="" />
            )}
          </div>
          <h1>Pendentes</h1>
        </div>
        <div
          className="input-Filter-Data mouse-pointer"
          onClick={() => setVerifyCheckboxFilterData(3)}
        >
          <div
            className="input-Check-Filter-Data"
            onClick={() => setVerifyCheckboxFilterData(3)}
          >
            {verifyCheckboxFilterData === 3 && (
              <img src={checkboxGreenFilter} alt="" />
            )}
          </div>
          <h1>Pagas</h1>
        </div>
      </div>
      <div className="container-button-filter-data-charges">
        <button
          onClick={() => {ativedFilterDataCharges()}}>
          Aplicar
        </button>
        <button onClick={() => setOpenModalFilterData(false)}>Cancelar</button>
      </div>
    </div>
  );
}