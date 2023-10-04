import { useState } from 'react'
import { createTagApi } from 'services/api/TagApiService';

export default function CreateTagComponent({
    setShowCreateTag,
    setTags,
    setTagsCount,
    refreshAllTags
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

        createTagApi(tag)
            .then(response => {
                // console.debug(response)
                setTags(prevTag => [response.data, ...prevTag])
                setShowCreateTag(false)
                setTagsCount(prev => prev + 1)
                refreshAllTags()
            })
            .catch(error => console.error(error.message))
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
                                    placeholder="Name"
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