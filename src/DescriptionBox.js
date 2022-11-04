export default function DescriptionBox({ data, handleShowDialog }) {
    return (
        (<div className="description-box">
            <h6>{data.title}</h6>
            <p>We will take it!!</p>
            <button onClick={() => { console.log("calling..."); handleShowDialog(); } }>Close</button>
        </div>)
    );
}