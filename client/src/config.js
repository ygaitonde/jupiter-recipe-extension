//AWS backend config
export default {
    apiGateway: {
      REGION: "us-east-1",
      URL: "https://zb9cbqszn5.execute-api.us-east-1.amazonaws.com/prod"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: "us-east-1_tEeNptpoh",
      APP_CLIENT_ID: "mjggrnnuh9271ct5956koce1b",
      IDENTITY_POOL_ID: "us-east-1:cd045f8a-c400-4c79-a41a-3392530bda34"
    }
  };