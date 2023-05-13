import { Bar } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const BarChart = ({ chartData }) => {
    return (
        <div className="chart-container">
            <Bar
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: `${chartData.datasets.label}`
                        },
                        legend: {
                            display: false
                        }
                    }
                }}
            />
        </div>
    );
};