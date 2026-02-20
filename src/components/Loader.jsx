import React from 'react';

const Loader = ({ visible }) => (
  <div
    className={`loader-overlay ${visible ? 'loader-visible' : 'loader-hidden'}`}
  >
    <div className="loader-text">MTX Trading</div>
  </div>
);

export default Loader;
