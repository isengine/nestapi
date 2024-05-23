async function back(req, data): Promise<string> {
  const { body, headers } = req;
  const { referer } = headers;

  const url = new URL(referer);
  const { protocol, host, pathname } = url;
  const ref = `${protocol}//${host}${pathname}`;

  const dataArray = [];
  for (const [key, value] of Object.entries({ ...body, ...data })) {
    dataArray.push(`${key}=${ encodeURI(`${value}`) }`);
  }

  return `${ref}?${dataArray.join('&')}`;
}

function selfUrl(req) {
  const { headers, protocol } = req;
  return `${protocol}://${headers.host}`;
}

export async function redirect(req, res, data = undefined) {
  const error = {
    error: 'Bad request',
    message: 'Unknown error',
  };
  const backUrl = await back(req, data || error);
  return await res.redirect(backUrl);
}

export async function query(req, res, uri) {
  const base = selfUrl(req);
  return await res.redirect(`${base}${uri}`);
}
