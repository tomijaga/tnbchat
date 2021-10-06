import { useEffect, useRef, useState } from "react";
import bs58 from "bs58";

import axios from "axios";
import {
  Account,
  AccountPaymentHandler,
  Bank,
  Transaction,
  PaginatedTransactionEntry,
} from "./thenewboston-js/src";

import Form from "antd/es/form";

import Button from "antd/es/button";
import Col from "antd/es/col";
import Card from "antd/es/card";
import Tooltip from "antd/es/tooltip";

import Comment from "antd/es/comment";
import Avatar from "antd/es/avatar";

import Row from "antd/es/row";

import Input from "antd/es/input";
import "antd/dist/antd.css";
import "./styles.css";

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

  // const pvUrl = "http://20.98.87.223";

  const [encodedText, setEncodedText] = useState("cat");
  const [form] = Form.useForm();

  useEffect(() => {
    tnbpay.init();
  }, []);

  const getPosts = async () => {
    const txs = await bank.getTransactions({
      limit: 100,
      recipient: tnbchat,
    });
    console.log({ txs });
    setPosts(txs.results);
  };
  const encode = (plainText: string) => {
    const textAsBytes = Buffer.from(
      encodeURIComponent(plainText).replaceAll("%20", " ")
    );
    console.log("encodeURIComponent", encodeURIComponent(plainText));
    // console.log("uri encoded", );

    const base_58_text = bs58.encode(textAsBytes);
    console.log("Text length", base_58_text.length);
    return base_58_text;
  };

  const decode = (codedText: string) => {
    const bytes = bs58.decode(codedText);
    const codedURI = bytes.reduce((cumulatedText: string, byte: any) => {
      return (cumulatedText += String.fromCharCode(byte));
    }, "");
    return decodeURIComponent(codedURI);
  };

  const onFinish = async ({ textInput }: any) => {
    console.log("Sending...", textInput);
    await tnbpay.sendCoins(tnbchat, 1, encodedText);
    setEncodedText("");
    getPosts();
  };

  const updateText = (e: any) => {
    const value = e.target.value;
    const encoded_text = encode(value);
    setEncodedText(encoded_text);
  };

  const onFinishFailed = console.log;

  const [posts, setPosts] = useState<PaginatedTransactionEntry[]>([]);
  useEffect(() => {
    getPosts();
  }, []);

  const Post = (tx: PaginatedTransactionEntry) => {
    return (
      <Col span={24}>
        <Comment
          // actions={actions}
          author={<a>{"Henry" + tx.block.id.slice(0, 2)}</a>}
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          }
          content={<p>{decode(tx.memo ?? "")}</p>}
          datetime={
            <Tooltip title={"x"}>
              <span>{`${tx.block.sender.slice(0, 4)}..${tx.block.sender.slice(
                -4
              )}`}</span>
            </Tooltip>
          }
        />
      </Col>
    );
  };

  return (
    <div className="App">
      <Row justify="center">
        <Col span={10}>
          <Row justify="center">
            {posts.map((tx) => Post(tx))}
            <Col>
              <Form
                form={form}
                name="post"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item name="textInput">
                  <Input.TextArea
                    style={{
                      color: encodedText.length >= 64 ? "red" : "black",
                    }}
                    onChange={updateText}
                    placeholder="What's Happening?"
                    showCount
                    allowClear
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    disabled={encodedText.length >= 64}
                    type="primary"
                    htmlType="submit"
                  >
                    Send
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
