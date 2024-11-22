import jwt from 'jsonwebtoken';

const generateJWT = (uid: string) => {

    return new Promise( ( resolve, reject ) => {

        const payload = {
            uid,
        };
    
        jwt.sign( payload, process.env.JWT_SECRET!, {
            expiresIn: '12h'
        }, ( err, token ) => {
    
            if ( err ) {
                console.log(`[error]: ${err}`);
                reject('There was an error generating the token');
            } else {
                resolve( token );
            }
    
        });

    });

}


export { generateJWT }