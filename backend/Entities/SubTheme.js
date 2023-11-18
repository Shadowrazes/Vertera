import Entity from "./Entity.js";
import ThemeEntity from "./Theme.js";
import UnitEntity from "./Unit.js";

class SubThemeEntity extends Entity{
    static TableName = 'subthemes';
    static PrimaryField = 'id';
    static NameField = 'name';
    static ThemeIdField = 'themeId';

    static async GetById(id) {
        const sql = `SELECT * from ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]); 
        return result[0];
    }

    // const themeNameAS = 'theme';
    //     const unitNameAS = 'unit';
    //     const sql = `
    //         SELECT 
    //             ${this.TableName}.${this.PrimaryField}, ${this.TableName}.${this.NameField}, 
    //             ${ThemeEntity.TableName}.${ThemeEntity.NameField} AS ${themeNameAS},
    //             ${UnitEntity.TableName}.${UnitEntity.NameField} AS ${unitNameAS} 
    //         FROM ${this.TableName}
    //         JOIN ${ThemeEntity.TableName} 
    //             ON ${this.TableName}.${this.ThemeIdField} = ${ThemeEntity.TableName}.${ThemeEntity.PrimaryField}
    //         JOIN ${UnitEntity.TableName} 
    //             ON ${ThemeEntity.TableName}.${ThemeEntity.UnitIdField} = ${UnitEntity.TableName} .${UnitEntity.PrimaryField};
    //     `;

    static async GetList() {
        const sql = `SELECT * from ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }

    static async Update(id, fields) {
        const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [fields, id]);
        return { affected: result.affectedRows, changed: result.changedRows, warning: result.warningStatus };
    }

    // Cascade deleting SubThemes & SubTheme to department link
    static async DeleteCascade(id) {
        const sql = `DELETE FROM ${this.TableName} WHERE ${this.PrimaryField} = ?`;
        const result = await super.Request(sql, [id]);
        return result.affectedRows;
    }
}

export default SubThemeEntity;