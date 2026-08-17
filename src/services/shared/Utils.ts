import { APIGatewayProxyEvent } from "aws-lambda";
import { JsonError } from "./Validator";
import { randomUUID } from "crypto";

export function createRandomId() {
    return randomUUID();
}

export function parseJsonSafe(jsonString: string): any | null {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        throw new JsonError((error as Error).message);
    }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];

    if (groups) {
        return (groups as string).includes('admins');
    }

    return false;
}