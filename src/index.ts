import { createClient, commandOptions } from "redis";
import { copyFinalDist, downloadS3Folder } from "./aws";
import { buildproject } from "./utils";
import axios from "axios";
import { updatestatus } from "./updatestatus";
const subscriber = createClient()
subscriber.connect()
const publisher = createClient()
publisher.connect()

async function main () {
    while(1){
        const res = await subscriber.brPop(
            commandOptions({ isolated : true }),
            "build-queue",
            0
            );
            // @ts-ignore
            const id = res.element
            await downloadS3Folder(`output/${id}`)
            console.log("downloded");
            
            await updatestatus(id, "building")

            publisher.hSet("status", id, "building...")
            await buildproject(id);
            
            await updatestatus(id, "build")

            publisher.hSet("status", id, "deploying...")
            await copyFinalDist(id); 

            await updatestatus(id, "deployed")

        publisher.hSet("status", id, "deployed")
    }
}

main()