import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import VideoCard from './VideoCard';

function WatchLater() {
  const [videos, setVideos] = useState([]);

  const fetchWatchLater = async () => {
    try {
      const res = await axios.get('watch-later/');
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching watch later videos:', err);
    }
  };

  useEffect(() => {
    fetchWatchLater();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Watch Later</h3>
      <div className="row">
        {videos.length === 0 ? (
          <p>No videos in Watch Later.</p>
        ) : (
          videos.map(video => (
            <div key={video.id} className="col-sm-6 col-md-4 mb-4">
              <VideoCard video={video} refreshVideos={fetchWatchLater} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default WatchLater;