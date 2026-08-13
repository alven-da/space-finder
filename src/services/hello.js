exports.main = async function main(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello! I will read from ${process.env.SPACES_TABLE_NAME}` }),
    }
} 