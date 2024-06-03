import { Injectable, OnApplicationBootstrap } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import {
    IInvitationRepository,
    IOrderRepository,
    ISearchRepository,
    ITokenRepository,
    IUserRepository
} from "../irepos"
import { ICategoriesRepository } from "../irepos/icategories-repository"
import { IProductRepository } from "../irepos/iproducts-repository"
import { SearchRepository, TokenRepository, UserRepository } from "../repos"
import { CategoryRepository } from "../repos/categories-repository"
import { OrderRepository } from "../repos/orders-repository"
import { ProductRepository } from "../repos/products-repository"
import {
    TokenDocument,
    Token,
    UserDocument,
    User,
    Product,
    ProductDocument,
    ShoppingList,
    ShoppingListDocument
} from "../schemas"
import { Category, CategoryDocument } from "../schemas/category.schema"
import { Order, OrderDocument } from "../schemas/order.shema"
import { IDataService } from "./idata-service"
import { IShoppingListRepository } from "../irepos/ishpping-list-repository"
import { ShoppingListRepository } from "../repos/shopping-list-repository"
import { Invitation, InvitationDocument } from "../schemas/invitation.schema"
import { InvitationRepository } from "../repos/invitation.repository"

@Injectable()
export class DataService implements IDataService, OnApplicationBootstrap {
    tokenRepository!: ITokenRepository
    userRepository!: IUserRepository
    productRepository!: IProductRepository
    categoryRepository!: ICategoriesRepository
    orderRepository!: IOrderRepository
    searchRepository!: ISearchRepository
    shoppingListRepository!: IShoppingListRepository
    invitationRepository!: IInvitationRepository

    constructor(
        @InjectModel(Token.name)
        private TokenRepositoryModel: Model<TokenDocument>,
        @InjectModel(User.name)
        private UserRepositoryModel: Model<UserDocument>,
        @InjectModel(Product.name)
        private ProductRepositoryModel: Model<ProductDocument>,
        @InjectModel(Category.name)
        private CategoryRepositoryModel: Model<CategoryDocument>,
        @InjectModel(Order.name)
        private OrderRepositoryModel: Model<OrderDocument>,
        @InjectModel(ShoppingList.name)
        private ShoppingListRepositoryModel: Model<ShoppingListDocument>,
        @InjectModel(Invitation.name)
        private InvitationRepositoryModel: Model<InvitationDocument>
    ) {}

    onApplicationBootstrap() {
        this.tokenRepository = new TokenRepository(this.TokenRepositoryModel)
        this.userRepository = new UserRepository(this.UserRepositoryModel)
        this.productRepository = new ProductRepository(this.ProductRepositoryModel)
        this.categoryRepository = new CategoryRepository(this.CategoryRepositoryModel)
        this.orderRepository = new OrderRepository(this.OrderRepositoryModel)
        this.shoppingListRepository = new ShoppingListRepository(this.ShoppingListRepositoryModel)
        this.invitationRepository = new InvitationRepository(this.InvitationRepositoryModel)
        this.searchRepository = new SearchRepository()
    }
}
