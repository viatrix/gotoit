
var getData = () => {};

export function setCallback(f) {
    getData = f;
}

export default getData;