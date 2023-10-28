const admin = require('firebase-admin');

const serviceAccount = {
    "type": "service_account",
    "project_id": "faceattendancerealtime-a8bc3",
    "private_key_id": "6800923e494312ad94b596bb65b73f46a965a5ff",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCa/Y0SR6KC9dwQ\nvAqRlaTO4QvG03uIozSMKfxPm4GEcyZcegfhnvY7NNOrxAgGaAy/qy/JwUB3Tj8P\n4u2sB2k02gYGBCpxquehox/L635+3qFT9IrHKzq+pFScvQZ18Ua6Jn9x/jp0k7C8\nkLo6atmFhCFFD4XOLHIZ6oqNbgzJzRsLvZWCcRN65RZ9T8qGPgibqIcq4loGzhhM\nKOC88YTrK+i2qB63eAmfHmyr6nyTtP8lJn0dCOklCBJ2KtNF3xChDedLSOndkOfG\nyD1vVemP0qtvrJhHq16FomNEcPC+SdL5tXCTxGmTazEckU1hzO+8LwY97fYCHjnP\nNj5pJtzXAgMBAAECggEAA0yGBgkMkQDDvhiCiIuM/a6NHicTzpYO+quztP8jJhBu\ncv9RrTnbFXK6q3UCCvyZT0SvYy1MxwodMCzX0J8p5MTCbrqd1kJVQsAG6CocXdM1\nJO2oXxI5jRKVBjMrhirfeGIOMKfA5BnMZCpLHYXdfyJLPJd4ym2S9GztlHBEBOI4\ngExHfpxiMgavJ0YKDKrLWWC/IXAD0d6XYYGl8gRwy5mirdnlpAZgFXvqm8dxVUr7\noGngypcwji34nxfSsGFizN2i8jVi8d6KzJh/Fg30OW+ManrrmsKN3HhfcN784qrV\nTbhj6et3hliMLXLT50OHXcwK8jZOx2ghZbrxVoI04QKBgQDTHvrMK5akc6sbt9/m\nehakSmlykRMa8eU3Da0x4O6XC5swK9A2gIK/J3/b5XSwUQVJRO57kuH1oqvzCE+a\ni3jGJbMEY2dSu4gJ2BnV8zED601EFMEV/veh1kEZxrsHCBUmF4WP1sirLTWLf6L2\nrbNkS9l7KAaK1h31FZc+k8USHQKBgQC77/6UP5SlQDnP4km4Yvaxzh8Hq+1PFNvU\nD8DWK32wvbGhSuvSFYelw6uqCOKtyIaH4tR81DNLM4t4mLG8oWDDrpylXnLGyhAi\nT8I75smATdfFVlf3emtjmW/WmUILqlD3qJ4VEg4f2MM0cTcbiz32RijGR4rwEbmm\nEN2qXUV4gwKBgDpRKWfydmcwyEgcz41DljOFloEeD8/2l6FQdtH7VwyEGTcCMz6K\n2xLgX1InnMcDalll4BZkaWRHrgWw+wQumIrraPrCVo0k3hwSBHjz90sk2TAAJ6Hi\nzxZ2L39mRM1ZbzYZczxbUQzvrQW+mQ5Yxt/ij82ULdJ1+Mp1T1TqzpoFAoGAN7ud\nKIOOZk8cldyKdibK98GjjBfdQSVzZ3jge+Lb3Ez031sjgeKmnm7feoY2Csk7tBJ9\nZyNarsNzaekGVGUbGAyxIY1XxkHn9PToKfFv8h+jjD7lyVtBe4DmHKLIZkM0zazw\nbFk1XRZgFS455G4vitgVgW938WegQXIg+kO8tVcCgYEAqL+4wqyiB6OupQpecHlY\n+kxfzLuqMrQqCk2qVyjoXlKoMxVA/oYDHGhcvi2vrphJeKqLqNPTH9UJa5IbRaXE\nOh0FZqQJ8hPNrQyKb/w7pOPB/ucUEri5LKojoOYX+k9ACRWAfd/sfzfh4azIC1Ui\n/0XwzJMDDHYPp1OFP/tT/BI=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-to3ip@faceattendancerealtime-a8bc3.iam.gserviceaccount.com",
    "client_id": "104462458624489998541",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-to3ip%40faceattendancerealtime-a8bc3.iam.gserviceaccount.com"
};

const initializeFirebase = () => {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://faceattendancerealtime-a8bc3-default-rtdb.firebaseio.com/" // Replace with your Firebase Realtime Database URL
        });
    }
};

module.exports = { initializeFirebase, admin };
