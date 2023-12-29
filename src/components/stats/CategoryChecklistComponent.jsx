import { useState } from "react"

export default function CategoryChecklistComponent({
    categories,
    setIncludeCategories,
    setReload,
}) {

    const [checkedState, setCheckedState] = useState(categories.map(c => c.statsDefault));

    const [errorMessage, setErrorMessage] = useState("");

    const message = "Click on Fetch to view Stats of selected Categories";

    const handleOnChange = (position) => {
        // console.debug('handle: ', checkedState)
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        // console.debug(updatedCheckedState)

        setCheckedState(updatedCheckedState);
        setErrorMessage(message)
    };

    function fetchSelected() {
        const updatedIncludedCategories = checkedState.reduce(
            (arr, currentState, index) => {

                if (currentState === true) {
                    arr.push(categories[index].id);
                    return arr;
                }
                return arr;
            },
            []
        );
        // console.debug(updatedIncludedCategories)
        setIncludeCategories(updatedIncludedCategories)

        // to reload chart components
        setReload(prevReload => prevReload + 1)

        setErrorMessage('')
    }

    function selectAll() {
        setCheckedState(checkedState.map(() => true));
        setErrorMessage(message)
    }

    function selectNone() {
        setCheckedState(checkedState.map(() => false));
        setErrorMessage(message)
    }

    return (
        <div className="">
            <div className="list-group mt-2">
                {categories.map(({ name, color }, index) => {
                    return (
                        <li key={index} className="list-group-item py-1 px-2">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`custom-checkbox-${index}`}
                                    name={name}
                                    value={name}
                                    checked={checkedState[index]}
                                    onChange={() => handleOnChange(index)}
                                />
                                <label className="form-check-label small stretched-link" htmlFor={`custom-checkbox-${index}`}>
                                    <span style={{ color: color }}>
                                        <i className="me-1 bi bi-link-45deg" />
                                    </span>
                                    {name}
                                </label>
                            </div>
                        </li>
                    );
                })}
            </div>

            {errorMessage && <div className="alert alert-info mt-2 mb-0 py-0 px-2 text-center"><small>{errorMessage}</small></div>}

            <div className="d-flex mt-2 justify-content-between">
                <div>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectAll()}>Select All</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectNone()}>Remove All</button>
                </div>
                <div>
                    <button className="btn btn-sm btn-outline-success ms-2" type="button" onClick={fetchSelected}>Fetch</button>
                </div>
            </div>

        </div>
    )
}