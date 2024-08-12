import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Error from '../Error'
import { AdvertModel } from '../../models/AdvertModel';
import { advertService } from '../../services/advertService';
import { Avatar, Carousel, Col, Image, Row, Spin, Tag } from 'antd';
import { ImageModel } from '../../models/ImageModel';
import Search from '../search';
import { AdvertSearchModel } from '../../models/FilterModel';
import { getQueryString } from '../../helpers/common-methods';
import { filterService } from '../../services/filterService';
import { FilterValueModel } from '../../models/FilterValueModel';
import FavoriteButton from '../favorite-button';
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { IUser } from '../../models/User';
import { accountService } from '../../services/accountService';
import { DateTime } from '../../helpers/DateTime';
import { imagesUrl } from '../../helpers/constants';


const AdvertPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [advert, setAdvert] = useState<AdvertModel>()
  const [advertFilterValues, setAdvertFilterValues] = useState<FilterValueModel[]>([])
  const [images, setImages] = useState<ImageModel[]>([])
  const id = Number(searchParams.get("id")) || undefined
  const navigate = useNavigate()
  const [error, setError] = useState<boolean>(false)
  const [showPhone, setShowPhone] = useState<boolean>(false)
  const [user, setUser] = useState<IUser>();
  const [advertDate,setAdvertDate] = useState<DateTime>()
  const [usertDate,setUserDate] = useState<DateTime>()

  useEffect(() => {
    if (!id) {
      setError(true);
      return
    }
    (async () => {
      const [images, filters, advert] = await Promise.all([
        advertService.getImages(id),
        filterService.getAdvertFilterValues(id),
        advertService.getById(id)
      ]);

      if (advert?.status !== 200
        || images?.status !== 200
        || filters?.status !== 200) {
        setError(true);
        return
      }
      setAdvert(advert.data);
      setAdvertDate( new DateTime(advert.data.date))
      setImages(images.data.sort((a, b) => a.priority - b.priority));
      setAdvertFilterValues(filters.data);
      const user = await accountService.getUser(advert.data.userId);
      if (user.status === 200) {
        setUser(user.data);
        setUserDate(new DateTime(user.data.registerDate))
      }
    })()
  }, [id])

  const onSearch = (searchFilter: AdvertSearchModel) => {
    navigate(`/main-search` + getQueryString(searchFilter))
  }

  return (
    <div className='my-5'>
      <Search isFilter={false} onSearch={onSearch} />
      <Spin fullscreen size='large' spinning={(!advert && !error)} />
      {advert
        && <>
          <div className='d-flex gap-2 align-content-start w-70 mx-auto my-5' >
            <Row gutter={[12, 20]}>
              <Col
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 15 }}
                xl={{ span: 16 }}
                xxl={{ span: 16 }}
                key={'col1'}
              >
                <div className='d-flex flex-column gap-3 '>
                  <div className="p-4 rounded  bg-white">
                    <Carousel
                      arrows
                      infinite={true}
                      draggable={false} >
                      {images.map(x =>
                        <div key={x.id} className='text-center' >
                          <Image
                            
                            height={600}
                            src={imagesUrl + "/1200_" + x.name}
                            alt={x.name}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                      )}
                    </Carousel>
                  </div>
                  <div className="d-flex flex-column  p-4 rounded  bg-white">
                    <div className='d-flex flex-wrap gap-2'>
                      {advertFilterValues.map(x =>
                        <Tag
                          key={x.id}
                          style={{
                            fontSize: 16,
                            padding: 8,
                            background: 'white',
                            borderColor: 'black'
                          }}>
                          {x.filterName}: {x.value}
                        </Tag>)}
                    </div>
                    <hr />
                    <h3>Опис</h3>
                    <p>{advert?.description}</p>
                    <hr />
                    <span style={{ fontSize: 13 }}>ID: {advert?.id}</span>
                  </div>
                </div>
              </Col>
              <Col
                sm={{ span: 24 }}
                md={{ span: 24 }}
                lg={{ span: 9 }}
                xl={{ span: 8 }}
                xxl={{ span: 8 }}
                key={'col2'}
              >
                <div className='d-flex flex-column gap-3 '>
                  <div className="d-flex flex-column p-4 rounded  bg-white">
                    <div className='d-flex text-start justify-content-between'>
                      <div style={{ fontSize: 13 }} className='d-flex gap-2 flex-wrap text-start'>
                        <span >{advert.areaName} обл. {advert.cityName} -</span>
                        {advertDate?.isToday
                          ? <span>Сьогодні о {advertDate?.getTime}</span>
                          : <span>{advertDate?.getDate}</span>}
                      </div>
                      <FavoriteButton advert={advert} />
                    </div>
                    <span className='fs-5 my-4 w-90 text-wrap'>{advert.title}</span>
                    <div className=' d-flex flex-column'>
                      <span className='fs-4 fw-bold ' style={{ fontSize: 19 }}>{advert.price === 0 ? 'Безкоштовно' : advert.price + ' грн.'} </span>
                      {advert.isContractPrice ? <span style={{ fontSize: 14, color: 'gray', fontWeight: 'lighter' }}>Договірна</span> : ''}
                    </div>
                    <div className='d-flex mt-4 flex-column gap-3'>
                      <button className='black-button '>Повідомлення</button>
                      <button onClick={() => { if (!showPhone) setShowPhone(true) }} className='border-button'>{!showPhone ? "Показати телефон" : <span><PhoneOutlined /> {advert.phoneNumber}</span>}</button>
                    </div>
                  </div>

                  <div className="p-4 rounded  bg-white w-100">
                    <h5 className='mb-4'>Користувач</h5>
                    <div className='d-flex gap-3 align-content-center align-items-center'>
                      <Avatar size={60} src={user? imagesUrl + '/400_' + user?.avatar :''} />
                      <div className='d-flex flex-column'>
                        <span style={{ fontSize: 22 }}>{advert.contactPersone}</span>
                        <span style={{ fontSize: 16 }}>На Olx з {usertDate?.getDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded  bg-white w-100">
                    <h5 className='mb-4'>Місцезнаходження</h5>
                    <div className='d-flex gap-3 align-content-center align-items-baseline'>
                      <EnvironmentOutlined className='fs-3' />
                      <div className='d-flex flex-column'>
                        <span style={{ fontSize: 22 }}>{advert.cityName}</span>
                        <span style={{ fontSize: 16 }}>{advert.areaName} обл.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </>}
      {(!id || error) && <Error
        status="500"
        title="Упс...виникла помилка"
        subTitle="Помилка звантаження інформації"
      />
      }
    </div>

  )
}

export default AdvertPage