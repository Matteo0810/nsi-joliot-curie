const BASE_API = "http://127.0.0.1:1500",
    Method = {
        GET: "GET",
        POST: "POST",
        PATCH: "PATCH",
        DELETE: "DELETE"
    }

async function request(path, method, query = null, data = null, contentType = "application/json") {
    const params = new URLSearchParams(query),
        init = {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        };
    if(contentType)
        init.headers['Content-Type'] = contentType
    init['body'] = data && contentType === 'application/json' ? JSON.stringify(data) :
        data && !contentType ? data : null
    const response = await (fetch(`${BASE_API}/${path}${query ? "?" : ""}${query ? params.toString() : ""}`, init))
    return response.json()
}

const USER = 'user',
    CONTENT = 'content/',
    FOLDERS = 'folders', FILES = 'files'

/* USER */
const loginUser = (data) => request(`${USER}/login`, Method.POST, null, data)

const getUser = () => request(`${USER}/get`, Method.GET)

//const registerUser = (data) => request(`${USER}/add`, Method.POST, null, data)
const updateUser = (data) => request(`${USER}/update`, Method.PATCH, null, data)
const deleteUser = (id) => request(`${USER}/delete/${id}`, Method.DELETE)

const getSearchResult = (query) => request(`${CONTENT}search/${query}`, Method.GET)

/* FOLDERS */
const getFolder = (folderId) => request(`${CONTENT}${FOLDERS}/get/${folderId}`, Method.GET)

/* FILES */
const addFiles = (data) => request(`${CONTENT}${FILES}/add`, Method.POST, null, data, null)
const deleteFile = (fileId) => request(`${CONTENT}${FILES}/delete/${fileId}`, Method.DELETE)