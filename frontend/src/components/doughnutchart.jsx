import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Title from "./title";

const COLORS = ["#0088FE", "#FFBB28"];

const DoughnutChart = ({ income = 0, expense = 0 }) => {
  // Prepare data based on the received props
  const data = [
    { name: "Income", value: parseFloat(income) || 0 },
    { name: "Expense", value: parseFloat(expense) || 0 },
  ];

  console.log("DoughnutChart Data: ", data); // Log data for debugging

  // Check if there's any data to display
  const hasData = data.some(item => item.value > 0);

  if (!hasData) {
    return (
      <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent">
        <Title title="Summary" />
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">No data available to display.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-1/3 flex flex-col items-center bg-gray-50 dark:bg-transparent">
      <Title title="Summary" />

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
          <Legend verticalAlign="bottom" height={36} />
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;