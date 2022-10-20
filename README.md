# Network-CS50-React

Harvard's CS50 Project 4 - Social networking site. Its a single page app written using Django framework, built-in API and Ajax, ReactJS and Python language.

Full specification, API description and setup: https://cs50.harvard.edu/web/2020/projects/4/network/

## Video Demo

https://youtu.be/I7qATqDsBHI

## Setup

Clone this repository and change directory to network:

```bash
git clone https://github.com/Looterro/Network-CS50-React.git
```

Install Django:
```bash
python3 -m pip install Django
```

Setup database and run the development server using commands:
```bash
python manage.py makemigrations network
python manage.py runserver
```

## Specification:

**New Post:** 
- Users who are signed in should be able to write a new text-based post by filling in text into a text area and then clicking a button to submit the post. After that, the posts are reloaded with an animation of adding another post. The box hides on every other page of the application, that is not page 1 of All posts section. 

**All Posts:** 
- The “All Posts” link in the navigation bar should take the user to a page where they can see all posts from all users, with the most recent posts first.
- Each post includes the username of the poster, the post content itself, the date and time at which the post was made, and the number of “likes” the post has.

**Profile Page:** 
- Clicking on a username should load that user’s profile page.
- It displays the number of followers the user has, as well as the number of people that the user follows.
- Shows all of the posts for that user, in reverse chronological order.
- For any other user who is signed in, this page also displays a “Follow” or “Unfollow” button that lets the current user toggle whether or not they are following this user’s posts. This only applies to any “other” user: a user is not be able to follow themselves.

**Following:** 
- The “Following” link in the navigation bar should take the user to a page where they see all posts made by users that the current user follows.
- This page should behaves as the “All Posts” page does, just with a more limited set of posts.
- This page is only available to users who are signed in.

**Pagination:** 
- On any page that displays posts, only 10 posts are displayed on a page. If there are more than ten posts, a “Next” button appears to take the user to the next page of posts (which are older than the current page of posts). If not on the first page, a “Previous” button appears to take the user to the previous page of posts as well.
- "Previous" button and "next" button disappear on the first and the last page of given section of posts, respectively.
- Between "previous" button and "next" button there is a group of numbered buttons that link to a given page of posts. The current page number is highlighted.

**Edit Post:** 
- Users are able to click an “Edit” button on any of their own posts to edit that post.
- When a user clicks “Edit” for one of their own posts, the content of their post is replaced with a textarea where the user can edit the content of their post.
- The user then can “Save” the edited post. Using ReactJS state, this is done without requiring a reload of the entire page.
- For security, it is ensured that the application is designed such that it is not possible for a user, via any route, to edit another user’s posts.

**“Like” and “Unlike”:** 

- Users can click a button or link on any post to toggle whether or not they “like” that post.
- Using ReactJS state, the server asynchronously updates the like count (as via a call to fetch) and then updates the post’s like count to be displayed on the page, without requiring a reload of the entire page.

**Comments section:** 

- Additional feature is comments section that allows users to post their comments under a post. After clicking a "Comments" button appended to a given post, a new body appears with comment form and users comments to that post, starting from the oldest at the top.
- A comment section is scrollable once the sum of individual comments height is higher than the max height of it. By default the window is scrolled to the bottom, where the newest post is displayed



