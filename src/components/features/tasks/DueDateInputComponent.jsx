import { filterPastTime } from "services/helpers/helper";
import ReactDatePicker from "react-datepicker";
import moment from "moment";

export default function DueDateInputComponent({
    type,
    dueDate,
    setDueDate,
    repeat,
    repeatDays,
    setRepeat,
    setRepeatDays,
    enableNotifications,
    setEnableNotifications,
    autoFocus = false,
    required = false,
    popupNumber = 1
}) {

    return (
        <div className="row small text-secondary text-start">
            <div className="col-lg-4 col-6 mb-3">
                <div>
                    <label htmlFor={"DueDate" + popupNumber}>{type === 'bad' ? 'Restrain until' : 'Due by'} <i className={type === 'bad' ? "bi bi-calendar-x" : "bi bi-calendar-check"} /></label>
                </div>
                <ReactDatePicker
                    className="form-control form-control-sm"
                    id={"DueDate" + popupNumber}
                    selected={dueDate}
                    dateFormat="yyyy MMM dd, HH:mm"
                    minDate={new Date()}
                    showTimeSelect
                    timeFormat="HH:mm"
                    filterTime={filterPastTime}
                    onFocus={e => e.target.blur()}      // fix for keyboard open on focus on mobile device
                    onSelect={(date) => setDueDate(moment(date).endOf('date').toDate())}
                    onChange={(date) => setDueDate(date)}
                    autoFocus={autoFocus}
                    required={required}
                />
            </div>

            <div className="col-lg-4 col-6 mb-3">
                <label htmlFor={"repeat" + popupNumber}>Repeat after (days) <i className="bi bi-arrow-repeat" /></label>
                <div className="input-group input-group-sm">
                    <div className="input-group-text px-1">
                        <input
                            type="checkbox"
                            name={"repeat" + popupNumber}
                            id={"repeat" + popupNumber}
                            className="form-check-input mt-0"
                            checked={repeat}
                            disabled={dueDate === null}
                            onChange={(e) => {
                                const val = e.target.checked;
                                setRepeat(val)
                                setRepeatDays(val ? 1 : 0);
                            }}
                        />
                        <label className="my-auto lh-1" htmlFor={"repeat" + popupNumber}>
                            <i className="ms-1 bi bi-arrow-repeat" />
                        </label>
                    </div>
                    <input
                        type="number"
                        name="repeatDays"
                        className="form-control"
                        value={repeatDays}
                        min={1}
                        placeholder="Days"
                        disabled={!repeat}
                        onChange={(e) => setRepeatDays(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="col-lg-4 mb-3">
                <label htmlFor={"enableNotifications" + popupNumber}>
                    Enable Notification for Due Time <i className="bi bi-bell"></i>
                </label>
                <div className="input-group input-group-sm ">

                    <div className="input-group-text px-1">
                        <input
                            type="checkbox"
                            name={"enableNotifications" + popupNumber}
                            className="form-check-input mt-0"
                            disabled={dueDate === null || type === 'bad'}
                            checked={enableNotifications}
                            onChange={(e) => setEnableNotifications(e.target.checked)}
                            id={"enableNotifications" + popupNumber}
                        />
                        <label className="" htmlFor={"enableNotifications" + popupNumber}>
                            <i className="ms-1 bi bi-bell" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}