import {useParams} from 'react-router-dom'
const ViewOnePost = () => {
    const {id} = useParams()
    console.log(id)
    //Make fetch to id of post clicked on. Pass through url?
    //Display main post, and render comments in div under main div
    return(
        <div className='container'>
            <div className='main'>
                {/* Render main post */}
            </div>
            <div className='comments'>
                {/* Render child posts */}
            </div>
        </div>
    )
}

export default ViewOnePost