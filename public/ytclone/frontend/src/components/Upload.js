import { useState } from 'react';
import axios from '../axiosConfig';
import { toast } from 'react-toastify';

function Upload() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    video: null,
    thumbnail: null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('video', form.video);
    if (form.thumbnail) formData.append('thumbnail', form.thumbnail);

    try {
      await axios.post('upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('✅ Upload successful!');
      setForm({ title: '', description: '', video: null, thumbnail: null });
    } catch (err) {
      console.error('UPLOAD ERROR:', err.response?.data || err.message);
      toast.error('❌ Upload failed. Check file format, size, or authentication.');
    }
  };

  return (
    <div className="container mt-4">
      <h3>Upload Video</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="form-control mb-2"
          onChange={handleChange}
          value={form.title}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          className="form-control mb-2"
          onChange={handleChange}
          value={form.description}
        />
        <label className="form-label">Upload Video File :</label>
        <input
          type="file"
          name="video"
          accept="video/*"
          className="form-control mb-2"
          onChange={handleFileChange}
          required
        />
        <label className="form-label">Upload Thumbnail :</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          className="form-control mb-3"
          onChange={handleFileChange}
        />
        <button type="submit" className="btn btn-danger">Upload</button>
      </form>
    </div>
  );
}

export default Upload;