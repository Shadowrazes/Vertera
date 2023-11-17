import Entity from "./Entity.js";

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

    static async GetList() {
        const sql = `SELECT * from ${this.TableName}`;
        const result = await super.Request(sql);
        return result;
    }
}

export default SubThemeEntity;