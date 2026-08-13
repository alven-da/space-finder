import { Fn, Stack } from "aws-cdk-lib";

export function getSuffixFromStack(stackName: Stack): string {
    const shortStackId = Fn.select(2, Fn.split('/', stackName.stackId));
    const suffix = Fn.select(4, Fn.split('-', shortStackId));
    
    if (!suffix) {
        throw new Error(`Invalid stack name: ${stackName}`);
    }

    return suffix;
}   