// function to verify confirmation token and remove from array
const verifyConfirmationToken = (confirmationTokens, email, token) => {
    let foundIndex;
    const found = confirmationTokens.some((item, index) => { foundIndex = index; return item.email === email && item.token === token; });
    if (found) {
        confirmationTokens.splice(foundIndex, 1);
    }
    return found;
}
module.exports = {verifyConfirmationToken};