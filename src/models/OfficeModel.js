
class OfficeModel {
    constructor(size) {
        this.size = size;
        this.type = ['', 'Home', 'Small Office', 'Medium Office', 'Big office'][size];
        this.space = [0, 1, 4, 7, 10][size];
        this.price = [0, 0, 100, 1000, 10000][size];
    }
}

export default OfficeModel;