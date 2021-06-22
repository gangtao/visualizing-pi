import React from "react";

import { Group } from "@visx/group";
import { Arc } from "@visx/shape";
import { Chord, Ribbon } from "@visx/chord";
import { scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";

import pi from "../Pi.js";

export default function Chords() {
  const width = 800;
  const height = 800;
  const background = "#a2a2a2";
  const size = 1000;

  let [sData, setSData] = React.useState({
    currentSize: 0,
    size: size,
    data: new Array(10).fill(0).map(() => new Array(10).fill(0)),
    piData: pi(size)
  });

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setSData((d) => {
        const currentSize = d.currentSize;
        if (currentSize === d.size) {
          return {
            currentSize: 0,
            size: size,
            data: new Array(10).fill(0).map(() => new Array(10).fill(0)),
            piData: d.piData
          };
        }

        const current = d.piData[currentSize];
        const next = d.piData[currentSize + 1];

        d.data[current][next] += 1;
        return {
          currentSize: currentSize + 1,
          size: d.size,
          data: d.data,
          piData: d.piData
        };
      });
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const dataMatrix = new Array(10).fill(0).map(() => new Array(10).fill(0));

  const data = pi(size);

  for (let i = 0; i < data.length - 1; i++) {
    const current = data[i];
    const next = data[i + 1];
    dataMatrix[current][next] += 1;
  }

  function descending(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

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
      "#1066d0",
      "#13805b"
    ]
  });

  const centerSize = 10;
  const outerRadius = Math.min(width, height) * 0.5 - (centerSize + 10);
  const innerRadius = outerRadius - centerSize;

  return (
    <svg width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={14}
        fill={background}
      />
      <Group key={`b1key`} top={20} left={10}>
        <Text class="htext" verticalAnchor="start">
          Digits:{sData.currentSize}
        </Text>
      </Group>
      <Group key={`Ckey`} top={height / 2} left={width / 2}>
        <Chord matrix={sData.data} padAngle={0.05} sortSubgroups={descending}>
          {({ chords }) => (
            <g>
              {chords.groups.map((group, i) => (
                <Arc
                  key={`key-${i}`}
                  data={group}
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  fill={color(i)}
                />
              ))}
              {chords.map((chord, i) => {
                return (
                  <Ribbon
                    key={`ribbon-${i}`}
                    chord={chord}
                    radius={innerRadius}
                    fill={color(chord.target.index)}
                    fillOpacity={0.75}
                  />
                );
              })}
            </g>
          )}
        </Chord>
      </Group>
    </svg>
  );
}
