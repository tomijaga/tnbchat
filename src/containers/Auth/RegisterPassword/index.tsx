import { useState } from "react";
import { Aes } from "utils/aes";
import Form from "antd/es/form";
import Input from "antd/es/input";
import Button from "antd/es/button";

const RegisterPassword = () => {
  const [cypherAlgorithm, setCypherAlgorithm] = useState<Aes | null>(null);
  const handleCreatePasswordForm = ({ tnbchatPassword }: any) => {
    console.log({ tnbchatPassword });
    /**
     * This fn doesn't store the password
     * Instead it encrypts a known key and stores it in the browser
     *
     * Ownership can be verified if the user can decrypt the stored encrypted key
     */

    setCypherAlgorithm(new Aes(tnbchatPassword));
    const encryptedKey = cypherAlgorithm?.ctrEncryption(
      process.env.REACT_APP_ENCRYPTION_KEY!
    );

    if (encryptedKey) {
      localStorage.setItem("encrypted_key", JSON.stringify(encryptedKey));
    } else {
      throw new Error("Key could not be Encrypted");
    }
  };

  return (
    <Form onFinish={handleCreatePasswordForm}>
      Enter Password
      <Form.Item name={"tnbchatPassword"}>
        <Input.Password />
      </Form.Item>
      <Form.Item name={"tnbchatPassword2"}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Submit Password</Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPassword;
