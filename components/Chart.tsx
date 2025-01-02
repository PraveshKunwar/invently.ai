import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface ChartProps {
  productId: string;
}

interface ProductHistory {
  field_name: string;
  old_value: string | number;
  new_value: string | number;
  updated_at: string;
}

const Chart: React.FC<ChartProps> = ({ productId }) => {
  const [history, setHistory] = useState<ProductHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/product/${productId}/history`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch product history");
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError("Error loading product history");
        console.log(err);
      }
    };
    fetchHistory();
  }, [productId]);
  if (error) return <div>{error}</div>;
  if (!history.length) return <div>No history available for this product</div>;
  const fieldsToChart = [
    "threshold_level",
    "price",
    "depletion_rate",
    "stock_level",
  ];
  const groupedHistory = fieldsToChart.reduce(
    (acc, field) => {
      acc[field] = history
        .filter((record) => record.field_name === field)
        .map((record) => ({
          value: record.new_value,
          date: record.updated_at,
        }));
      return acc;
    },
    {} as Record<string, { value: string | number; date: string }[]>
  );
  return (
    <div>
      {fieldsToChart.map((field, idx) => {
        const fieldData = groupedHistory[field];
        if (!fieldData || fieldData.length === 0) return null;

        const chartData = {
          labels: fieldData.map((record) =>
            new Date(record.date).toLocaleDateString()
          ),
          datasets: [
            {
              label: field,
              data: fieldData.map((record) => record.value),
              borderColor: `hsl(${(idx * 360) / fieldsToChart.length}, 70%, 50%)`,
              fill: false,
            },
          ],
        };
        return (
          <div
            key={field}
            style={{
              width: "100%",
              maxWidth: "800px",
              margin: "2rem auto",
              backgroundColor: "#1e1e1e",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "white", textAlign: "center" }}>
              {`${field.charAt(0).toUpperCase() + field.slice(1)} History`}
            </h3>
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  tooltip: { mode: "index", intersect: false },
                },
                scales: {
                  x: { title: { display: true, text: "Date" } },
                  y: { title: { display: true, text: "Value" } },
                },
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
export default Chart;
