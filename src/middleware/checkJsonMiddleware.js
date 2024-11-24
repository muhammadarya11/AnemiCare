const checkJson = async (c, next) => {
    const contentType = c.req.header('Content-Type');

    if (contentType !== 'application/json') {
        return c.json({
            message: 'Invalid content type. Expected application/json.'
        }, 400);
    }

    await next();
};

export default checkJson;