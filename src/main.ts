import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"
import { config as awsConfig } from "aws-sdk"
import "reflect-metadata"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())

    const config = new DocumentBuilder()
        .setTitle("Shpper back")
        .setDescription("The online shop API")
        .setVersion("1.0")
        .addBearerAuth(
            {
                description: `Bearer <JWT>`,
                name: "Authorization",
                bearerFormat: "Bearer",
                scheme: "Bearer",
                type: "http",
                in: "Header"
            },
            "access"
        )
        .addTag("shopper")
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("api", app, document)

    const port: string = process.env.PORT || "3000"
    await app.listen(port, () => {
        console.log(`Server running at http://localhost:3000`)
        console.log(`Swagger running at http://localhost:3000/api`)
    })

    awsConfig.update({
        accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY),
        region: String(process.env.AWS_REGION)
    })
}
void bootstrap()
