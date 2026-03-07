import RESOURCE from "../src/api/resourcesurl.json";

export const ENV = {
  USEREMAIL: process.env.USEREMAIL ?? "usuario_padrao",
  USERPASSWORD: process.env.USERPASSWORD ?? "",
  API_RESOURCES: RESOURCE,
};
