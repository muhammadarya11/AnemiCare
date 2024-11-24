class ResponseCode {
    static HTTP_OK = 200;
    static HTTP_CREATED = 201;
    static HTTP_ACCEPTED = 202;
    static HTTP_NO_CONTENT = 204;

    static HTTP_BAD_REQUEST = 400;
    static HTTP_UNAUTHORIZED = 401;
    static HTTP_FORBIDDEN = 403;
    static HTTP_NOT_FOUND = 404;
    static HTTP_METHOD_NOT_ALLOWED = 405;

    static HTTP_CONFLICT = 409;
    static HTTP_UNPROCESSABLE_ENTITY = 422;

    static HTTP_INTERNAL_SERVER_ERROR = 500;
    static HTTP_NOT_IMPLEMENTED = 501;
    static HTTP_BAD_GATEWAY = 502;
    static HTTP_SERVICE_UNAVAILABLE = 503;
    static HTTP_GATEWAY_TIMEOUT = 504;
}

export default ResponseCode;
