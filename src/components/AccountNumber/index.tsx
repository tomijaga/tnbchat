import {CSSProperties, FC, useState} from 'react';
import Button from 'antd/es/button';
import Tooltip from 'antd/es/tooltip';
import Typography from 'antd/es/typography';
import {reduceAccNumber} from 'utils';

export const AccountNumber: FC<{accountNumber: string; style?: CSSProperties}> = ({accountNumber, style}) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <Tooltip
      title={
        <Typography.Text onClick={(e) => e?.stopPropagation()} style={{fontSize: 'smaller'}} copyable>
          {accountNumber}
        </Typography.Text>
      }
    >
      <Tooltip title="Copied" visible={isCopied}>
        <Button
          style={{...style, ...{color: 'secondary'}}}
          size="small"
          type="text"
          onClick={async (e) => {
            e?.stopPropagation();
            await navigator.clipboard.writeText(accountNumber);
            setIsCopied(true);

            setTimeout(() => {
              setIsCopied(false);
            }, 1000);
          }}
        >
          @{reduceAccNumber(accountNumber ?? '')}
        </Button>
      </Tooltip>
    </Tooltip>
  );
};
