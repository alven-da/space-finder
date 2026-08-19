import { CfnOutput, RemovalPolicy, Stack, StackProps, } from 'aws-cdk-lib'
import { AttributeType, Table as DynamoDBTable, ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { getSuffixFromStack } from '../Utils';
import { BlockPublicAccess, Bucket, BucketAccessControl, HttpMethods, IBucket } from 'aws-cdk-lib/aws-s3';

export class DataStack extends Stack {
    public readonly spacesTable: ITable;
    public readonly deploymentBucket: IBucket;
    public readonly photosBucket: IBucket;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const suffix = getSuffixFromStack(this);

        this.deploymentBucket = new Bucket(this, 'SpaceFinderFrontend', {
            bucketName: `space-finder-frontend-${suffix}`,
            publicReadAccess: true,
            websiteIndexDocument: 'index.html',
            removalPolicy: RemovalPolicy.DESTROY,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            }
        });

        this.photosBucket = new Bucket(this, 'SpaceFinderPhotos', {
            bucketName: `space-finder-photos-${suffix}`,
            cors: [
                {
                    allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
                    allowedOrigins: ['*'],
                    allowedHeaders: ['*']
                }
            ],
            removalPolicy: RemovalPolicy.DESTROY,
            // accessControl: BucketAccessControl.PUBLIC_READ,
            blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
        });

        new CfnOutput(this, 'SpaceFinderPhotoBucketName', {
            value: this.photosBucket.bucketName
        });

        this.spacesTable = new DynamoDBTable(this, 'SpacesTable', {
            partitionKey: {
                name: 'id',
                type: AttributeType.STRING
            },
            tableName: `SpacesTable-${suffix}`,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        
    }
}