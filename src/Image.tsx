interface IImage {
  src: string;
  alt: string;
  className?: string;
}

const Image = ({ src, alt, className }: IImage) => {
  return (
    <>
      <img src={src} alt={alt} className={className} />
    </>
  )
}


export default Image;