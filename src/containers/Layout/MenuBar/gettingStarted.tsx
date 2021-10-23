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
            This app is currently running on thenewboston testnet so you will need testnet coins to make a post.
          </Typography.Paragraph>

          <Typography.Paragraph>
            To get the testnet coins copy your account number and follow the outlined instructions.
          </Typography.Paragraph>
          <Typography.Paragraph>
            <ul>
              <li>
                Make a{' '}
                <Typography.Link
                  target="_blank"
                  href="https://twitter.com/intent/tweet?url=&text=Requesting%20faucet%20funds%20into%20[Account%20Number]%20on%20the%20%23TNBFaucet%20test%20network."
                >
                  tweet{' '}
                </Typography.Link>
                with your account number and the faucet hashtag.
              </li>
              <li>
                Copy the link of the tweet and paste it on the{' '}
                <Typography.Link target="_blank" href="https://tnbexplorer.com/testnet/faucet">
                  tnbexplorer faucet page{' '}
                </Typography.Link>
              </li>
            </ul>
          </Typography.Paragraph>
        </Col>
      </Row>
    </Modal>
  );
};

export default GettingStarted;
