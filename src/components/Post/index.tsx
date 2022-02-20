import {FC, ReactNode, useEffect, useState, useCallback} from 'react';
import {useHistory} from 'react-router-dom';

import Avatar from 'antd/es/avatar';
import Button from 'antd/es/button';
import Card from 'antd/es/card';
import Col from 'antd/es/col';
import Row from 'antd/es/row';
import Tag from 'antd/es/tag';
import MoreOutlined from '@ant-design/icons/MoreOutlined';
import Typography from 'antd/es/typography';
import {decodePostMessage, getDefaultPfp} from 'utils';
import {format as formatDate, formatDistanceToNowStrict, compareAsc, sub as subtractFromDate} from 'date-fns';
import isUrl from 'is-url';
import Grid from 'antd/es/grid';
import ReactPlayer from 'react-player';
import Tooltip from 'antd/es/tooltip';

import {PaginatedTransactionEntry} from 'packages/thenewboston/src';

import CommentOutlined from '@ant-design/icons/CommentOutlined';
import LikeOutlined from '@ant-design/icons/LikeOutlined';
import DislikeOutlined from '@ant-design/icons/DislikeOutlined';

import {AccountNumber, CustomTags} from 'components';

import {ReactComponent as TnbLogo} from 'assets/tnb3.svg';
import Icon from '@ant-design/icons/lib/components/Icon';
import {Link} from 'react-router-dom';
import axios from 'axios';

import {PostData} from 'api';
import {useSelector} from 'react-redux';
import {getUserProfiles} from 'selectors';
import {nanoid} from '@reduxjs/toolkit';

const {useBreakpoint} = Grid;
export const Post: FC<{data: PostData; skeleton?: boolean}> = ({data: tx, skeleton}) => {
  // const history = useHistory();
  const screens = useBreakpoint();
  const [memoData, setMemoData] = useState<ReactNode[]>([]);
  const accountNumber = tx.block.sender;

  const profilePageUrl = `/accounts/${accountNumber}`;

  const profiles = useSelector(getUserProfiles);
  const profile = profiles[accountNumber];

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
            key={nanoid()}
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
            key={nanoid()}
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
          <Typography.Link key={nanoid()} href={url} target="_blank">
            {responseURL}
          </Typography.Link>
        );
      }
    } catch (e) {
      console.log({e});
      return <Typography.Text key={nanoid()}>{url}</Typography.Text>;
    }
  };

  const formatMemo = useCallback(async (memo: string) => {
    const decodedText = decodePostMessage(memo);
    const formattedWords: ReactNode[] = [];

    for (const paragraph of decodedText.split('\n')) {
      for (const word of paragraph.split(' ')) {
        let plaintext = '';
        const formattedParagraph: ReactNode[] = [];
        if (isUrl(word)) {
          formattedParagraph.push(
            <Typography.Text key={nanoid()} mark>
              {plaintext + ' '}
            </Typography.Text>,
          );

          formattedParagraph.push(await embedUrl(word));
        } else {
          plaintext = plaintext.concat(' ', word);
        }
      }
      formattedWords.push(
        paragraph ? (
          <Typography.Paragraph key={nanoid()} style={{margin: '0px'}}>
            {paragraph}
          </Typography.Paragraph>
        ) : (
          <br key={nanoid()} />
        ),
      );
    }

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
    if (tx.ipfs_data) {
      formatMemo(tx.ipfs_data.text).then((result) => {
        setMemoData(result);
      });
    } else {
      formatMemo(tx.memo ?? '').then((result) => {
        setMemoData(result);
      });
    }
  }, [tx, formatMemo]);

  return (
    // <Link to={`/${accountNumber}/post/${tx.block.balance_key}`} style={{zIndex: 0}}>
    <Card
      // bordered={false}
      size={'small'}
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
            <Avatar
              style={{background: 'rgba(0,0,0, 0.05)'}}
              src={profile?.pfp_url || getDefaultPfp(accountNumber)}
              alt="pfp"
            />
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
                    <Typography.Text strong>{profile?.display_name || accountNumber.slice(0, 4)}</Typography.Text>
                  </Link>
                </Col>
                <Col
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  style={{color: 'lightgray'}}
                >
                  <AccountNumber accountNumber={accountNumber} />
                </Col>
                <Col>
                  <CustomTags
                    type="gov"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
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
            <Col span={24} style={{fontSize: '15px'}}>
              {memoData}
            </Col>

            {/* {action} */}
            <Col>
              <Row gutter={20} align="middle" justify="space-between">
                {/* <Col style={{marginLeft: '-10px'}}>
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
                </Col> */}
                {/* <Col>
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
                </Col> */}
                {/* <Col>
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
                </Col> */}
                {/* <Col push={2} style={{zIndex: 10}}>
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
                </Col> */}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
    // </Link>
  );
};
