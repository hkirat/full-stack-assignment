export const generateUniqueId = (length = 6) => {
  const availableChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let uniqueId = "";

  for (let i = 0; i < length; i++) {
    uniqueId += availableChars.charAt(
      Math.floor(Math.random() * availableChars.length)
    );
  }

  return uniqueId;
};
