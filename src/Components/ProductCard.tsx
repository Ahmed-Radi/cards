import Image from "../Image";
import { IProduct } from "../interfaces";
import { numberWithCommas, textSlicer } from "../utils/functions";
import Button from "./ui/Button";
import CircleColor from "./ui/CircleColor";

interface IProductCard {
  product: IProduct;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const ProductCard = ({ product, onEdit, onRemove }: IProductCard) => {
  const {
    title,
    description,
    price,
    imageURL,
    category,
    colors,
  } = product; // ** When we use destructuring, we can use 'product' too

  /** ReRender */
  const productColors = colors.map((color: string) => {
    return <CircleColor key={color} color={color} />
  })

  return (
    <div className="max-w-sm md:max-w-lg mx-auto md:mx-0 border rounded-md p-2 flex flex-col space-y-3">
      <Image className="rounded-md h-52 w-full lg:object-cover" src={imageURL} alt={title} />
      <h3 className="text-lg font-semibold" title={title}>{textSlicer(title, 25)}</h3>
      <p className="text-sm text-gray-500 break-words" title={description}>{textSlicer(description)}</p>
      <div className="flex items-center flex-wrap space-x-1">
        {!colors.length ? <p className="min-h-[20px]">Not available colors!</p> : productColors}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg text-indigo-600 font-semibold">${numberWithCommas(price)}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold">{category.name}</span>
          <Image src={category.imageURL} alt={category.name} className="w-10 h-10 rounded-full object-bottom" />
        </div>
      </div>

      <div className="flex items-center justify-between space-x-2">
        <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={() => onEdit(product?.id ?? '') /*onEdit*/}>
          Edit
        </Button>
        <Button className="bg-[#c2344d] hover:bg-red-800" onClick={() => onRemove(product?.id ?? '')}>
          Remove
        </Button>
      </div>
    </div>
  )
}


export default ProductCard;