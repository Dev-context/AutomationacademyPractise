import resoucesurl from "../src/api/resourcesurl.json";
const apiAdress = resoucesurl;

export const ENV = {
  USEREMAIL: process.env.USEREMAIL ?? "usuario_padrao",
  USERPASSWORD: process.env.USERPASSWORD ?? "",
  API_ADDRESS: apiAdress,
};
