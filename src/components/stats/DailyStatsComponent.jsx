import { useState } from "react"

import ListPomodorosComponent from "components/stats/ListPomodorosComponent";

import CategoryChecklistComponent from "components/stats/CategoryChecklistComponent";

export default function DailyStatsComponent({ pomodoroStatus, pomdorosListReload }) {

    const [includeCategories, setIncludeCategories] = useState([])

    const [showIncludeCategories, setShowIncludeCategories] = useState(false)

    const [reload, setReload] = useState(0)

    return (
        <div className="text-secondary">

            {
                includeCategories.length !== 0 &&
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-12 mt-2">
                            <ListPomodorosComponent
                                key={[reload, pomodoroStatus, pomdorosListReload]}
                                includeCategories={includeCategories}
                                showButtons={false}
                            />
                        </div >
                    </div>
                </div>
            }

            <div className="col-md-12">
                <div className="d-flex justify-content-between mb-2">
                    <h6 className="mb-0">
                        Included Project Categories
                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                            {includeCategories.length}
                            <i className="ms-1 bi bi-link-45deg" />
                        </span>
                    </h6>
                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowIncludeCategories(!showIncludeCategories)}>
                        <i className="bi bi-pencil-square" />
                    </button>
                </div>
                <div style={{ display: showIncludeCategories ? "block" : "none" }} >
                    <CategoryChecklistComponent
                        setIncludeCategories={setIncludeCategories}
                        reload={reload}
                        setReload={setReload}
                        setShowIncludeCategories={setShowIncludeCategories}
                    />
                </div>
            </div>

        </div >
    )
}