import React from "react";

const Loader = () => {
  return (
    <div>
      <div id="loader" className="flex justify-center items-center h-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
