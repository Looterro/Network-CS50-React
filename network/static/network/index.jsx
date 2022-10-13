function Post(props) {

    console.log(props.state.posts)

    function testRun () {
        console.log(props.state.pageNumber)
        props.changePageNumber()
        console.log(props.state.pageNumber)
    }

    //Make sure data is fetched
    if (!props.state.isLoaded) {

        return (
        
        <div>
            Loading...
            <button onClick={testRun}>check!</button>
        </div>
        
        
        );
        

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
                <Paginator postProps={props} upperPageLimit={props.state.upperPageLimit} />
            </div>
        );
    }
}

function Paginator(props) {

    function buttons () {

        console.log("check!")
        let listButtons = []
        for (let i=1; i <= props.upperPageLimit; i++) {
            listButtons.push("i")
        }
        console.log(listButtons)

        return (
            <span>
                {listButtons.map((button, i) =>
                    <li><button /*onClick={paginatorNumber}*/ className={props.postProps.pageNumber == i ? "page-link active" : "page-link" }>{i}</button></li>
                )}
            </span>
        )
    }

    function paginatorNext() {
        props.postProps.changePageNumber(props.postProps.state.pageNumber + 1)
    }

    function paginatorPrevious() {
        props.postProps.changePageNumber(props.postProps.state.pageNumber - 1)
    }

    // function paginatorNumber(number) {
    //     props.postProps.changePageNumber(number)
    // }

    //Check if there is only one page
    if (props.upperPageLimit !==1) {
        return (
            <div>
                <nav>
                    <ul className="pagination">
                        <li className="page-item"><button onClick={paginatorPrevious} className="page-link">&laquo; previous</button></li>
                        {buttons()}
                        <li className="page-item"><button onClick={paginatorNext} className="page-link">next &raquo;</button></li>
                    </ul>
                </nav>
            </div>
        )
    } else {

        return (
            ""
        )
    }

}

function App() {

    //Adapting title based on the type of posts
    const [state, setState] = React.useState({
        postsType: 'all_posts',
        pageNumber: 1,
        isLoaded: false,
        posts: [],
        upperPageLimit: 1
    })

    function loadPosts () {

        //Load the posts only if they are not loaded already to prevent the loop
        if (state.isLoaded !== true) {

            fetch(`/posts/${state.postsType}?page=${state.pageNumber}`)
            .then(response => response.json())
            .then(data => {

                let posts = data.posts
                console.log(posts)

                setState({
                    ...state,
                    isLoaded: true,
                    posts: data.posts,
                    upperPageLimit: data.upper_page_limit
                })
            })

        }

    }

    function changePageNumber (value) {
        setState({
            ...state,
            pageNumber: value,
            isLoaded: false,
        })
        console.log(state.pageNumber)
        loadPosts();

    }

    //load posts once when starting the app
    loadPosts();
    console.log(state.upperPageLimit)

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