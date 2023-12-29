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
                    <h6><span><span class="me-1" style="color: rgb(42, 192, 67);">■</span><span>General</span></span><button
                            type="button" class="btn btn-sm btn-outline-secondary py-0 px-1 ms-1"><i
                                class="bi bi-pencil-square"></i></button><button type="button"
                            class="btn btn-sm btn-outline-secondary py-0 px-1 ms-1"><i
                                class="bi bi-chat-right-text"></i></button><span
                            class="ms-1 badge rounded-pill text-bg-secondary">5<i class="ms-1 bi bi-list-ul"></i></span></h6>
                    <div><button type="button" class="btn btn-sm btn-outline-secondary py-0 px-1 mb-2"><i
                                class="bi bi-plus-circle"></i></button></div>
                </div>
                <div class="">
                    <div id="tasks-list">
                        <div class="update-list-row">
                            <div class="d-flex justify-content-start">
                                <div class="mx-2 flex-grow-1 text-start update-popup-container">
                                    <div class="py-2">
                                        <div class="description text-dark">Meditation</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>25</span><span
                                                style="float: right;"></span></div>
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
                                                        class="bi bi-hourglass"></i></span>25</span><span
                                                style="float: right;"></span></div>
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
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>30</span><span
                                                style="float: right;"></span><span class="me-1"><i class="bi bi-clock-fill"
                                                    style="padding-right: 0.1rem;"></i>10</span></div>
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
                                                        class="bi bi-hourglass"></i></span>15</span><span
                                                style="float: right;"></span></div>
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
                                        <div class="description text-dark">The Three Body Problem</div>
                                        <div class="subscript text-secondary"><span class="me-1"><span><i
                                                        class="bi bi-hourglass"></i></span>25</span><span class="me-1"><i
                                                    class="bi bi-clock" style="padding-right: 0.1rem;"></i>25</span><span
                                                style="float: right;"></span></div>
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
                            class="ms-1 badge rounded-pill text-bg-secondary">18<i class="ms-1 bi bi-list-ul"></i></span>
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
                                        <div class="description text-secondary">The Three Body Problem</div>
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
                        <li class="pagination-item selected">2</li>
                        <li class="pagination-item">3</li>
                        <li class="pagination-item">4</li>
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

export const streakChart = `
    <div class="py-1 px-3 chart-card">
        <div>
            <div class="row">
                <div class="col-lg-12 mb-1">
                    <h6 class="mb-0">Daily Streak<wbr><span class="loader-container-2"><span class="ms-1 loader-2"
                                style="display: none;"></span></span></h6>
                </div>
                <div class="col-6 px-0 mb-1"><select class="form-select form-select-sm" id="project_category_id"
                        name="project_category_id">
                        <option value="0">Select Category</option>
                        <option value="1">Learning</option>
                        <option value="53" selected>Hobbies</option>
                    </select></div>
                <div class="col-6 px-0 mb-1"><select class="form-select form-select-sm" id="project_id" name="project_id">
                        <option value="0">Select Category's Project</option>
                        <option value="253">Gappe</option>
                        <option value="162" selected>Non Fictional Content</option>
                        <option value="161">Nature</option>
                        <option value="159">Fictional Books</option>
                        <option value="160">Entertainment</option>
                    </select></div>
                <div class="col-12 px-0 mb-1"><select class="form-select form-select-sm" id="task_id" name="task_id">
                        <option value="0">Select Project's Task</option>
                        <option value="5356">Thinking fast and slow by Daniel Kahneman</option>
                        <option value="4753">Tennis videos</option>
                        <option value="4353">Wildlife videos</option>
                        <option value="4310">Non Fictional movies</option>
                        <option value="3879">Search Books</option>
                        <option value="264">Non fictional book</option>
                        <option value="266">YouTube subscription India</option>
                        <option value="265">YouTube subscription</option>
                        <option value="4405">Non fictional movies old</option>
                        <option value="3704">Atomic Habits revision</option>
                        <option value="4352" selected>Elon Musk by Ashlee Vance</option>
                    </select></div>
            </div><svg class="react-calendar-heatmap" viewBox="0 0 326 120">
                <g transform="translate(30, 0)" class="react-calendar-heatmap-month-labels"><text x="11" y="10"
                        class="react-calendar-heatmap-month-label">Jul</text><text x="66" y="10"
                        class="react-calendar-heatmap-month-label">Aug</text><text x="110" y="10"
                        class="react-calendar-heatmap-month-label">Sep</text><text x="154" y="10"
                        class="react-calendar-heatmap-month-label">Oct</text><text x="209" y="10"
                        class="react-calendar-heatmap-month-label">Nov</text><text x="253" y="10"
                        class="react-calendar-heatmap-month-label">Dec</text></g>
                <g transform="translate(30, 14)" class="react-calendar-heatmap-all-weeks">
                    <g transform="translate(0, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(11, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(22, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(33, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(44, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(55, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(66, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(77, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(88, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(99, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(110, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(121, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(132, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(143, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(154, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(165, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(176, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(187, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(198, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(209, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(220, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(231, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(242, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-22: 0:25">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-24: 0:10">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-25: 0:12">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(253, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-good-10" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-26: 1:05">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-27: 0:05">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-good-10" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-28: 1:40">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-11-30: 0:25">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-good-10" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-02: 1:40">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(264, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-03: 0:10">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-07: 0:10">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-good-10" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-09: 1:15">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(275, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-good-10" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-10: 1:15">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-good-10" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-14: 0:40">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                    <g transform="translate(286, 0)" class="react-calendar-heatmap-week">
                        <rect width="10" height="10" x="0" y="0" class="color-good-0" data-tooltip-id="streak-tooltip"
                            data-tooltip-content="2023-12-17: 0:25">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="11" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="22" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="33" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="44" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="55" class="color-empty">
                            <title></title>
                        </rect>
                        <rect width="10" height="10" x="0" y="66" class="color-empty">
                            <title></title>
                        </rect>
                    </g>
                </g>
                <g transform="translate(10, 14)" class="react-calendar-heatmap-weekday-labels"><text x="0" y="21"
                        class=" react-calendar-heatmap-weekday-label">Mon</text><text x="0" y="43"
                        class=" react-calendar-heatmap-weekday-label">Wed</text><text x="0" y="65"
                        class=" react-calendar-heatmap-weekday-label">Fri</text></g>
            </svg>
        </div>
    </div>
    `;

export const taskStats = `
    <div class="container my-1">
        <div class="row">
            <div class="col-12">
                <h6 class="text-start text-success"><i class="me-1 bi bi-list-ul"></i>Elon Musk by Ashlee Vance</h6>
            </div>
        </div>
        <div class="row small">
            <div class="col-4">Today's Time<div class=""><i class="px-1 bi bi-clock-fill"></i>0</div>
            </div>
            <div class="col-4">Total Time<div class=""><i class="px-1 bi bi-clock"></i>9:37</div>
            </div>
            <div class="col-4">Number of Days<div class=""># 14</div>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-12">
                <div class="p-1 chart-card"><svg class="react-calendar-heatmap" viewBox="0 0 326 120">
                        <g transform="translate(30, 0)" class="react-calendar-heatmap-month-labels"><text x="11" y="10"
                                class="react-calendar-heatmap-month-label">Jul</text><text x="66" y="10"
                                class="react-calendar-heatmap-month-label">Aug</text><text x="110" y="10"
                                class="react-calendar-heatmap-month-label">Sep</text><text x="154" y="10"
                                class="react-calendar-heatmap-month-label">Oct</text><text x="209" y="10"
                                class="react-calendar-heatmap-month-label">Nov</text><text x="253" y="10"
                                class="react-calendar-heatmap-month-label">Dec</text></g>
                        <g transform="translate(30, 14)" class="react-calendar-heatmap-all-weeks">
                            <g transform="translate(0, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(11, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(22, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(33, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(44, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(55, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(66, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(77, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(88, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(99, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(110, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(121, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(132, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(143, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(154, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(165, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(176, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(187, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(198, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(209, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(220, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(231, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(242, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-good-10"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-22: 0:25">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-good-0"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-24: 0:10">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-good-0"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-25: 0:12">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(253, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-good-20"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-26: 1:05">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-good-0"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-27: 0:05">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-good-30"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-28: 1:40">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-good-10"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-11-30: 0:25">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-good-30"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-02: 1:40">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(264, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-good-0"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-03: 0:10">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-good-0"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-07: 0:10">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-good-20"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-09: 1:15">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(275, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-good-20"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-10: 1:15">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-good-10"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-14: 0:40">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                            <g transform="translate(286, 0)" class="react-calendar-heatmap-week">
                                <rect width="10" height="10" x="0" y="0" class="color-good-10"
                                    data-tooltip-id="streak-tooltip" data-tooltip-content="2023-12-17: 0:25">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="11" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="22" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="33" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="44" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="55" class="color-empty">
                                    <title></title>
                                </rect>
                                <rect width="10" height="10" x="0" y="66" class="color-empty">
                                    <title></title>
                                </rect>
                            </g>
                        </g>
                        <g transform="translate(10, 14)" class="react-calendar-heatmap-weekday-labels"><text x="0" y="21"
                                class=" react-calendar-heatmap-weekday-label">Mon</text><text x="0" y="43"
                                class=" react-calendar-heatmap-weekday-label">Wed</text><text x="0" y="65"
                                class=" react-calendar-heatmap-weekday-label">Fri</text></g>
                    </svg></div>
            </div>
        </div>
        <div class="row small text-secondary m-2">
            <div class="col-12">
                <div class="row small text-start">
                    <div class="col-12">
                        <h6><span>Pomodoros</span><span class="ms-1 badge rounded-pill text-bg-secondary">27<i
                                    class="ms-1 bi bi-hourglass"></i></span></h6>
                    </div>
                    <div class="col-12 border text-center"><span class="me-1"><span><i
                                    class="bi bi-hourglass"></i></span>25</span><span style="padding-right: 0.1rem;"><i
                                class="bi bi-calendar-check" style="padding-right: 0.1rem;"></i>21:30</span><span><i
                                class="bi bi-arrow-repeat" style="padding-right: 0.1rem;"></i>1</span></div>
                </div>
                <div id="pomodoros-list">
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 17</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-success"><span>11:00</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">25</span></span></div>
                    </div>
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 14</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-success"><span>20:35</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">15</span></span></div>
                    </div>
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 14</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-success"><span>20:35</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">25</span></span></div>
                    </div>
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 10</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-danger"><span>22:00</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">25</span></span></div>
                    </div>
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 10</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-danger"><span>22:00</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">25</span></span></div>
                    </div>
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 10</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-danger"><span>22:00</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">25</span></span></div>
                    </div>
                    <div class="px-1 row pomodoro-list-row">
                        <div class="col-4 text-start"><span class="me-1 small">2023 Dec 09</span></div>
                        <div class="col-4 text-end"><span class="me-1 small text-success"><span>21:00</span></span></div>
                        <div class="col-4 text-end"><span class="small"><i class="bi bi-clock-fill"
                                    style="padding-right: 0.1rem;"></i><span
                                    style="font-variant-numeric: tabular-nums;">25</span></span></div>
                    </div>
                </div>
                <ul class="pagination-container pagination-bar pagination-scroll mb-0 ps-0">
                    <li class="pagination-item disabled">
                        <div class="arrow left"></div>
                    </li>
                    <li class="pagination-item selected">1</li>
                    <li class="pagination-item">2</li>
                    <li class="pagination-item">3</li>
                    <li class="pagination-item">4</li>
                    <li class="pagination-item">
                        <div class="arrow right"></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    `;

export const totalChartData = {
    labels: ['11 Sep-17 Sep', '18 Sep-24 Sep', '25 Sep-01 Oct', '02 Oct-08 Oct', '09 Oct-15 Oct', '16 Oct-22 Oct', '23 Oct-29 Oct', '30 Oct-05 Nov', '06 Nov-12 Nov', '13 Nov-19 Nov', '20 Nov-26 Nov', '27 Nov-03 Dec', '04 Dec-10 Dec', '11 Dec-17 Dec', '18 Dec-24 Dec'],
    datasets: [
        {
            "backgroundColor": "#4a86e8",
            "data": [
                0.34,
                1.1333333333333333,
                0.03666666666666667,
                0.16333333333333333,
                0.2,
                0.4166666666666667,
                0,
                0.23333333333333334,
                0,
                0,
                0.05,
                0.04,
                0.13333333333333333,
                0.15333333333333332,
                1.0866666666666667
            ],
            "label": "Practice"
        },
        {
            "backgroundColor": "#6aa84f",
            "data": [
                0,
                0,
                0,
                0.25,
                0.2833333333333333,
                0,
                0.11333333333333333,
                0.4766666666666667,
                0.08333333333333333,
                0,
                0.09,
                0.14333333333333334,
                0,
                0.15333333333333332,
                0.08333333333333333
            ],
            "label": "Learning"
        },
        {
            "backgroundColor": "#274e13",
            "data": [
                0,
                0.8,
                0.16,
                1.2966666666666666,
                1.45,
                0,
                0.82,
                1.8333333333333333,
                0.6033333333333334,
                0.18,
                1.2366666666666666,
                0.7866666666666666,
                0.22333333333333333,
                0.05333333333333334,
                0.3233333333333333
            ],
            "label": "Workout"
        },
        {
            "backgroundColor": "#124f12",
            "data": [
                0.5666666666666667,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            "label": "Non Fictional Content"
        },
        {
            "backgroundColor": "#7f6000",
            "data": [
                0.9066666666666666,
                0.33,
                0,
                0.36,
                0.13333333333333333,
                0,
                0.04,
                0.08333333333333333,
                0.04,
                0,
                0.69,
                0,
                0.0033333333333333335,
                0.08666666666666667,
                0.5566666666666666
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#ffe599",
            "data": [
                0.03,
                0,
                0,
                0.06666666666666667,
                0.26666666666666666,
                0.03333333333333333,
                0,
                0.03333333333333333,
                0.05333333333333334,
                0,
                0.06666666666666667,
                0.03333333333333333,
                0.29333333333333333,
                0.03333333333333333,
                0.13333333333333333
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#f1c232",
            "data": [
                0,
                0,
                0,
                0,
                0.4033333333333333,
                0.25,
                0.28,
                0.3433333333333333,
                0.16666666666666666,
                0.18,
                0.4866666666666667,
                0.27666666666666667,
                0.59,
                0,
                0
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#b6d7a8",
            "data": [
                0.03333333333333333,
                0,
                0,
                0,
                0,
                0,
                0,
                0.4633333333333333,
                0,
                0,
                0,
                0.08333333333333333,
                0.31333333333333335,
                1.6466666666666667,
                0.17333333333333334
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#2ac043",
            "data": [
                0.8466666666666667,
                0,
                0.8633333333333333,
                0.81,
                1.62,
                0.13333333333333333,
                0,
                0.43,
                0.6066666666666667,
                0,
                0.16666666666666666,
                1.41,
                0.8933333333333333,
                0.4033333333333333,
                0.22
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#52ff52",
            "data": [
                0.36666666666666664,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0.1,
                0,
                0.03333333333333333,
                0,
                0.05333333333333334,
                0.023333333333333334,
                0
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#8fff8f",
            "data": [
                2.32,
                0.45,
                0,
                3.23,
                0.5333333333333333,
                0.3,
                0.2966666666666667,
                1.1033333333333333,
                1.0533333333333332,
                0,
                0.5966666666666667,
                2.3966666666666665,
                3.4366666666666665,
                2.4966666666666666,
                4.386666666666667
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#00c9c9",
            "data": [
                0.2733333333333333,
                0.6,
                0.31666666666666665,
                0.47,
                0.5366666666666666,
                0.5666666666666667,
                0.71,
                0.48333333333333334,
                0.5366666666666666,
                0.33666666666666667,
                0.55,
                0.8833333333333333,
                0.7666666666666667,
                0.5866666666666667,
                0.6533333333333333
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#23b6e7",
            "data": [
                0,
                0,
                0.03333333333333333,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0.8566666666666667,
                1.2,
                0.5333333333333333,
                0.31666666666666665,
                0.23333333333333334
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#22688c",
            "data": [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0.11666666666666667,
                0
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#22d4d4",
            "data": [
                0,
                0,
                0,
                0,
                0.16666666666666666,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0.25,
                0
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#ff7575",
            "data": [
                0.8333333333333334,
                0.7666666666666667,
                7.133333333333334,
                0.7366666666666667,
                0.7,
                2.47,
                6.483333333333333,
                2.8,
                2.8833333333333333,
                3.44,
                0.5833333333333334,
                0.6,
                0.7,
                0.6,
                0.4
            ],
            "label": "..."
        },
        {
            "backgroundColor": "#ff0000",
            "data": [
                1.1666666666666667,
                2.9966666666666666,
                3.4,
                1.45,
                1.0566666666666666,
                2.933333333333333,
                1.65,
                0.6333333333333333,
                1.1633333333333333,
                2.55,
                0.016666666666666666,
                0.13,
                0.06666666666666667,
                0,
                0
            ],
            "label": "Entertainment"
        }
    ]
}