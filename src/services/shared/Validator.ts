import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
    constructor(fieldName: string) {
        super(`Value for ${fieldName} is expected`);
    }
}

export class JsonError extends Error {
    constructor(message: string) {
        super(`Failed to parse JSON: ${message} `);
    }
}

export function validateAsSpaceEntry(arg: any): arg is SpaceEntry {
    if ((arg as SpaceEntry).location === undefined) {
        throw new MissingFieldError("location");
    }

    if ((arg as SpaceEntry).name === undefined) {
        throw new MissingFieldError("name");
    }

    if ((arg as SpaceEntry).id === undefined) {
        throw new MissingFieldError("id");
    }

    return (
        typeof arg === 'object' &&
        arg !== null &&
        typeof arg.id === 'string' &&
        typeof arg.location === 'string' &&
        typeof arg.name === 'string' &&
        (arg.photoUrl === undefined || typeof arg.photoUrl === 'string')
    );
}