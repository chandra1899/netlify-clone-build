import { S3 } from "aws-sdk";
import fs from "fs"
import path from "path"

const s3 = new S3({
    accessKeyId : "a915a83a984ca573f61e6f3eab99daee",
    secretAccessKey : "a87f1c585a44ae708ffdd6a2e390d46f79bc1d041fe07a7cc3e793b4c831035e",
    endpoint : "https://04b74d21ee5c34d7a6a3405431dac7ec.r2.cloudflarestorage.com"
})

export async function downloadS3Folder (prefix: string) {
    console.log(prefix);
    const allFiles = await s3.listObjectsV2({
        Bucket: "vercel",
        Prefix: prefix
    }).promise();

    const allPromises = allFiles.Contents?.map(async ({Key}) => {
        return new Promise(async (resolve) => {
            if(!Key) {
                resolve("");
                return ;
            }
            const finalOutputPath = path.join(__dirname, Key);
            const outputFile = fs.createWriteStream(finalOutputPath);
            const dirName = path.dirname(finalOutputPath);
            if(!fs.existsSync(dirName)){
                fs.mkdirSync(dirName, { recursive : true});
            }
            s3.getObject({
                Bucket: "vercel",
                Key
            }).createReadStream().pipe(outputFile).on("finish", () => {
                resolve("");
            })
        })
    }) || []
    console.log("waiting");
    
    await Promise.all(allPromises?.filter(x => x !== undefined))
}
