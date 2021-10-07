import "antd/dist/antd.css";
import "../styles.css";
import "../App.css";

import {
  Account,
  AccountPaymentHandler,
  Bank,
  PaginatedTransactionEntry,
  Transaction,
} from "../thenewboston-js/src";
import { FC, ReactNode, useEffect, useRef, useState } from "react";

import Avatar from "antd/es/avatar";
import Button from "antd/es/button";
import Card from "antd/es/card";
import Col from "antd/es/col";
import Comment from "antd/es/comment";
import Form from "antd/es/form";
import Grid from "antd/es/grid";
import Input from "antd/es/input";
import { Layout } from "antd";
import Menu from "antd/es/menu";
import { Post } from "components";
import Row from "antd/es/row";
import Tooltip from "antd/es/tooltip";
import Typography from "antd/es/typography";
import axios from "axios";
import bs58 from "bs58";
import { encode } from "utils";
import { default as isImageUrl } from "image-url-validator";
import isUrl from "is-url";

const tnbchat =
  "06e51367ffdb5e3e3c31118596e0956a48b1ffde327974d39ce1c3d3685e30ab";
const sk = "25d9b8e19a450706e5acf868b9d81a2b2679c1753e9fec64087fa715f94c27a3";
const bankUrl = "http://bank.tnbexplorer.com";

export default function App() {
  const account = new Account(sk);
  const bank = new Bank(bankUrl);
  const [tnbpay, setTnbPay] = useState<AccountPaymentHandler>(
    new AccountPaymentHandler({ account, bankUrl })
  );

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  // const pvUrl = "http://20.98.87.223";
  console.log(screens);
  const [encodedText, setEncodedText] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    tnbpay.init();
  }, []);

  const getPosts = async () => {
    const txs = await bank.getTransactions({
      limit: 100,
      recipient: tnbchat,
    });
    setPosts(txs.results);
  };

  const onFinish = async ({ textInput }: any) => {
    if (textInput) {
      console.log("Sending...", textInput);
      const block = await tnbpay.sendCoins(tnbchat, 1, encodedText);
      setEncodedText("");

      const tx: PaginatedTransactionEntry = {
        recipient: tnbchat,
        amount: 1,
        block,
        memo: encodedText,
        id: "122" + textInput.slice(0, 5),
      };
      setPosts((prev) => [tx, ...prev]);
    }
  };

  const updateText = async (e: any) => {
    const value = e.target.value;
    const encoded_text = encode(value);
    setEncodedText(await encoded_text);
  };

  const onFinishFailed = console.log;

  const [posts, setPosts] = useState<PaginatedTransactionEntry[]>([]);
  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className="App">
      <Row justify="center">
        <Col md={5} span={0}>
          <Layout.Sider
            theme="light"
            width={300}
            style={{
              padding: "20px",
              height: "100vh",
              position: "fixed",
              left: "calc( 28% - 300px )",
            }}
            // mode="inline"
          >
            <Typography.Title level={5}>Home</Typography.Title>
            <Typography.Title level={5}>Channels</Typography.Title>
            <Typography.Title level={5}>Gov Proposals</Typography.Title>
            <Typography.Title level={5}>Wallet</Typography.Title>
            <br />

            <Typography.Title level={5}>Profile</Typography.Title>
            <Typography.Title level={5}>Messages</Typography.Title>
            <Typography.Title level={5}>Settings</Typography.Title>
            <Typography.Title level={5}>Help</Typography.Title>
          </Layout.Sider>
        </Col>

        <Col lg={10} md={15}>
          <Row justify="center">
            <Col span={24}>
              <Card>
                <Form
                  form={form}
                  name="post"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row justify="center">
                    <Col span={12}>
                      <Form.Item name="textInput">
                        <Input.TextArea
                          style={{
                            color: encodedText.length > 64 ? "red" : "black",
                          }}
                          onChange={updateText}
                          placeholder="What's Happening?"
                          showCount
                          allowClear
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Input.TextArea
                        disabled={true}
                        value={encodedText}
                        placeholder="What's going on under the hood?"
                        showCount
                      />
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button
                      disabled={encodedText.length > 64}
                      type="primary"
                      htmlType="submit"
                    >
                      Send
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>
            {posts.map((tx) => (
              <Col span={24} key={tx.id}>
                {<Post data={tx} />}
              </Col>
            ))}
          </Row>
        </Col>

        <Col lg={5} span={0}>
          <Layout.Sider
            theme="dark"
            width={300}
            style={{
              height: "100vh",
              position: "fixed",
              right: "calc( 28% - 300px )",
              padding: "20px",
            }}
            // mode="inline"
          >
            <Card></Card>
          </Layout.Sider>
        </Col>
      </Row>
    </div>
  );
}
