import {Account, AccountPaymentHandler, Bank, PaginatedTransactionEntry, Transaction} from '../../thenewboston/src';
import {FC, ReactNode, useEffect, useRef, useState} from 'react';

import Avatar from 'antd/es/avatar';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Comment from 'antd/es/comment';
import Row from 'antd/es/row';
import Tag from 'antd/es/tag';
import Tooltip from 'antd/es/tooltip';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Typography from 'antd/es/typography';
import {decode} from 'utils';
import {formatDistanceToNowStrict} from 'date-fns';
import isUrl from 'is-url';
import Grid from 'antd/es/grid';

const memoTextToComponent = (word: string) => {
  if (word === '') return <Typography.Text> </Typography.Text>;
  if (word) {
    if (word.startsWith('https://tinyurl.com') || word.startsWith('https://bit.ly')) {
      return (
        <img
          style={{
            width: '300px',
            height: '300px',
            objectFit: 'scale-down',
          }}
          src={word}
        />
      );
    }

    if (isUrl(word)) {
      return (
        <Typography.Link href={word} target="_blank">
          {word}
        </Typography.Link>
      );
    }
  }
  return word;
};

const formatMemo = (memo: string) => {
  const decodedText = decode(memo);
  const formattedWords: ReactNode[] = [];

  decodedText.split(' ').map((word: string) => {
    formattedWords.push(memoTextToComponent(word));
    formattedWords.push(' ');
  });

  return formattedWords;
};

const {useBreakpoint} = Grid;
export const Post: FC<{data: PaginatedTransactionEntry}> = ({data: tx}) => {
  const screens = useBreakpoint();
  return (
    <Card>
      <Col span={24}>
        <Row gutter={10}>
          <Col span={3}>
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" alt="Han Solo" />
          </Col>
          <Col span={21}>
            <Row gutter={[10, 10]} justify="space-between" align="middle" style={{textAlign: 'left'}}>
              <Col>
                <Row gutter={10} align="bottom">
                  <Col>
                    <Typography.Text style={{fontSize: 'small', color: 'gray'}}>
                      {'Henry' + tx.block.id.slice(0, 2)}
                    </Typography.Text>
                  </Col>
                  <Col style={{fontSize: 'small', color: 'lightgray'}}>@{tx.block.sender.slice(0, 4)}..df12</Col>
                  <Col>
                    <Tag color="gold">Gov</Tag>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row gutter={screens.xs ? 5 : 40} align="bottom">
                  <Col style={{fontSize: 'small', color: 'lightgray'}}>
                    {formatDistanceToNowStrict(new Date(tx.block.modified_date))
                      .replaceAll(/hour(s)/g, 'h')
                      .replaceAll(/minute(s)/gi, 'm')
                      .replaceAll(/second(s)/g, 's')
                      .replaceAll(' ', '')}
                  </Col>
                  <Col>
                    <Button size="small" type="text" shape="circle" icon={<MoreOutlined />} />
                  </Col>
                </Row>
              </Col>
              <Col span={24}>{formatMemo(tx.memo ?? '')}</Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Card>
  );
};
