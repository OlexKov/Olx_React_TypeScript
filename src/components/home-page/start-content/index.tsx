import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'
import CategoryViewVertical from '../../category/category-view-v'
import VipAdvertCard from '../../advert/advert-cards/vip-card'
import { StartContentProps } from '../../../models/Props'
import { AdvertModel } from '../../../models/AdvertModel'
import { advertService } from '../../../services/advertService'
import { useNavigate } from 'react-router-dom'

const StartContent: React.FC<StartContentProps> = ({ categories, onCategorySelect = () => { } }) => {
  const [vipAdverts, setVipAdverts] = useState<AdvertModel[]>();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const vips = await advertService.getRandomVip(12);
      if (vips?.status === 200)
        setVipAdverts(vips.data)
    })()
  }, [])
  return (
    <>
      <div className='white-container my-5'>
        <span className='mx-auto py-4 fw-bold fs-2'>Розділи на сервісі OLX</span>
        <Row className='p-3 w-75 mx-auto'>
          {categories && categories.map((x, index) =>
            <Col
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
              xxl={{ span: 3 }}
              key={index}>
              <CategoryViewVertical category={x} key={x.id} onClick={() => { onCategorySelect(x.id || undefined) }} />
            </Col>
          )}
        </Row>
      </div>
      <div className='my-5 text-center'>
        <h3 className='py-4 fw-bold fs-2'>VIP оголошення</h3>
        <Row className='p-3 w-75 mx-auto' gutter={[10, 10]}>
          {vipAdverts && vipAdverts.map((x, index) =>
            <Col
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
              xl={{ span: 6 }}
              key={index}>
              <VipAdvertCard key={x.id} onClick={(advertId: number) => navigate(`/advert?id=${advertId}`)} advert={x} />
            </Col>
          )}
        </Row>
      </div>
    </>
  )
}

export default StartContent