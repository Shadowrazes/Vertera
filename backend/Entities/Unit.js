import Entity from "./Entity.js";
import Translation from "./Translation.js";

class Unit extends Entity{
    static TableName = 'units';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static OrderField = 'orderNum';
    static TranslationType = 'unit'

    static async GetById(id) {
        const sql = `SELECT * FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    static async GetList() {
        const sql = `SELECT * FROM ${this.TableName} ORDER BY ${this.OrderField} ASC`;
        const result = await super.Request(sql);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = {nameCode};
            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if(fields.stroke){
                const row = await this.GetById(id);
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if(fields.orderNum) updateFields.orderNum = fields.orderNum;
            if(super.IsArgsEmpty(updateFields)) return super.EmptyUpdateInfo;

            const result = await super.TransRequest(conn, sql, [updateFields, id]);
            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    // Cascade deleting Unit & Themes & SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default Unit;