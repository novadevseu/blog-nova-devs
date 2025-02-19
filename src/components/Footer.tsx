import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="py-4 text-center">
      <p>&copy; {new Date().getFullYear()} Nova Devs. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
