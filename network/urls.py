
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    path("posting_compose", views.posting_compose, name="posting_compose"),
    path("posts/<str:posts_type>", views.posts, name="posts"),
    path("edit_post/<str:post_id>", views.edit_post, name="edit_post"),
    path("like", views.like, name="like"),
    path("like_status", views.like_status, name="like_status"),
    path("load_users/<str:user>", views.load_users, name="load_users"),
    path("follow", views.follow, name="follow"),
    path("follow_status", views.follow_status, name="follow_status"),

    path("comments/<str:post_id>", views.comments, name="comments"),
    path("comments_compose/<str:post_id>", views.comments_compose, name="comments_compose"),
    
]
