import { PathLike } from 'fs';
import { faker } from "@faker-js/faker";

// Products type
type Product = {
	[key: string]: number | String | PathLike | undefined,
	name?: String,
	price?: number,
	thumbnail?: PathLike
};

/**
 * Products class
 * @class
 */

class Products {
	
	private readonly PRODUCT_COUNT: number = 5;
	
	/**
	 * Gets test products
	 * @return {Array}
	 */
	
	getAll(): Array<Product> {
		
		// Products array
		const products: Array<Product> = [];
		
		// Build all products
		for(let x: number = 0, max: number = this.PRODUCT_COUNT; x < max; x = x + 1) {
			products.push({
				name      : faker.commerce.productName(),
				price     : Number(faker.commerce.price(1, 5000, 0)),
				thumbnail : faker.image.abstract(350, 350),
			});
		}
		
		// (:
		return products;
		
	}
	
}

export { Product };
export default Products;