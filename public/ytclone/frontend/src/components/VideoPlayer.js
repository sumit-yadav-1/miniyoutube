// src/components/VideoPlayer.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../axiosConfig';
import './VideoPlayer.css';
import { toast } from 'react-toastify';

function VideoPlayer() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const fetchVideo = async () => {
    try {
      const res = await axios.get(`videos/${id}/`);
      console.log("Video API response:", res.data); // Debug
      setVideo(res.data);
    } catch (err) {
      console.error('Error fetching video:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`videos/${id}/comments/`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleLike = async () => {
    await axios.post(`videos/${id}/like/`);
    fetchVideo();
  };

  const handleWatchLater = async () => {
    await axios.post(`videos/${id}/watchlater/`);
    fetchVideo();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`videos/${id}/comments/`, { text: comment });
      setComment('');
      fetchComments();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/video/${id}`;
    navigator.clipboard.writeText(url);
    toast.info('🔗 Video link copied to clipboard!');
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, [id]);

  if (!video) return <div className="text-center mt-5">Loading...</div>;

  // Fallback for full URL
  const videoURL = video.video?.startsWith('http')
    ? video.video
    : `http://127.0.0.1:8000${video.video}`;

  return (
    <div className="container mt-4">
      <div className="card shadow rounded p-3">
        <video
          src={videoURL}
          controls
          className="w-100 rounded"
          style={{ backgroundColor: '#000', maxHeight: '480px' }}
        />
        <h3 className="mt-3">{video.title}</h3>
        <p className="text-muted">{video.description}</p>

        <div className="d-flex align-items-center gap-4 mt-2 flex-wrap">
          <button className="btn btn-outline-danger fw-bold" onClick={handleLike}>
            ❤️ {video.is_liked ? 'Liked' : 'Like'} ({video.likes_count || 0})
          </button>
          <button className="btn btn-outline-success fw-bold" onClick={handleWatchLater}>
            📌 {video.is_watch_later ? 'Saved' : 'Watch Later'}
          </button>
          <button className="btn btn-outline-primary fw-bold" onClick={handleShare}>
            🔗 Share
          </button>
        </div>
      </div>

      <div className="card mt-4 p-3 shadow-sm">
        <h5>💬 Comments</h5>
        <form onSubmit={handleComment} className="d-flex flex-column gap-2 mt-2">
          <textarea
            rows="3"
            className="form-control"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-danger align-self-end">Post Comment</button>
        </form>
        <hr />
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="mb-3">
              <strong>{c.user_name}</strong> · <small className="text-muted">{c.time_ago}</small>
              <p className="mb-1">{c.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;