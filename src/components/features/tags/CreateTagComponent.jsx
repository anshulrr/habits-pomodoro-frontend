import { useState } from 'react'
import { addItemToCache } from 'services/db/dbService';

export default function CreateTagComponent({
    setShowCreateTag,
}) {

    const [name, setName] = useState('')
    const [color] = useState('#abcdef')
    const [priority] = useState(1)

    function handleSubmit(error) {
        error.preventDefault();

        const tag = {
            name,
            priority,
            color
        }
        // console.debug('create tag:', { tag });
        addItemToCache('tags', tag);

        setShowCreateTag(false)
    }

    return (
        <div className="createTag mb-1">
            <form onSubmit={handleSubmit}>
                <div className="contianer">
                    <div className="row">

                        <div className="col-12">
                            <div className="input-group text-start">

                                <input
                                    type="text"
                                    name="tag"
                                    className="form-control form-control-sm"
                                    value={name}
                                    placeholder="Tag Name"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    autoFocus
                                />


                                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowCreateTag(false)}>
                                    <i className="align-middle bi bi-x-lg" />
                                </button>
                                <button className="btn btn-sm btn-outline-success" type="submit">
                                    <i className="align-middle bi bi-plus-circle" />
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}