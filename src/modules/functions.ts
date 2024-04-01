import axios from 'axios';
import runQuery from 'modules/db';
import deleteEmotes from 'modules/deleteEmotes';
const { labymod } = require('config/config');

async function addToPartner(uuid: string): Promise<void> {
    console.log("Adding %s as member to LabyMod", uuid);
    try {
        await axios({
        timeout: 2000,
        method: "post",
        maxBodyLength: Infinity,
        url: `${labymod.url}/${uuid}`,
        data: `{ "permission": 1 }`,
        headers: {
            "X-AUTH-TOKEN": labymod.token,
            "Content-Type": "application/json",
        },
        });
    } catch (err) {
        console.log("Failed to add user %s", uuid);
    }
}

async function removeFromPartner(uuid: string): Promise<void> {
    console.log("Removing %s as member from LabyMod", uuid);
    try {
        await axios({
        timeout: 2000,
        method: "delete",
        maxBodyLength: Infinity,
        url: `${labymod.url}/${uuid}`,
        headers: {
            "X-AUTH-TOKEN": labymod.token,
            "Content-Type": "application/json",
        },
        });
    } catch (err) {
        console.log("Failed to remove user %s", uuid);
    }
}

async function updateStaff(staff: any[]): Promise<void> {
    if (staff == null) return;

    const staff_alltime = await runQuery("SELECT username, skinValue, uuid, deleteEmote FROM staff_alltime");
    const processedUuids: Set<string> = new Set();

    for (const user of staff_alltime) {
        const { uuid, username, skinValue, deleteEmote } = user;
        if (deleteEmote) continue;

        const staffUser = await staff.find((staffUser: any) => staffUser.uuid === uuid);
        processedUuids.add(uuid);

        if (!staffUser) {
            console.log(`User no longer staff, removing ${username}`);
            await runQuery(
                "UPDATE staff_alltime SET deleteStaff = 1 WHERE uuid = ?",
                [uuid]
            );

            removeFromPartner(uuid);
        } else if (username !== staffUser.username) {
            console.log(`Found user with old name, updating! newName: ${staffUser.username} oldName: ${username}`);
            await runQuery(
                "UPDATE staff_alltime SET username = ?, oldUsername = ?, deleteEmote = 1 WHERE uuid = ?",
                [staffUser.username, staffUser.username, uuid]
            );
        } else if (skinValue) {
            const response = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
            const profile = response.data;
            
            if (profile.properties && profile.properties.length > 0) {
                const properties = profile.properties[0];
                if (properties.name === 'textures') {
                    const textureData = JSON.parse(Buffer.from(properties.value, 'base64').toString('utf-8'));
                    const newSkinValue = textureData.textures.SKIN.url;

                    if (newSkinValue != skinValue) {
                        console.log(`Found user with old skin, updating! ${username}`)

                        await runQuery(
                            "UPDATE staff_alltime SET skinValue = ?, deleteEmote = 1 WHERE uuid = ?",
                            [newSkinValue, uuid]
                        );
                    }
                }
            }
        };
    }
    

    for (const user of staff) {
        const { uuid, username } = user;

        const existingUser = await staff_alltime.find((staffUser: any) => staffUser.uuid === uuid);
        if (existingUser && existingUser.deleteEmote) continue;

        if (!processedUuids.has(uuid)) {
            const response = await axios.get(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
            const profile = response.data;
            
            if (profile.properties && profile.properties.length > 0) {
                const properties = profile.properties[0];
                if (properties.name === 'textures') {
                    const textureData = JSON.parse(Buffer.from(properties.value, 'base64').toString('utf-8'));
                    const newSkinValue = textureData.textures.SKIN.url;

                    if (newSkinValue) {
                        console.log(`Inserting new user ${username}`);
                        await runQuery(
                            "INSERT INTO staff_alltime (username, uuid, skinValue) VALUES (?, ?, ?)",
                            [username, uuid, newSkinValue]
                        );

                        staff.length <= 25 ? await addToPartner(uuid) : console.log("%s kunne ikke tilføjes som medlem.\nMere end 25 staffs.", uuid);
                    }
                }
            }
        }
    }

    await deleteEmotes();
}

export {
    addToPartner,
    removeFromPartner,
    updateStaff
};
