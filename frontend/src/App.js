import React, { useState } from 'react';
import classNames from "classnames";
import './App.css';

function App() {
  const [Operators, setOperators] = useState([]);
  const [currentOperators, setCurrentOperators] = useState('');
  const getOperators = async() => {
    const response = await fetch('http://localhost:5000/api/operators');
    const data = await response.json();
    setOperators(data);
  }

  React.useEffect(() => {
    getOperators();
  }, []);
  return (
    <div className="App">
      <ul>
        {Operators.map((operator) => (
          <div>
            <li onClick={() => {
              setCurrentOperators(operator.OperatorID);
            }} key={operator.OperatorID}>{operator.OperatorName.Zh_tw}: 路線總數: {operator.routes.length}</li>
            <div className={classNames({
              show: currentOperators === operator.OperatorID,
              hide: currentOperators !== operator.OperatorID
            })}> 
              {operator.routes.map((route) => (
                <p>
                  <strong>{route.RouteName.Zh_tw}</strong> 起始點: {route.DepartureStopNameZh}, 終點: {route.DepartureStopNameZh}
                </p>
              ))} 
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
