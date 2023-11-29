import Entity from "./Entity.js";

class Country extends Entity{
    static TableName = 'countries';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }
}

export default Country;