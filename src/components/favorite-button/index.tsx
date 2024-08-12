import React, { useEffect, useState } from 'react'
import { storageService } from '../../services/storangeService'
import user from '../../stores/UserStore'
import { accountService } from '../../services/accountService'
import { message } from 'antd'
import { HeartFilled, HeartOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react'
import { FavoriteButtonProps } from '../../models/Props'

const FavoriteButton: React.FC<FavoriteButtonProps> = observer(({ advert, onChange = () => { } }) => {
    const [favorite, setFavorite] = useState<boolean>(false)

    useEffect(() => {
        if (user.isAuthorized) {
            setFavorite(advert?.isFavorite || false);
        }
        else {
            if (storageService.isLocalFavorites() && advert) {
                setFavorite(storageService.getLocalFavorites().find(x=>x.id === advert.id) !== undefined)
            }
            else
                setFavorite(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.isAuthorized, advert])

    const favoriteClick = async (e: any) => {
        e.stopPropagation();
        setFavorite(!favorite)
        if (advert) {
            if (user.isAuthorized) {
                const result = await accountService.toggleFavorite(advert.id)
                if (result.status !== 200) {
                    setFavorite(!favorite)
                    return
                }
            }
            else {
                storageService.toggleFavorites(({id:advert.id,price:advert.price,date:advert.date}))
            }
        }
        onChange(advert?.id,!favorite)
        message.success(favorite ? 'Оголошення видалено з обраних' : 'Оголошення додано до обраних')
    }
    return (
        <>
            {favorite
                ? <HeartFilled className=' ms-3 fs-5 text-danger' onClick={favoriteClick} />
                : <HeartOutlined className=' ms-3 fs-5' onClick={favoriteClick} />}
        </>

    )
})

export default FavoriteButton