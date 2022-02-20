import React, {FC} from 'react';
import Card from 'antd/es/card';
export const Message: FC<{received?: boolean}> = ({children, received}) => {
  const radius = '20px';
  return (
    <Card
      size="small"
      style={{
        borderBottomRightRadius: radius,
        borderBottomLeftRadius: radius,

        borderTopRightRadius: received ? radius : '0px',
        borderTopLeftRadius: received ? '0px' : radius,

        width: 'auto',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </Card>
  );
};
