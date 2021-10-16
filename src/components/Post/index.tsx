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
import {format as formatDate, formatDistanceToNowStrict} from 'date-fns';
import isUrl from 'is-url';
import Grid from 'antd/es/grid';
import ReactPlayer from 'react-player';
import Tooltip from 'antd/es/tooltip';

import CommentOutlined from '@ant-design/icons/CommentOutlined';
import LikeOutlined from '@ant-design/icons/LikeOutlined';
import DislikeOutlined from '@ant-design/icons/DislikeOutlined';

import {ReactComponent as TnbLogo} from 'assets/tnb3.svg';
import Icon from '@ant-design/icons/lib/components/Icon';
import {Link} from 'react-router-dom';

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
    // <Link to={`/${tx.block.sender}/post/${tx.block.balance_key}`} style={{zIndex: 0}}>
    <Card
      id="post"
      onClick={(e) => {
        // window.location.href = `/posts/${tx.block.balance_key}`;
      }}
    >
      <Row gutter={10}>
        <Col flex={'32px'}>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={`/${tx.block.sender}`}
          >
            <Avatar src={`https://robohash.org/${tx.block.sender}.png?sets=set1,set3,set4,set5`} alt="pfp" />
          </Link>
        </Col>
        <Col span={21}>
          <Row gutter={[10, 10]} justify="space-between" align="middle" style={{textAlign: 'left'}}>
            <Col>
              <Row gutter={10} align="bottom">
                <Col>
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    to={`/${tx.block.sender}`}
                  >
                    <Typography.Text strong style={{color: 'gray'}}>
                      {'User-' + tx.block.sender.slice(0, 4)}
                    </Typography.Text>
                  </Link>
                </Col>
                <Col
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{color: 'lightgray'}}
                >
                  <Tooltip overlayInnerStyle={{fontSize: 'smaller'}} title={'Copy Address'}>
                    @{tx.block.sender.slice(0, 4)}..{tx.block.sender.slice(-4)}
                  </Tooltip>
                </Col>
                <Col>
                  <Tag
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    color="gold"
                  >
                    Gov
                  </Tag>
                </Col>
              </Row>
            </Col>
            <Col>
              <Row gutter={screens.xs ? 5 : 40} align="bottom">
                <Col
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{color: 'lightgray'}}
                >
                  <Tooltip
                    overlayInnerStyle={{fontSize: 'smaller'}}
                    placement="bottom"
                    title={formatDate(new Date(tx.block.modified_date), "h':'m aa '⁃' MMM d, yyyy  ")}
                  >
                    {formatDistanceToNowStrict(new Date(tx.block.modified_date))
                      .replaceAll(/hour(s)/g, 'h')
                      .replaceAll(/minute(s)/gi, 'm')
                      .replaceAll(/second(s)/g, 's')
                      .replaceAll(' ', '')}
                  </Tooltip>
                </Col>
                <Col>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    shape="circle"
                    size="small"
                    type="text"
                    icon={<MoreOutlined />}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>{memoData}</Col>
            <Col>
              <Row gutter={20} align="middle" justify="space-between">
                <Col style={{marginLeft: '-10px'}}>
                  <Tooltip overlayInnerStyle={{fontSize: 'smaller'}} placement="bottomLeft" title="Like">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Like');
                      }}
                      shape="circle"
                      size="small"
                      type="text"
                      icon={<LikeOutlined />}
                    />{' '}
                    0
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip overlayInnerStyle={{fontSize: 'smaller'}} placement="bottomLeft" title="Dislike">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Dislike');
                      }}
                      shape="circle"
                      size="small"
                      type="text"
                      icon={<DislikeOutlined />}
                    />{' '}
                    0{' '}
                  </Tooltip>
                </Col>
                <Col>
                  <Tooltip overlayInnerStyle={{fontSize: 'smaller'}} placement="bottomLeft" title="Reply">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('LReplyike');
                      }}
                      shape="circle"
                      size="small"
                      type="text"
                      icon={<CommentOutlined />}
                    />{' '}
                    0 Replies
                  </Tooltip>
                </Col>
                <Col push={2} style={{zIndex: 10}}>
                  <Tooltip overlayInnerStyle={{fontSize: 'smaller'}} placement="bottomLeft" title="Gift User Tnb coins">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Tip');
                      }}
                      shape="circle"
                      size="small"
                      type="text"
                      icon={<Icon component={TnbLogo} />}
                    />
                    Tip
                  </Tooltip>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
    // </Link>
  );
};
