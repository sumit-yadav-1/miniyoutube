// src/components/VideoCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function VideoCard({ video, refreshVideos }) {
  const navigate = useNavigate();

  const handleAction = async (action) => {
    await fetch(`videos/${video.id}/${action}/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.token}` },
    });
    refreshVideos();
  };

  return (
    <div className="card h-100 rounded shadow-sm" style={{ width: '100%' }}>
      <img
        src={video.thumbnail}
        alt={video.title}
        className="card-img-top rounded-top"
        style={{ cursor: 'pointer', height: '200px', objectFit: 'cover' }}
        onClick={() => navigate(`/video/${video.id}`)}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-truncate">{video.title}</h5>
        <div className="mt-auto d-flex justify-content-between">
          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={() => handleAction('like')}
            style={{ minWidth: '70px' }}
          >
            <strong>{video.is_liked ? '❤️ Liked' : '♡ Like'}</strong>
          </button>

          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={() => handleAction('watchlater')}
            style={{ minWidth: '110px' }}
          >
            <strong>{video.is_watch_later ? '✅ Saved' : '➕ Watch Later'}</strong>
          </button>

          <button
            className="btn btn-link text-decoration-none p-0"
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/video/${video.id}`)}
          >
            <strong>🔗 Share</strong>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;