import {React,useState,useEffect} from 'react';
import RegistrationTable from '../registrationTable/registrationTable';

import "./style/coar.css";
const Coar = () => {

  const[data, setData] = useState(null);

  useEffect(() => {
    fetch('regdata.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => console.error('Error fetching data:', error));
  },[]);

     if (!data) return <div>Loading...</div>;

  return (
      <div className="coar-table">
            <h1>Registration Data Table</h1>
            <RegistrationTable data={data} />
        </div>
  )
}

export default Coar