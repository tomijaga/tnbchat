import {CSSProperties, FC, useState} from 'react';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import Typography from 'antd/es/typography';
import WalletOutlined from '@ant-design/icons/WalletOutlined';
import {shortenAddress} from 'utils';

export const AccountNumber: FC<{accountNumber: string; style?: CSSProperties}> = ({accountNumber, style}) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <Tooltip title={isCopied ? 'Copied' : <>Copy Wallet Address</>}>
      <Typography.Text
        style={{...style, cursor: 'pointer'}}
        code
        onClick={async (e) => {
          e?.stopPropagation();
          await navigator.clipboard.writeText(accountNumber);
          setIsCopied(true);

          setTimeout(() => {
            setIsCopied(false);
          }, 5000);
        }}
      >
        <WalletOutlined /> {shortenAddress(accountNumber ?? '')}
      </Typography.Text>
    </Tooltip>
  );
};
