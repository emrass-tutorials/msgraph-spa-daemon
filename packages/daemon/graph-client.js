const graph = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");

module.exports = {
  getUsers: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const users = await client.api("/users").get();

    return users;
  },

  getUserDetails: async function (accessToken, userId) {
    const client = getAuthenticatedClient(accessToken);
    console.log("User ID: ", userId);

    const user = await client
      .api(`/users/${userId}`)
      .select("displayName,mail,userPrincipalName")
      .get();

    return user;
  },

  getCalendarView: async function (accessToken, userId, start, end) {
    const client = getAuthenticatedClient(accessToken);

    const events = await client
      .api(`/users/${userId}/calendarview"`)
      // Add the begin and end of the calendar window
      .query({ startDateTime: start, endDateTime: end })
      // Order by start time
      .orderby("start/dateTime")
      .get();

    return events;
  },
};

function getAuthenticatedClient(accessToken) {
  const client = graph.Client.init({
    // Use the provided access token to authenticate requests
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  return client;
}
