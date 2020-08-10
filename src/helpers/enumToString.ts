/**
 * Converts an enum into a String
 * @param _enum Enum
 * @returns string type
 * @gist https://gist.github.com/ruslanguns/d5a6bd9af6bddb77d6b2f2a2fef82748
 */
export const EnumToString = (_enum: object) =>
  Object.keys(_enum)
    .map(key => _enum[key])
    .filter(value => typeof value === 'string') as string[];
