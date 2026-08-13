import path from 'path';

import { Stack, StackProps, } from 'aws-cdk-lib'
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {
    public readonly helloLambda: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        const helloLambda =new LambdaFunction(this, 'HelloLambda', {
            runtime: Runtime.NODEJS_24_X,
            handler: 'hello.main',
            code: Code.fromAsset(path.join(__dirname, '..', '..', 'services')),
            environment: {
                SPACES_TABLE_NAME: props.spacesTable.tableName || '',
            }
        });

        this.helloLambda = new LambdaIntegration(helloLambda);
    }
}