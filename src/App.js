import { useDispatch, useSelector } from "react-redux";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.count);
  const handleIncrement = () => {
    dispatch({
      type: "INC",
    });
  };
  const handleIncrementByTen = () => {
    dispatch({
      type: "INCBY10",
      payload: 10,
    });
  };
  return (
    <div className="App">
      <h1>Current Count : {count}</h1>
      <button onClick={handleIncrement}>Plus</button>
      <button onClick={handleIncrementByTen}>Plus 10</button>
    </div>
  );
}

export default App;
