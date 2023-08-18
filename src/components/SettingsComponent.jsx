import ListProjectCategoriesComponent from './ListProjectsCategoriesComponent';
import ChangePasswordComponent from './ChangePasswordComponent';
import { useState } from 'react';
import UserSettingsComponent from './UserSettingsComponent';
import ListCommentsComponent from './ListCommentsComponents';

export default function SettingsComponent() {

    const [showChangePassword, setShowChangePassword] = useState(false)

    const [showComments, setShowComments] = useState(false);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 px-4">
                    <h6 className="text-start pb-2">
                        Change Password &nbsp;
                        <i className="bi bi-pencil-square" onClick={() => setShowChangePassword(!showChangePassword)}></i>
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

                <div className="col-md-12 px-4">
                    <h6 className="text-start pb-2">
                        All Comments &nbsp;
                        <i className="bi bi-pencil-square" onClick={() => setShowComments(!showComments)}></i>
                    </h6>
                    {
                        showComments !== false &&
                        <div id="popup" className="comments-overlay">
                            <div className="comments-popup">
                                <div className="text-end p-3">
                                    <i className="bi bi-x-lg" onClick={() => setShowComments(false)}></i>
                                </div>
                                <ListCommentsComponent
                                    filterBy={'user'}
                                />
                            </div>
                        </div>
                    }
                    <hr />
                </div>
            </div>

        </div >
    )
}