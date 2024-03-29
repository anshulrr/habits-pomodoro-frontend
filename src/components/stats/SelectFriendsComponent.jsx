import { useState } from 'react'

export default function SelectFriendsComponent({
    subjects,
    setSubject,
    retrieveProjectCategories,
}) {

    const [subjectId, setSubjectId] = useState('0')

    function handleOnChange(fun, val) {
        fun(val)
        updateStats(val)
    }

    function updateStats(subjectId) {
        // to reload chart components
        document.title = "Friend's Stats";
        const sub = subjects.find((x) => x.id === parseInt(subjectId));
        setSubject(sub);
        retrieveProjectCategories(sub);

        if (parseInt(subjectId) === -1) {
            document.title = "Stats";
        }
    }

    return (
        <div className="row">
            <div className="col-lg-12 mt-2">
                <div className="input-group input-group-sm">
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

        </div>
    )
}