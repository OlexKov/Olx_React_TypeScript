import React from 'react'
import {  Image } from 'antd';
import { DeleteFilled } from '@ant-design/icons';
import { SortedImageProps } from '../../models/Props';

const SortedImage: React.FC<SortedImageProps> = ({ item, deleteHandler }) => {
    return (
        <div className='border border-1 rounded-2 p-1 position-relative'>
            <DeleteFilled onClick={() => deleteHandler(item.uid)} className='close' />
            <Image
                className='rounded-2'
                alt={item.uid}
                src={item.url || (item.preview as string)}
                preview={true}
                width={250}
                style={{ objectFit: "cover", aspectRatio: "16/10" }}
            />
        </div>
    )
}

export default SortedImage