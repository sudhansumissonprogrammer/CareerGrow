import React from 'react';
import { Link } from 'react-router-dom';

const SubMenu = ({ menuItems }) => {
  return (
    <ul className="sub-menu">
      {menuItems.map((item, index) => (
        <li key={index} className="sub-menu-item">
          <Link to={item.path}>{item.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default SubMenu;
