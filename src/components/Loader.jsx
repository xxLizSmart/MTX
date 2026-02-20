import React from 'react';

const Loader = ({ visible }) => (
  <div className={`loader-container ${visible ? 'loader-visible' : 'loader-fade-out'}`}>
    <div className="loader">
      <span className="loader-text">MTX Trading</span>
    </div>
  </div>
);

export default Loader;
