import ListCommentsComponent from "./ListCommentsComponents";

export default function ListCommentsPopupComponent({
    filterBy,
    id,
    title,
    projectColor,
    project,
    setShowCommentsId,
}) {

    return (
        <div className="comments-overlay">
            <div className="comments-popup">
                <div className="close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                </div>

                <div className="mt-4">
                    <ListCommentsComponent
                        filterBy={filterBy}
                        id={id}
                        title={title}
                        projectColor={projectColor}
                        project={project}
                    />
                </div >

            </div>
        </div>
    )
}