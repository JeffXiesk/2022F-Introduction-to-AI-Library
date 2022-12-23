const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://172.18.24.158:8002',
            changeOrigin: true,
            async: false,
            crossDomain: true, 
        })
    );
};
