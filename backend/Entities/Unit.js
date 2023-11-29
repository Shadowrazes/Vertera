import Entity from "./Entity.js";

class Unit extends Entity{
    static TableName = 'units';
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

    static async Update(id, fields) {
        return;
        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [fields, id]);
        return {affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus};
    }

    // Cascade deleting Unit & Themes & SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default Unit;