import Entity from "./Entity.js";

class HelperJobTitle extends Entity{
    static TableName = 'helper_job_titles';
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

export default HelperJobTitle;