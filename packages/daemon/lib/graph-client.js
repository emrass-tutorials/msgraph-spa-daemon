require("isomorphic-fetch");
const graph = require("@microsoft/microsoft-graph-client");

module.exports = {
  getUsers: async function (accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const users = await client.api("/users").get();

    return users.value;
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
      .api(`/users/${userId}/calendarview`)
      .query({
        startDateTime: start,
        endDateTime: end,
      })
      .filter("categories/any(c:c eq 'AB')")
      .orderby("start/dateTime")
      .get();

    return events.value;
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
