import { useState } from "react"

export default function CategoryChecklistComponent({ categories, setIncludeCategories }) {

    const [checkedState, setCheckedState] = useState(categories.map(c => c.statsDefault));

    const [level, setLevel] = useState(0);

    const handleOnChange = (position) => {
        // console.debug('handle: ', checkedState)
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        // console.debug(updatedCheckedState)

        setCheckedState(updatedCheckedState);
    };

    function updateForFetch() {
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
    }

    function selectAll() {
        setCheckedState(checkedState.map(() => true));
    }

    function selectNone() {
        setCheckedState(checkedState.map(() => false));
    }

    function selectUpto() {
        setCheckedState(categories.map(c => c.level <= level));
    }

    function selectAbove() {
        setCheckedState(categories.map(c => c.level >= level));
    }

    return (
        <div className="mb-3">
            <div className="text-start">
                {categories.map(({ name, level }, index) => {
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
                                    <div className="col">
                                        <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>{name}</label>
                                    </div>
                                    <div className="col text-end">
                                        {level}
                                    </div>
                                </div>
                            </small>
                        </div>
                    );
                })}
            </div>

            <div className="input-group my-2">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectUpto()}>Upto</button>
                <input type="number" className="form-control form-control-sm" name="level" value={level} placeholder="Level" onChange={(e) => setLevel(e.target.value)} />
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectAbove()}>Above</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectAll()}>All</button>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => selectNone()}>None</button>
                <button className="btn btn-sm btn-outline-success" type="button" onClick={updateForFetch}>Fetch</button>
            </div>

        </div>
    )
}