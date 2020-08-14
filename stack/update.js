import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const data = JSON.parse(event.body);
  console.log("data: ", data);
  const params = {
    TableName: process.env.tableName,
    // 'Key'
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'recipeId': path parameter
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      recipeId: event.pathParameters.id
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET content = :content, recipeName = :recipeName",
    ExpressionAttributeValues: {
      ":content": data.recipe.content || null,
      ":recipeName": data.recipe.recipeName || ""
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});