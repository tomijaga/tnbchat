import {FC} from 'react';

import Col from 'antd/es/col';

import Row from 'antd/es/row';
import Grid from 'antd/es/grid';

import MenuBar from './MenuBar';
import MobileMenuBar from './MobileMenuBar';
const {useBreakpoint} = Grid;

const Layout: FC = ({children}) => {
  const screens = useBreakpoint();
  console.log(screens);
  return (
    <Row justify="center" gutter={30} style={{padding: '0px', margin: '0px'}}>
      <Col xl={5} lg={4} md={5} sm={5} xs={0} span={0}>
        <MenuBar />
      </Col>
      <Col xl={11} lg={13} md={16} sm={19} xs={24} span={24} style={{padding: '0px'}}>
        <Row style={{minHeight: '100vh'}} align="top" justify="space-between">
          <Col span={24} style={{minHeight: 'calc(100vh - 50px)'}}>
            {children}
          </Col>

          <Col span={0} style={{position: 'sticky', bottom: '0px', maxHeight: '50px'}}>
            <MobileMenuBar />
          </Col>
        </Row>
      </Col>

      <Col
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
    </Row>
  );
};

export default Layout;
