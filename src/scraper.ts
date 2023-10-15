import axios from 'axios';

const api = "https://api.truthordarebot.xyz/v1";

export async function getTruth(): Promise<string | null> {
    try {
        const response = await axios.get(`${api}/truth`);
        if (response.status !== 200) {
            console.log(`Unable to get truth: HTTP ${response.status}`);
            return null;
        }
        return response.data.question;
    } catch (e) {
        console.log(`An error occurred: ${e}`);
        return null;
    }
}

export async function getDare(): Promise<string | null> {
    try {
        const response = await axios.get(`${api}/dare`);
        if (response.status !== 200) {
            console.log(`Unable to get dare: HTTP ${response.status}`);
            return null;
        }
        return response.data.question;
    } catch (e) {
        console.log(`An error occurred: ${e}`);
        return null;
    }
}

export async function getTruthAndDare(): Promise<[string | null, string | null]> {
    const [truth, dare] = await Promise.all([getTruth(), getDare()]);
    return [truth, dare];
}
