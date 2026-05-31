// Universal function for all API requests
async function Call(baseUri, useCase, dtoIn, method) {
  let response;

  if (!method || method === "get") {
    // GET request - parameters are added to URL as query string
    response = await fetch(
      `${baseUri}/${useCase}${
        dtoIn && Object.keys(dtoIn).length
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`
    );
  } else if (method === "delete") {
    // DELETE request - parameters are added to URL as query string
    response = await fetch(
      `${baseUri}/${useCase}${
        dtoIn && Object.keys(dtoIn).length
          ? `?${new URLSearchParams(dtoIn)}`
          : ""
      }`,
      { method: "DELETE" }
    );
  } else {
    // POST request - parameters are sent in request body as JSON
    response = await fetch(`${baseUri}/${useCase}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dtoIn),
    });
  }

  // Parse response as JSON and return with status info
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

// Base URL of the backend server
const baseUri = "http://localhost:8000";

const FetchHelper = {
  // Car endpoints
  car: {
    list: async () => {
      return await Call(baseUri, "car/list", null, "get");
    },
    get: async (dtoIn) => {
      return await Call(baseUri, "car/get", dtoIn, "get");
    },
    create: async (dtoIn) => {
      return await Call(baseUri, "car/create", dtoIn, "post");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "car/update", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "car/delete", dtoIn, "delete");
    },
  },
  // ServiceRecord endpoints
  serviceRecord: {
    list: async (dtoIn) => {
      return await Call(baseUri, "serviceRecord/list", dtoIn, "get");
    },
    create: async (dtoIn) => {
      return await Call(baseUri, "serviceRecord/create", dtoIn, "post");
    },
    update: async (dtoIn) => {
      return await Call(baseUri, "serviceRecord/update", dtoIn, "post");
    },
    delete: async (dtoIn) => {
      return await Call(baseUri, "serviceRecord/delete", dtoIn, "delete");
    },
    maintenanceSchedule: async (dtoIn) => {
      return await Call(baseUri, "serviceRecord/maintenanceSchedule", dtoIn, "get");
    },
  },
};

export default FetchHelper;