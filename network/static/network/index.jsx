function Title(props) {

    return (
        <div className="title">
            <h2>{props.state.postsType == "all_posts" ? "All Posts" : `${props.state.postsType}`}</h2>
        </div>
    )
}

function UserProfile(props) {
    
    const [state, setState] = React.useState({
        followedCount: 0,
        followingCount: 0,
        followed: false,
    })

    function followUser() {
        console.log(state)

        fetch('follow', {
            method: 'PUT',
            body: JSON.stringify({
                username: props.state.postsType
            }),
        })
        .then(response => response.json())
        .then(data => {

            const followedstate = data['followed']
            const followedUpdatedCount = data['followers']

            setState({
                ...state,
                followed: followedstate,
                followedCount: followedUpdatedCount,
            })
        })
    }

    // Only run this component if browsing a user profile
    if (props.state.postsType != 'all_posts' && props.state.postsType != 'following') {
        

        //Only run the function if the user posts in App component are loaded. When posts update, so does the followed/following count
        if (props.state.isLoaded === false) {

            fetch('/load_users/' + props.state.postsType)
            .then(response => response.json())
            .then(user => {

                console.log(user)
                console.log(user.followers)

                setState({
                    ...state,
                    followedCount: user.followers.length,
                    followingCount: user.following.length,
                })

                //Fetch information whether a given user is followed by request user or not

                fetch('/follow_status', {
                    method: 'PUT',
                    body: JSON.stringify({
                        username: props.state.postsType
                    })
                })
                .then(response => response.json())
                .then(data => {

                    let followed = data['followed']
                    console.log(followed)
                    setState({
                        ...state,
                        followed: followed,
                    })
                })

            })

            

        }

        console.log(props.state.postsType != 'all_posts' && props.state.postsType != 'following');
        console.log(props.username.innerHTML)
        console.log(state.followed)

        return (
            <div className="userview">
                <div> Followers: {state.followedCount} | Following: {state.followingCount} </div>
                {props.username.innerHTML == props.state.postsType ? "" : <button onClick={followUser} className="btn btn-sm btn-secondary"> {state.followed ? "Unfollow" : "Follow"} </button>}
            </div>
        )
    }

    return (
        ""
    )

}

function Post(props) {

    const [state, setState] = React.useState({
        editing: false,
    })

    console.log(props.state.posts)

    function postUserview (event) {
        console.log(event.target.innerHTML)
        props.postUserview(event.target.innerHTML)
    }

    if (!props.state.isLoaded) {

        return (
        
        <div>
        </div>
        
        );
        

    } else {

        console.log(props.state.posts)
        console.log(props.state.posts.length)
        console.log(props.username)
        
        return (
            <div id="posts-section">
                {props.state.postsType == 'all_posts' && props.state.pageNumber == 1 ? <PostForm postProps={props} /> : ""}
                {props.state.posts.map((post, i) =>
                    <div className={i == 0 && props.state.animate == true ? "card animate" : "card"} key={i}>
                        <div className="card-title m-2">
                            <button className="btn btn-link" onClick={postUserview}>{post.user}</button>
                            <div className="card-subtitle m-2 text-muted">
                                {post.body}
                                <br />
                                <small>{post.timestamp}</small>
                                {post.user == props.username.innerHTML ? <button className="btn sm btn-link edit">Edit</button> : ""}
                                <br />
                                <button className="btn like">&#9825;</button>
                                <button className="btn btn-link commentBtn">Comments</button>
                            </div>
                        </div>
                    </div>    
                )}
                <Paginator postProps={props} />
            </div>
        );
    }
}

function PostForm(props) {

    const [state, setState] = React.useState({
        text: "",
    })

    //Update the text
    function updateText(event) {
        setState({
            text: event.target.value
        })
    }

    function submitPost (event) {

        //Prevent reloading the page
        event.preventDefault()
        fetch('/posting_compose', {
            method: 'POST',
            body: JSON.stringify({
                body: state.text,
            }),
        })
        .then(response => {

            //Reload the posts
            props.postProps.setState({
                ...props.postProps.state,
                isLoaded: false,
                //animate addition of the new post
                animate: true,
            })

            props.postProps.loadPosts()
        })

    }

    return (
        <div id="post-form">
            <h5 className="m-2">New Post</h5>
            <form id="compose-form">
                <textarea id="post-body" className="form-control m-1" placeholder="Write your post here" onChange={updateText}></textarea>
                <input type="submit" onClick={submitPost} className="btn btn-primary m-1" value="Post" />
            </form>
        </div>
    )
}

function Paginator(props) {

    //Create an array that keeps track of how many pages there are in a certain view
    let listButtons = []
    buttons()

    function buttons () {

        for (let i=1; i <= props.postProps.state.upperPageLimit; i++) {
            listButtons.push({i})
        }
        console.log(listButtons)
        console.log(props.postProps.state.pageNumber)

    }

    //Based on the length of the array add the same amount of buttons
    let buttonsTemplate = listButtons.map((button, i) =>
        <li className={props.postProps.state.pageNumber == i+1 ? "page-item active" : "page-item"}><button data-position={i+1} className="page-link" onClick={paginatorNumber}>{i+1}</button></li>
    )

    //Navigate between pages
    function paginatorNext() {
        props.postProps.changePageNumber(props.postProps.state.pageNumber + 1)
    }

    function paginatorPrevious() {
        props.postProps.changePageNumber(props.postProps.state.pageNumber - 1)
    }

    function paginatorNumber(event) {
        console.log('click!')
        //use dataset as the value for a pageNumber
        console.log(event.target.dataset.position)
        props.postProps.changePageNumber(event.target.dataset.position)
    }

    //Check if there is only one page
    if (props.postProps.state.upperPageLimit !==1) {
        return (
            <div>
                <nav>
                    <ul className="pagination">
                        {props.postProps.state.pageNumber > 1 ? <li className="page-item"><button onClick={paginatorPrevious} className="page-link">&laquo; previous</button></li>  : "" }
                        {buttonsTemplate}
                        {props.postProps.state.pageNumber < props.postProps.state.upperPageLimit ? <li className="page-item"><button onClick={paginatorNext} className="page-link">next &raquo;</button></li> : "" }
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
        upperPageLimit: 1,
        animate: false,
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

    // Change the view to following or a userview by clicking links in the navbar
    const following = document.getElementById('following_nav');
    following.onclick = () => {
        console.log("click")
        setState({
            ...state,
            postsType: "following",
            isLoaded: false,
        })
        loadPosts();
    }

    //get the username of the client
    const userview = document.getElementById('username');

    userview.onclick = () => {
        console.log("click")
        setState({
            ...state,
            postsType: `${userview.innerHTML}`,
            isLoaded: false,
        })
        loadPosts();
    }

    function postUserview (username) {
        setState({
            ...state,
            postsType: `${username}`,
            isLoaded: false,
        })
        loadPosts();
    }

    //load posts once when starting the app
    loadPosts();
    console.log(state.upperPageLimit)

    return (

        // load an app component
        <div>

            <div>
                <Title 
                    state={state}
                />
                <UserProfile
                    state={state}
                    username={userview} 
                />
                <Post 
                    state={state}
                    setState={setState}
                    username={userview}
                    changePageNumber={changePageNumber}
                    postUserview={postUserview}
                    loadPosts={loadPosts}
                />
            </div>

        </div>
    );

}

//Render app component and show where to render it
ReactDOM.render(<App />, document.querySelector("#app"));