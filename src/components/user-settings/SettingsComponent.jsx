import { useState } from 'react';

import ListProjectCategoriesComponent from 'components/user-settings/ListProjectsCategoriesComponent';
import ChangePasswordComponent from 'components/user-settings/ChangePasswordComponent';
import UserSettingsComponent from 'components/user-settings/UserSettingsComponent';

export default function SettingsComponent() {

    const [showChangePassword, setShowChangePassword] = useState(false)

    return (
        <div className="container">
            <div className="row">

                <div className="col-md-12 px-4">
                    <h6 className="text-start pb-2">
                        Change Password &nbsp;
                        <button type="button" className="btn btn-sm btn-outline-success py-0 px-1">
                            <i className="bi bi-pencil-square" onClick={() => setShowChangePassword(!showChangePassword)}></i>
                        </button>
                    </h6>
                    {
                        showChangePassword &&
                        <ChangePasswordComponent />

                    }
                    <hr />
                </div>

                <div className="col-md-12">
                    <ListProjectCategoriesComponent />
                    <hr />
                </div>

                <div className="col-md-12 px-4">
                    <UserSettingsComponent />
                    <hr />
                </div>

            </div>
        </div >
    )
}