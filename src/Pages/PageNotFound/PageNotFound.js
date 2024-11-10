import React from 'react';
import './PageNotFound.css'

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for could not be found.</p>
      <a href="/">Go back to homepage</a>
    </div>
  );
};

export default PageNotFound;