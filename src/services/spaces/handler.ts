import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

import { postSpaces } from './PostSpaces';
import { getSpaces } from './GetSpaces';
import { updateSpaces } from './UpdateSpaces';
import { deleteSpaces } from './DeleteSpaces';
import { JsonError, MissingFieldError } from '../shared/Validator';


const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
    
    let message: string = '';

    try {
        switch (event.httpMethod) {
            case 'GET':
                return await getSpaces(event, ddbClient);
            case 'POST':
                const response = await postSpaces(event, ddbClient);
                return response;
            case 'PUT':
                // Implement the logic for PUT method here
                return await updateSpaces(event, ddbClient);
            case 'DELETE':
                // Implement the logic for DELETE method here
                return await deleteSpaces(event, ddbClient);
            default:
                message = `Hello from default method`;
        }
    } catch (error) {
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: error.message }),
            };
        }

        if (error instanceof JsonError) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
    
   
    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify({ message }),
    };

    return response;
}

export { handler };