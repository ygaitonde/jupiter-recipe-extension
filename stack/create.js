import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Item'
    // - 'userId': identity  from Cognito Identity Pool
    // - 'recipeId': uuid
    // - 'recipeName' : user defined recipe name from request body
    // - 'content': from request body
    // - 'createdAt': current unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      recipeId: uuid.v1(),
      recipeName: data.name,
      content: data.content,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});