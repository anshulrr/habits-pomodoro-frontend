import { useState } from 'react'
import { putItemToCache } from 'services/dbService';

export default function UpdateTagComponent({
    tag,
    setShowUpdateTag,
    refreshAllTags
}) {

    const [name, setName] = useState(tag.name)
    const [color, setColor] = useState(tag.color)
    const [priority, setPriority] = useState(tag.priority)

    function handleSubmit(error) {
        error.preventDefault();

        const updated_tag = {
            ...tag,
            name,
            priority,
            color
        }

        console.debug('update tag:', { updated_tag });
        putItemToCache('tags', updated_tag);

        // cleanup
        setShowUpdateTag(-1)
        refreshAllTags();
    }

    return (
        <div className="task-overlay">
            <div className="task-popup">
                <div className="close-popup m-2">
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
                                    placeholder="Tag Name"
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
                                    placeholder="Color"
                                />
                            </div>

                            <div className="col-lg-4 mb-3">
                                <label htmlFor="priority">Order <i className="bi bi-arrow-up" /></label>
                                <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    id="priority"
                                    value={priority}
                                    name="priority"
                                    min="1"
                                    onChange={(e) => setPriority(e.target.value)}
                                    placeholder="Order"
                                />
                                <small>(Lower numbered tags appears at the top of the list)</small>
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