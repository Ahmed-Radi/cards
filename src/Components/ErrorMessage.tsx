import { IErrorMessage } from "../interfaces";

const ErrorMessage = ({ message }: IErrorMessage) => {
  return message ? <span className="block text-red-700 font-semibold text-sm">{message}</span> : null
}

export default ErrorMessage;