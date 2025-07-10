from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import Video
from .serializers import VideoSerializer
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.generics import RetrieveAPIView, ListCreateAPIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# ------------------ AUTH ------------------

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=400)

        User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User registered successfully!"}, status=201)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)

# ------------------ VIDEO UPLOAD ------------------

class UploadVideoView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = VideoSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        print(serializer.errors)
        return Response(serializer.errors, status=400)

# ------------------ VIDEO LISTS ------------------

class AllVideosView(APIView):
    def get(self, request):
        videos = Video.objects.all().order_by('-uploaded_at')
        serializer = VideoSerializer(videos, many=True, context={'request': request})
        return Response(serializer.data)

class UserVideosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        videos = Video.objects.filter(user=request.user).order_by('-uploaded_at')
        serializer = VideoSerializer(videos, many=True, context={'request': request})
        return Response(serializer.data)

class UserDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        videos = Video.objects.filter(user=request.user)
        serializer = VideoSerializer(videos, many=True, context={'request': request})
        return Response(serializer.data)

# ------------------ LIKE / WATCH LATER ------------------

class ToggleWatchLaterView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            video = Video.objects.get(id=pk)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=404)

        if request.user in video.watch_later.all():
            video.watch_later.remove(request.user)
            return Response({"message": "Removed from Watch Later"})
        else:
            video.watch_later.add(request.user)
            return Response({"message": "Added to Watch Later"})

class WatchLaterListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        videos = request.user.watch_later_videos.all()
        serializer = VideoSerializer(videos, many=True, context={'request': request})
        return Response(serializer.data)

class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        video = Video.objects.get(pk=pk)
        content = request.data.get('content')
        if not content:
            return Response({'error': 'Comment cannot be empty'}, status=400)
        comment = Comment.objects.create(video=video, user=request.user, content=content)
        return Response(CommentSerializer(comment).data, status=201)

class VideoDetailView(RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_context(self):
        return {"request": self.request}

class CommentListCreateView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        video_id = self.kwargs['pk']
        return Comment.objects.filter(video_id=video_id).order_by('-created_at')

    def perform_create(self, serializer):
        video_id = self.kwargs['pk']
        serializer.save(user=self.request.user, video_id=video_id)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    try:
        video = Video.objects.get(id=pk)
    except Video.DoesNotExist:
        return Response({"error": "Video not found"}, status=404)

    user = request.user
    if user in video.likes.all():
        video.likes.remove(user)
        return Response({'status': 'unliked'})
    else:
        video.likes.add(user)
        return Response({'status': 'liked'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_watch_later(request, pk):
    try:
        video = Video.objects.get(id=pk)
    except Video.DoesNotExist:
        return Response({"error": "Video not found"}, status=404)

    user = request.user
    if user in video.watch_later.all():
        video.watch_later.remove(user)
        return Response({'status': 'removed'})
    else:
        video.watch_later.add(user)
        return Response({'status': 'added'})
