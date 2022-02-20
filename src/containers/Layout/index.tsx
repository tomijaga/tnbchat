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
      <Col xl={18} lg={20} md={19} sm={19} xs={24} span={24} style={{padding: '0px'}}>
        {children}
      </Col>

      <Col span={0} style={{position: 'sticky', bottom: '0px', maxHeight: '50px'}}>
        <MobileMenuBar />
      </Col>
    </Row>
  );
};

export default Layout;
