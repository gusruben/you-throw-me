import { json } from '@sveltejs/kit';
import fs from 'node:fs';

const filePath = "src/lib/data/leaderboard.json"

export function GET() {
    if (!fs.existsSync(filePath)) {
        return json([]);
    } else {
        return json(JSON.parse(fs.readFileSync(filePath)))
    }
}

export async function POST({ request }) {
    let data = [];
    if (fs.existsSync(filePath)) {
        try {
            data = JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            console.error("Failed to parse existing data:", error);
        }
    }

    try {
        const newEntry = await request.json(); // Read the body once here
        console.log("New Entry:", newEntry);

        data.push(newEntry);
        data.sort((a, b) => b.score - a.score);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log("Updated leaderboard:", data);

        return json(data);
    } catch (error) {
        console.error("Failed to handle POST request:", error);
        return json({ error: "Failed to update leaderboard" }, { status: 500 });
    }
}