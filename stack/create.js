import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Item' 
    // - 'userId': identity  from Cognito Identity Pool
    // - 'noteId': uuid
    // - 'content': from request body
    // - 'createdAt': current timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});