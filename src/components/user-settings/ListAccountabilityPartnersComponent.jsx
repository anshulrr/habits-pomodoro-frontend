import { useEffect, useState } from "react"

import { addAccountabilityPartnerssApi, removeAccountabilityPartnerssApi, retrieveAccountabilityPartnerssApi } from "services/api/AccountabilityPartnerApiService";

export default function ListAccountabilityPartnersComponent() {

    const [partners, setPartners] = useState([])
    const [email, setEmail] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')

    const [showAddPartner, setShowAddPartner] = useState(false)

    useEffect(
        () => {
            refreshPartners()
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function refreshPartners() {
        retrieveAccountabilityPartnerssApi()
            .then(response => {
                // console.debug(response)
                setPartners(response.data)
            })
            .catch(error => console.error(error.message))
    }

    function removeAccountabilityPartner(partner) {
        console.log(partner)
        removeAccountabilityPartnerssApi(partner)
            .then(response => {
                refreshPartners();
            })
            .catch(error => console.error(error.message))
    }

    function handleSubmit(error) {
        error.preventDefault();

        addAccountabilityPartnerssApi({ email })
            .then(response => {
                // console.debug(response)
                setShowAddPartner(false)
                refreshPartners()
                setErrorMessage('')
            })
            .catch(error => {
                console.error(error.message)
                if (error.response.status === 404) {
                    setErrorMessage("User not found");
                } else if (error.response.status === 409) {
                    setErrorMessage("Accountability Partner already added");
                }
            })
    }


    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div>
                        <div className="row px-0">
                            <div className="col-10 text-start px-0">
                                <h6>
                                    Accountability Partners
                                    <span className="ms-1 badge rounded-pill text-bg-secondary">
                                        {partners.length}
                                        <i className="ps-1 bi bi-person-fill" />
                                    </span>
                                </h6>
                            </div>
                            <div className="col-2 px-0 text-end">
                                <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1 mb-1" onClick={() => setShowAddPartner(!showAddPartner)}>
                                    <i className="bi bi-plus-circle" />
                                </button>
                            </div>
                        </div>

                        {
                            showAddPartner &&
                            <div className="row px-0">
                                <div className="col-12 px-0">
                                    <form onSubmit={handleSubmit}>
                                        <div className="input-group text-end">
                                            <input
                                                type="text"
                                                name="email"
                                                className="form-control form-control-sm"
                                                value={email}
                                                placeholder="email"
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setShowAddPartner(false)}>
                                                <i className="align-middle bi bi-x-lg" />
                                            </button>
                                            <button className="btn btn-sm btn-outline-success" type="submit">
                                                Add Accountability Partner
                                            </button>
                                        </div>
                                    </form>
                                    <div className="text-danger text-start"><small>{errorMessage}</small></div>

                                </div>
                            </div>
                        }
                        {
                            partners.map(
                                partner => (
                                    <div key={partner.id} className="row border-bottom my-1">
                                        {/* todo: decide better solution for maxWidth */}
                                        <div className="col-8 ps-1 text-start">
                                            <small>
                                                {partner.email}&nbsp;
                                            </small>
                                        </div>
                                        <div className="col-4 pe-0 text-end">
                                            <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => removeAccountabilityPartner(partner)}>
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )
                            )
                        }
                    </div>
                </div>
            </div>

        </div >
    )
}