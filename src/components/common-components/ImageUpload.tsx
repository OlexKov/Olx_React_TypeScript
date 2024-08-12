import { Badge } from 'antd'
import React from 'react'
import { FileType, getBase64, reorder } from '../../helpers/common-methods';
import Dragger from 'antd/es/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import SortedImage from './SortedImage';
import { ImageLoaderProps } from '../../models/Props';

const ImageUpload: React.FC<ImageLoaderProps> = ({ files, onChange = () => { } }) => {

  const props = {
    showUploadList: false,
    name: 'file',
    multiple: true,
    async onChange(info: any) {
      const { status } = info.file;
      if (status !== 'uploading') {
        for (let index = 0; index < info.fileList.length; index++) {
          if (!info.fileList[index].preview && !info.fileList[index].url) {
            info.fileList[index].preview = await getBase64(info.fileList[index].originFileObj as FileType)
          }
        }
        onChange(info.fileList);
      }
    },
    beforeUpload() { return false }
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }
    onChange(reorder(
      files,
      result.source.index,
      result.destination.index
    ));
  }

  const deleteImage = (uid: string) => {
    onChange(files?.filter(x => x.uid !== uid))
  }

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    "borderRadius": "10px",
    userSelect: 'none',
    padding: 10,
    margin: `5px`,
    background: isDragging ? 'darkgrey' : 'grey',
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver: boolean) => ({
    "borderRadius": "10px",
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: 15,
    overflow: 'auto',
  });

  return (
    <>
      <h6>Перше фото буде на обкладинці оголошення. Перетягніть, щоб змінити порядок фото.</h6>
      <div className='d-flex flex-column gap-2 border border-1 rounded-2 p-2'>
        <Dragger {...props} fileList={files}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Натисніть або перетягніть файл у цю область, щоб завантажити</p>
          <p className="ant-upload-hint">
            Підтримка одиночного або масового завантаження. Категорично заборонено завантажувати дані компанії чи інше
            заборонені файли.
          </p>
        </Dragger>
        {(files?.length || 0) > 0 &&
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  {files?.map((item, index) => (
                    <Draggable key={item.uid} draggableId={item.uid} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style
                          )}
                        >
                          {index === 0 ?
                            <Badge.Ribbon text="Основне" color="green">
                              <SortedImage item={item} deleteHandler={deleteImage} />
                            </Badge.Ribbon> :
                            <SortedImage item={item} deleteHandler={deleteImage} />}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>}
      </div>
    </>
  )
}

export default ImageUpload