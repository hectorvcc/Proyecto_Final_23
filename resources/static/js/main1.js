
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { S3 } from "@aws-sdk/client-s3"
import { APIGatewayClient } from "@aws-sdk/client-api-gateway";


//Configurar el objeto de credenciales
const credenciales = new fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: "eu-west-2" }),
    IdentityPoolId: 'eu-west-2:737a60ff-d730-49c9-981c-b6808466f7f2', // ID del pool de identidades de Cognito
});

const clientS3 = new S3({
    region: "eu-west-2",
    credentials: credenciales,
});

const clientApiG = new APIGatewayClient({
    region:"eu-west-2",
    credentials: credenciales,
})






// Obtener las credenciales temporales
credenciales
    .then(() => {

        //Processar la imagen
        photoButton.addEventListener('click', () => {
           /* canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataURL = canvas.toDataURL('image/jpeg', 1.0);

            const byteString = atob(dataURL.split(',')[1]);
            const matrizBytes = new ArrayBuffer(byteString.length);
            const imageBytes = new Uint8Array(matrizBytes);
            for (let i = 0; i < byteString.length; i++) {
                imageBytes[i] = byteString.charCodeAt(i);
            }*/

            const fileName = 'manzana.jpg'; //poner la imagen que la coja del bucket
            const bucketName = 'misdatoshackaton';

            clientS3.upload({
                Bucket: bucketName,
                Key: fileName,
                Body: imageBytes,
                ACL: 'public-read',
                ContentType: 'image/jpeg'
            }, (err, data) => {
                if (err) {
                    console.log('Error al subir la imagen a S3', err);
                } else {
                    console.log('Imagen subida exitosamente a S3', data);

                    // Convertir la matriz de bytes en una cadena base64
                    const base64Image = btoa(String.fromCharCode.apply(null, imageBytes));

                    // Enviar la imagen como un objeto JSON a través de una solicitud POST a API Gateway
                    fetch('https://1unxpew4ed.execute-api.eu-west-2.amazonaws.com/alpha/execution', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'

                            //'Authorization': tokenId
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
                        .then(response => response.json())
                        .then(data => console.log(data))
                        .catch(error => console.error(error));




                }
            });
        });
    })
    .catch((error) => {
        console.error('Error al obtener las credenciales de Cognito:', error);
    });


