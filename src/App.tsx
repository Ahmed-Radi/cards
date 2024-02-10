import { ChangeEvent, FormEvent, useState } from 'react';
import ProductCard from './Components/ProductCard';
import { categories, colors, formInputsList, productList } from './data';
import Modal from './Components/ui/Modal';
import Button from './Components/ui/Button';
import Input from './Components/ui/Input';
import { ICategory, IErrors, IProduct } from './interfaces';
import { productValidation } from './validation';
import ErrorMessage from './Components/ErrorMessage';
import CircleColor from './Components/ui/CircleColor';
import { v4 as uuid } from "uuid";
import Select from './Components/ui/Select';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const defaultProductObj = {
    title: '',
    description: '',
    price: '',
    imageURL: '',
    colors: [],
    category: {
      name: '',
      imageURL: '',
    }
  }
  const initErrors = {
    title: '',
    description: '',
    price: '',
    imageURL: '',
    colors: '',
  }
  /** State */
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [product, setProduct] = useState<IProduct>(defaultProductObj);
  const [productToEdit, setProductTodEdit] = useState<IProduct>(defaultProductObj);
  const [products, setProducts] = useState<IProduct[]>(productList);
  const [errors, setErrors] = useState<IErrors>(initErrors);
  const [tempColor, setTempColor] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [productIdToRemove, setProductIdToRemove] = useState<string>();
  /** Handler */
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);
  const closeEditModal = () => setIsOpenEditModal(false);
  const openEditModal = () => setIsOpenEditModal(true);
  const closeConfirmModal = () => setIsOpenConfirmModal(false);
  const openConfirmModal = () => setIsOpenConfirmModal(true);
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setProduct({
      ...product,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: '',
    })
  };
  const onChangeEditHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setProductTodEdit({
      ...productToEdit,
      [name]: value,
    })
    setErrors({
      ...errors,
      [name]: '',
    })
  }
  const onCancel = () => {
    setProduct(defaultProductObj);
    closeModal();
  };
  const onRemove = (id: string) => {
    setProductIdToRemove(id)
    openConfirmModal();
  };
  const removeProduct = ()  => {
    setProducts((prev) => (
      prev.filter((product) => product.id !== productIdToRemove))
    )
    toast.success('Product has been removed successfully!')
    setProductIdToRemove(undefined);
    closeConfirmModal();
  };
  const onEdit = (id: string) => {
    const product = products.find((product) => product.id === id);
    if(!product) return
    setProductTodEdit(product);
    openEditModal();
  };
  const submitEditHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { title, description, imageURL, price } = productToEdit;
    const errorsObj: IErrors = productValidation({
      title: title,
      description: description,
      imageURL: imageURL,
      price: price,
      colors: tempColor.concat(productToEdit?.colors),
    })
    const hasErrorMessage = Object.values(errorsObj).some((value) => value === '') && Object.values(errorsObj).every((value) => value === '')

    if (!hasErrorMessage) {
      setErrors(errorsObj);
      return;
    }

    setProducts((prev) => {
      const newProducts = prev.map((product) => {
        if(product.id === productToEdit.id) {
          return {
            ...productToEdit,
            colors: tempColor.concat(productToEdit?.colors),
          }
        }
        return product;
      })
      return newProducts;
    });

    toast.success('Product has been updated successfully!')
    setProductTodEdit(defaultProductObj);
    setTempColor([]);
    closeEditModal();
  };
  const submitHandler = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const { title, description, imageURL, price } = product
    const errorsObj: IErrors = productValidation({
      title: title,
      description: description,
      imageURL: imageURL,
      price: price,
      colors: tempColor,
    })
    const hasErrorMessage = Object.values(errorsObj).some((value) => value === '') && Object.values(errorsObj).every((value) => value === '')

    if (!hasErrorMessage) {
      setErrors(errorsObj);
      return;
    }

    setProducts((prev) => [{
      ...product,
      id: uuid(),
      colors: tempColor,
      category: selectedCategory,
    }, ...prev]);

    toast.success('Product has been added successfully!')
    setProduct(defaultProductObj);
    setTempColor([]);
    setSelectedCategory(categories[0]);
    closeModal();
  };
  /** ReRender */
  const renderProductList = () => {
    // ** use this way to render list of components
    // ** instead of using map inside return
    // ** if you want to add some logic
    return products.map((product) => <ProductCard key={product.id} product={product} onEdit={onEdit} onRemove={onRemove} />)
  }
  const renderFormInputList = formInputsList.map((input) => (
    <div key={input.id} className='flex flex-col'>
      <label htmlFor={input.id} className='mb-[3px] text-sm font-medium text-gray-700'>
        {input.label}
      </label>
      <Input
        id={input.id}
        type={input.type}
        name={input.name}
        placeholder={input.name}
        value={product[input.name]}
        onChange={onChangeHandler}
      />
      <ErrorMessage message={errors[input.name]} />
    </div>
  ))
  const renderEditFormInputList = formInputsList.map((input) => (
    <div key={input.id} className='flex flex-col'>
      <label htmlFor={input.id} className='mb-[3px] text-sm font-medium text-gray-700'>
        {input.label}
      </label>
      <Input
        id={input.id}
        type={input.type}
        name={input.name}
        placeholder={input.name}
        value={productToEdit[input.name]}
        onChange={onChangeEditHandler}
      />
      <ErrorMessage message={errors[input.name]} />
    </div>
  ))
  const productColors = colors.map((color: string) => {
    return <CircleColor key={color} color={color} onClick={() => {
      if(tempColor.includes(color) || productToEdit.colors?.includes(color)) {
        setTempColor((prev) => prev.filter((item) => item !== color));
        setProductTodEdit((prev) => ({...prev, colors: prev.colors.filter((item) => item !== color)}));
        return;
      }
      setTempColor((prev) =>[...prev, color])
    }} />
  })

  return (
    <main className='container'>
      <Button
        onClick={openModal}
        className="block bg-indigo-700 hover:bg-indigo-800 mx-auto my-10 px-10 font-medium"
        width="w-fit"
      >
        Build a Product
      </Button>
      <div className='m-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 p-2 rounded-md'>
        {renderProductList()}
      </div>
      <Modal title={'Add a new product'} isOpen={isOpen} closeModal={closeModal}>
        <form className='space-y-2' onSubmit={submitHandler}>
          {renderFormInputList}
          <Select selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          <div className="flex flex-wrap items-center my-4 space-x-1">
            {productColors}
          </div>
          <ErrorMessage message={errors["colors"]} />
          <div className="flex flex-wrap items-center my-4 space-x-1">
            {tempColor.map((color: string) => (
              <span
                className='p-1 mr-1 mb-1 rounded-md text-sm text-white'
                style={{ backgroundColor: color }}
                key={color}
              >
                {color}
              </span>
            ))}
          </div>
          <div className='flex items-center space-x-3'>
            <Button
              type="submit"
              onClick={openModal}
              className="bg-indigo-700 hover:bg-indigo-800 rounded-md px-4 py-2 text-sm font-medium text-white"
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
            >
              Close
            </Button>
          </div>
        </form>
      </Modal>
      {/* EDIT PRODUCT MODAL */}
      <Modal title={'Edit product'} isOpen={isOpenEditModal} closeModal={closeEditModal}>
        <form className='space-y-2' onSubmit={submitEditHandler}>
          {renderEditFormInputList}
          <Select selectedCategory={productToEdit.category} setSelectedCategory={(value: ICategory) => setProductTodEdit(prev =>({...prev, category: value}))} />
          <div className="flex flex-wrap items-center my-4 space-x-1">
            {productColors}
          </div>
          <ErrorMessage message={errors["colors"]} />
          <div className="flex flex-wrap items-center my-4 space-x-1">
            {tempColor.concat(productToEdit?.colors)?.map((color: string) => (
              <span
                className='p-1 mr-1 mb-1 rounded-md text-sm text-white'
                style={{ backgroundColor: color }}
                key={color}
              >
                {color}
              </span>
            ))}
          </div>
          <div className='flex items-center space-x-3'>
            <Button
              type="submit"
              className="bg-indigo-700 hover:bg-indigo-800 rounded-md px-4 py-2 text-sm font-medium text-white"
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={closeEditModal}
              className="bg-[#f5f5fa] hover:bg-gray-300 !text-black"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* DELETE PRODUCT CONFIRM MODAL */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Product from your Store?"
        description="Deleting this product will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button className="bg-[#c2344d] hover:bg-red-800" onClick={removeProduct}>Yes, remove</Button>
          <Button className="bg-[#f5f5fa] hover:bg-gray-300 !text-black" onClick={closeConfirmModal}>
            Cancel
          </Button>
        </div>
      </Modal>
      <Toaster />
    </main>
  )
}

export default App
