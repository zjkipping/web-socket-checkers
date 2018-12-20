import { GenericError } from "./types";

export const nullPropertiesCheck = (object: any, keys: string[]): GenericError | undefined  => {
  let nullKeys = keys.filter(key => object[key] === '' || !object[key]);
  return nullKeys.length > 0 ? {
    code: 'NULL_PROPERTY',
    message: 'Null Values for Keys: ' + JSON.stringify(nullKeys)
  } : undefined;
}
