import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };


function dbConnect():PrismaClient{

    if(!connectionString){
        throw new Error("DATABASE_URL is not defined");
    }

    const isCloudDb = connectionString.includes("neon.tech") || connectionString.includes("sslmode=require") || process.env.NODE_ENV === "production";
    const pool = new Pool({
        connectionString,
        ssl: isCloudDb ? { rejectUnauthorized: false } : undefined,
    });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({adapter});

    return prisma;
}
    
const prisma = globalForPrisma.prisma || dbConnect();




if(process.env.NODE_ENV !== "production"){
    globalForPrisma.prisma = prisma;
}


export default prisma;
