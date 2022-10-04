document.addEventListener('DOMContentLoaded', function() {

    //document.querySelector('#all-posts-nav').addEventListener('click', () => load_posts());
    document.querySelector('#following_nav').addEventListener('click', () => load_posts('following'));
    document.querySelector('#username').addEventListener('click', () => load_user(document.querySelector('#username').innerHTML));

    const csrf_token = getCookie('csrftoken');
    document.querySelector('#compose-form').onsubmit = function() {
        fetch('/posting_compose', {
            method: 'POST',
            body: JSON.stringify({
                body: document.querySelector('#post-body').value,
            }),
            credentials: 'same-origin',
            headers: {
                "X-CSRFToken": csrf_token
            }
        })
        .then(response => load_posts())

    }

    load_posts('all_posts')
});

//Getting csrf cookie to safely submit the data through PUT and POST fetch
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        let cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function load_user (user) {

    console.log(user);

    //Hide previous posts from other section
    document.querySelector('#posts-section').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';
    document.querySelector('#userview').innerHTML = '';

    //Create new title of the page with given username
    document.querySelector('#title').innerHTML = `${user}`;

    let user_information = document.createElement('div');
    user_information.className = "userinformation";
    user_information.id = `${user}-profile`;
    document.querySelector('#userview').append(user_information);

    fetch('/load_users/' + user)
    .then(response => response.json())
    .then(data => {
        let users = data.user;
        console.log(users);
        console.log(users.username);
        users.forEach(profile => {
            //Create button to toggle following status
            let follow_toggle = document.createElement('button');
            follow_toggle.id = `follow-toggle-${user}`;
            follow_toggle.className = "follow btn btn-info";
            follow_toggle.innerHTML = "Follow";
            document.querySelector(`#${user}-profile`).append(follow_toggle);

            //Keep track of how many given user follows other users and the amount of folllowers
            let followedCounter = profile.followers.length;
            let followingCounter = profile.following.length;

            let followCounter_div = document.createElement('div');
            followCounter_div.id = `${user}-counter`;
            followCounter_div.innerHTML = `Followers: ${followedCounter} | Following: ${followingCounter}`;


            console.log(profile.username);
            console.log(profile);
            console.log(profile.followers);
            console.log(profile.followers.length);
            console.log(profile.following);
            console.log(document.querySelector('#username').innerHTML);

            document.querySelector(`#${user}-profile`).append(followCounter_div);
        
            //Check if user is on their own profile page and hide follow button
            if (profile.username === document.querySelector('#username').innerHTML) {
                follow_toggle.style.display = 'none';    
            } 
        
            document.querySelector('#userview').append(user_information);

            const csrf_token = getCookie('csrftoken');
            fetch('/follow_status', {
                method: 'PUT',
                body: JSON.stringify({
                    username: user
                }),
                credentials: 'same-origin',
                headers: {
                    "X-CSRFToken": csrf_token
                }
            })
            .then(response => response.json())
            .then(data => {
                let followed = data['followed']
        
                if (followed === true){
                    follow_toggle.className = "btn btn-secondary";
                    follow_toggle.innerHTML = "Unfollow";
                }
        
                document.querySelector(`#follow-toggle-${user}`).onclick = () => {
                    console.log(data);
                    console.log(followed);
                    console.log(user);
                    follow(user);
                }
            })

            function follow(user) {
                
                const csrf_token = getCookie('csrftoken');
                fetch('follow', {
                    method: 'PUT',
                    body: JSON.stringify({
                        username: user
                    }),
                    credentials: 'same-origin',
                    headers: {
                        "X-CSRFToken": csrf_token
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    let followed = data['followed'];
                    console.log(followed);
                    let followers = data['followers'];
                    console.log(followers);
        
                    if (followed === false ) {
                        follow_toggle.className = "btn btn-info";
                        follow_toggle.innerHTML = "Follow"; 
                    } else {
                        follow_toggle.className = "btn btn-secondary";
                        follow_toggle.innerHTML = "Unfollow";
                    }
        
                    followCounter_div.innerHTML = `Followers: ${followers} | Following: ${followingCounter}`;
                })
            }
        
        })
    })

    //Load posts with given username
    load_posts(user)
}


function load_posts(posts_type, page_number) {

    // When loading the page, display the first page of posts
    if (page_number===undefined) {page_number = 1};

    // Display the title of the page
    if (posts_type == "all_posts") {
        document.querySelector('#title').innerHTML = "All Posts";
    } else {
        document.querySelector('#title').innerHTML = `${posts_type}`;
    }
    
    // Hide previous sections
    document.querySelector('#posts-section').innerHTML = '';
    document.querySelector('#pagination').innerHTML = '';
    if (posts_type == "following") {
        document.querySelector('#userview').innerHTML = '';
    }

    // Fetch posts
    fetch(`/posts/${posts_type}?page=${page_number}`)
    .then(response => response.json())
    .then(data => {

        // get posts
        let posts = data.posts;
        // get upper page limit
        let upper_page_limit = data.upper_page_limit;
        console.log(upper_page_limit)

        posts.forEach(post => {
            let element = document.createElement('div');
            element.innerHTML = `
                <div class="card">
                    <div class="card-title m-2">
                        <button class="userview-link"><strong id='username-${post.id}'>${post['user']}</strong></button>
                        <div id="text-area-${post['id']}" class="card-subtitle m-2 text-muted">
                            ${post['body']}
                            <br>
                            <small id="timestamp-${post['id']}">${post['timestamp']}</small>
                        </div>
                    </div>
                </div>`;
            //Append the element
            document.querySelector('#posts-section').append(element);

            // Hide edit button if user is not owner of the post
            let username = document.querySelector('#username').innerHTML;
            if ( post['user'] == username ) {
                let button = document.createElement('button');
                button.className = 'edit btn btn-secondary btn-sm';
                button.innerHTML = 'Edit';
                
                // If user clicks edit button, hide button and run edit post function
                button.addEventListener('click', () => {
                    edit_post(post)
                    element.removeChild(button);
                    element.removeChild(like_toggle);
                    element.removeChild(counter_div);
                    element.removeChild(comment_toggle);
                    element.removeChild(comment_div);
                })

                element.appendChild(button);
            }

            // Create link to user page on each post

            document.querySelector(`#username-${post.id}`).addEventListener('click', () => load_user(post['user']));
            
            // Create the like button and counter and then append to post

            let like_toggle = document.createElement('div');
            like_toggle.innerHTML = '&#9825;';
            like_toggle.className = 'btn like';

            let like_counter = 0;
            if (post.likes.length > 0) {
                like_counter = post.likes.length;
            }

            let counter_div = document.createElement('div');
            counter_div.innerHTML = `${like_counter}`;
            counter_div.style.display = 'inline-block';

            element.appendChild(like_toggle);
            element.appendChild(counter_div);

            //Check if post is liked by user and call like function
            const csrf_token = getCookie('csrftoken');
            fetch('/like_status', {
                method: 'PUT',
                body: JSON.stringify({
                    id: post.id
                }),
                credentials: 'same-origin',
                headers: {
                    "X-CSRFToken": csrf_token
                }
            })
            .then(response => response.json())
            .then(data => {

                let liked = data['liked']

                //If post already liked, change heart to filled and red
                if (liked === true ){
                    like_toggle.innerHTML = '&#9829'
                    like_toggle.style.color = 'red';
                }

                // Onclick change like button
                like_toggle.addEventListener('click', () => {
                    console.log(data);
                    console.log(liked)
                    like_post(post.id)
            })
            })

            function like_post(post_id) {
                
                const csrf_token = getCookie('csrftoken');
                fetch('like', {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: post_id
                    }),
                    credentials: 'same-origin',
                    headers: {
                        "X-CSRFToken": csrf_token
                    }
                })
                .then(response => response.json())
                .then(data => {
                    
                    console.log(data)
                    let liked = data['liked']
                    console.log(liked)
                    let likes = data['likes']

                    if (liked === false) {
                        like_toggle.innerHTML = '&#9825; '
                        like_toggle.style.color = 'black';
                    } else {
                        like_toggle.innerHTML = '&#9829'
                        like_toggle.style.color = 'red';
                    }
                    // Update the like counter without reloading the page
                    counter_div.innerHTML = likes
                })

            }

            // Create the comment button and append to post

            let comment_toggle = document.createElement('div');
            comment_toggle.innerHTML = 'Comments';
            comment_toggle.id = `${post.id}-comments-btn`
            comment_toggle.className = 'btn comments-toggle btn-light btn-sm mx-2'

            element.appendChild(comment_toggle);

            //Create comment section to display comments and comment form to post comments
            let comment_div = document.createElement('div');
            comment_div.id = `${post.id}-comment-div`;
            comment_div.className = 'comment_div m-3';

            //Div for fetched comments
            let comments_div = document.createElement('div');
            comments_div.className = "comments_div"

            //Append comment form to comment section
            let comment_form = document.createElement('div');
            comment_form.id = `${post.id}-comment-form`;
            comment_form.innerHTML = `
                <form id="comment-form-${post.id}">
                    <div>
                        <textarea id="comment-body-${post.id}" class="form-control m-1" placeholder="Write your comment here"></textarea>
                        <input type="submit" class="btn btn-primary btn-sm m-1" value="Comment">
                    </div>
                </form>
            `;

            comment_toggle.addEventListener('click', () => {

                //Hide comments section if already opened or display one
                if (element.contains(comment_div)){
                    element.removeChild(comment_div);
                    comments_div.innerHTML='';
                    comment_div.removeChild(comments_div);
                    comment_div.removeChild(comment_form);
                } else {
                    element.appendChild(comment_div);
                    comment_div.appendChild(comments_div);
                    comment_div.appendChild(comment_form);
                }

                //onsubmit add comment
                document.querySelector(`#comment-form-${post.id}`).onsubmit = function (event) {

                    const csrf_token = getCookie('csrftoken');
                    fetch('/comments_compose/' + post['id'], {
                        method: 'POST',
                        body: JSON.stringify({
                            body: document.querySelector(`#comment-body-${post.id}`).value
                        }),
                        credentials: 'same-origin',
                        headers: {
                            "X-CSRFToken": csrf_token
                        }
                    })
                    .then(response => load_comments(post.id))
                    document.querySelector(`#comment-body-${post.id}`).value='';

                    return false
                }
                //load all comments
                load_comments(post.id);
            });

            function load_comments(post_id) {
                //create div and append to comment_div then fetch comments in their own divs and append to comments

                comments_div.innerHTML='';

                fetch('/comments/' + post_id)
                .then(response => response.json())
                .then(data => {

                    let comments = data.comments;
                    comments.forEach(comment => {
                        let comment_element = document.createElement('div');
                        comment_element.className = 'comment mx-2'
                        comment_element.innerHTML = `
                        <div>
                            <div>
                            <button class="userview-link-comments" id='username-comment-${comment.id}'><small><strong>${comment['user']}</strong></small></button>
                                <div class="text-muted">
                                    <small>${comment['body']}</small>
                                    <br>
                                    <small>${comment['timestamp']}</small>
                                </div>
                            </div>
                        </div>
                        `;

                        comments_div.appendChild(comment_element);

                        document.querySelector(`#username-comment-${comment.id}`).addEventListener('click', () => load_user(comment['user']));


                    });
                });
            }
        });

        // Check if there is only one page, add pagination buttons
        if (upper_page_limit !== 1) {

            // Make sure that pagination div is displayed
            document.querySelector('#pagination').style.display = 'block';

            //Generate a string of list buttons that change the page number
            pagination_btn_list = "";

            for (let i=1; i <= upper_page_limit; i++) {
                let pagination_span = document.createElement('span');
                let pagination_list_btn = document.createElement('li');
                pagination_list_btn.id = `paginator-${i}`;

                //Check if one of the buttons is the same as the current page and change class
                if (page_number == i){
                    pagination_list_btn.className = "page-item active";
                } else {
                    pagination_list_btn.className = "page-item";
                }

                //Add contents to the string containing list of buttons
                pagination_list_btn.innerHTML = `<a class="page-link">${i}</a></li>`;
                pagination_span.append(pagination_list_btn);
                pagination_btn_list += pagination_span.innerHTML;
            }

            let paginator = document.createElement('div');
            paginator.innerHTML = `
            <div>
                <nav>
                    <ul class="pagination">
                            <li id="previous_paginator" class="page-item"><a class="page-link">&laquo; previous</a></li>
                            ${pagination_btn_list}
                            <li id="next_paginator" class="page-item"><a class="page-link"">next &raquo;</a></li>
                    </ul>
                </nav>
            </div>
            `
            document.querySelector('#pagination').append(paginator);

            //Onlick change page number to the value of the button
            
            for (let i=1; i <= upper_page_limit; i++) {
                document.querySelector(`#paginator-${i}`).onclick = function() {
                    document.querySelector('#posts-section').innerHTML = '';
                    document.querySelector('#pagination').innerHTML = '';
                    page_number = i;
                    load_posts(posts_type, page_number);
                }
            }

            // Onclick change page of posts

            document.querySelector('#previous_paginator').onclick = function() {
                document.querySelector('#posts-section').innerHTML = '';
                document.querySelector('#pagination').innerHTML = '';
                page_number --;
                load_posts(posts_type, page_number)
            }
            document.querySelector('#next_paginator').onclick = function() {
                document.querySelector('#posts-section').innerHTML = '';
                document.querySelector('#pagination').innerHTML = '';
                page_number ++;
                load_posts(posts_type, page_number)
            }

            // Hide buttons if limit of pages reached
            if (page_number <= 1) {
                document.querySelector('#previous_paginator').style.display = 'none';
            } else if (page_number == upper_page_limit) {
                document.querySelector('#next_paginator').style.display = 'none';
            }
            
        } else {
            //If there is only one page, dont display the pagination div after posts
            document.querySelector('#pagination').style.display = 'none';
        }
        
        // Hide new post submission if not on page 1 or not in all_posts section

        if (page_number != 1 || posts_type != "all_posts") {
            document.querySelector('#post-form').style.display = 'none';
        } else {
            document.querySelector('#post-form').style.display = 'block';
        }

    });

    // Edit post function, pre-populate textarea with former text

    function edit_post(post) {
        console.log(post, post.id , post.body);

        console.log(post.body.slice(-23));
        console.log(post.body.split(''));

        //Remove "[Edited]" information for another edit
        if (post.body.slice(-24) == ' <small>[Edited]</small>') {
            let split = post.body.split('');
            split.splice(-24);
            post.body = split.join('');
        }


        //Create textarea for edit input and pre-populate with former data
        let textArea = document.createElement('div');
        textArea.innerHTML = `
            <form id="edit_form_${post.id}">
                <textarea id="edit-post-body-${post.id}" class="form-control m-1">${post.body}</textarea>
                <input type="submit" class="btn btn-primary m-1" value="Save Changes">
            </form>
        `;
        console.log(textArea.innerHTML);
        let target = document.querySelector(`#text-area-${post.id}`)
        console.log(target.innerHTML, target.id);
        
        //Manipulate DOM to remove former body and append the form
        target.innerHTML = '';
        target.appendChild(textArea);

        //hide new post submission and only display the text area for edit
        document.querySelector('#post-form').style.display = 'none';
        
        console.log(post['id']);
        console.log(post.id);
        
        // Use PUT to change the text of a post
        document.querySelector(`#edit_form_${post.id}`).addEventListener('submit', function() {
            //fetch post and put new value and add ID
            
            const csrf_token = getCookie('csrftoken');
            fetch('/edit_post/' + post['id'], {
                method: 'PUT',
                body: JSON.stringify({
                    body: document.querySelector(`#edit-post-body-${post['id']}`).value + ' <small>[Edited]</small>',
                }),
                credentials: 'same-origin',
                headers: {
                    "X-CSRFToken": csrf_token
                }
            })

            return false
        });
    }

}