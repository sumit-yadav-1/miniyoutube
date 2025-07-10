import { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import VideoCard from './VideoCard';

function Dashboard() {
  const [videos, setVideos] = useState([]);

  const fetchMyVideos = async () => {
    try {
      const res = await axios.get('my-videos/');
      setVideos(res.data);
    } catch (err) {
      console.error('Error fetching your videos:', err);
    }
  };

  useEffect(() => {
    fetchMyVideos();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">My Uploaded Videos</h3>
      <div className="row">
        {videos.length === 0 ? (
          <p>No videos uploaded yet.</p>
        ) : (
          videos.map((video) => (
            <div key={video.id} className="col-sm-6 col-md-4 mb-4">
              <VideoCard video={video} refreshVideos={fetchMyVideos} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;