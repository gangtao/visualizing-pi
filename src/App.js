import "./styles.css";

import React from "react";
import pi from "./Pi.js";
import Line from "./components/Line.js";
import Heatmap from "./components/Heatmap.js";
import Chords from "./components/Chords.js";
import Bar from "./components/Bar.js";

export default function App() {
  return (
    <div className="App">
      <h1>Visualization of π</h1>
      <h5>made by gang.tao@outlook.com </h5>
      <p>π is {pi(10)} </p>

      <div>
        <Chords />
      </div>

      <div>
        <Line size={100} lineType="area" />
      </div>
      <div>
        <Bar />
      </div>
      <div>
        <Heatmap />
      </div>
    </div>
  );
}
