from rest_framework import serializers
from .models import Video, Comment
from django.contrib.auth.models import User

class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'user_name', 'text', 'time_ago']

    def get_user_name(self, obj):
        return obj.user.username

    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        return timesince(obj.created_at) + " ago"

class VideoSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_watch_later = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id',
            'title',
            'description',
            'video',
            'thumbnail',
            'likes_count',
            'is_liked',
            'is_watch_later',
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(id=request.user.id).exists()
        return False

    def get_is_watch_later(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.watch_later.filter(id=request.user.id).exists()
        return False