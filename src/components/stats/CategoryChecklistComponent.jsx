import { useState } from "react"

export default function CategoryChecklistComponent({
    categories,
    setIncludeCategories,
    setReload,
}) {

    const [checkedState, setCheckedState] = useState(categories.map(c => c.statsDefault));

    const [level, setLevel] = useState(1);

    const [errorMessage, setErrorMessage] = useState("");

    const message = "Click on Fetch to update";

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

    function selectUpto() {
        setCheckedState(categories.map(c => c.level <= level));
        setErrorMessage(message)
    }

    function selectAbove() {
        setCheckedState(categories.map(c => c.level >= level));
        setErrorMessage(message)
    }

    return (
        <div className="mb-3">
            <div className="text-start">
                {categories.map(({ name, level, color }, index) => {
                    return (
                        <div key={index} className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={`custom-checkbox-${index}`}
                                name={name}
                                value={name}
                                checked={checkedState[index]}
                                onChange={() => handleOnChange(index)}
                            />
                            <small>
                                <div className="row">
                                    <div className="col-10">
                                        <span style={{ color: color }}>
                                            <i className="me-1 bi bi-link-45deg" />
                                        </span>
                                        <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>{name}</label>
                                    </div>
                                    <div className="col-2 text-end text-secondary">
                                        {level}
                                    </div>
                                </div>
                            </small>
                        </div>
                    );
                })}
            </div>

            <div className="text-danger"><small>{errorMessage}</small></div>

            <div className="input-group my-2 justify-content-end">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectUpto()}>Upto</button>
                <input type="number" className="form-control form-control-sm" name="level" value={level} placeholder="Order" onChange={(e) => setLevel(e.target.value)} />
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectAbove()}>Above</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectAll()}>All</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectNone()}>None</button>
                <button className="btn btn-sm btn-outline-success" type="button" onClick={fetchSelected}>Fetch</button>
            </div>

        </div>
    )
}