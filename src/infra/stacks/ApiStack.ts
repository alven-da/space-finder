import { Stack, StackProps, } from 'aws-cdk-lib'
import { AuthorizationType, CognitoUserPoolsAuthorizer, Cors, LambdaIntegration, MethodOptions, ResourceOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends StackProps {
    helloLambdaIntegration?: LambdaIntegration; // Add any additional properties specific to the ApiStack here
    spacesLambdaIntegration?: LambdaIntegration; // Add any additional properties specific to the ApiStack here
    userPool?: IUserPool;
}

export class ApiStack extends Stack {
    constructor(scope: Construct, id: string, props: ApiStackProps) {
        super(scope, id, props);

        const api = new RestApi(this, 'SpacesApi');

        const authorizer = new CognitoUserPoolsAuthorizer(this, 'SpacesApiAuthorizer', {
            cognitoUserPools: [props.userPool|| {} as IUserPool],
            identitySource: 'method.request.header.Authorization'
        });

        authorizer._attachToApi(api);

        const optionsWithAuth: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            },
            
        };

        const optionsWithCors: ResourceOptions = {
            defaultCorsPreflightOptions: {
                allowOrigins: Cors.ALL_ORIGINS,
                allowMethods: Cors.ALL_METHODS,
                // allowHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key'],
            }
        };

        const spacesResource = api.root.addResource('spaces', optionsWithCors);

        // api.addGatewayResponse('UnauthorizedResponse', {
        //     type: GatewayResponseType.UNAUTHORIZED,
        //     responseHeaders: {
        //         'Access-Control-Allow-Origin': "'*'",
        //         'Access-Control-Allow-Headers': "'*'",
        //     },
        // });

        // api.addGatewayResponse('AccessDeniedResponse', {
        //     type: GatewayResponseType.ACCESS_DENIED,
        //     responseHeaders: {
        //         'Access-Control-Allow-Origin': "'*'",
        //         'Access-Control-Allow-Headers': "'*'",
        //     },
        // });

        
        spacesResource.addMethod('GET', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('POST', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('PUT', props.spacesLambdaIntegration, optionsWithAuth);
        spacesResource.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuth);


    }
}