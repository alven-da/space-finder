import { DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters && event.queryStringParameters.id && event.body) {
        const spaceId = event.queryStringParameters.id;

        const parsedBody = JSON.parse(event.body) || {};

        const reqBodyKey = Object.keys(parsedBody)[0];
        const reqBodyValue = parsedBody[reqBodyKey];

        const updateResult = await ddbClient.send(new UpdateItemCommand({
            TableName: process.env.SPACES_TABLE_NAME || '',
            Key: {
                'id': { S: spaceId }
            },
            UpdateExpression: `SET #zzzNew = :new`,
            ExpressionAttributeValues: {
                ':new': { S: reqBodyValue }
            },
            ReturnValues: 'UPDATED_NEW',
            ExpressionAttributeNames: {
                '#zzzNew': reqBodyKey
            }
        }));

        return {
            statusCode: 204,
            body: JSON.stringify(updateResult.Attributes)
        };
    }

    return {
        statusCode: 204,
        body: JSON.stringify({ message: 'Missing id query parameter or request body' }),
    };
}
