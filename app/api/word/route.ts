import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

const DEFAULT_WORDS = ["apple", "tree", "carrot"];

// GET
// Retrieve all words from the database
// /api/word?type=all -> all words
// /api/word?type=subset -> all words starting with the letter a
// /api/word?type=reset -> reset to default words
export async function GET(req: Request) {
    // Retrieve GET request parameters
    const {searchParams} = new URL(req.url);
    const type = searchParams.get("type") ?? "all"; // default to all

    try {
        if (type == "all") {
            const words = await prisma.word.findMany(); // all fields incluing id
            return NextResponse.json(words, {status: 200});
        }
        if (type == "subset") {
            const words = await prisma.word.findMany({ // word field only
                where: { word: { startsWith: "a" } },
                select: { word: true }
            });
            return NextResponse.json(words.map((v) => v.word), {status: 200}); // Convert to a 1D array
        }
        if (type == "reset") {
            await prisma.word.deleteMany();
            for await (const word of DEFAULT_WORDS) {
                await prisma.word.create({
                    data: { word: word }
                })
            }
            return NextResponse.json({code: "RESET"}, {status: 200}); // Convert to a 1D array
        }
    } catch (error) {
        return NextResponse.json({code: "UNKNOWN_SERVER_ERROR", message: error}, {status: 500})
    }
}

// POST
// Add a new word into the table
// The word must be unique
export async function POST(req: Request) {
    try {
        // Retrieve POST request parameters
        const form = await req.json() as { word: string };

        if (form.word) {
            const data = await prisma.word.create({
                data: { word: form.word },
            })
            return NextResponse.json(data, {status: 200});
        }
        // No word in the request
        return NextResponse.json({code: "NO_WORD"}, {status: 400})
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code == "P2002") {
                // Word not unique
                return NextResponse.json({code: "NOT_UNIQUE", message: error}, {status: 400})
            }
            // Other database error
            return NextResponse.json({code: "DATABASE_ERROR", message: error}, {status: 500})
        }
        return NextResponse.json({code: "UNKNOWN_SERVER_ERROR", message: error}, {status: 500})
    }
}