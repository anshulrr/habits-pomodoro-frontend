import { buttonsStates, projectsChartData, streakChart, taskStats, tasksChartData, tasksList1, tasksList2, totalChartData } from "services/helpers/aboutPageHelper";

import { DoughnutChart } from "./stats/charts/DoughnutChart";
import { BarChart } from "./stats/charts/BarChart";
import { Bar } from "react-chartjs-2"
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(CategoryScale)
Chart.register(annotationPlugin);


export default function AboutComponent() {

    return (
        <div className="container about-page">
            <div className="row mt-3 mb-0">
                <div className="col-lg-12 mb-0">
                    <div className="text-bg-primary p-1" style={{ borderRadius: "10px" }}>

                        <h1 className="h3">
                            Habits Pomodoro
                        </h1>
                        <div className="h6">
                            A productivity tracking web app for learners and anyone who wants to build good habits and break bad once.
                        </div>
                    </div>
                </div>
            </div>
            <div className="row small mt-2">
                <div className="col-12">
                    <div className="">
                        <i className="bi bi-info-circle" /> This app is inspired by techniques explained in the book Atomic Habits by James Clear.
                    </div>
                    <div className="">
                        <i className="bi bi-info-circle" /> Do you feel that even after reading the whole book, it is difficult to follow the mentioned ideas in your life?
                        Then let this app help you understand, remember and follow the ideas of habit creation, by using simple tech in your device.
                    </div>
                    <div className="">
                        <i className="bi bi-info-circle" /> If you have trouble planning your days, let's start with tracking your day and then gradually start using this tracked data for your next day plan.
                    </div>
                </div >
            </div >
            <div className="row small my-0">
                <div className="col-lg-6 my-0 text-start my-auto">
                    <div className="alert alert-primary px-2 py-1">
                        <h2 className="h5 py-2">
                            Basic Features
                        </h2>
                        <ul className="text-start">
                            <li>
                                To <span className="fw-bold">add a task</span> of the habit you want to monitor use
                                <button type="button" className="btn btn-sm btn-outline-secondary px-1 py-0 mx-1 align-middle">
                                    <i className="bi bi-plus-circle"></i>
                                </button>
                                button.
                            </li>
                            <li>
                                <div>
                                    To <span className="fw-bold">start pomodoro timer</span> click on play
                                    <button type="button" className="btn btn-sm btn-outline-success px-1 py-0 mx-1 align-middle">
                                        <i className="bi bi-play-circle"></i>
                                    </button>
                                    button.
                                    <span className="ms-1 small fst-italic">
                                        (β version: doesn't work correctly in mobile device)
                                    </span>
                                </div>

                                <div>
                                    <span className="me-1">
                                        To <span className="fw-bold">add old entry</span> use
                                    </span>
                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2 me-1">
                                        Add past Pomodoro <i className="bi bi-calendar-plus" />
                                    </button>
                                    from task popup list, and specify 'End Time' & 'Time Spent'.
                                </div>
                            </li>
                            <li className="my-1">
                                <div>
                                    <span className="me-1">
                                        To check <span className="fw-bold">stats of the task</span> use
                                    </span>
                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2 me-1">
                                        Stats <i className="ps-1 bi bi-graph-up" />
                                    </button>
                                    from task popup list.
                                </div>
                                <div>
                                    To check <span className="fw-bold">stats of all the tasks</span> added, go to 'Stats' page.
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto">
                    <div className="px-2 mx-2 rounded" style={{ backgroundColor: "rgb(233, 236, 239)" }}>
                        <div className="content" dangerouslySetInnerHTML={{ __html: tasksList1 }}></div>
                    </div>
                </div>
            </div>

            <div className="row small my-0">
                <div className="col-lg-6 my-0 order-lg-3 text-start my-auto">
                    <div className="about-card px-2 py-1">
                        <h2 className="h5 py-2">
                            More Features
                        </h2>
                        <div>
                            Let’s start exploring one by one, how features in this app can help you to follow the ideas mentioned in each chapter of the book.
                        </div>
                        <h3 className="h6 py-2">
                            Introduction
                        </h3>
                        <div>
                            <ol>
                                <li>
                                    <span className="fst-italic">System</span>: As days pass by, our daily routine tasks convert to habits. Hence regularly we build bad habits, automatically without any extra effort.
                                </li>
                                <ul className="ms-2">
                                    <li>
                                        Now it is our choice to let the bad habits build or create a system to build good habits.
                                    </li>
                                </ul>
                                <li>
                                    <span className="fst-italic">Identity</span>: To become the identity you wish for, choose role models and start adding their good habits.
                                </li>
                                <li>
                                    <span className="fst-italic">Freedom</span>: We all want to achieve freedom in all aspects of life. We can do it by gradually building required habits.
                                </li>
                                <ul className="ms-2">
                                    <li>
                                        Physical Health, Family and Relationship Fulfillment, Career Prosperity, Financial Satisfaction, Spiritual Wellness, Mental Strength
                                    </li>
                                </ul>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto order-lg-1">
                    <div className="px-2 mx-2 rounded" style={{ backgroundColor: "rgb(233, 236, 239)" }}>
                        <div className="content" dangerouslySetInnerHTML={{ __html: tasksList2 }}>
                        </div>
                    </div>
                </div>
                <div className="col-lg-1 order-lg-2"></div>
            </div>

            <div className="row small my-0">
                <div className="col-lg-6 my-0 text-start my-auto">
                    <div className="about-card px-2 py-1">

                        <h3 className="h6 py-2">
                            Make It Obvious
                        </h3>
                        <ol>
                            <li>
                                <span className="fst-italic">Awareness</span>: To create a Habit Scorecard add all your habits (tasks).
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Update Task’s <span className="fw-bold">Habit Type</span>: neutral, good, bad.
                                </li>
                                <li>
                                    Later on once you have many habits to monitor, you will need easy access to habits and better visualization of stats.
                                    For that put them into separate <span className="fw-bold">Projects</span> of different <span className="fw-bold">Project Categories</span>.
                                    You can also group habits by <span className="fw-bold">Tags</span> (daily, imp) for easy access.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Types of cues</span>: time & location
                            </li>
                            <ul className="ms-2">
                                <li>
                                    For <span className="fst-italic">implementation intention</span> use <span className="fw-bold">Due Time</span> (Also you can use option to repeat after #days).
                                </li>
                                <li>
                                    To achieve <span className="fst-italic">Habits Stacking</span> set same Due Time for stacked tasks.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Context of Environment</span>:
                            </li>
                            <ul className="ms-2">
                                <li>
                                    You can use task <span className="fw-bold">Notes</span> to specify location or any other details.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Invisible</span>: Restrain intention
                            </li>
                            <ul className="ms-2">
                                <li>
                                    To avoid distractions due to bad habit, set <span className="fw-bold">Restrain Time</span> after working hours ie. end of the day, and stick to it without fail.
                                </li>
                                <li>
                                    Add notes for each violations.
                                </li>
                            </ul>
                        </ol>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto">
                    <div className="my-1 mx-2 py-1 chart-card content">
                        <h6>
                            Total (avg hours)
                        </h6>
                        <div className="container">
                            {
                                <div>
                                    <button type="button" className="btn btn-sm btn-outline-secondary ">Daily</button>
                                    <button type="button" className="btn btn-sm btn-outline-secondary active">Weekly</button>
                                    <button type="button" className="btn btn-sm btn-outline-secondary ">Monthly</button>
                                </div>
                            }
                            <div className="row">
                                <div className="col-3">
                                    <i className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-left"></i>
                                </div>
                                <div className="col-6">
                                </div>
                                <div className="col-3">
                                    <i className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                        <div className="chart-container">
                            <Bar
                                data={
                                    {
                                        labels: totalChartData.labels,
                                        datasets: totalChartData.datasets
                                    }
                                }
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    aspectRatio: 0.75,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                            labels: {
                                                boxWidth: 10
                                            }
                                        }
                                    },
                                    scales: {
                                        x: {
                                            stacked: true
                                        },
                                        y: {
                                            stacked: true
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row small my-0">
                <div className="col-lg-6 my-0 order-lg-3 text-start my-auto">
                    <div className="about-card px-2 py-1">

                        <h3 className="h6 py-2">
                            Make It Attractive
                        </h3>
                        <ol>
                            <li>
                                <span className="fst-italic">Temptation Bundling</span>: Anticipation of reward.
                            </li>
                            <ul className="ms-2">
                                <li>
                                    You can always check the streak of good habits and streak of bad habits.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Social Groups</span>:
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Figure out good habits in your social groups, add it as to be started habits.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Repulsion Bundling</span>: read books / blogs to reframe.
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Add reframe reasons to task notes.
                                </li>
                                <li>
                                    Set <span className="fw-bold">Daily Pomodoros Limit</span> for a bad habit, then check the days of violations in task stats.
                                </li>
                            </ul>
                        </ol>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto order-lg-1 text-center">
                    <div className="my-1 mx-2 py-1 chart-card content">
                        <BarChart
                            chartData={projectsChartData}
                            buttonsStates={buttonsStates}
                            thickness={2}
                            isDummy={true}
                        />
                    </div>
                </div>
                <div className="col-lg-1 order-lg-2"></div>
            </div>

            <div className="row small my-0">
                <div className="col-lg-6 my-0 text-start my-auto">
                    <div className="about-card px-2 py-1">

                        <h3 className="h6 py-2">
                            Make It Easy
                        </h3>
                        <ol>
                            <li>
                                <span className="fst-italic">Number of times</span>:
                            </li>
                            <ul className="ms-2">
                                <li>
                                    <span className="fw-bold">Streak of each task</span>: showing number of days missed.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Decrease friction</span>: for good habits.
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Map tasks to <span className="fw-bold">Daily Tag</span> for easy access, which will also help to see stacked tasks in one place.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">2 Minute rule</span>: Ritualize the beginning.
                            </li>
                            <ul className="ms-2">
                                <li>
                                    For new habits <span className="fw-bold">Increase pomodoro length gradually</span>.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Increase friction</span>: for bad habits.
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Keep an eye on the streak of bad habits. Decrease the number of days spent on bad habits.
                                </li>
                            </ul>

                        </ol>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto">
                    <div className="mx-2 rounded">
                        <div className="content" dangerouslySetInnerHTML={{ __html: taskStats }}></div>
                    </div>
                </div>
            </div>

            <div className="row small my-0">
                <div className="col-lg-6 my-0 order-lg-3 text-start my-auto">
                    <div className="about-card px-2 py-1">

                        <h3 className="h6 py-2">
                            Make It Satisfying
                        </h3>
                        <ol>
                            <li>
                                <span className="fst-italic">Immediate Reward</span>:
                            </li>
                            <ul className="ms-2">
                                <li>
                                    <span className="fw-bold">Detailed and filtered Stats in different time frames</span> of all habits.
                                </li>
                                <li>
                                    <span className="fw-bold">Streak of tasks, projects and categories</span>.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Habit Tracker</span>: Never miss good habits twice / Never repeat bad habits again.
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Use streak in task stats for regular monitoring.
                                </li>
                            </ul>
                            <li>
                                <span className="fst-italic">Accountability Partners</span>:
                            </li>
                            <ul className="ms-2">
                                <li>
                                    Allow <span className="fw-bold">Accountability Partners</span> to collaborate using shared stats of selected project categories.
                                </li>
                            </ul>
                        </ol>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto order-lg-1 text-center">
                    <div className="my-1 mx-2 py-1 chart-card content">
                        <DoughnutChart
                            chartData={tasksChartData}
                            buttonsStates={buttonsStates}
                            thickness={1}
                            isDummy={true}
                        />
                    </div>
                </div>
                <div className="col-lg-1 order-lg-2"></div>
            </div>

            <div className="row small my-0">
                <div className="col-lg-6 my-0 text-start my-auto">
                    <div className="about-card px-2 py-1">
                        <h3 className="h6 py-2">
                            Advanced Tactics
                        </h3>
                        <ol>
                            <li>
                                <span className="fst-italic">Exploit vs Explore</span>: Once you feel your life is getting stagnant, start exploring finding good habits to add to your daily routine.
                            </li>
                            <li>
                                <span className="fst-italic">Motivation</span>: It is important to figure out good habits which are at the edge of your ability. Gradually it will help to build better and better habits.
                            </li>
                            <li>
                                <span className="fst-italic">Reflect and Review</span>: Don’t get stuck with your old habits. Reflect and review and make some tweaks when necessary.
                            </li>
                        </ol>
                    </div>
                </div>
                <div className="col-lg-4 offset-lg-1 py-2 my-auto">
                    <div className="mx-2 rounded">
                        <div className="content" dangerouslySetInnerHTML={{ __html: streakChart }}></div>
                    </div>
                </div>
            </div>
            <div className="row small my-0">
                <div className="col-lg-12 pb-2">
                    <div className="alert alert-primary py-1" role="alert">
                        <i className="bi bi-info-circle" /> To access this version of the app easily, you can use the <span className="fw-bold">'Install app'</span> option available in Chrome browser.
                    </div>
                    <div>
                        Please reach out <a href="mailto:ansh14j@gmail.com">here</a> if you have any suggestions or issues.
                    </div>
                </div>
            </div>
        </div >
    )
}