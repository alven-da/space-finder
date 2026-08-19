import { CfnOutput, RemovalPolicy, Stack, StackProps, } from 'aws-cdk-lib'
import { Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { getSuffixFromStack } from '../Utils';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { AccessLevel, Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

interface UiDeploymentStackProps extends StackProps {
    deploymentBucket: IBucket;
}

export class UiDeploymentStack extends Stack {

    constructor(scope: Construct, id: string, props: UiDeploymentStackProps) {
        super(scope, id, props);

        const suffix = getSuffixFromStack(this);

        const destinationBucket = new Bucket(this, 'uiDeploymentBucket', {
            bucketName: `space-finder-frontend-${suffix}`,
            removalPolicy: RemovalPolicy.DESTROY,
        });
        
        const uiDir = path.join(__dirname, '..', '..', '..', '..', 'space-finder-frontend', 'dist');

        if (!existsSync(uiDir)) {
            console.warn (`Ui Dir Not Found ${uiDir}`);
            return;
        }

        new BucketDeployment(this, 'SpacesFinderDeployment', {
            destinationBucket,
            sources: [Source.asset(uiDir)],
        });

        const originIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
        destinationBucket.grantRead(originIdentity);

        const distribution = new Distribution(this, 'SpacesFinderDistribution', {
            defaultRootObject: 'index.html',
            defaultBehavior: {
                origin: S3BucketOrigin.withOriginAccessControl(destinationBucket, {
                    originAccessLevels: [AccessLevel.READ],
                })
            },
        });

        new CfnOutput(this, 'SpacesFinderURL', {
            value: distribution.distributionDomainName
        });
    }

    
}