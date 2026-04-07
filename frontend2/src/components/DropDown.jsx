import React from 'react';
import SubMenu from './SubMenu';

const DropDown = ({ isOpen, menuItems }) => {
  return (
    <div className={`dropdown ${isOpen ? 'open' : ''}`}>
      <SubMenu menuItems={menuItems} />
    </div>
  );
};

export default DropDown;
