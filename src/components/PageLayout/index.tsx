import {FC} from 'react';

import Col from 'antd/es/col';

import Row from 'antd/es/row';

export const PageLayout: FC<{showExtra?: boolean}> = ({children, showExtra = true}) => {
  return (
    <Row style={{minHeight: '100vh'}} align="top" justify="space-between">
      {showExtra ? (
        <>
          <Col xl={11} lg={13} md={16} sm={19} xs={24} span={24} style={{padding: '0px', minHeight: '100vh'}}>
            {children}
          </Col>
          <Col
            style={{minHeight: '100vh'}}
            //   xl={7} lg={7} md={0} span={0}
            xs={0}
            sm={5}
            span={0}
          >
            {/* 
          <Row
            style={{
              position: 'sticky',
              top: '0px',
            }}
          >
            <Col span={24}>
              <Row gutter={[30, 30]}>
                <Col span={24}>
                  <Input prefix={<SearchOutlined style={{color: 'rgba(0,0,0,.45)'}} />} />
                </Col>

                <Col span={24}>
                  <Card>- tnb data -</Card>
                </Col>

                <Col span={24}>
                  <Card>- tnb blog posts -</Card>
                </Col>
                <Col span={24}>
                  <Card>- Footer -</Card>
                </Col>
              </Row>
            </Col>
          </Row>
           */}
          </Col>
        </>
      ) : (
        <Col span={24} style={{padding: '0px', minHeight: '100vh'}}>
          {children}
        </Col>
      )}
    </Row>
  );
};
