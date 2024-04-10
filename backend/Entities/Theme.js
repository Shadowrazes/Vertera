import Entity from "./Entity.js";
import Translation from "./Translation.js";

class Theme extends Entity {
    static TableName = 'themes';
    static PrimaryField = 'id';
    static NameCodeField = 'nameCode';
    static UnitIdField = 'unitId';
    static OrderField = 'orderNum';
    static VisibilityField = 'visibility';
    static TranslationType = 'theme';
    static Visibilitises = { client: 2, helper: 3, system: 4};

    static VisibleByClients = 1;
    static VisibleByHelpers = 2;
    static VisibleByAdmins = 3;

    static ValidateVisibility(role) {
        return this.Visibilitises[role];
    }

    static async GetById(id, initiator, constraint) {
        const constraintSql = ``;

        if(constraint) {
            constraintSql += ` AND ${this.VisibilityField} < ${this.ValidateVisibility(initiator.role)}`;
        }

        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.PrimaryField} = ?
            ${constraintSql}
        `;
        const result = await super.Request(sql, [id]);
        return result[0];
    }

    static async GetList(initiator, constraint) {
        const constraintSql = ``;

        if(constraint) {
            constraintSql += `WHERE ${this.VisibilityField} < ${this.ValidateVisibility(initiator.role)}`;
        }

        const sql = `
            SELECT * FROM ${this.TableName}
            ${constraintSql}
            ORDER BY ${this.OrderField} ASC
        `;
        const result = await super.Request(sql);
        return result;
    }

    static async GetListByUnit(unitId, initiator, constraint) {
        const constraintSql = ``;

        if(constraint) {
            constraintSql += ` AND ${this.VisibilityField} < ${this.ValidateVisibility(initiator.role)}`;
        }

        const sql = `
            SELECT * FROM ${this.TableName} 
            WHERE ${this.UnitIdField} = ?
            ${constraintSql}
            ORDER BY ${this.OrderField} ASC
        `;
        const result = await super.Request(sql, [unitId]);
        return result;
    }

    static async TransInsert(fields) {
        return await super.Transaction(async (conn) => {
            const nameCode = await Translation.TransInsert(conn, fields, this.TranslationType);

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const insertFields = {
                unitId: fields.unitId, visibility: fields.visibility,
                nameCode, orderNum: fields.orderNum
            };
            const result = await super.TransRequest(conn, sql, [insertFields]);
            return nameCode;
        });
    }

    static async TransUpdate(id, fields, initiator) {
        return await super.Transaction(async (conn) => {
            if (fields.stroke) {
                const row = await this.GetById(id, initiator);
                const translationResult = await Translation.TransUpdate(conn, fields, row.nameCode);
            }

            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;

            const updateFields = {};
            if (fields.unitId) updateFields.unitId = fields.unitId;
            if (fields.orderNum) updateFields.orderNum = fields.orderNum;
            if (fields.visibility) updateFields.visibility = fields.visibility;
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