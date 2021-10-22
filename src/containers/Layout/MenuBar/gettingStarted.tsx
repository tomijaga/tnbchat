import {FC} from 'react';
import Col from 'antd/es/col';

import Modal from 'antd/es/modal';
import Row from 'antd/es/row';
import Typography from 'antd/es/typography';

const GettingStarted: FC<{visible: boolean; onClose: () => void}> = ({visible, onClose}) => {
  return (
    <Modal onCancel={onClose} title="Get Testnet Coins" footer={null} centered visible={visible}>
      <Row justify="center">
        <Col>
          <Typography.Paragraph>
            This chat app is currently running on thenewboston testnet so you will need testnet coins to make a post.
          </Typography.Paragraph>

          <Typography.Paragraph>
            To get the testnet coins copy the account number you want to sent the coins to, go to the tnbexplorer faucet
            page and follow the outlined instructions.
          </Typography.Paragraph>
          <Typography.Paragraph>
            Make a <Typography.Link>tweet</Typography.Link>
            with your account number and the faucet hashtag. Copy the link of the tweet and paste it on the tnbexplorer
            faucet page
          </Typography.Paragraph>
        </Col>
      </Row>
    </Modal>
  );
};

export default GettingStarted;
