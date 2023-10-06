"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewWordForm() {
    const [word, setWord] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    // Handle submission of the form
    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        setLoading(true);
        e.preventDefault();

        // POST request to API
        const res:any = await fetch("/api/word", {
            method: "POST",
            body: JSON.stringify({ word: word }),
            headers: {
              'Content-Type': 'application/json',
            },
        })
        try {
            // Successful request
            const data = await res.json();
            if (res.status != "200") {
                alert("Error: " + data.code);
            }
            // Successful database operation, refresh the page
            router.refresh();
        } catch (errorr) {
            alert("Something went wrong.")
        }
        setLoading(false);
    }


    return (
        <form  onSubmit={handleSubmit}>
            <input onChange={(e) => {setWord(e.target.value)}} value={word} type="text" id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required></input>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full" type="submit" disabled={loading}>
                Add
            </button>
        </form>
    )
}