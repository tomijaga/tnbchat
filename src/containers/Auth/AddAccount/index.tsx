import { useState } from "react";
import Card from "antd/es/card";
import Col from "antd/es/col";
import Button from "antd/es/button";
import Row from "antd/es/row";
import Form from "antd/es/form";
import { generateMnemonic } from "tnb-hd-wallet";
import { Input, Typography } from "antd";

type AddAccountOption = "create_account" | "import_account" | "none";

const AddAccount = () => {
  const [option, setOption] = useState<AddAccountOption>("none");

  return (
    <Row>
      {option === "none" && (
        <>
          <Col>
            <Card onClick={() => setOption("create_account")}>
              Create Account
            </Card>
          </Col>
          <Col>
            <Card onClick={() => setOption("import_account")}>
              Import Address
            </Card>
          </Col>
          <Col>
            <Card onClick={() => setOption("import_account")}>
              Import Seed Phrase
            </Card>
          </Col>
        </>
      )}
      <>
        <Button onClick={() => setOption("none")}>Back button</Button>
        {option === "create_account" ? (
          <>
            <Card>{generateMnemonic()}</Card>
            <Typography.Text>
              Copy and save your seed phrase in a secure location.
              <br />
              Go to this link to see the best ways to secure your seed phrase
              [Post link here]
            </Typography.Text>
            <Button>Verify Seed Phrase</Button>
          </>
        ) : (
          <Form>
            <Form.Item label={"Signing Key"}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button>Sign</Button>
            </Form.Item>
          </Form>
        )}
      </>
    </Row>
  );
};

export default AddAccount;
