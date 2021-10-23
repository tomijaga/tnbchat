import Card from 'antd/es/card';
import Tag from 'antd/es/tag';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import Typography from 'antd/es/typography';
import {AccountNumber} from 'components';
import {getPfp} from 'utils';
import Grid from 'antd/es/grid';
import {FC} from 'react';
import Row from 'antd/es/row';
import Col from 'antd/es/col';

import {getUserAccount} from 'selectors';
import {UserAccount} from 'types';
import {useDispatch, useSelector} from 'react-redux';
import {switchUserAccount} from 'dispatchers/account';
import {message} from 'antd';

const {useBreakpoint} = Grid;

export const ManagedAccount: FC<{userAccount: UserAccount}> = ({
  userAccount: {account_number: accountNumber, username, testnet_balance, mainnet_balance},
}) => {
  const screens = useBreakpoint();
  const dispatch = useDispatch();
  const currAccount = useSelector(getUserAccount);

  const handleSwitchAccount = () => {
    dispatch(switchUserAccount(accountNumber));
    message.info(`Switched Account`);
  };

  return (
    <Card
      size="small"
      bordered={false}
      hoverable
      style={{backgroundColor: accountNumber === currAccount?.account_number ? 'rgba(0,0,0, 0.05)' : ''}}
      onClick={handleSwitchAccount}
    >
      {accountNumber === currAccount?.account_number && (
        <Tag color="green" style={{position: 'absolute', top: '0px', left: '2px'}}>
          <CheckOutlined />
        </Tag>
      )}

      <Row gutter={10} align="middle" style={{fontSize: screens.sm ? 'small' : 'small'}}>
        <Col>
          <img width={screens.sm ? '50px' : '30px'} src={getPfp(accountNumber)} alt="profile" />
        </Col>

        <Col span={7} sm={7} xs={10}>
          <Row justify="center">
            <Col span={24}>
              <Typography.Text strong>{username}</Typography.Text>
            </Col>
            <Col span={24}>
              <AccountNumber accountNumber={accountNumber} style={{padding: '0px', fontSize: 'small'}} />
            </Col>
          </Row>
        </Col>
        <Col xs={{push: 2, span: 9}} sm={{push: 3}} md={{push: 4}} span={11}>
          <Row>
            <Col span={24}>
              <Typography.Text strong>{(mainnet_balance ?? 0).toLocaleString()}</Typography.Text>{' '}
              {screens.sm ? 'Mainnet Coins' : 'Mainnet'}
            </Col>
            <Col span={24}>
              <Typography.Text strong>{(testnet_balance ?? 0).toLocaleString()}</Typography.Text>{' '}
              {screens.sm ? 'Testnet Coins' : 'Testnet'}
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
