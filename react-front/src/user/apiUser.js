import apiUrl from '../config/env.json'

export const read = (userId, token) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/user/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

export const update = (userId, token, user) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/user/${userId}`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            },
            body: user
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

export const list = () => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/users`, {
            method: "GET"
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

export const remove = (userId, token) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/user/${userId}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

export const updateUser = (user, next) => {
    if (window !== undefined) {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
}

export const follow = (userId, token, followId) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/user/follow`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, followId })
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

export const unfollow = (userId, token, unfollowId) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/user/unfollow`, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, unfollowId })
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}

export const findPeople = (userId, token) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/user/findpeople/${userId}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            }
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err))
}