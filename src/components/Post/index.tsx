import {PaginatedTransactionEntry} from 'thenewboston/src';
import {FC, ReactNode, useEffect, useState} from 'react';

import Avatar from 'antd/es/avatar';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Tag from 'antd/es/tag';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Typography from 'antd/es/typography';
import {decode} from 'utils';
import {formatDistanceToNowStrict} from 'date-fns';
import isUrl from 'is-url';
import Grid from 'antd/es/grid';
import ReactPlayer from 'react-player';

const memoTextToComponent = async (word: string) => {
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
          alt={word}
          src={word}
        />
      );
    }

    if (isUrl(word)) {
      if (word.endsWith('.mp4')) {
        if (await ReactPlayer.canPlay(word))
          return (
            <iframe
              width="300px"
              height="300px"
              src={word}
              title="TnbChat video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          );
        // return <ReactPlayer width="100%" height="100%" muted={true} loop={true} light url={word} />;
      }
      return (
        <Typography.Link href={word} target="_blank">
          {word}
        </Typography.Link>
      );
    }
  }
  return word;
};

const formatMemo = async (memo: string) => {
  const decodedText = decode(memo);
  const formattedWords: ReactNode[] = [];

  for (const word of decodedText.split(' ')) {
    formattedWords.push(await memoTextToComponent(word));
    formattedWords.push(' ');
  }

  return formattedWords;
};

const {useBreakpoint} = Grid;
export const Post: FC<{data: PaginatedTransactionEntry}> = ({data: tx}) => {
  const screens = useBreakpoint();
  const [memoData, setMemoData] = useState<ReactNode[]>([]);
  useEffect(() => {
    formatMemo(tx.memo ?? '').then((result) => {
      setMemoData(result);
    });
  }, [tx]);

  return (
    <Card>
      <Col span={24}>
        <Row gutter={10}>
          <Col flex={'50px'}>
            <Avatar src={`https://robohash.org/${tx.block.sender}.png?sets=set1,set3,set4,set5`} alt="pfp" />
          </Col>
          <Col span={21}>
            <Row gutter={[10, 10]} justify="space-between" align="middle" style={{textAlign: 'left'}}>
              <Col>
                <Row gutter={10} align="bottom">
                  <Col>
                    <Typography.Text strong style={{fontSize: 'small', color: 'gray'}}>
                      {'User-' + tx.block.sender.slice(0, 4)}
                    </Typography.Text>
                  </Col>
                  <Col style={{fontSize: 'small', color: 'lightgray'}}>
                    @{tx.block.sender.slice(0, 4)}..{tx.block.sender.slice(-4)}
                  </Col>
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
              <Col span={24}>{memoData}</Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Card>
  );
};
