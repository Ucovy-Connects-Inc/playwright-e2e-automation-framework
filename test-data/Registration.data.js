import { CommonUtils } from "../utils/CommonUtils.js";

export const data = {
  login: {
    InvalidUsername: "hjdhsjfhksjfiwsfnklsfj",
    InvalidPassword: "ghsg12345",
    ValidUsername: "munaztest",
    ValidPassword: "Default1"
  },

  admin: {
    username: "munaztest",
    password: "Default1"
  },

  registration: {
    firstName: `TestFN_${CommonUtils.generateRandomString(6)}`,
    lastName: `TestLN_${CommonUtils.generateTimestamp()}`,
    email: `munazza.mehroze+${Math.floor(Math.random() * 9999) + 1}@marathon.health`,
    dateOfBirth: CommonUtils.generateRandomDOB(),
    streetAddress: CommonUtils.generateRandomAddress(),
    city: 'Testville',
    state: 'CA',
    zipCode: '90210',
    phoneNumber: CommonUtils.generateValidPhoneNumber(),
    password: "Password123"
  }
};