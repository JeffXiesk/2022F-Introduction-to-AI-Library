const baseURL = '/api';

const formFetch = (path, args = {}, method = 'POST') => () => {
    const encode = encodeURIComponent;
    console.log(args)
    return fetch(`${baseURL}${path}`, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: method.toUpperCase(),
        credentials: 'include',
        body: Object.keys(args).map(key => `${encode(key)}=${encode(args[key])}`).join('&')
    }).then(response => response.json());
};

export const failURL = `https://cas.sustech.edu.cn/cas/login?service=http%3A%2F%2F172.18.24.158%3A8002%2Fapi%2Flogin`;
// export const failURL = `https://cas.sustech.edu.cn/cas/login?service=http://localhost:3000/api/login`;
// export const failURL = `https://cas.sustech.edu.cn/cas/login?service=http://${window.location.hostname}/login`;

export default formFetch;