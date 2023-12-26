import { useState } from 'react'

export default function SelectFriendsComponent({
    subjects,
    setSubject,
    retrieveProjectCategories,
    setShowFriendsStats
}) {

    const [subjectId, setSubjectId] = useState('0')
    const [errorMessage, setErrorMessage] = useState('')

    function handleOnChange(fun, val) {
        fun(val)
        setErrorMessage("Click on Fetch to view Categories and Stats of selected Mentee")
    }

    function updateStats() {
        // to reload chart components
        document.title = "Friend's Stats";
        const sub = subjects.find((x) => x.id === parseInt(subjectId));
        setSubject(sub);
        retrieveProjectCategories(sub);

        if (parseInt(subjectId) === -1) {
            setShowFriendsStats(false);
            document.title = "Stats";
        }

        setErrorMessage('')
    }

    return (
        <div className="row mb-3">
            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <select
                        className="form-select form-select-sm"
                        name="subject-id"
                        onChange={(e) => handleOnChange(setSubjectId, e.target.value)}
                        value={subjectId}
                        id="subjectId"
                    >
                        <option value="0" disabled>Select a Mentee</option>
                        {
                            subjects.map(
                                subject => (
                                    <option key={subject.id} value={subject.id}>{subject.email}</option>
                                )
                            )
                        }
                        <option value="-1">Unselect</option>
                    </select>
                </div>
            </div>



            <div className="col-lg-12">
                {errorMessage && <div className="alert alert-info mb-0 py-0 px-2 text-center"><small>{errorMessage}</small></div>}
                <div className="mt-2 text-end">
                    <button className="btn btn-sm btn-outline-success" type="button" onClick={updateStats}>Fetch</button>
                </div>
            </div>
        </div>
    )
}