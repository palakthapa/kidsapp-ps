const validationMethods = {
    "match": function (value, regex) {
        return regex.match(value);
    }
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/g;
const passwordRegex = /^(?=.*[A-Z])(?=.*[^{}a-zA-Z0-9])(?=.*[0-9])[^\s\\\n\{\}]*$/g;

const validationSchemas = {
    login: {
        email: {
            "required": true,
            "method": "match",
            "args": [
                emailRegex
            ],
            "undef_message": "Please provide a valid email address",
            "failed_test_message": "Please provide a valid email address"
        },
        password: {
            "required": true,
            "method": "match",
            "args": [
                passwordRegex
            ],
            "message": "Please provide a valid email address"
        }
    }
}

export default validationUtil = (req, res, type) => {
    let data = req.body || {};

    for (const key in validationSchemas[type] || {}) {
        if (Object.hasOwnProperty.call(object, key)) {
            const element = object[key];
            if (element.required && !data[key]) res.status(400).send(element.undef_message);

            if(!validationMethods[element.method](data[key], ...element.args)) res.status(400).send(element.failed_test_message);
        }
    }
}