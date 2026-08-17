import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function listBuckets(credentials: any) {
    const client = new S3Client({
        // credentials
    });

    const command = new ListBucketsCommand();
    const result = await client.send(command);

    return result;
}

async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'saturos',
        'Demo123qwe_'
    );

    const idToken = await service.getIdToken();
    // console.log(idToken);
    const credentials = await service.generateTemporaryCredentials();

    const buckets = await listBuckets(credentials)

    console.log('Break', buckets);
}

testAuth();