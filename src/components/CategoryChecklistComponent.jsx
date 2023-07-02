import { useState } from "react"

export default function CategoryChecklistComponent({ categories, setIncludeCategories }) {

    const [checkedState, setCheckedState] = useState(
        new Array(categories.length).fill(true)
    );

    const handleOnChange = (position) => {
        // console.log('handle: ', checkedState)
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        // console.log(updatedCheckedState)

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
        // console.log(updatedIncludedCategories)

        setIncludeCategories(updatedIncludedCategories)
    };

    return (
        <div>
            <ul className="categories-list">
                {categories.map(({ name }, index) => {
                    return (
                        <li key={index}>
                            <div className="categories-list-item">
                                <input
                                    type="checkbox"
                                    id={`custom-checkbox-${index}`}
                                    name={name}
                                    value={name}
                                    checked={checkedState[index]}
                                    onChange={() => handleOnChange(index)}
                                />
                                <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}