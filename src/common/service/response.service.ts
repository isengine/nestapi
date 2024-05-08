import { request as reqHttps } from 'https';
import { request as reqHttp } from 'http';

export const responseServer = async ({
  url,
  method,
  data,
  headers,
}): Promise<any> => {
  const uri = new URL(url);
  const json = JSON.stringify(data);
  const options = {
    hostname: uri.hostname,
    path: uri.pathname,
    port: uri.port,
    method: method?.toUpperCase() || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': json.length,
      ...headers,
    },
  };

  return new Promise((resolve, reject) => {
    const req = uri.protocol === 'http:'
      ? reqHttp(options, (res) => {
        let resData = '';
        res.on('data', (d) => {
          resData += d;
        });
        res.on('end', () => {
          let result = resData;
          try {
            result = JSON.parse(resData);
          } catch (e) {
            console.error('Response data json parse error', e);
          }
          resolve(result);
        });
      })
      : reqHttps(options, (res) => {
        let resData = '';
        res.on('data', (d) => {
          resData += d;
        });
        res.on('end', () => {
          resolve(JSON.parse(resData));
        });
      });

    req.on('error', (e) => {
      reject(new Error(`Failed to send data to server: ${e.message}`));
    });

    req.write(json);
    req.end();
  });
};
