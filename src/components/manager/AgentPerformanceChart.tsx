
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AgentPerformanceData {
  name: string;
  hours: number;
  diamonds: number;
  target: number;
}

interface AgentPerformanceChartProps {
  data: AgentPerformanceData[];
}

export const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({
  data,
}) => {
  return (
    <Card className="w-full h-[400px]">
      <CardHeader>
        <CardTitle className="text-lg">Performance des agents</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                borderColor: "#e2e8f0",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
            <Legend />
            <Bar
              dataKey="hours"
              name="Heures de live"
              fill="#8884d8"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="diamonds"
              name="Diamants (x100)"
              fill="#82ca9d"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="target"
              name="Objectif"
              fill="#ffc658"
              radius={[4, 4, 0, 0]}
              opacity={0.5}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
