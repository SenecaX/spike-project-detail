import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

type LineChartD3Props = {
  data: { name: string; temperature: number; crackmovement: number }[];
};

const LineChartD3: React.FC<LineChartD3Props> = ({ data }) => {
  const ref = useRef<SVGSVGElement>(null);
  const [range, setRange] = useState([0, 100]);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();

      const margin = { top: 10, right: 100, bottom: 100, left: 0 };
      const brushHeight = 40;
      const width = 1400 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom - brushHeight;

      // Handle brush event
      const brushed = (event: d3.D3BrushEvent<any>) => {
        const selection = event.selection;
        if (selection) {
          const rangePercentage = [
            (selection[0] / width) * 100,
            (selection[1] / width) * 100,
          ];
          setRange(rangePercentage); // Update state with the new range
        }
      };

      const brushes = d3
        .brushX()
        .extent([
          [0, height + 10],
          [width, height + brushHeight],
        ])
        .on("brush", brushed) // Use new brush event handler
        .on("end", brushed); // Also update on brush end

      const x = d3
        .scaleUtc()
        .domain(d3.extent(data, (d) => new Date(d.name)))
        .range([0, width]);
      const y1 = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.temperature),
          d3.max(data, (d) => d.temperature),
        ])
        .range([height, 0])
        .clamp(true);
      const y2 = d3
        .scaleLinear()
        .domain([
          d3.min(data, (d) => d.crackmovement),
          d3.max(data, (d) => d.crackmovement),
        ])
        .range([height, 0])
        .clamp(true);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      g.append("text").attr("x", -margin.left).attr("y", 10).text("mm");
      g.append("text")
        .attr("x", width + margin.right - 20)
        .attr("y", 10)
        .text("degrees celcius");

      const xAxis = g
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));
      const yAxisLeft = g.append("g").call(d3.axisLeft(y1));
      const yAxisRight = g
        .append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(y2));

      const line1 = d3
        .line<{ name: string; temperature: number }>()
        .x((d) => x(new Date(d.name)))
        .y((d) => y1(d.temperature));
      const line2 = d3
        .line<{ name: string; crackmovement: number }>()
        .x((d) => x(new Date(d.name)))
        .y((d) => y2(d.crackmovement));

      const path1 = g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#E85319")
        .attr("stroke-width", 1.5)
        .attr("d", line1);
      const path2 = g
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0f5a96")
        .attr("stroke-width", 1.5)
        .attr("d", line2);

      const brush = d3
        .brushX()
        .extent([
          [0, height + 10],
          [width, height + brushHeight],
        ])
        .on("brush", (event) => {
          const selection = event.selection;
          if (selection) {
            x.domain(selection.map(x.invert, x));
            xAxis.call(d3.axisBottom(x));
            path1.attr("d", line1);
            path2.attr("d", line2);
          }
        });

      g.append("g").attr("class", "brush").call(brush);

      const zoomed = (event: d3.D3ZoomEvent<any, any>) => {
        const t = event.transform;
        x.domain(
          t
            .rescaleX(
              d3
                .scaleUtc()
                .domain(d3.extent(data, (d) => new Date(d.name)))
                .range([0, width])
            )
            .domain()
        );
        xAxis.call(d3.axisBottom(x));
        path1.attr("d", line1);
        path2.attr("d", line2);
      };

      const zoom = d3.zoom().on("zoom", zoomed);
      svg.call(zoom);
    }
  }, [data]);

  return <svg ref={ref} width={1400} height={400}></svg>;
};

export default LineChartD3;
