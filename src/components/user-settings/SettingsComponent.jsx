import { useEffect, useState } from 'react';

import ListProjectCategoriesComponent from 'components/user-settings/ListProjectsCategoriesComponent';
import ChangePasswordComponent from 'components/user-settings/ChangePasswordComponent';
import UserSettingsComponent from 'components/user-settings/UserSettingsComponent';

import { useAuth } from 'services/auth/AuthContext';
import ListAccountabilityPartnersComponent from './ListAccountabilityPartnersComponent';

export default function SettingsComponent() {

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
            <div className="row py-3" style={{ display: window.innerWidth <= 992 ? "block" : "none" }}>
                <div className="col-12">
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (showAll ? "active" : "")} onClick={() => setShowAll(true)}>
                        Show All
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "categories" && !showAll ? "active" : "")} onClick={() => { setSubPage("categories"); setShowAll(false) }}>
                        Project Categories
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "partners" && !showAll ? "active" : "")} onClick={() => { setSubPage("partners"); setShowAll(false) }}>
                        Accountability Partners
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "settings" && !showAll ? "active" : "")} onClick={() => { setSubPage("settings"); setShowAll(false) }}>
                        User Settings
                    </button>
                </div>
            </div>
            <div className="row">

                <div className="col-lg-4">
                    <div className="px-2 py-2" style={{ display: subPage === "categories" || showAll ? "block" : "none" }}>
                        <ListProjectCategoriesComponent />
                    </div>
                </div>

                <div className="col-lg-4" style={{ backgroundColor: "#f2f3f4" }}>
                    <div className="px-2 py-2" style={{ display: subPage === "partners" || showAll ? "block" : "none" }}>
                        <ListAccountabilityPartnersComponent />
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="px-2 py-2" style={{ display: subPage === "settings" || showAll ? "block" : "none" }}>
                        <UserSettingsComponent />
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
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => logout()}>
                            Logout
                        </button>
                    </div>
                </div>

            </div>
        </div >
    )
}