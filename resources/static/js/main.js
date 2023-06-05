const AWS = require('aws-sdk');
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails, CognitoUserSession } from '@amazon-cognito-identity-js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ApiGatewayManagementApiClient } from '@aws-sdk/client-apigatewaymanagementapi';


const userPool = new CognitoUserPool({
    UserPoolId: 'eu-west-2_4GFbwjau7',
    ClientId: '6akc7v1rkdn3bt8ggp3nbfop55'
});

var cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {

    const userData = {
        Username: cognitoUser.getUsername(),
        Pool: userPool
    };

    cognitoUser.getSession(function (result) {
        if (result) {
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'eu-west-2:737a60ff-d730-49c9-981c-b6808466f7f2',
                Logins: {
                    'cognito-idp.eu-west-2.amazonaws.com/eu-west-2:737a60ff-d730-49c9-981c-b6808466f7f2': result.getIdToken().getJwtToken()
                }
            });

            // Obtener las credenciales temporales
            credenciales.getPromise()
                .then(() => {
                    // Instanciación de los servicios de AWS con las credenciales de IAM
                    const s3 = new AWS.S3();

                    //Processar la imagen
                    photoButton.addEventListener('click', () => {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;

                        const context = canvas.getContext('2d');
                        context.drawImage(video, 0, 0, canvas.width, canvas.height);

                        canvas.toBlob((blob) => {
                            const fileName = 'manzana.jpg'; //poner la imagen que la coja del bucket
                            const bucketName = 'misdatoshackaton';
                            s3.upload({
                                Bucket: bucketName,
                                Key: fileName,
                                Body: blob,
                                ACL: 'public-read',
                                ContentType: 'image/jpeg'
                            }, (err, data) => {
                                if (err) {
                                    console.log('Error al subir la imagen a S3', err);
                                } else {
                                    console.log('Imagen subida a S3', data);
                                    //LLamar Lambda transformacion
                                    /* const lambdaParams = {
                                        FunctionName: 'bytes2Image',
                                        InvocationType: 'Event',
                                        Payload: JSON.stringify({ bucketName, fileName })
                                    };

                                    lambda.invoke(lambdaParams, (lambdaErr, lambdaData) => {
                                        if (lambdaErr) {
                                            console.log('Error al invocar la función Lambda', lambdaErr);
                                        }
                                    }); */

                                    // Enviar la imagen como un objeto JSON a través de una solicitud POST a API Gateway
                                    const user = new CognitoUser(userData);
                                    const session = user.getSignInUserSession();
                                    const accessToken = session.getAccessToken().getJwtToken();
                                    fetch('https://1unxpew4ed.execute-api.eu-west-2.amazonaws.com/alpha/execution', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': accessToken
                                        },
                                        body: JSON.stringify({
                                            "Image": {
                                                "S3Object": {
                                                    "Bucket": "misdatoshackaton",
                                                    "Name": "manzana.png"
                                                }
                                            }
                                        })
                                    })
                                        .catch(error => console.error(error));

                                    // Iniciar la ejecución de Step Function
                                    /* const params = {
                                        stateMachineArn: 'arn:aws:states:eu-west-2:321312025804:stateMachine:PruebaRekognition',
                                        input: JSON.stringify({
                                            image: base64Image
                                        })
                                    }; */
                                }
                            });
                        }, 'image/jpeg', 1.0);
                    });
                })
                .catch((error) => {
                    console.error('Error al obtener las credenciales de Cognito:', error);
                });
        }
    });
}