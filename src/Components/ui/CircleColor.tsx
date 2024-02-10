interface ICircleColor extends React.HTMLAttributes<HTMLSpanElement>{
  color: string;
}

const CircleColor = ({ color, ...rest }: ICircleColor) => {
  return (
    <span className={"block w-5 h-5 rounded-full cursor-pointer"} style={{ backgroundColor: color }} {...rest} />
  )
}


export default CircleColor;