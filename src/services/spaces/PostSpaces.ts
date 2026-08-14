import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const randomId = uuidv4();
    const item = JSON.parse(event.body || '{}');

    const result = await ddbClient.send(new PutItemCommand({
        TableName: process.env.SPACES_TABLE_NAME || '',
        Item: marshall(item)
        // Item: {
        //     id: { S: randomId },
        //     location: { S: item.location || 'Unknown' }
        // }
    }));

    return {
        statusCode: 201,
        body: JSON.stringify({ message: `Space created with ID: ${randomId}` }),
    };
}