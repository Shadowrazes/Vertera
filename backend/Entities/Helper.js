import Entity from "./Entity.js";
import UserEntity from "./User.js";
import HelperDepartmentEntity from "./HelperDepartment.js"; 

class HelperEntity extends Entity{
    static TableName = 'helpers';
    static PrimaryField = 'id';
    static LoginField = 'login';
    static PasswordField = 'password';
    static JobTitleField = 'jobTitle';
    static BirthdayField = 'birthday';
    static StartWorkDateField = 'startWorkDate';

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

    static async GetMostFreeHelper(ticketArgs) {
        // temp
        return 2;
    }

    static async TransInsert(args) {
        return await super.Transaction(async (conn) => {
            const id = await UserEntity.TransInsert(conn, args, 'helper');

            const sql = `INSERT INTO ${this.TableName} SET ?`;
            const fields = {id, login: args.login, password: args.password, jobTitle: args.jobTitle,
                            birthday: args.birthday, startWorkDate: new Date()};
            const result = await super.TransRequest(conn, sql, [fields]);

            const helperDepartmentResult = await HelperDepartmentEntity.TransInsert(conn, id, args.departmentIds);

            return id;
        });
    }

    static async TransUpdate(id, fields) {
        return await super.Transaction(async (conn) => {
            const userFields = { fullName: fields.fullName, country: fields.country, phone: fields.phone };
            const helperFields = {  password: fields.password, jobTitle: fields.jobTitle, birthday: fields.birthday };
            const sql = `UPDATE ${this.TableName} SET ? WHERE ${this.PrimaryField} = ?`;
            
            const helperResult = await super.TransRequest(conn, sql, [helperFields, id]);
            const userResult = await UserEntity.TransUpdate(conn, id, userFields);
            const helperDepartmentDelResult = await HelperDepartmentEntity.TransDeleteByHelper(conn, id);
            const helperDepartmentInsertResult = await HelperDepartmentEntity.TransInsert(conn, id, args.departmentIds);

            return {affected: helperResult.affectedRows, changed: helperResult.changedRows, 
                    warning: helperResult.warningStatus};
        });
    }
}

export default HelperEntity;