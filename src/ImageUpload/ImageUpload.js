import React, { useState } from 'react';
import { Input, Button } from '@material-ui/core';

import { storage } from '../firebase.js';
import axios from '../axios.js';
import './ImageUpload.css';

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            axios.post('/instagramPost', {
              caption: caption,
              user: username,
              image: url,
            });

            setProgress(0);
            setCaption('');
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <Input
        placeholder="Enter a caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <div>
        <input type="file" onChange={handleChange} />
        <Button className="imageupload__button" onClick={handleUpload}>
          Upload
        </Button>
      </div>

      <br />
    </div>
  );
};

export default ImageUpload;
