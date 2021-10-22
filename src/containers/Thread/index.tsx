import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import Image from 'antd/es/image';
import Tabs from 'antd/es/tabs';
import Tooltip from 'antd/es/tooltip';

import Card from 'antd/es/card';
import Button from 'antd/es/button';

import Col from 'antd/es/col';
import Typography from 'antd/es/typography';
import {Post} from 'components';
import Row from 'antd/es/row';
import Grid from 'antd/es/grid';
import {getPost} from 'api';
import {mainnetBank, testnetBank} from 'api/node';
import {UserData} from 'types';
import {PaginatedTransactionEntry} from 'packages/thenewboston/src';

interface ThreadParam {
  balance_key: string;
}

const Thread = () => {
  const balanceKey = useParams<ThreadParam>().balance_key;
  const [mainPost, setMainPost] = useState<PaginatedTransactionEntry | null>(null);

  console.log({balanceKey, mainPost});
  useEffect(() => {
    getPost({balance_key: balanceKey}).then((result) => setMainPost(result));
  });
  return (
    <Row justify="center">
      <Col xl={11} lg={13} md={16} sm={19} xs={24} span={24}>
        <Row justify="center">
          <Col span={24}>{mainPost ? <Post data={mainPost}></Post> : 'Loading..'}</Col>

          <Col span={24}></Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Thread;
