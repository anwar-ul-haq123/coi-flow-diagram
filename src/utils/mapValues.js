export default function mapValues(o, func) {
  const res = {};
  for (const key in o) {
    if (o.hasOwnProperty(key)) {
      res[key] = func(o[key]);
    }
  }
  return res;
}
