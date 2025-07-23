import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className=" py-4 bg-[#343a40] ">
        <p className="text-base text-center leading-6 tracking-[-0.064px] text-white font-normal">
          &copy;{new Date().getFullYear()} SupaNext. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Footer;
