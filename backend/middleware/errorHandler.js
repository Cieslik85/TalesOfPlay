const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.code === '23505') {
        return res.status(409).json({ message: 'Resource already exists / duplicate entry' });
    }

    if (err.code === '23503') {
        return res.status(400).json({ message: 'Invalid reference - related resource not found' });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;