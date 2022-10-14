import { PathLike } from "fs";

type AppConfiguration = {
  [key: string]: boolean | PathLike;
  DATA_STORAGE: PathLike;
  IS_ADMIN: boolean;
};

const config: AppConfiguration = {
  DATA_STORAGE: `${process.cwd()}/data`,
  IS_ADMIN: false,
};

export { AppConfiguration };
export default config;
