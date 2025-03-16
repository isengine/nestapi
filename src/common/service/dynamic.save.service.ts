import * as moment from 'moment';

export const parseDynamicSaveObject = (entity) => {
  const save = {};
  Object.entries(entity).forEach(([key, value]) => {
    const type = value === null ? 'null' : typeof value;

    let string = value;

    if (value === undefined) {
      return;
    }

    if (type === 'null') {
      string = 'NULL';
    }

    if (type === 'object') {
      string = `'${escapeQuotes(JSON.stringify(value))}'`;
    }

    if (type === 'string') {
      string = `'${escapeQuotes(value)}'`;
    }

    const date = parseDate(value);
    if (date) {
      string = `'${date}'`;
    }

    save[key] = string;
  });

  return save;
};

const escapeQuotes = (string) => {
  return `${string || ''}`.replace(/['"\\]/giu, '\\$&');
};

const parseDate = (dateValue) => {
  if (typeof dateValue === 'number') {
    return null;
  }

  if (typeof dateValue === 'string') {
    if (dateValue?.length < 10 || dateValue?.length > 29) {
      return null;
    }
  }

  const datetime = moment(dateValue, moment.ISO_8601, true);

  if (!datetime.isValid()) {
    return null;
  }

  return datetime.format('YYYY-MM-DD HH:mm:ss');
};
