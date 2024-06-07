// Imports global types
import "@twilio-labs/serverless-runtime-types";
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";
import * as ViberTypes from "./viber_types.private";
import * as Helper from "./viber.helper.private";

// Load Libraries
const { ViberMessageType } = <typeof ViberTypes>(
  require(Runtime.getFunctions()["api/viber/viber_types"].path)
);

// Load Libraries
const { wrappedSendToFlex } = <typeof Helper>(
  require(Runtime.getFunctions()["api/viber/viber.helper"].path)
);

export const handler: ServerlessFunctionSignature<
  ViberTypes.ViberContext,
  ViberTypes.ViberMessage
> = async (context, event, callback: ServerlessCallback) => {
  console.log("event received - /api/viber/incoming: ", event);

  try {
    // Debug: Console Log Incoming Events
    console.log("---Start of Raw Event---");
    console.log(event);
    console.log("---End of Raw Event---");

    // Step 1: Verify viber signature
    // TODO: Add verification

    // Step 2: Process Twilio Conversations
    if (event.sender && event.sender.name) {
      const userId = event.sender.id;
      console.log(`event.sender.id: ${event.sender.id}`);
      await wrappedSendToFlex(context, userId, event);
    }

    return callback(null, {
      success: true,
    });
  } catch (err) {
    console.log(err);
    return callback("outer catch error");
  }
};
