const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function required() {
    return (value, done) => {
        done({
            required: !!value
        });
    }
}

export function min(minValue, type) {
    return (value, done) => {
        if (!value) return done({min: true});
        switch (type) {
            case 'date':
                done({
                    min: {
                        valid: new Date(minValue) < new Date(value),
                        min: minValue,
                        type
                    }
                });
                break;
            case 'number':
                done({
                    min: {
                        valid: parseFloat(minValue) < parseFloat(value),
                        min: minValue,
                        type
                    }
                });
                break;
            default:
                done({
                    min: {
                        valid: minValue < value.length,
                        min: minValue,
                        type
                    }
                });
                break;
        }
    }
}

export function max(maxValue, type) {
    return (value, done) => {
        if (!value) return done({max: true});
        switch (type) {
            case 'date':
                done({
                    max: {
                        valid: new Date(maxValue) > new Date(value),
                        max: maxValue,
                        type
                    }
                });
                break;
            case 'number':
                done({
                    max: {
                        valid: parseFloat(maxValue) > parseFloat(value),
                        max: maxValue,
                        type
                    }
                });
                break;
            default:
                done({
                    max: {
                        valid: maxValue > value.length,
                        max: maxValue,
                        type
                    }
                });
                break;
        }
    }
}

export function pattern(pattern) {
    return (value, done) => {
        done({
            pattern: new RegExp(pattern).test(value)
        });
    }
}

export function email() {
    return (value, done) => {
        done({
            email: emailRegex.test(value)
        });
    }
}

export function equalTo(field) {

    return (value, done, {root}) => {
        const equalToField = root.get(field);
        if (!equalToField) throw 'The field doesnt belong to the form';

        done({
            equalTo: {
                valid: equalToField.getValue() === value,
                equalToLabel: equalToField.getLabel() || equalToField.getName()
            }
        })
    }
}
