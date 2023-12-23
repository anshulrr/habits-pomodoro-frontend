import moment from "moment";


export const tasksChartData = {
    colors: ['#105b06', '#107B06', '#229B22', '#FF0000', '#FF0000', '#8B8000'],
    data: [8.183, 4.1, 1.366, 2.416, 1.16, 4.683],
    label: 'Tasks (hours)',
    labels: ['Learning: Artificial Intelligence course', 'Workout: Jogging', 'Non fictional content: Alon Musk by Ashlee Vance', 'Entertainment: Fictional books', 'Entertainment: Fictional Movies', 'General Project: Cooking']
}

export const projectsChartData = {
    colors: ['#105b06', '#107B06', '#229B22', '#FF0000', '#8B8000'],
    data: [8.183, 4.1, 1.366, 3.632, 4.683],
    label: 'Projects (hours)',
    labels: ['Learning', 'Workout', 'Non fictional content', 'Entertainment', 'General Project'],
}

export const buttonsStates = {
    limit: 'weekly',
    offset: 0,
    dateString: moment().format('DD MMM')
}


export const tasksList1 = `
        <div class="row">
            <div class="col-lg-12 py-3">
                <div class="d-flex justify-content-between">
                    <h6><span><i class="bi bi-tag-fill me-1" style="color: rgb(137, 224, 112);"></i>daily</span><span
                            class="ms-1 badge rounded-pill text-bg-secondary">35<i class="ms-1 bi bi-list-ul"></i></span>
                    </h6>
                    <div></div>
                </div>
                <div class="">
                    <div id="tasks-list">
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Meditation </div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>25</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>General</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Tennis</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>50</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>20:05</span><span
                                                class="me-1 "><i class="bi bi-clock-fill"
                                                    style="padding-right: 0.1rem;"></i>50</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>General</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Jogging</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>10</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>6:06</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>General</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Elon Musk by Ashlee Vance</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>15</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>9:37</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>General</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">The Wheel of Time</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>30</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>12:50</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>General</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

export const tasksList2 = `
        <div class="row">
            <div class="col-lg-12 py-3">
                <div class="d-flex justify-content-between">
                    <h6><span><i class="bi bi-tag-fill me-1" style="color: rgb(137, 224, 112);"></i>daily</span><span
                            class="ms-1 badge rounded-pill text-bg-secondary">33<i class="ms-1 bi bi-list-ul"></i></span>
                    </h6>
                    <div></div>
                </div>
                <div class="">
                    <div id="tasks-list">
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Meditation </div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>25</span><span
                                                class="text-danger" style="padding-right: 0.1rem;"><i
                                                    class="bi bi-calendar-check" style="padding-right: 0.1rem;"></i>Dec 21,
                                                12:00</span><span><i class="bi bi-arrow-repeat"
                                                    style="padding-right: 0.1rem;"></i>2</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>Workouts</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-1 text-start"><button type="button"
                                        class="btn-outline-danger btn btn-sm px-1 py-0 align-middle"><i
                                            class="bi bi-calendar-check"></i></button></div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-success">Tennis</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>50</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>23:05</span><span
                                                class="me-1 "><i class="bi bi-clock-fill"
                                                    style="padding-right: 0.1rem;"></i>50</span><span class="text-secondary"
                                                style="padding-right: 0.1rem;"><i class="bi bi-calendar-check"
                                                    style="padding-right: 0.1rem;"></i>Dec 25, 8:00</span><span><i
                                                    class="bi bi-arrow-repeat"
                                                    style="padding-right: 0.1rem;"></i>2</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>Workouts</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-1 text-start"><button type="button"
                                        class="btn-outline-secondary btn btn-sm px-1 py-0 align-middle"><i
                                            class="bi bi-calendar-check"></i></button></div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-success px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Jogging</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>10</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>6:41</span><span
                                                class="text-secondary" style="padding-right: 0.1rem;"><i
                                                    class="bi bi-calendar-check" style="padding-right: 0.1rem;"></i>Dec 25,
                                                6:30</span><span><i class="bi bi-arrow-repeat"
                                                    style="padding-right: 0.1rem;"></i>2</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(0, 201, 201); padding-right: 0.1rem;">■</span>Workouts</span><span
                                                    class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-1 text-start"><button type="button"
                                        class="btn-outline-secondary btn btn-sm px-1 py-0 align-middle"><i
                                            class="bi bi-calendar-check"></i></button></div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-dark px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-success">Elon Musk by Ashlee Vance</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>10</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>40</span><span
                                                class="text-danger" style="padding-right: 0.1rem;"><i
                                                    class="bi bi-calendar-check" style="padding-right: 0.1rem;"></i>Dec 21,
                                                19:00</span><span><i class="bi bi-arrow-repeat"
                                                    style="padding-right: 0.1rem;"></i>1</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(35, 182, 231); padding-right: 0.1rem;">■</span>Non
                                                    Fictional Content</span><span class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-1 text-start"><button type="button"
                                        class="btn-outline-danger btn btn-sm px-1 py-0 align-middle"><i
                                            class="bi bi-calendar-check"></i></button></div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-success px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-secondary">The Wheel of Time</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>30</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>14:50</span><span
                                                class="text-secondary" style="padding-right: 0.1rem;"><i
                                                    class="bi bi-calendar-check"
                                                    style="padding-right: 0.1rem;"></i>19:30</span><span><i
                                                    class="bi bi-arrow-repeat"
                                                    style="padding-right: 0.1rem;"></i>1</span><span
                                                style="float: right;"><span class="me-1"><span
                                                        style="color: rgb(255, 117, 117); padding-right: 0.1rem;">■</span>Fictional
                                                    Books</span><span class="me-1"><i class="bi bi-tag-fill"
                                                        style="color: rgb(137, 224, 112); padding-right: 0.1rem;"></i>daily</span></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="my-auto me-1 text-start"><button type="button"
                                        class="btn-outline-secondary btn btn-sm px-1 py-0 align-middle"><i
                                            class="bi bi-calendar-check"></i></button></div>
                                <div class="my-auto me-2 text-start"><button type="button"
                                        class="btn btn-sm btn-outline-secondary px-1 py-0 align-middle"><i
                                            class="bi bi-play-circle"></i></button></div>
                            </div>
                        </div>
                    </div>
                    <ul class="pagination-container pagination-bar pagination-scroll ps-0">
                        <li class="pagination-item">
                            <div class="arrow left"></div>
                        </li>
                        <li class="pagination-item">1</li>
                        <li class="pagination-item dots">…</li>
                        <li class="pagination-item">4</li>
                        <li class="pagination-item selected">5</li>
                        <li class="pagination-item">6</li>
                        <li class="pagination-item">
                            <div class="arrow right"></div>
                        </li>
                    </ul>
                    <div class="mt-1">
                        <div class="d-flex justify-content-center">
                            <div style="cursor: pointer;"><span class="badge text-bg-light">Archived<span
                                        class="text-secondary ps-1"><i class="bi bi-eye-slash"></i></span></span><span
                                    class="badge rounded-pill text-bg-secondary">23<i class="ms-1 bi bi-list-ul"></i></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;