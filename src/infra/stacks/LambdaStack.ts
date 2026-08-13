import path from 'path';

import { Stack, StackProps, } from 'aws-cdk-lib'
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

interface LambdaStackProps extends StackProps {
    spacesTable: ITable;
}

export class LambdaStack extends Stack {
    public readonly spacesLambda: LambdaIntegration;

    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super(scope, id, props);

        // const helloLambda = new NodejsFunction(this, 'HelloLambda', {
        //     runtime: Runtime.NODEJS_24_X,
        //     entry: path.join(__dirname, '..', '..', 'services', 'hello.ts'),
        //     handler: 'handler',
        //     environment: {
        //         SPACES_TABLE_NAME: props.spacesTable.tableName || '',
        //     }
        // });

        const spacesLambda = new NodejsFunction(this, 'SpacesLambda', {
            runtime: Runtime.NODEJS_24_X,
            entry: path.join(__dirname, '..', '..', 'services', 'spaces', 'handler.ts'),
            handler: 'handler',
            environment: {
                SPACES_TABLE_NAME: props.spacesTable.tableName || '',
            }
        });

        // helloLambda.addToRolePolicy(new PolicyStatement({
        //     effect: Effect.ALLOW,
        //     actions: ['s3:ListBuckets', 's3:ListAllMyBuckets'],
        //     resources: ['*'],
        // }));

        // const helloLambda =new LambdaFunction(this, 'HelloLambda', {
        //     runtime: Runtime.NODEJS_24_X,
        //     handler: 'hello.main',
        //     code: Code.fromAsset(path.join(__dirname, '..', '..', 'services')),
        //     environment: {
        //         SPACES_TABLE_NAME: props.spacesTable.tableName || '',
        //     }
        // });

        this.spacesLambda = new LambdaIntegration(spacesLambda);
    }
}