from django.urls import path
from .views import (
    RegisterView, LoginView, UploadVideoView, AllVideosView,
    UserDashboardView, ToggleWatchLaterView, WatchLaterListView,
    UserVideosView, toggle_like, toggle_watch_later
)
from .views import CommentCreateView
from .views import VideoDetailView, CommentListCreateView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('upload/', UploadVideoView.as_view(), name='upload-video'),
    path('videos/', AllVideosView.as_view(), name='all-videos'),
    path('my-videos/', UserVideosView.as_view(), name='my-videos'),
    path('user/dashboard/', UserDashboardView.as_view(), name='user-dashboard'),
    path('videos/<int:pk>/like/', toggle_like),
    path('videos/<int:pk>/watchlater/', toggle_watch_later),
    path('watch-later/', WatchLaterListView.as_view(), name='watch-later'),
    path('videos/<int:pk>/comment/', CommentCreateView.as_view(), name='add-comment'),
    path('videos/<int:pk>/', VideoDetailView.as_view(), name='video-detail'),
    path('videos/<int:pk>/comments/', CommentListCreateView.as_view(), name='video-comments'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]