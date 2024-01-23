import { useEffect, useState } from 'react';

import ListProjectCategoriesComponent from 'components/user-settings/ListProjectsCategoriesComponent';
import ChangePasswordComponent from 'components/user-settings/ChangePasswordComponent';
import UserSettingsComponent from 'components/user-settings/UserSettingsComponent';

import { useAuth } from 'services/auth/AuthContext';
import ListAccountabilityPartnersComponent from './ListAccountabilityPartnersComponent';
import FooterComponent from 'components/FooterComponent';

export default function ProfileComponent() {

    const [showChangePassword, setShowChangePassword] = useState(false)

    const [subPage, setSubPage] = useState('')

    const [showAll, setShowAll] = useState(true)

    const authContext = useAuth()

    function logout() {
        if (!window.confirm("Are you sure? Press OK to Logout.")) {
            return;
        }
        authContext.logout()
    }

    useEffect(
        () => {
            document.title = 'Settings';
        }, []
    )

    return (
        <div className="container">
            <div className="row">

                <div className="col-lg-4">
                    <div className="px-2 py-2">
                    </div>
                </div>

                <div className="col-lg-4" style={{ backgroundColor: "#f2f3f4" }}>
                    <div className="px-2 py-2">
                        <hr />
                        <h6 className="text-start pb-2">
                            Change Password &nbsp;
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-secondary py-0 px-1"
                                onClick={() => setShowChangePassword(!showChangePassword)}
                                style={{ float: "right" }}
                            >
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
                </div>

                <div className="col-lg-4">
                    <div className="px-2 py-2">
                        <hr />
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0" onClick={() => logout()}>
                            Logout
                        </button>
                        <hr />
                    </div>
                </div>

            </div>

            <FooterComponent />
        </div >
    )
}