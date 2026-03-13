import React from "react";
import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const RadarTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid #DDE3D8", padding: "8px 10px" }}>
      <div style={{ fontWeight: 700, color: "#333333" }}>{payload[0].payload.category}</div>
      <div style={{ color: "#00793A", fontSize: 13 }}>{payload[0].value} / 100</div>
    </div>
  );
};

const RadarChart = ({ data, dataKey, categories, color = "#00793A", height = 320 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <ReRadarChart data={data}>
      <PolarGrid stroke="#D8DED5" />
      <PolarAngleAxis dataKey={categories} tick={{ fill: "#4F5B53", fontSize: 12 }} />
      <PolarRadiusAxis domain={[0, 100]} tick={{ fill: "#728078", fontSize: 11 }} />
      <Tooltip content={<RadarTooltip />} />
      <Radar name={dataKey} dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.28} />
    </ReRadarChart>
  </ResponsiveContainer>
);

export default RadarChart;
