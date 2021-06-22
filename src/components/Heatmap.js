import React from "react";

import { Group } from "@visx/group";
import { HeatmapCircle } from "@visx/heatmap";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";

import pi from "../Pi.js";

export default function Heatmap() {
  const width = 800;
  const height = 800;
  const background = "#28272c";
  const margin = { top: 20, left: 0 };
  const gap = 1;
  const maxSize = 77;

  let [sData, setSData] = React.useState({
    currentSize: 0,
    data: [],
    r: 0,
    xScale: scaleLinear({ domain: [0, 0] }),
    yScale: scaleLinear({ domain: [0, 0] })
  });

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setSData((d) => {
        const size = d.currentSize + 1;
        if (size === maxSize) {
          return {
            currentSize: 0,
            data: [],
            r: 0,
            xScale: scaleLinear({ domain: [0, 0] }),
            yScale: scaleLinear({ domain: [0, 0] })
          };
        }
        const data = pi(size * size);
        const heatmapData = [];
        for (let i = 0; i < size; i++) {
          const rowData = data.slice(i * size, i * size + size);
          const row = {};
          row.bin = i;
          row.bins = rowData.map((d, i) => {
            return { bin: i, count: d };
          });
          heatmapData.push(row);
        }
        const r = width / (2 * size) - gap;
        const xScale = scaleLinear({
          domain: [0, size],
          range: [0, width - margin.left]
        });
        const yScale = scaleLinear({
          domain: [0, size],
          range: [0, height - margin.top]
        });

        return {
          currentSize: d.currentSize + 1,
          data: heatmapData,
          xScale: xScale,
          yScale: yScale,
          r: r
        };
      });
    }, 500);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const colorScale = scaleOrdinal({
    range: [
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf"
    ],
    domain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  });

  const opacityScale = scaleLinear({
    range: [0.1, 1],
    domain: [0, 9]
  });

  return (
    <svg width={width} height={height}>
      <Group key={`HTkey`}>
        <Text class="htext" verticalAnchor="start">
          Digits:{sData.currentSize ** 2}
        </Text>
      </Group>
      <Group key={`Hkey`} top={margin.top} left={margin.left}>
        <rect
          x={0}
          y={0}
          width={width - margin.left}
          height={height - margin.top}
          rx={10}
          fill={background}
        />

        <HeatmapCircle
          data={sData.data}
          colorScale={colorScale}
          xScale={(d) => sData.xScale(d) ?? 0}
          yScale={(d) => sData.yScale(d) ?? 0}
          opacityScale={opacityScale}
          radius={sData.r}
          gap={gap}
        />
      </Group>
    </svg>
  );
}
