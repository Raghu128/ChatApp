import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, onValue, push, set } from "firebase/database"; 
import { UserContext } from "../../context/UserContext"; 
import PostComponent from '../../Components/PostComponent/PostComponent.js';

const FeedPage = () => {
  const { user } = useContext(UserContext); 
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    photo: "",
    text: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const postsRef = ref(db, "posts/");

    const unsubscribe = onValue(
      postsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetchedPosts = Object.keys(data).map((postId) => ({
            ...data[postId],
            id: postId,
          }));
          setPosts(fetchedPosts);
        } else {
          console.log("No posts found.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching posts: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handlePostChange = (event) => {
    const { name, value } = event.target;
    setNewPost({
      ...newPost,
      [name]: value,
    });
  };

  const handlePostSubmit = (event) => {
    event.preventDefault();
    if (user) {
      const db = getDatabase();
      const postsRef = ref(db, "posts/");
      const newPostRef = push(postsRef);
      const postToAdd = {
        id: newPostRef.key,
        photo: newPost.photo,
        text: newPost.text,
        likes: 0,
        comments: [],
        userId: user.uid,
      };

      set(newPostRef, postToAdd)
        .then(() => {
          setNewPost({ photo: "", text: "" });
        })
        .catch((error) => {
          console.error("Error adding post: ", error);
        });
    } else {
      console.log("Please login to add posts.");
    }
  };

  return (
    <div className="feed-page">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h1>Feed Page</h1>
          <form onSubmit={handlePostSubmit}>
            <input
              type="text"
              name="photo"
              value={newPost.photo}
              onChange={handlePostChange}
              placeholder="Enter photo URL"
            />
            <textarea
              name="text"
              value={newPost.text}
              onChange={handlePostChange}
              placeholder="Enter post text"
            />
            <button type="submit">Add Post</button>
          </form>
          <hr />
          <div className="posts-container">
            {posts.map((post) => (
              <PostComponent key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedPage;
