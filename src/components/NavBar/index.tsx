import React from 'react';

import "./../../styles/index.scss"
interface NavBarProps { }

const NavBar: React.FC<NavBarProps> = () => {
  return (
    <div className="bg-blue w-64 text-white py-10 h-screen shadow-2xl">
      <div className="w-full mx-auto text-center">
        <p className="text-4xl">📝 Notes</p>
        <div className="h-0.5 mx-auto w-3/4 bg-white mt-4 "></div>
      </div>
    </div>
  );
}

export default NavBar;
