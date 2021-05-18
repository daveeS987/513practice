import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';

import axios from '../axios.js';
import './Post.css';

function Post({ user, username, postId, image, caption, comments }) {
  const [commentsArray, setCommentsArray] = useState([]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    setCommentsArray(comments);
  }, []);

  const postComment = async (e) => {
    e.preventDefault();

    let newCommment = {
      username,
      text: comment,
    };

    await axios
      .put(`/instagramPost/${postId}`, {
        caption,
        user: username,
        image,
        comments: [...commentsArray, newCommment],
      })
      .then((result) => {
        setCommentsArray([...commentsArray, newCommment]);
        setComment('');
      });
  };

  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={image} alt="post" />
      <h4 className="post__text">
        {username} <span className="post__caption">{caption}</span>
      </h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            disabled={!comment}
            className="post__button"
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
