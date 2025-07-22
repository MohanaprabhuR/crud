import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="text-center py-3 mt-5 bg-[#343a40] text-white">
        <p className="mb-0">
          &copy;{new Date().getFullYear()} SupaNext. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
