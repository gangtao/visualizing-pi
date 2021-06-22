import React from "react";

import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { Text } from "@visx/text";

import pi from "../Pi.js";

export default function BarChart() {
  const width = 800;
  const height = 200;
  const verticalMargin = 50;

  let [sData, setSData] = React.useState({ size: 0, data: [] });

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setSData((d) => {
        const currentSize = d.size;

        if (currentSize === 100) {
          return { size: 0, data: [] };
        }

        //TODO: just caculate new data point
        const data = pi(currentSize + 1);
        const barData = new Array(10).fill(0);

        data.forEach((d) => {
          barData[d] += 1;
        });

        const histData = barData.map((d) => {
          return (d = d / (currentSize + 1));
        });

        return { size: currentSize + 1, data: histData };
      });
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  // bounds
  const xMax = width;
  const yMax = height - verticalMargin;

  const xScale = scaleBand({
    range: [0, xMax],
    round: true,
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    padding: 0.4
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    round: true,
    domain: [0, 0.5]
  });

  const color = scaleOrdinal({
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    range: [
      "#3ca74d",
      "#d2b200",
      "#cb2a95",
      "#864dcc",
      "#5d5cdf",
      "#d7373f",
      "#da7b12",
      "#1273e5",
      "#13805b",
      "#7c7c7c"
    ]
  });

  const axisColor = "#1066d0";

  return (
    <svg width={width} height={height}>
      <Group key={`b1key`} top={20} left={10}>
        <Text class="htext" verticalAnchor="start">
          Digits:{sData.size}
        </Text>
      </Group>
      <Group key={`b2key`} top={20} left={10}>
        {sData.data.map((d, i) => {
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(d) ?? 0);
          const barX = xScale(i);
          const barY = yMax - barHeight;
          return (
            <Group key={`b3key` + i}>
              <Bar
                key={`bar-${i}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={color(i)}
              />
              <Text class="htext" x={barX} y={barY - 15} verticalAnchor="start">
                {d.toFixed(2)}
              </Text>
            </Group>
          );
        })}
        <AxisBottom
          top={yMax}
          scale={xScale}
          stroke={axisColor}
          tickStroke={axisColor}
          tickLabelProps={() => ({
            fill: axisColor,
            fontSize: 11,
            textAnchor: "middle"
          })}
        />
      </Group>
    </svg>
  );
}
