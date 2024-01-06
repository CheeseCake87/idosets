export default function Loading() {
    return (
        <div className={"loading"}>
            <svg width="24" height="24" stroke="#000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g className={"spinner"}>
                    <circle cx="12" cy="12" r="9.5" fill="none" stroke-width="3"></circle>
                </g>
            </svg>
            <p>Loading, please wait...</p>
        </div>
    )
}
