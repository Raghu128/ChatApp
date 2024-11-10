import React, { useState, useEffect } from "react";
import { getDatabase, ref, update, get } from "firebase/database";
import './PostComponent.css'; // Assuming you have some styles for this component

const PostComponent = ({ post, user }) => {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if the user has liked the post
    if (user) {
      const db = getDatabase();
      const likedPostsRef = ref(db, `users/${user.uid}/likedPosts/${post.id}`);
      get(likedPostsRef).then((snapshot) => {
        if (snapshot.exists()) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      });
    }
  }, [post.id, user]);

  const handleLikePost = () => {
    if (!user) {
      console.log("Please log in to like the post.");
      return;
    }

    const db = getDatabase();
    const postRef = ref(db, `posts/${post.id}`);
    const likedPostsRef = ref(db, `users/${user.uid}/likedPosts/${post.id}`);

    get(postRef).then((snapshot) => {
      const currentLikes = snapshot.val().likes || 0;

      if (liked) {
        // If already liked, unlike the post
        update(postRef, { likes: currentLikes - 1 })
          .then(() => {
            update(likedPostsRef, null); // Remove the like entry from user's data
            setLiked(false);
          })
          .catch((error) => {
            console.error("Error unliking post: ", error);
          });
      } else {
        // If not liked, like the post
        update(postRef, { likes: currentLikes + 1 })
          .then(() => {
            update(likedPostsRef, true); // Mark the post as liked for the user
            setLiked(true);
          })
          .catch((error) => {
            console.error("Error liking post: ", error);
          });
      }
    });
  };

  const handleCommentChange = (event) => {
    setCommentText(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (!user) {
      console.log("Please log in to comment.");
      return;
    }

    const db = getDatabase();
    const postRef = ref(db, `posts/${post.id}`);

    const newComment = {
      text: commentText,
      userId: user.uid,
      userName: user.displayName || "Anonymous",
    };

    update(postRef, { comments: [...post.comments, newComment] })
      .then(() => {
        setCommentText("");
      })
      .catch((error) => {
        console.error("Error adding comment: ", error);
      });
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  return (
    <div className="post">
      <img src={post.photo} alt="Post" />
      <p>{post.text}</p>
      <p>Likes: {post.likes}</p>
      <button onClick={handleLikePost}>
        {liked ? "Unlike" : "Like"}
      </button>
      <button onClick={toggleComments}>
        {showComments ? "Hide Comments" : "Show Comments"}
      </button>
      {showComments && (
        <div className="comments-section">
          {/* <h4>Comments:</h4> */}
          {post && post.comments.map((comment, index) => (
            <div key={index}>
              <strong>{comment.userName}</strong>: {comment.text}
            </div>
          ))}
          <form onSubmit={handleCommentSubmit}>
            <input
              type="text"
              value={commentText}
              onChange={handleCommentChange}
              placeholder="Add a comment"
            />
            <button type="submit">Comment</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
