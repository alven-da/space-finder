import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

export async function postSpacesWithDoc(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);
    
    const randomId = uuidv4();
    const item = JSON.parse(event.body || '{}');

    const result = await ddbDocClient.send(new PutItemCommand({
        TableName: process.env.SPACES_TABLE_NAME || '',
        Item: item
        // Item: marshall(item)
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