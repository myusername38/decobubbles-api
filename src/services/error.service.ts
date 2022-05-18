/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ErrorMessage } from 'src/interfaces/firebase/error-message';
@Injectable()
export class ErrorService {

    private firebaseCodes = [
        { code: 'auth/wrong-password', status: 403, message: 'Incorrect password try again' },
        { code: 'auth/email-already-in-use', status: 400, message: 'Email is already in use' },
        { code: 'auth/internal-error', status: 500, message: 'Internal server error' },
        { code: 'auth/invalid-claims', status: 400, message: 'Invalid user claims' },
        { code: 'auth/invalid-email', status: 400, message: 'Invalid email' },
        { code: 'auth/invalid-email-verified', status: 400, message: 'Invalid email verified' },
        { code: 'auth/invalid-password', status: 400, message: 'Invalid password' },
        { code: 'auth/uid-already-exists', status: 400, message: 'Uid already exists' },
        { code: 'auth/user-not-found', status: 404, message: 'User not found' },
        { code: 'INVALID_ARGUMENT', status: 400, message: 'Invalid arguement' },
        { code: 'FAILED_PRECONDITION', status: 500, message: 'Failed to connect to server' },
        { code: 'NOT_FOUND', status: 404, message: 'Resource is not found' },
        { code: 'UNKNOWN', status: 500, message: 'Unknown error' },
        { code: 'INTERNAL', status: 500, message: 'Internal server error' },
        { code: 'CERTIFICATE_FETCH_FAILED', status: 401, message: 'Credentials failed to fetch' },
        { code: 'EMAIL_ALREADY_EXISTS', status: 400, message: 'This email is already in use' },
        { code: 'EXPIRED_ID_TOKEN', status: 401, message: 'JWT has expired' },
        { code: 'REVOKED_ID_TOKEN', status: 401, message: 'JWT has been revoked' },
        { code: 'USER_NOT_FOUND', status: 404, message: 'User not found' },
    ]

    public getError(err: any): ErrorMessage {
        let httpCode = 500;
        let message = '';
        if (err.code && this.firebaseCodes.some(x => x.code === err.code)) {
            const firebaseError = this.firebaseCodes.find(x => x.code == err.code);
            httpCode = firebaseError.status;
            message = firebaseError.message;
        } else {
            httpCode = err.status ? err.status : 500;
            message = err.message ? err.message : 'Unknown server error'
        }
        return { httpCode, message };
    }
}
