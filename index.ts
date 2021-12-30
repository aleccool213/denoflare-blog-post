import { IncomingRequestCf } from "./deps.ts";

/**
 * Loosely based on the A/B Testing Cloudflare Worker example.
 * Ref: https://developers.cloudflare.com/workers/examples/ab-testing
 */
function fetch(request: IncomingRequestCf): Response {
  const NAME = "experiment-0";

  const TEST_RESPONSE = new Response("Test group");
  const CONTROL_RESPONSE = new Response("Control group");

  // Determine which group this requester is in.
  const cookie = request.headers.get("cookie");
  if (cookie && cookie.includes(`${NAME}=control`)) {
    return CONTROL_RESPONSE;
  } else if (cookie && cookie.includes(`${NAME}=test`)) {
    return TEST_RESPONSE;
  } else {
    // If there is no cookie, this is a new client. Choose a group and set the cookie.
    const group = Math.random() < 0.5 ? "test" : "control"; // 50/50 split
    const response = group === "control" ? CONTROL_RESPONSE : TEST_RESPONSE;
    response.headers.append("Set-Cookie", `${NAME}=${group}; path=/`);

    return response;
  }
}

export default {
  fetch,
};
