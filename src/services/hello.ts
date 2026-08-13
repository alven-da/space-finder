import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({});

async function handler(event: APIGatewayProxyEvent, context: Context) {
    const cmd = new ListBucketsCommand({});
    const listBucketsResponse = (await s3Client.send(cmd)).Buckets;

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({ message: `Hello! Here are your buckets: ${JSON.stringify(listBucketsResponse)}` }),
    };

    console.log(event);

    return response;
}

export { handler };