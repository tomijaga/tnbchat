import React, {FC} from 'react';
import Card from 'antd/es/card';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Image from 'antd/es/image';
import Typography from 'antd/es/typography';
import Badge from 'antd/es/badge';
import Avatar from 'antd/es/avatar';

import {MessageData} from 'api/message';
import {getDefaultPfp, shortenAddress} from 'utils';
import {useSelector} from 'react-redux';
import {getUserProfiles} from 'selectors';

export const MessageInfoCard: FC<{
  recipient: string;
  latestMessage?: string;
  timestamp?: string;
  unseenMessages: number;
  onClick?: (event: any) => void;
}> = ({recipient, onClick, latestMessage, timestamp, unseenMessages}) => {
  const profiles = useSelector(getUserProfiles);
  const profile = profiles[recipient];

  return (
    <Card onClick={onClick} hoverable bordered={false} size="small">
      <Row gutter={[10, 10]}>
        <Col span={4} flex={'70px'}>
          <Badge size="small" title="new messages" count={unseenMessages}>
            <Avatar shape="square" src={profile?.pfp_url || getDefaultPfp(recipient)} />
          </Badge>
        </Col>

        <Col span={20}>
          <Row justify="space-between">
            <Col>
              <Typography.Text style={{wordBreak: 'break-all'}} strong>
                {shortenAddress(recipient)}
              </Typography.Text>
            </Col>

            <Col>{timestamp ? new Date(timestamp).toLocaleDateString() : null}</Col>
            <Col span={24} style={{textAlign: 'left'}}>
              <Typography.Text
                ellipsis
                style={{
                  wordBreak: 'break-all',
                  maxWidth: '200px',
                  color: unseenMessages ? 'Highlight' : 'currentcolor',
                }}
              >
                {latestMessage}
              </Typography.Text>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
