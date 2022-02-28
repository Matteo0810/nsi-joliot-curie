const BASE_API = "http://127.0.0.1:1500",
    Method = {
    GET: "GET",
    POST: "POST",
    PATCH: "PATCH",
    DELETE: "DELETE"
}

async function request(path, method, query = null, data = null) {
    const params = new URLSearchParams(query)

    const response = await (fetch(`${BASE_API}/${path}${query ? "?" : ""}${query ? params.toString() : ""}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: data ? JSON.stringify(data) : null
    }))
    return response.json()
}

const USER = 'user',
    FOLDERS = 'folders'

/* USER */
const loginUser = (data) => request(`${USER}/login`, Method.POST, null, data)

const getUser = () => request(`${USER}/get`, Method.GET)

const registerUser = (data) => request(`${USER}/add`, Method.POST, null, data)
const updateUser = (data) => request(`${USER}/update`, Method.PATCH, null, data)
const deleteUser = (id) => request(`${USER}/delete/${id}`, Method.DELETE)

/* FOLDERS */
const getFolders = (folderId) => request(`${FOLDERS}/get/${folderId}`, Method.GET)
