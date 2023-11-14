import Entity from "./Entity.js";
import UserEntity from "./User.js";

class HelperEntity extends Entity{
    static TableName = 'helpers';
    static PrimaryField = 'id';
    static LoginField = 'login';
    static PasswordField = 'password';
    static DepartmentField = 'department';
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

    static async Insert(args) {
        const id = await UserEntity.Insert(args, 'helper');
        const sql = `INSERT INTO ${this.TableName} SET ?`;
        const fields = {id, login: args.login, password: args.password, department: args.department,
                        jobTitle: args.jobTitle, birthday: args.birthday, startWorkDate: new Date()};
        const result = await super.Request(sql, [fields]);
        return id;
    }

    static async Update(id) {

    }

    static async Delete(id) {

    }

    //  clear table
    // Insert or Update
}

export default HelperEntity;