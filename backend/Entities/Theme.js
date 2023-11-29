import Entity from "./Entity.js";

class Theme extends Entity{
    static TableName = 'themes';
    static PrimaryField = 'id';
    static NameField = 'name';
    static UnitIdField = 'unitId';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * from ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }

    static async Update(id, fields) {
        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [fields, id]);
        return {affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus};
    }

    // Cascade deleting Theme & SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default Theme;