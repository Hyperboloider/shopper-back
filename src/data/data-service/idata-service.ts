import {
    ITokenRepository,
    IUserRepository,
    IProductRepository,
    ICategoriesRepository,
    IOrderRepository,
    ISearchRepository,
    IShoppingListRepository,
    IInvitationRepository
} from "../irepos"

export abstract class IDataService {
    abstract tokenRepository: ITokenRepository
    abstract userRepository: IUserRepository
    abstract productRepository: IProductRepository
    abstract categoryRepository: ICategoriesRepository
    abstract orderRepository: IOrderRepository
    abstract searchRepository: ISearchRepository
    abstract shoppingListRepository: IShoppingListRepository
    abstract invitationRepository: IInvitationRepository
}
