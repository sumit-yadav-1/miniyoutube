// src/components/Home.js
import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import VideoCard from './VideoCard';

function Home({ searchQuery }) {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('videos/');
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching videos:', err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="container mt-4">
      <h3 className="mb-4">All Videos</h3>
      <div className="row">
        {filteredVideos.length === 0 ? (
          <p>No videos found.</p>
        ) : (
          filteredVideos.map(video => (
            <div key={video.id} className="col-sm-6 col-md-4 mb-4">
              <VideoCard video={video} refreshVideos={fetchVideos} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;