import Image from 'next/image'
import NewWordForm from './NewWordForm';

export default async function Home() {

    const req = await fetch(process.env.URL + "/api/word", { cache: 'no-store' })
    if (!req.ok) { // Fetch status
        return (
            <h1>API error</h1>
        )
    } else {
        const data = await req.json(); // { id: string, word: string }
        const words = data;

        return (
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
                <section className='border-2 border-gray-300 bg-white w-full max-w-md flex flex-col items-center p-4 gap-4'>
                    { words.map((v: any) => {
                        return (
                            <>
                                <p key={v.id}>{v.word}</p>
                            </>
                        )
                    })
                    }
                <NewWordForm />
                </section>
          </main>
        )
    }
}
