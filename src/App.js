import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { Button, Avatar, makeStyles, Modal, Input } from '@material-ui/core';
import FlipMove from 'react-flip-move';
import Pusher from 'pusher-js';

import './App.css';
import axios from './axios.js';
import Post from './Post/Post.js';
import ImageUpload from './ImageUpload/ImageUpload.js';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    height: '300px',
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    height: 200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpen(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    await auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpen(false);
    setRegisterOpen(false);
  };

  useEffect(() => {
    const checkUser = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // console.log('A NEW USER DETECTED:', authUser);
        setUser(authUser);
        if (!authUser.displayName) {
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      checkUser();
    };
  }, [user, username]);

  async function getAllPosts() {
    let allPosts = await axios.get('/instagramPost');
    setPosts(allPosts.data.results);
  }

  useEffect(() => {
    const pusher = new Pusher('da2ec1cce9c3a1c021c7', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('instagramposts');
    channel.bind('inserted', (data) => {
      console.log('Insert was triggered: ', data);
      getAllPosts();
    });
  }, []);

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>Login</Button>
          </form>
        </div>
      </Modal>

      <Modal open={registerOpen} onClose={() => setRegisterOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__login">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleRegister}>Register</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user?.displayName ? (
          <div className="app__headerRight">
            <Button onClick={() => auth.signOut()}>Logout</Button>
            <Avatar
              className="app__headerAvatar"
              alt={user.displayName}
              src="/static/images/avatar/1.jpg"
            />
          </div>
        ) : (
          <form className="app__loginHome">
            <Button onClick={() => setOpen(true)}>Login</Button>
            <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
          </form>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          <FlipMove>
            {posts.map((post) => (
              <Post
                user={user}
                key={post._id}
                postId={post._id}
                username={post.user}
                caption={post.caption}
                image={post.image}
                comments={post.comments}
              />
            ))}
          </FlipMove>
        </div>
      </div>

      {user?.displayName ? (
        <div className="app__upload">
          <ImageUpload username={user.displayName} />
        </div>
      ) : (
        <center>
          <h3>Login to upload</h3>
        </center>
      )}
    </div>
  );
}

export default App;
