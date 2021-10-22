import React from 'react';
import Menu from 'antd/es/menu';
import {useHistory} from 'react-router-dom';

const MobileMenuBar = () => {
  const history = useHistory();
  return (
    <Menu mode="horizontal">
      <Menu.Item
        key={1}
        onClick={() => {
          history.push('/home');
        }}
      >
        Home
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          // history.push(`/accounts/${account?.account_number}`);
        }}
      >
        Profile
      </Menu.Item>
      <Menu.Item>Getting Started</Menu.Item>
    </Menu>
  );
};

export default MobileMenuBar;
