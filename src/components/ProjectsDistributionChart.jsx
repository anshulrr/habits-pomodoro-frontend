import { Doughnut } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const ProjectsDistributionChart = ({ chartData }) => {
    // console.log("hi", chartData);

    return (
        <div className="chart-container">
            <Doughnut
                data={
                    {
                        labels: chartData.labels,
                        // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                        datasets: [
                            {
                                label: 'Time in minutes',
                                data: chartData.data,
                                // you can set indiviual colors for each bar
                                backgroundColor: chartData.colors,
                                // borderWidth: 1,
                                // barThickness: 6,  // number (pixels) or 'flex'
                                // maxBarThickness: 8 // number (pixels)
                            }
                        ]
                    }

                }
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: `Project's Distribution Time (${chartData.label})`
                        },
                        legend: {
                            display: true,
                            position: 'right',
                            labels: {
                                boxWidth: 10
                            }
                        }
                    }
                }}
            />
        </div>
    );
};