import { useState } from "react"

export default function CategoryChecklistComponent({ categories, setIncludeCategories }) {

    const [checkedState, setCheckedState] = useState(categories.map(c => c.statsDefault));

    const handleOnChange = (position) => {
        // console.debug('handle: ', checkedState)
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        // console.debug(updatedCheckedState)

        setCheckedState(updatedCheckedState);

        const updatedIncludedCategories = updatedCheckedState.reduce(
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
    };

    return (
        <div className="text-start">
            {categories.map(({ name }, index) => {
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
                        <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>{name}</label>
                    </div>
                );
            })}
        </div>
    )
}