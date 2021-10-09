import { FC, useState } from "react";
import { Aes } from "utils/aes";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";

const VerifyUser: FC<{ onFinish: (obj: any) => void }> = ({ onFinish }) => {
  return (
    <Form onFinish={onFinish}>
      Enter Password
      <Form.Item name={"tnbchatPassword"}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Submit Password</Button>
      </Form.Item>
    </Form>
  );
};

export default VerifyUser;
