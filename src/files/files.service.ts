import { Injectable } from "@nestjs/common"
import { S3 } from "aws-sdk"
import { randomUUID } from "crypto"
import { FileData } from "./file-date"

@Injectable()
export class FilesService {
    private readonly s3 = new S3()

    async uploadPublicFile(dataBuffer: Buffer, filename: string): Promise<FileData> {
        const uploadResult = await this.s3
            .upload({
                Bucket: String(process.env.AWS_PUBLIC_BUCKET_NAME),
                Body: dataBuffer,
                Key: `${String(randomUUID())}-${filename}`
            })
            .promise()
        return new FileData(uploadResult.Location, uploadResult.Key)
    }

    async deletePublicFile(key: string) {
        await this.s3
            .deleteObject({
                Bucket: String(process.env.AWS_PUBLIC_BUCKET_NAME),
                Key: key
            })
            .promise()
    }
}
