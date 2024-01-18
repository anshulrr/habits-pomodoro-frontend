export default function SearchCommentComponent({
    searchString,
    setSearchString,
    resetFiltersAndReload
}) {

    function handleSubmit(error) {
        error.preventDefault();
        resetFiltersAndReload('search');
    }

    return (
        <div className="">
            <form onSubmit={handleSubmit}>
                <div className="contianer">
                    <div className="row">

                        <div className="col-12">
                            <div className="input-group text-start">

                                <input
                                    type="text"
                                    name="search task"
                                    className="form-control form-control-sm"
                                    value={searchString}
                                    placeholder="Search All Notes"
                                    onChange={(e) => setSearchString(e.target.value)}
                                    required
                                />

                                <button className="btn btn-sm btn-outline-secondary" type="submit">
                                    <i className="align-middle bi bi-search" />
                                </button>

                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}