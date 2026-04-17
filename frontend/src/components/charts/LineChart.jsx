import React from "react";
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  Legend,
} from "recharts";

const ChartTooltip = ({ active, payload, label, yFormatter }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#FFFFFF",
        border: "1px solid #DDE3D8",
        padding: "10px 12px",
        minWidth: 180,
      }}
    >
      <div style={{ color: "#333333", fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} style={{ color: item.color, fontSize: 13, marginBottom: 2 }}>
          {item.name}: {yFormatter(item.value)}
        </div>
      ))}
    </div>
  );
};

const LineChart = ({
  data,
  xKey,
  yKey,
  secondaryKey,
  color = "#00793A",
  secondaryColor = "#65AC1E",
  yLabel = "Value",
  secondaryLabel = "Secondary",
  area = true,
  height = 320,
  yFormatter = (value) => value,
}) => (
  <ResponsiveContainer width="100%" height={height}>
    <ReLineChart data={data} margin={{ top: 8, right: 14, left: 4, bottom: 0 }}>
      <defs>
        <linearGradient id={`gradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="10%" stopColor={color} stopOpacity={0.28} />
          <stop offset="95%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
      <XAxis dataKey={xKey} tick={{ fill: "#5F6B64", fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis
        tickFormatter={yFormatter}
        tick={{ fill: "#5F6B64", fontSize: 12 }}
        axisLine={false}
        tickLine={false}
        width={56}
      />
      <Tooltip content={<ChartTooltip yFormatter={yFormatter} />} />
      <Legend iconType="circle" />
      {area && (
        <Area
          type="monotone"
          dataKey={yKey}
          stroke="none"
          fill={`url(#gradient-${yKey})`}
          legendType="none"
          isAnimationActive={false}
        />
      )}
      <Line
        type="monotone"
        name={yLabel}
        dataKey={yKey}
        stroke={color}
        strokeWidth={2.8}
        dot={false}
        activeDot={{ r: 5 }}
        connectNulls
      />
      {secondaryKey && (
        <Line
          type="monotone"
          name={secondaryLabel}
          dataKey={secondaryKey}
          stroke={secondaryColor}
          strokeWidth={2.2}
          dot={false}
          activeDot={{ r: 4 }}
          connectNulls
        />
      )}
    </ReLineChart>
  </ResponsiveContainer>
);

export default LineChart;
