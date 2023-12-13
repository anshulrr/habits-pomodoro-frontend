export default function AboutComponent() {

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="col-lg-12">
                    <h1 className="h3">
                        Habits Pomodoro
                    </h1>
                    <h2 className="h5 py-2">
                        About this app
                    </h2>
                </div>
            </div>
            <div className="row small">
                <div className="col-lg-12 mb-2">
                    This app is inspired by techniques explained in the book Atomic Habits by James Clear.
                    <div>
                        Do you feel that even after reading the whole book, it is really difficult to follow the mentioned ideas in your life?
                        Then let this app can help you understand, remember and follow the ideas of habit creation by using simple tech in your device.
                    </div>
                </div>
                <div className="col-lg-12 text-start" style={{ backgroundColor: "#f2f3f4" }}>
                    <h3 className="h5 py-2">
                        Basic Features
                    </h3>
                    <ul className="text-start">
                        <li className="mb-2">
                            To <b>add a task</b> of the habit you want to monitor use
                            <button type="button" className="btn btn-sm btn-outline-secondary px-1 py-0 mx-1 align-middle">
                                <i className="bi bi-plus-circle"></i>
                            </button>
                            button.
                        </li>
                        <li>
                            <div className="mb-2">
                                To <b>start pomodoro timer</b> click on play
                                <button type="button" className="btn btn-sm btn-outline-success px-1 py-0 mx-1 align-middle">
                                    <i className="bi bi-play-circle"></i>
                                </button>
                                button.
                                <span className="ms-1 small fst-italic">
                                    (β version: doesn't work correctly in mobile device)
                                </span>
                            </div>

                            <div className="mb-2">
                                <span className="me-1">
                                    To <b>add old entry</b> use
                                </span>
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2 me-1">
                                    Add past Pomodoro <i className="bi bi-calendar-plus" />
                                </button>
                                from task popup list, and specify 'End Time' & 'Time Taken'.
                            </div>
                        </li>
                        <li className="my-1">
                            <div className="mb-2">
                                <span className="me-1">
                                    To check <b>stats of the task</b> use
                                </span>
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2 me-1">
                                    Stats <i className="ps-1 bi bi-graph-up" />
                                </button>
                                from task popup list.
                            </div>
                            <div className="mb-2">
                                To check <b>stats of all the tasks</b> added, go to 'Stats' page.
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    )
}