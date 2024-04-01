import axios from 'axios';
import runQuery from 'modules/db';
const { token, staffteam } = require('config/config');

interface Emoji {
    id: string;
    name: string;
    user: {
        id: string;
        username: string;
    };
}

async function deleteEmotes(): Promise<void> {
    console.log("Deleting old emotes...");
    try {
        const staff_alltime = await runQuery(`
            SELECT oldUsername, username, uuid, deleteEmote, deleteStaff FROM staff_alltime
            WHERE deleteEmote = 1 OR deleteStaff = 1
        `);
    
        const guildEmojisResponse = await axios.get<Emoji[]>(`https://discord.com/api/v9/guilds/${staffteam.guildID}/emojis`, {
            headers: {
                Authorization: `Bot ${token}`,
                ContentType: `application/json`,
            },
        });
    
        const guildEmojis = guildEmojisResponse.data;
    
        for (const staff of staff_alltime) {
            const { oldUsername, username, uuid, deleteEmote, deleteStaff } = staff;
    
            let emojiName = "";
            if (deleteEmote && oldUsername) {
                emojiName = oldUsername;
            } else if (deleteStaff && oldUsername) {
                emojiName = oldUsername;
            } else {
                emojiName = username;
            }
    
            const matchingEmojis = guildEmojis.filter((emoji) => emoji.name === emojiName || emoji.name === null);
    
            if (matchingEmojis.length > 0) {
                for (const emoji of matchingEmojis) {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                    await axios.delete(`https://discord.com/api/v9/guilds/${staffteam.guildID}/emojis/${emoji.id}`, {
                    headers: {
                        Authorization: `Bot ${token}`,
                        ContentType: `application/json`,
                    },
                    });
                    console.log(`Deleted emoji with name ${emoji.name} and ID ${emoji.id}`);
                }
            } else {
                console.log(`Emoji with name ${emojiName} not found. Setting properties to null.`);
            }
    
            if (deleteStaff) {
                await runQuery("DELETE FROM staff_alltime WHERE uuid = ?", [uuid]);
            } else if (deleteEmote) {
                await runQuery("UPDATE staff_alltime SET oldUsername = NULL, deleteEmote = NULL WHERE uuid = ?", [uuid]);
            }
        }
    } catch (error: any) {
        console.error('Error deleting emojis:', error.message);
    }
}


export default deleteEmotes;