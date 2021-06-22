import React from "react";

import { Group } from "@visx/group";
import { LinePath, AreaClosed } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";

import { max } from "d3-array";

import pi from "../Pi.js";

export default function Line(props) {
  const { size, lineType } = props;
  const width = 800;
  const height = 100;

  let [sData, setSData] = React.useState([]);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setSData((data) => {
        const currentSize = data.length;
        if (currentSize === size) {
          return [];
        }
        const newData = pi(currentSize + 1);
        return newData.map((d, i) => [i, d]);
      });
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const data = pi(size);
  const lineData = data.map((d, i) => [i, d]);

  // data accessors
  const getX = (d) => d[0];
  const getY = (d) => d[1];

  // scales
  const xScale = scaleLinear({
    domain: [0, max(lineData, getX)]
  });
  const yScale = scaleLinear({
    domain: [0, max(lineData, getY)]
  });

  xScale.range([0, width - 20]);
  yScale.range([height - 20, 0]);

  return (
    <svg width={width} height={height + 40}>
      <Group key={`lkey`} top={20} left={10}>
        <Text class="htext" verticalAnchor="start">
          Digits:{sData.map((d) => d[1]).join("")}
        </Text>
      </Group>
      {lineType === "line" ? (
        <Group key={`l1key`} top={40} left={10}>
          <LinePath
            data={sData}
            x={(d) => xScale(getX(d)) ?? 0}
            y={(d) => yScale(getY(d)) ?? 0}
            stroke="#ca242d"
            strokeWidth="3"
            shapeRendering="geometricPrecision"
          />
        </Group>
      ) : (
        <Group key={`l2key`} top={40} left={10}>
          <AreaClosed
            data={sData}
            x={(d) => xScale(getX(d)) ?? 0}
            y={(d) => yScale(getY(d)) ?? 0}
            yScale={yScale}
            stroke="#ca242d"
            fill="#ca242d"
            strokeWidth="3"
            shapeRendering="geometricPrecision"
          />
        </Group>
      )}
    </svg>
  );
}
