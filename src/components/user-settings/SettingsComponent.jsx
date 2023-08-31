import { useState } from 'react';

import ListProjectCategoriesComponent from 'components/user-settings/ListProjectsCategoriesComponent';
import ChangePasswordComponent from 'components/user-settings/ChangePasswordComponent';
import UserSettingsComponent from 'components/user-settings/UserSettingsComponent';

export default function SettingsComponent() {

    const [showChangePassword, setShowChangePassword] = useState(false)

    return (
        <div className="container mt-3">
            <div className="row">

                <div className="col-md-12">
                    <h6 className="text-start pb-2">
                        Change Password &nbsp;
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowChangePassword(!showChangePassword)}>
                            <i className="bi bi-pencil-square" />
                        </button>
                    </h6>
                    {
                        showChangePassword &&
                        <ChangePasswordComponent
                            setShowChangePassword={setShowChangePassword}
                        />

                    }
                    <hr />
                </div>

                <div className="col-md-12">
                    <ListProjectCategoriesComponent />
                    <hr />
                </div>

                <div className="col-md-12">
                    <UserSettingsComponent />
                    <hr />
                </div>

            </div>
        </div >
    )
}