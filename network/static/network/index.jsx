function Post(props) {

    console.log(props.state.posts)

    function testRun () {
        console.log(props.state.pageNumber)
        props.changePageNumber()
        console.log(props.state.pageNumber)
    }

    //Make sure data is fetched
    if (!props.state.isLoaded) {

        return <div>Loading...</div>;

    } else {

        console.log(props.state.posts)
        
        return (
            <div id="posts-section">
                <button onClick={testRun}>check!</button>
                <div><h2>{props.state.postsType == "all_posts" ? "All Posts" : `${props.state.postsType}`}</h2></div>
                {props.state.posts.map((post, i) =>
                    <div className="card" key={i}>
                        <div className="card-title m-2">
                            <strong>{post.user}</strong>
                            <div className="card-subtitle m-2 text-muted">
                                {post.body}
                                <br />
                                <small>{post.timestamp}</small>
                            </div>
                        </div>
                    </div>    
                )}
            </div>
        );
    }
}


function App() {

    //Adapting title based on the type of posts
    const [state, setState] = React.useState({
        postsType: 'all_posts',
        pageNumber: 1,
        isLoaded: false,
        posts: []
    })

    //Load the posts
    React.useEffect(() => {
        fetch(`/posts/${state.postsType}?page=${state.pageNumber}`)
        .then(response => response.json())
        .then(data => {

            let posts = data.posts
            console.log(posts)

            setState({
                ...state,
                isLoaded: true,
                posts: data.posts,
            })
        })
    }, [])

    function changePageNumber () {
        setState({
            ...state,
            pageNumber: 2,
        })
    }

    return (

        // load an app component
        <div>

            <div>
                <Post 
                state={state}
                changePageNumber={changePageNumber}
                />
            </div>

        </div>
    );

}

//Render app component and show where to render it
ReactDOM.render(<App />, document.querySelector("#app"));