import { Amplify } from 'aws-amplify';
import { SignInOutput, fetchAuthSession, signIn } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'ap-southeast-1';
const userPoolId = 'ap-southeast-1_PPwFrNx9R';
const userPoolClientId = '3t5129hsnngeomrn36muvfq0ph';
const identityPoolId = 'ap-southeast-1:638dfa93-e093-40de-bca9-795ca1bc7b0d';

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId,
            userPoolClientId,
            identityPoolId
        }
    }
});

export class AuthService {
    public async login(username: string, password: string) {
        const signInOutput: SignInOutput = await signIn({
            username,
            password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });

        return signInOutput;
    }

    public async getIdToken() {
        const authSession = await fetchAuthSession();

        return authSession.tokens?.idToken?.toString();
    }

    public async generateTemporaryCredentials() {
        const idToken = await this.getIdToken();

        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${userPoolId}`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId,
                logins: {
                    // TODO: To Fix Later
                    [cognitoIdentityPool]: idToken || ''
                }
            })
        });

        return cognitoIdentity.config.credentials();
    }
}