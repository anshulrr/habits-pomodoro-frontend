import { useState } from "react"

import ListPomodorosComponent from "components/stats/ListPomodorosComponent";

import CategoryChecklistComponent from "components/stats/CategoryChecklistComponent";

export default function DailyStatsComponent({ pomodoroStatus, pomdorosListReload }) {

    const [includeCategories, setIncludeCategories] = useState([])

    const [showIncludeCategories, setShowIncludeCategories] = useState(false)

    const [reload, setReload] = useState(0)

    return (
        <div className="text-secondary">

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

            <div className="col-md-12">
                <div className="mb-0 small text-center">
                    Included Categories
                    <span className="small ms-1 align-middle">
                        ({includeCategories.length}<i className="bi bi-link-45deg" />)
                    </span>
                    <span className="small ms-1 align-middle">
                        <i className="bi bi-pencil-square" onClick={() => setShowIncludeCategories(!showIncludeCategories)} />
                    </span>
                </div>

                <div className="update-popup-2-container">
                    <div className="update-popup-2" style={{ display: showIncludeCategories ? "block" : "none" }} >
                        <span className="ms-1 align-middle">
                            <i className="bi bi-x-lg" onClick={() => setShowIncludeCategories(!showIncludeCategories)} />
                        </span>
                        <CategoryChecklistComponent
                            setIncludeCategories={setIncludeCategories}
                            reload={reload}
                            setReload={setReload}
                            setShowIncludeCategories={setShowIncludeCategories}
                        />
                    </div>
                </div>
            </div>

        </div >
    )
}