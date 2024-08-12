import React from 'react'
import { AdvertViewProps } from '../../../../models/Props'
import { Tag } from 'antd';
import FavoriteButton from '../../../favorite-button';
import { EditOutlined } from '@ant-design/icons';
import { DateTime } from '../../../../helpers/DateTime';
import { imagesUrl } from '../../../../helpers/constants';

const HorisontalAdvertCard: React.FC<AdvertViewProps> = ({ advert, onEdit, onClick = () => { }, onFavoriteChange = () => { } }) => {
    const date = new DateTime(advert.date);
    const onCardEdit = (e: any) => {
        e.stopPropagation();
        if (onEdit) {
            onEdit(advert.id)
        }
    }
    return (
        <div className='d-flex gap-2 bg-white p-2 advert-view' onClick={() => onClick(advert.id)}>
            <img
                src={imagesUrl + "/200_" + advert.firstImage}
                alt={advert.firstImage}
                style={{
                    objectFit: "cover",
                    aspectRatio: "16/12",
                    height: 180,
                    borderRadius: 5
                }} />
            <div className='d-flex flex-column justify-content-between w-100 p-1'>
                <div className='d-flex flex-column gap-1'>
                    <div className='d-flex justify-content-between'>
                        <span className='fs-4' >{advert.title}</span>
                        <div style={{ marginBottom: 10 }} className='d-flex gap-0 flex-column'>
                            <span style={{ fontSize: 19, fontWeight: 'bold' }}>{advert.price === 0 ? 'Безкоштовно' : advert.price + ' грн.'} </span>
                            {advert.isContractPrice ? <span style={{ fontSize: 14, color: 'gray', fontWeight: 'lighter' }}>Договірна</span> : ''}
                        </div>
                    </div>
                    <Tag style={{
                        width: 'fit-content',
                        fontSize: 16,
                        fontWeight: 'lighter'
                        , padding: "2px 5px 2px 5px",
                        borderWidth: 0,
                        backgroundColor: 'lightgray'
                    }}>{advert.isNew ? 'Нове' : 'Вживане'}</Tag>
                </div>
                <div className='d-flex justify-content-between'>
                    <div style={{ fontSize: 13 }} className='d-flex  gap-2 text-start mt-auto'>
                        <span>{advert.areaName} обл. {advert.cityName} -</span>
                        {date.isToday
                            ? <span>Сьогодні о {date.getTime}</span>
                            : <span>{date.getDate}</span>}
                    </div>
                    {onEdit
                        ? <EditOutlined className='ms-3 fs-4 text-danger' onClick={onCardEdit} />
                        : <FavoriteButton advert={advert} onChange={onFavoriteChange} />
                    }
                </div>
            </div>
        </div>
    )
}

export default HorisontalAdvertCard