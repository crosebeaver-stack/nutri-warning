import { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState("");

  const checkFood = (food: string) => {
    const badFoods = ["mcdonalds", "burger", "pizza", "kfc"];
    if (badFoods.includes(food.toLowerCase())) {
      setResult("🚫 DON'T EAT THAT!");
    } else {
      setResult("✅ That’s probably fine.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Nutri Warning</h1>

      <button onClick={() => checkFood("burger")}>
        Check Burger
      </button>

      <button onClick={() => checkFood("apple")} style={{ marginLeft: "10px" }}>
        Check Apple
      </button>

      <h2 style={{ marginTop: "30px" }}>{result}</h2>
    </div>
  );
}

export default App;