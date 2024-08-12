import React from 'react'
import { AdvertViewProps } from '../../../../models/Props'
import { Card } from 'react-bootstrap';
import FavoriteButton from '../../../favorite-button';
import { DateTime } from '../../../../helpers/DateTime';
import { imagesUrl } from '../../../../helpers/constants';

const VipAdvertCard: React.FC<AdvertViewProps> = ({ advert, onClick = () => { } }) => {
    const date = new DateTime(advert.date);
    return (
        <Card className='advert-view h-100' onClick={() => onClick(advert.id)}>
            <Card.Img src={imagesUrl + "/200_" + advert.firstImage} alt={advert.firstImage} style={{ objectFit: "cover", aspectRatio: "16/12" }} />
            <Card.Body>
                <div className=' h-100 d-flex flex-column '>
                    <div className='d-flex flex-column text-start'>
                        <div className='d-flex justify-content-between text-start '>
                            <h6 className=' fw-light text-wrap'>{advert.title}</h6>
                            <FavoriteButton advert={advert} />
                        </div>
                        <div style={{marginBottom:10}} className='d-flex gap-0 flex-column'>
                            <span style={{fontSize:19}}>{advert.price === 0 ? 'Безкоштовно' : advert.price + ' грн.'} </span>
                            {advert.isContractPrice ? <span style={{fontSize:14,color:'gray' ,fontWeight:'lighter'}}>Договірна</span> : ''}
                        </div>
                    </div>
                    <div className='d-flex flex-column text-start mt-auto'>
                        <span>{advert.cityName}</span>
                        {date.isToday
                            ? <span>Сьогодні о {date.getTime}</span>
                            : <span>{date.getDate}</span>}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default VipAdvertCard