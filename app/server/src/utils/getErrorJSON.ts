const getErrorJSON = (message: string, code: string, statusCode: number) => {
    return JSON.stringify({ message, code, statusCode });
}
export default getErrorJSON;