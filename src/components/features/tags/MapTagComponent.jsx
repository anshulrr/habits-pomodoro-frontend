import { useEffect, useRef, useState } from "react"

import Pagination from "services/pagination/Pagination"
import { getTagsCountApi, mapTagsApi, retrieveAllTagsApi } from "services/api/TagApiService";
import { retrieveTaskApi } from "services/api/TaskApiService";

export default function MapTagComponent({
    task,
    setShowMapTags,
    setTasksReload
}) {

    const PAGESIZE = 1000;

    const [currentPage, setCurrentPage] = useState(1)

    const [tagsCount, setTagsCount] = useState(-1)
    const [tags, setTags] = useState([])

    const listElement = useRef(null);
    const [elementHeight, setElementHeight] = useState(0);

    const [checkedState, setCheckedState] = useState([]);

    useEffect(
        () => {
            getTagsCount()

            const observer = new ResizeObserver(handleResize);
            observer.observe(listElement.current);
            return () => {
                // Cleanup the observer by unobserving all elements
                observer.disconnect();
            };
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            // console.debug('re-render ListCommentsComponents')
            refreshTags()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleResize = () => {
        if (listElement.current !== null && listElement.current.offsetHeight !== 0) {
            // console.debug(currentPage, listElement.current.offsetHeight);
            setElementHeight(listElement.current.offsetHeight);
        }
    };

    const handleOnChange = (position) => {
        // console.debug('handle: ', checkedState)
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );
        // console.debug(updatedCheckedState)

        setCheckedState(updatedCheckedState);
    };

    function refreshTags() {
        setTags([]);
        retrieveAllTagsApi({ limit: PAGESIZE, offset: (currentPage - 1) * PAGESIZE })
            .then(response => {
                // console.debug(response)
                setTags(response.data)
                // setCheckedState(response.data.map(c => false));
                refreshTaskTags(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function refreshTaskTags(tags) {
        retrieveTaskApi({ id: task.id })
            .then(response => {
                // console.debug(response)
                // TODO: find better solution
                for (let i = 0; i < tags.length; i++) {
                    tags[i].selected = false;
                    for (let j = 0; j < response.data.tags.length; j++) {
                        if (response.data.tags[j].id === tags[i].id) {
                            tags[i].selected = true;
                        }
                    }
                }

                setCheckedState(tags.map(t => t.selected));
            })
            .catch(error => console.error(error.message))
    }

    function getTagsCount() {
        getTagsCountApi()
            .then(response => {
                setTagsCount(response.data)
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
        // console.log(selectedTags)

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

                <div className="close-popup m-1">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowMapTags(-1)}></i>
                </div>

                <div className="container my-5">

                    <div className="row mb-3">
                        <div className="col-lg-4 offset-lg-4">
                            <div className="border rounded p-3 mx-2">

                                <div className="d-flex justify-content-between">
                                    <h6>
                                        Tags
                                        {
                                            tagsCount !== -1 &&
                                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                                {tagsCount}
                                                <i className="ms-1 bi bi-tags-fill" />
                                            </span>
                                        }
                                    </h6>
                                </div>

                                {
                                    tagsCount === 0 &&
                                    <div className="alert alert-light text-center small mb-0">
                                        <i className="pe-1 bi bi-clipboard-data" />
                                        Nothing to display
                                    </div>
                                }

                                {
                                    tagsCount !== 0 && tags.length === 0 &&
                                    <div className="loader-container" style={{ height: elementHeight }}>
                                        <div className="loader"></div>
                                    </div>
                                }

                                <div id="comments-list" ref={listElement} className="text-start">
                                    {
                                        tags.map(
                                            (tag, index) => (
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
                                        )
                                    }
                                </div>

                                <Pagination
                                    className="pagination-bar ps-0"
                                    currentPage={currentPage}
                                    totalCount={tagsCount}
                                    pageSize={PAGESIZE}
                                    onPageChange={page => setCurrentPage(page)}
                                />

                                <div className="text-end mt-3">
                                    <button className="btn btn-sm btn-outline-secondary me-1" type="button" onClick={() => setShowMapTags(-1)}>
                                        Cancel
                                    </button>
                                    <button className="btn btn-sm btn-outline-success" type="button" onClick={() => mapTags()}>Map Tags</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >

            </div>
        </div>
    )
}