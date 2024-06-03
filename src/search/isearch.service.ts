import { ResponseProductDto } from "src/products/dto"
import { CartItem, OptimisationDTO, PopulatedCartItem } from "./dto"

export const SEARCH_SERVICE = "SEARCH_SERVICE"

export interface ISearchService {
    getAutocompleteProductsForQuery(query: string): Promise<ResponseProductDto[]>
    getSimilarCarts(cart: CartItem[]): Promise<PopulatedCartItem[][]>
    getMaximixProducts(request: OptimisationDTO): Promise<ResponseProductDto[]>
}
