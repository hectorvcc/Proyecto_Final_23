const AWS = require('aws-sdk');
AWS.config.update({
    accessKeyId: 'AKIAUVT5QNTGA3MWOCUD',
    secretAccessKey: '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'
});


// Configurar región de AWS
AWS.config.update({ region: 'eu-west-2' });
// Crear instancia de S3
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// Crear parámetros para el bucket
const bucketParams = { Bucket: 'misdatoshackaton' };
// Crear parámetros para el archivo
const fileParams = { Bucket: 'cosashackaton', Key: FotoFinal, Body: 'Hola soy una foto subida!' };
// Subir archivo al bucket
s3.putObject(fileParams, function (err, data) {
        if (err) {
            console.log("Error al subir el archivo al bucket", err);
        } else {
            console.log("Archivo subido al bucket", data);
        }
    }
);
// Obtener archivo del bucket

var FotoFinal;

function decodificador(link) {
    let byteString = atob(link.split(',')[1]);
    let mimeString = link.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: mimeString });
    return new File([blob], "foto.png", { type: "image/png" });
}