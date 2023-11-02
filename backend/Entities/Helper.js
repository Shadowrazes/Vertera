import Entity from "./Entity.js";

class HelperEntity extends Entity{
    static TableName = 'helpers';

    static async Get(id) {
        return await super.Get(id, this.TableName);
    }

    static async GetAll() {
        
    }

    static async Insert(id, name, role, county) {
        
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default HelperEntity;