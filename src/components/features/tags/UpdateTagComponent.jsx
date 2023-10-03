import { useState } from 'react'
import { updateTagApi } from 'services/api/TagApiService';

export default function UpdateTagComponent({
    tag,
    setShowUpdateTag,
    setTags,
    refreshAllTags
}) {

    const [name, setName] = useState(tag.name)
    const [color, setColor] = useState(tag.color)
    const [priority, setPriority] = useState(tag.priority)

    function handleSubmit(error) {
        error.preventDefault();

        const updated_tag = {
            name,
            priority,
            color
        }

        updateTagApi(tag.id, updated_tag)
            .then(response => {
                // console.debug(response)
                setShowUpdateTag(-1)
                setTags(tags => tags.map(tg => {
                    if (tg.id === tag.id) {
                        tg.name = response.data.name
                        tg.color = response.data.color
                        tg.priority = response.data.priority
                    }
                    return tg;
                }))
                refreshAllTags();
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="close-popup m-1">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowUpdateTag(-1)}></i>
                </div>
                <div className="container mt-3">
                    <form onSubmit={handleSubmit}>
                        <div className="row small text-secondary">

                            <div className="col-lg-4 mb-3">
                                <label htmlFor="tag">Tag Name</label>
                                <input
                                    type="text"
                                    name="tag"
                                    id="tag"
                                    className="form-control form-control-sm"
                                    value={name}
                                    placeholder="Name"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="col-lg-4 mb-3">
                                <label htmlFor="color">Color </label>
                                <input
                                    type="color"
                                    className="form-control form-control-sm"
                                    id="color"
                                    value={color}
                                    name="color"
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="color"
                                />
                            </div>

                            <div className="col-lg-4 mb-3">
                                <label htmlFor="priority">Priority <i className="bi bi-arrow-up" /></label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="priority"
                                    value={priority}
                                    name="priority"
                                    min="1"
                                    onChange={(e) => setPriority(e.target.value)}
                                    placeholder="priority"
                                />
                            </div>

                            <div className="col-lg-12 mb-3 text-end">
                                <button className="me-2 btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowUpdateTag(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-sm btn-outline-success" type="submit">
                                    Update Tag
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}