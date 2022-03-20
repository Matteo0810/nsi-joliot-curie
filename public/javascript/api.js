const BASE_API = "http://localhost:1500",
    Method = { GET: "GET", POST: "POST", PATCH: "PATCH", DELETE: "DELETE" }

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

const USER = 'user', REPOSITORY = 'repository',
    FOLDERS = 'folder', FILES = 'file'

/* USER */
const userData = request(`${USER}/`, Method.GET)

//const registerUser = data => request(`${USER}/add`, Method.POST, null, data)
const loginUser = data => request(`${USER}/login`, Method.POST, null, data)
const updateUser = data => request(`${USER}/`, Method.PATCH, null, data)
const deleteUser = id => request(`${USER}`, Method.DELETE, { folder_id: id })

const getSearchResult = query => request(`${REPOSITORY}/search/${query}`, Method.GET)

/* FOLDERS */
const addFolder = data => request(`${REPOSITORY}/${FOLDERS}/add`, Method.POST, null, data)
const getFolder = id => request(`${REPOSITORY}/${FOLDERS}/get`, Method.GET, { folder_id: id })

/* FILES */
const addFiles = data => request(`${REPOSITORY}/${FILES}/add`, Method.POST, null, data, null)
const deleteFile = fileId => request(`${REPOSITORY}/${FILES}/delete/${fileId}`, Method.DELETE)