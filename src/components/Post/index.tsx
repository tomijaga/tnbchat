import {FC, ReactNode, useEffect, useState, useCallback} from 'react';
// import {useHistory} from 'react-router-dom';

import Avatar from 'antd/es/avatar';
// import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Tag from 'antd/es/tag';
// import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Typography from 'antd/es/typography';
import {decodePostMessage, getPfp} from 'utils';
import {format as formatDate, formatDistanceToNowStrict, compareAsc, sub as subtractFromDate} from 'date-fns';
import isUrl from 'is-url';
import Grid from 'antd/es/grid';
// import ReactPlayer from 'react-player';
import Tooltip from 'antd/es/tooltip';

import {PaginatedTransactionEntry} from 'packages/thenewboston/src';

// import CommentOutlined from '@ant-design/icons/CommentOutlined';
// import LikeOutlined from '@ant-design/icons/LikeOutlined';
// import DislikeOutlined from '@ant-design/icons/DislikeOutlined';

import {AccountNumber} from 'components';

// import {ReactComponent as TnbLogo} from 'assets/tnb3.svg';
// import Icon from '@ant-design/icons/lib/components/Icon';
import {Link} from 'react-router-dom';
import axios from 'packages/thenewboston/node_modules/axios';

const {useBreakpoint} = Grid;
export const Post: FC<{data: PaginatedTransactionEntry}> = ({data: tx}) => {
  // const history = useHistory();
  const screens = useBreakpoint();
  const [memoData, setMemoData] = useState<ReactNode[]>([]);
  const profilePageUrl = `/accounts/${tx.block.sender}`;

  const embedUrl = async (url: string) => {
    try {
      const urlData = await axios.get(url);

      const {
        headers: {'content-type': contentType},
        request: {responseURL},
      } = urlData;
      if (contentType.includes('image')) {
        return (
          <img
            style={{
              width: '300px',
              height: '300px',
              objectFit: 'scale-down',
            }}
            alt={responseURL}
            src={responseURL}
          />
        );
      } else if (contentType.includes('video')) {
        return (
          <iframe
            width="300px"
            height="300px"
            src={responseURL}
            title="video Player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      } else {
        return (
          <Typography.Link href={url} target="_blank">
            {responseURL}
          </Typography.Link>
        );
      }
    } catch {
      return <Typography.Text>{url}</Typography.Text>;
    }
  };

  const formatMemo = useCallback(async (memo: string) => {
    const decodedText = decodePostMessage(memo);
    const formattedWords: ReactNode[] = [];

    let paragraph = '';

    for (const word of decodedText.split(' ')) {
      if (word.includes('\n')) {
        const splitWords = word.split('\n');
        for (const splitWord of splitWords) {
          if (splitWord !== splitWords[splitWords.length - 1]) {
            formattedWords.push(<Typography.Paragraph>{paragraph + splitWord}</Typography.Paragraph>);
            paragraph = '';
          } else {
            paragraph = splitWord;
          }
        }
      } else {
        if (isUrl(word)) {
          // console.log(word, 'is Url');
          formattedWords.push(<Typography.Text>{paragraph + ' '}</Typography.Text>);
          formattedWords.push(await embedUrl(word));

          paragraph = ' ';
        } else {
          paragraph = paragraph.concat(' ', word);
        }
      }
    }

    formattedWords.push(<Typography.Text>{paragraph}</Typography.Text>);
    return formattedWords;
  }, []);

  const formatDateOnPost = () => {
    // If the date is more than 1 day
    const postsDate = new Date(tx.block.modified_date);

    if (compareAsc(subtractFromDate(new Date(Date.now()), {days: 1}), postsDate) === 1) {
      if (compareAsc(subtractFromDate(new Date(Date.now()), {years: 1}), postsDate) === 1) {
        return formatDate(postsDate, 'MMM d, yyyy');
      }
      return formatDate(postsDate, 'MMM d');
    }

    return formatDistanceToNowStrict(postsDate)
      .replaceAll(/hours|hour/gi, 'h')
      .replaceAll(/minutes|minute/gi, 'm')
      .replaceAll(/seconds|second/gi, 's')
      .replaceAll(' ', '');
  };

  useEffect(() => {
    formatMemo(tx.memo ?? '').then((result) => {
      setMemoData(result);
    });
  }, [tx, formatMemo]);

  return (
    // <Link to={`/${tx.block.sender}/post/${tx.block.balance_key}`} style={{zIndex: 0}}>
    <Card
      size={screens.xs ? 'small' : 'default'}
      id="post"
      onClick={(e) => {
        // history.push(`/posts/${tx.block.balance_key}`);
      }}
    >
      <Row gutter={10}>
        <Col flex={'32px'}>
          <Link
            onClick={(e) => {
              e.stopPropagation();
            }}
            to={profilePageUrl}
          >
            <Avatar style={{background: 'rgba(0,0,0, 0.05)'}} src={getPfp(tx.block.sender)} alt="pfp" />
          </Link>
        </Col>
        <Col style={{width: 'calc(100% - 50px )'}}>
          <Row gutter={screens.xs ? [5, 5] : [10, 10]} justify="space-between" align="top" style={{textAlign: 'left'}}>
            <Col span={16}>
              <Row gutter={10} align="bottom">
                <Col>
                  <Link
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    to={profilePageUrl}
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
                  <AccountNumber accountNumber={tx.block.sender} />
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
            <Col
              //  md={6} sm={7}
              xs={{flex: '100px'}}
            >
              <Row align="top" justify="space-between">
                <Col
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{color: 'lightgray'}}
                >
                  <Tooltip
                    overlayInnerStyle={{fontSize: 'smaller'}}
                    placement="bottom"
                    title={formatDate(new Date(tx.block.modified_date), "h':'m aa '⁃' MMM d, yyyy")}
                  >
                    <Typography.Text style={{fontSize: 'small'}}>{formatDateOnPost()}</Typography.Text>
                  </Tooltip>
                </Col>
                {/* <Col>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    shape="circle"
                    size="small"
                    type="text"
                    icon={<MoreOutlined />}
                  />
                </Col> */}
              </Row>
            </Col>
            <Col span={24}>{memoData}</Col>

            {/* {action} */}
            <Col>
              {/* <Row gutter={20} align="middle" justify="space-between">
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
            */}
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
    // </Link>
  );
};
