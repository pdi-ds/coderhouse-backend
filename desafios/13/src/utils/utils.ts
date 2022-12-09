import * as bcrypt from "bcrypt";

function compare(str1: any, str2: any) {
  return bcrypt.compareSync(str1, str2);
}

function create(str: any) {
  return bcrypt.hashSync(str, bcrypt.genSaltSync(10));
}

export { compare, create };
