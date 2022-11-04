type AppConfiguration = {
  [key: string]: boolean;
  IS_ADMIN: boolean;
};
const config: AppConfiguration = {
  IS_ADMIN: true,
};

export { AppConfiguration };
export default config;
