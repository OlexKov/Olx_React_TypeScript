import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import React from 'react';
const BackButton:React.FC = ()=>{
   return(
      <Button shape="circle" onClick={() => window.history.back()} type="primary" icon={<ArrowLeftOutlined className='fs-4' />} />
)}
export default BackButton;