import { IErrors, IProductToValidate } from "../interfaces";

/**
 * Validates a product object for required fields and constraints.
 *
 * @param {Object} product - The product to be validated.
 * @param {string} product.title - The title of the product.
 * @param {string} product.description - The description of the product.
 * @param {string} product.imageURL - The URL of the product's image.
 * @param {string} product.price - The price of the product.
 *
 * @returns {Object} - An object containing error messages for invalid fields.
 * @property {string} title - Error message for the title field.
 * @property {string} description - Error message for the description field.
 * @property {string} imageURL - Error message for the imageURL field.
 * @property {string} price - Error message for the price field.
 */
export const productValidation: any = (product: IProductToValidate): object => {
  const { title, description, imageURL, price, colors } = product;
  const errors: IErrors = {
    title: "",
    description: "",
    imageURL: "",
    price: "",
    colors: "",
  }

  const validUrl: boolean = /^(ftp|http|https):\/\/[^ "]+$/.test(imageURL);

  if (!title.trim() || title.length < 10 || title.length > 80) {
    errors.title = "Title must be between 10 and 50 characters"
  }
  if (!description.trim() || description.length < 10 || description.length > 900) {
    errors.description = "Description must be between 10 and 50 characters"
  }
  if (!imageURL.trim() || !validUrl) {
    errors.imageURL = "Image URL is not valid"
  }
  if (!price.trim() || isNaN(Number(price))) {
    errors.price = "Price must be a number"
  }
  if (colors.length === 0) {
    errors.colors = "Please, select at least one color"
  }

  return errors
}