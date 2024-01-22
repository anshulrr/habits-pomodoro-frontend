export default function FooterComponent({
    setShowLeftMenu,
    setReload,
    title,
    isEmpty = true
}) {

    return (
        <footer className="">
            <nav className="fixed-bottom footer-shadow bg-light border-top border-1">
                <div className="container">
                    {
                        isEmpty &&
                        <div className="footer-empty">
                            &zwnj;
                        </div>
                    }
                    {
                        !isEmpty &&
                        <div className="d-flex justify-content-between header-menu">

                            <div className="my-2 mx-2">
                                <div className="left-menu-icon" onClick={() => setShowLeftMenu(true)}>
                                    <i className="bi bi-list" />
                                    <div className="button-title">
                                        {title}
                                    </div>
                                </div>
                            </div>

                            <div className="my-2 mx-2">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setReload(prev => prev + 1)}>
                                    <i className="bi bi-arrow-clockwise" />
                                </button>
                            </div>

                        </div>
                    }


                </div>
            </nav>
        </footer>
    )
}