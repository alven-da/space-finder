import { DeleteItemCommand, DynamoDBClient, GetItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters && event.queryStringParameters.id) {
        const spaceId = event.queryStringParameters.id;

        const deleteResult = await ddbClient.send(new DeleteItemCommand({
            TableName: process.env.SPACES_TABLE_NAME || '',
            Key: {
                'id': { S: spaceId }
            },
            ReturnValues: 'ALL_OLD'
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ message: `Space with ID ${spaceId} deleted`, deletedItem: deleteResult.Attributes ? unmarshall(deleteResult.Attributes) : null }),   
        };
    }

    return {
        statusCode: 204,
        body: JSON.stringify({ message: 'Missing id query parameter or request body' }),
    };
}
