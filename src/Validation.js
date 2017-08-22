export function required() {
    return (value, done) => {
        done({
            required: !!value
        });
    }
}

export function min(minValue, type) {
    return (value, done) => {
        switch (type) {
            case 'date':
                done({
                    min: new Date(minValue) < new Date(value)
                });
                break;
            case 'number':
                done({
                    min: parseFloat(minValue) < parseFloat(value)
                });
                break;
            default:
                done({
                    min: minValue.length < value
                });
                break;
        }
    }
}

export function max(maxValue, type) {
    return (value, done) => {
        switch (type) {
            case 'date':
                done({
                    max: new Date(maxValue) > new Date(value)
                });
                break;
            case 'number':
                done({
                    max: parseFloat(maxValue) > parseFloat(value)
                });
                break;
            default:
                done({
                    max: maxValue.length > value
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