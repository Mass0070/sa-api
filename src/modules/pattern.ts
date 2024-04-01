const USERNAME_PATTERN = /^(?=.{1,20}$)[A-Za-z0-9_]+$/;
function validateUsername(username: string): boolean {
    return username != null && USERNAME_PATTERN.test(username);
}

const SERVER_PATTERN = /^(?=.{1,12}$)[A-Za-z]+$/;
function validateServer(server: string): boolean {
    return server != null && SERVER_PATTERN.test(server);
}

const UUID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
function validateUUID(uuid: string): boolean {
    return uuid != null && UUID_PATTERN.test(uuid);
}

const EMAIL_PATTERN = /^[a-zA-Z0-9_\-.]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
function validateEmail(email: string): boolean {
    return email != null && EMAIL_PATTERN.test(email);
}

export { validateUsername, validateServer, validateUUID, validateEmail };
