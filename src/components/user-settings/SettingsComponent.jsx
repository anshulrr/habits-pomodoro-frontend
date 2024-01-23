import { useEffect, useState } from 'react';

import ListProjectCategoriesComponent from 'components/user-settings/ListProjectsCategoriesComponent';
import UserSettingsComponent from 'components/user-settings/UserSettingsComponent';

import ListAccountabilityPartnersComponent from './ListAccountabilityPartnersComponent';
import FooterComponent from 'components/FooterComponent';

export default function SettingsComponent() {

    const [subPage, setSubPage] = useState('')

    const [showAll, setShowAll] = useState(true)

    useEffect(
        () => {
            document.title = 'Settings';
        }, []
    )

    return (
        <div className="container">
            <div className="row sub-menu" style={{ display: window.innerWidth <= 992 ? "block" : "none" }}>
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
                    </div>
                </div>

            </div>

            <FooterComponent />
        </div >
    )
}