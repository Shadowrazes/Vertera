import Entity from "./Entity.js";
import Translation from "./Translation.js";

class Theme extends Entity {
    static TableName = 'themes';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static UnitIdField = 'unitId';
    static OrderField = 'orderNum';
    static TranslationType = 'theme'

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

    static async GetListByUnit(unitId) {
        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.UnitIdField} = ?
            ORDER BY ${this.OrderField} ASC
        `;
        const result = await super.Request(sql, [unitId]);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = { unitId: fields.unitId, nameCode, orderNum: fields.orderNum };
            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            if (fields.stroke) {
                const row = await this.GetById(id);
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if (fields.unitId) updateFields.unitId = fields.unitId;
            if (fields.orderNum) updateFields.orderNum = fields.orderNum;
            if (super.IsArgsEmpty(updateFields)) return super.EmptyUpdateInfo;

            const result = await super.TransRequest(conn, sql, [updateFields, id]);
            return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
        });
    }

    // Cascade deleting Theme & SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        return await super.Transaction(async (conn) => {
            const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
            const result = await super.TransRequest(conn, sql, [id]);

            const translationResult = await Translation.ClearUnused(conn);

            return result.affectedRows;
        });
    }
}

export default Theme;