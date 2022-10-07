//TODO
function Post(props) {

    // const [postsView, setPostsView] = React.useState ({
    //     id: this.props.id,
    //     // liked: false etc.
    // })

    const posts_type = 'all_posts'
    const page_number = '1'

    //Setting items as an array to load posts once
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [items, setItems] = React.useState([]);


    React.useEffect(() => {
        fetch(`/posts/${posts_type}?page=${page_number}`)
        .then(response => response.json())
        .then( data => {
            let posts = data.posts
            console.log(posts)
            setItems(data)
            setIsLoaded(true)

        })
    }, [])

    console.log(items)
    console.log(items.posts)

    //Make sure data is fetched
    if (!isLoaded) {

        return <div>Loading...</div>;

    } else {

        console.log(items)
        console.log(items.posts)

        return (
            <div>
                {items.posts.map((post, i) =>
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

    return (
        // load an app component
        <div>
            <div><Post /></div>

        </div>
    );

}

//Render app component and show where to render it
ReactDOM.render(<App />, document.querySelector("#app"));