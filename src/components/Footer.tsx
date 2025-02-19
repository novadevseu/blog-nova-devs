import React from "react";

const Footer: React.FC = () => {
  return (
    
    <footer className="mt-10 py-6  text-center">
    <p className="text-sm">
    &copy; {new Date().getFullYear()} Built by <span className="font-bold">Nova Devs</span>
    </p>
    
  </footer>
  );
};

export default Footer;
