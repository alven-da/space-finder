### References ###

Alex HD's Repo: https://github.com/alexhddev/CDK-course-resources

### Updated S3Origin constructs

```
const s3Origin = S3BucketOrigin.withOriginAccessControl(deploymentBucket, {
    originAccessLevels: [AccessLevel.READ],
});

const distribution = new Distribution(this, 'SpacesFinderDistribution', {
    defaultRootObject: 'index.html',
    defaultBehavior: {
        origin: s3Origin
    }
});
```