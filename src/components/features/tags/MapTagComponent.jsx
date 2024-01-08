import { useEffect, useState } from "react"

import { mapTagsApi } from "services/api/TagApiService";
import { retrieveTaskApi } from "services/api/TaskApiService";

export default function MapTagComponent({
    task,
    tagsMap,
    setShowMapTags,
    setTasksReload
}) {

    const [tagsCount, setTagsCount] = useState(-1)
    const [tags, setTags] = useState([])

    const [checkedState, setCheckedState] = useState([]);

    const [mappedTagsCount, setMappedTagsCount] = useState(-1);

    useEffect(
        () => {
            refreshTags();
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleOnChange = (position) => {
        // console.debug('handle: ', checkedState)
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        // console.debug(updatedCheckedState)

        setCheckedState(updatedCheckedState);
    };

    function refreshTags() {
        const tagsArray = [...tagsMap.values()];
        tagsArray.map(tag => tag.selected = false);
        setTagsCount(tagsArray.length);
        // initialize checkedState for controlled input
        setCheckedState(tagsArray.map(t => t.selected));
        setTags(tagsArray);
        refreshTaskTags(tagsArray);
    }

    function refreshTaskTags(tags) {
        retrieveTaskApi({ id: task.id })
            .then(response => {
                // using Map for easy access and update
                let count = 0;
                for (let j = 0; j < response.data.tags.length; j++) {
                    tagsMap.get(response.data.tags[j].id).selected = true;
                    count++;
                }
                tags = [...tagsMap.values()];

                setCheckedState(tags.map(tag => tag.selected));
                setMappedTagsCount(count);
            })
            .catch(error => console.error(error.message))
    }

    function mapTags() {

        const selectedTags = checkedState.reduce(
            (arr, currentState, index) => {
                if (currentState === true) {
                    arr.push(tags[index].id);
                    return arr;
                }
                return arr;
            },
            []
        );
        // console.debug(selectedTags)

        mapTagsApi(task.id, { tagIds: selectedTags })
            .then(response => {
                setShowMapTags(-1)
                setTasksReload(prev => prev + 1);
            })
            .catch(error => console.error(error.message))

    }

    return (
        <div className="tags-overlay">
            <div className="tags-popup">

                <div className="close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowMapTags(-1)}></i>
                </div>

                <div className="container my-3">

                    <div className="row mb-3">
                        <h6 className="ms-2 text-center">
                            <i className="me-1 bi bi-list-ul" />
                            {task.description}
                        </h6>
                        <div className="col-lg-4 offset-lg-4">
                            <div className="border rounded p-3 mx-2">

                                <div className="small text-secondary text-start mb-2">
                                    <div>
                                        Map Tags
                                        {
                                            tagsCount !== -1 &&
                                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                                {mappedTagsCount !== -1 &&
                                                    <span>
                                                        {mappedTagsCount}/
                                                    </span>
                                                }
                                                {tagsCount}
                                                <i className="ms-1 bi bi-tags-fill" />
                                            </span>
                                        }
                                    </div>
                                </div>

                                {
                                    tagsCount === 0 &&
                                    <div className="alert alert-light text-center small mb-0">
                                        <i className="pe-1 bi bi-clipboard-data" />
                                        Nothing to display
                                    </div>
                                }

                                <div id="tags-list" className="text-start">
                                    {
                                        tags.map(
                                            (tag, index) => {
                                                // const tag = tags.get(tag_index)
                                                // console.debug(tag, checkedState[index])
                                                return (
                                                    <div key={index} className="form-check">
                                                        <label className="form-check-label" htmlFor={`custom-checkbox-${index}`}>
                                                            <i className="bi bi-tag-fill me-1" style={{ color: tag.color }} />
                                                            {tag.name}
                                                        </label>
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            id={`custom-checkbox-${index}`}
                                                            name={tag.name}
                                                            value={tag.name}
                                                            checked={checkedState[index]}
                                                            onChange={() => handleOnChange(index)}
                                                        />
                                                    </div>
                                                )
                                            }
                                        )
                                    }
                                </div>

                                <div className="text-end mt-3">
                                    <button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => setShowMapTags(-1)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-sm btn-outline-success" type="button" onClick={() => mapTags()}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >

            </div>
        </div>
    )
}