export const validateToken = (token = null) => {
  if (!token) {
    return false;
  }

  return token === "aasldkw039uj03iurj28wiuj9w";
};
