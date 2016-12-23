
import {offices} from '../data/knowledge';

class OfficeModel {
    constructor(size) {
        this.size = size;
        this.name = offices[size].name;
        this.space = offices[size].space;
        this.price = offices[size].price;
    }
}

export default OfficeModel;