/**
 * This class is used to fetch the API from Server
 * Both admin and user will use this class for CRUD operations
 */
class Client {
  // GET Request
  async get(url) {
    const res = await fetch(url);
    const resData = await res.json();
    return resData;
  }

  // POST Request
  async post(url, inputData) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(inputData),
    });

    const resData = await res.json();
    return resData;
  }

  // PUT Request
  async put(url, inputData) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(inputData),
    });

    const resData = await res.json();
    return resData;
  }

  // DELETE Request
  async delete(url) {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-type': 'application/json' },
    });

    const resData = await res.json();
    return resData;
  }
}

export const client = new Client();
