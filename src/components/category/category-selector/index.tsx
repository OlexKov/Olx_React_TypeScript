import { Button, Col, Modal, Row } from "antd"
import CategoryView from "../category-view-h"
import { useEffect, useState } from "react";
import { CategoryModel } from "../../../models/CategoryModel";
import { categoryService } from "../../../services/categoryService";
import { CategorySelectorProps } from "../../../models/Props";

const CategorySelector: React.FC<CategorySelectorProps> = ({ categoryId, onChange = () => { } }) => {
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    useEffect(() => {
        (async () => {
            var result = await categoryService.getAll();
            if (result.status === 200) {
                setCategories(result.data)
            }
        })()
    }, [])

    const showModal = () => {
        setIsCategoryModalOpen(true);
    };

    const handleClick = (id: number) => {
        setIsCategoryModalOpen(false);
        onChange(id)
    };

    const handleClose = () => {
        setIsCategoryModalOpen(false);
    };
    return (
        <>
            <div className={`${categoryId ? '' : 'p-4'} gap-3  rounded-2 d-inline-flex bg-secondary-subtle`}>
                {categoryId ? <CategoryView category={categories.find(x=>x.id === categoryId)} /> : <h5>Оберіть категорію</h5>}
                <Button className='fs-6 align-self-center' onClick={showModal} type='link'>Змінити</Button>
            </div>
            <Modal
                centered
                closable
                title={<h4>Категорії</h4>}
                open={isCategoryModalOpen}
                onClose={handleClose}
                onCancel={handleClose}
                width={'80%'}
                okButtonProps={{ hidden: true }} >

                <Row className='p-3' gutter={[16, 16]}>
                    {categories && categories.map((x, index) =>
                        <Col
                            sm={{ span: 16 }}
                            md={{ span: 10 }}
                            lg={{ span: 8 }}
                            xl={{ span: 6 }}
                            key={index}>
                            <div className='category-view rounded-3'>
                                <CategoryView category={x} onClick={ handleClick} />
                            </div>

                        </Col>
                    )}
                </Row>
            </Modal>
        </>
    )
}

export default CategorySelector