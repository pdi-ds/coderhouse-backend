import Container from "../Container/Container";
import { Validation, ValidationResult } from "../Products/Products";
import { Knex } from "knex";
import CreateTableBuilder = Knex.CreateTableBuilder;

type Message = {
  [key: string]: number | String | Date | undefined;
  id?: number;
  from?: String;
  message?: number;
  date?: Date;
};

class Messages extends Container {
  private tableCreated: boolean = false;
  constructor(config: object) {
    super(config, "messages");
  }

  async create(
    message: Message
  ): Promise<ValidationResult | Message | boolean> {
    await this.checkTable();
    const validation: ValidationResult = this.validateMessage(message);
    if (validation.errors.length > 0) return validation;
    const result = await this.store([{ ...message }]);
    return result === true ? message : false;
  }

  async checkTable(): Promise<boolean> {
    if (this.tableCreated === false) {
      const exists: boolean = await this.connection.schema.hasTable(
        this.tableName
      );
      if (exists === false) {
        await this.createTable((table: CreateTableBuilder): void => {
          table.increments("id");
          table.string("from", 255);
          table.text("message");
          table.timestamp("date").defaultTo(this.connection.fn.now());
        })
          .then(() => {
            this.tableCreated = true;
            return true;
          })
          .catch((err) => {
            console.log(err);
            return false;
          });
      }
    }
    return true;
  }

  async getAll(): Promise<Array<any> | boolean> {
    await this.checkTable();
    return await super.getAll();
  }

  validateMessage(data: Message): ValidationResult {
    const results: Array<Validation> = [
      {
        field: "from",
        validator: (value: any): boolean => {
          const matches: Array<string> | null = String(value)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
          return matches !== null && matches.length > 0;
        },
        message: "The <from> field is required.",
      },
      {
        field: "message",
        validator: (value: any): boolean => {
          return value !== null && value !== "";
        },
        message: "The <message> field is required",
      },
    ].map(
      ({
        field,
        validator,
        message,
      }: {
        field: string;
        validator: Function;
        message: string;
      }): Validation =>
        validator.call(null, data[field] || null) === false
          ? { field, message, valid: false }
          : { field, valid: true }
    );

    return {
      valid: results.filter(
        (validation: Validation) => validation.valid === true
      ),
      errors: results.filter(
        (validation: Validation) => validation.valid === false
      ),
    };
  }
}

export { Message };
export default Messages;
