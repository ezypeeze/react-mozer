export function defaultMessageProvider(validationName, validationOptions) {
    switch (validationName) {
        case 'required':
            return "The {label} is required.";
        case 'min':
            return `The {label} must be after ${validationOptions.min}.`;
        case 'max':
            return `The {label} must be before ${validationOptions.max}.`;
        case 'pattern':
            return "The {label}} doesn't have a valid syntax.";
        case 'email':
            return "The {label} isn't a valid email address.";
        default:
            return "The {label} is invalid";
    }
}