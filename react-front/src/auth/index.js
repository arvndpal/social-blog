import apiUrl from '../config/env.json'
export const signup = (user) => {
    console.log("process.env.REACT_APP_API_URL ==>", process.env)
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/signup`, {
        method: "Post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

export const authenticate = (jwt, next) => {
    if (typeof window !== undefined) {
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
}

export const signin = (user) => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/signin`, {
        method: "Post",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => {
        return response.json()
    }).catch(err => console.log(err))
}

export const signout = (next) => {
    if (typeof window != undefined) localStorage.removeItem('jwt');
    next();

    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/signout`, {
        method: "Get"
    }).then(response => {
        console.log("signout==>", response)
        return response.json()
    })
        .catch(err => console.log(err))
}

export const isAuthenticated = () => {
    if (typeof window == undefined) {
        return false;
    }

    if (localStorage.getItem("jwt")) {
        let jwtDecode = JSON.parse(localStorage.getItem("jwt"));
        // console.log("jwt", jwtDecode);
        return jwtDecode
    } else {
        return false;
    }
}

export const forgotPassword = email => {
    console.log("email: ", email);
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/forgot-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const resetPassword = resetInfo => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/reset-password/`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(resetInfo)
    })
        .then(response => {
            console.log("forgot password response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const socialLogin = user => {
    return fetch(`${apiUrl[process.env.NODE_ENV].api_url}/social-login/`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        // credentials: "include", // works only in the same origin
        body: JSON.stringify(user)
    })
        .then(response => {
            console.log("signin response: ", response);
            return response.json();
        })
        .catch(err => console.log(err));
};