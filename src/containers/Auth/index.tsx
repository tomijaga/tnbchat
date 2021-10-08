import { FC, useState, ReactNode } from "react";
import Modal from "antd/es/modal";
import Card from "antd/es/card";
import Col from "antd/es/col";
import Row from "antd/es/row";

import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";
import AddAccount from "./AddAccount";
import RegisterPassword from "./RegisterPassword";

const Auth: FC<{ showModal?: boolean }> = ({ showModal }) => {
  const authComponents = {
    addAccount: <AddAccount />,
    registerPassword: <RegisterPassword />,
  };

  const [authStatus, setAuthStatus] =
    useState<keyof typeof authComponents>("registerPassword");

  return (
    <Modal visible={showModal} bodyStyle={{ height: "500px", width: "350px" }}>
      {authComponents[authStatus]}
    </Modal>
  );
};

export default Auth;
