
// Try to convert this like using a spread operator
export const validateInput = (inputs) => {
    for (let input of inputs) {
        if (input === "") {
            return true;
        }
    }

    return false;
}