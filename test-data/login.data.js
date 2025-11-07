import { CommonUtils } from "../utils/CommonUtils.js";

export const data = {
  login: {
    username: "hjdhsjfhksjfiwsfnklsfj",
    password: "ghsg12345"
  },
  
  registration: {
    // Static registration data
    firstName: `TestFN_${CommonUtils.generateRandomString(4)}`,
    lastName: `TestLN_${CommonUtils.generateRandomString(4)}`,
    email: `munazza.mehroze${Math.floor(Math.random() * 10000) + 1}@marathon.health`,  
    ssn: "", // We need to add this method
    dob: CommonUtils.generateRandomDOB(),
    streetAddress: CommonUtils.generateRandomAddress(),
    streetAddress2: "", // Optional apartment/unit
    city: "Testville",
    state: "CA", 
    zipCode: "90210",
    phoneNumber: CommonUtils.generateValidPhoneNumber(),
    homePhone: "", // Optional home phone
    employer: "Test Company"
  }
};