import Container from "../Container/Container";
import { PathLike } from "fs";
import { normalize, denormalize, schema, NormalizedSchema } from "normalizr";
import Entity = schema.Entity;

type Message = {
  [key: string]: number | Author | String | undefined;
  id?: number;
  author?: Author;
  message?: String;
  date?: number;
};

type Author = {
  [key: string]: number | String | PathLike | undefined;
  email?: String;
  first_name?: String;
  last_name?: String;
  age?: number;
  alias?: String;
  avatar?: PathLike;
};

const authorSchema: Entity = new Entity(
  "authors",
  {},
  { idAttribute: "email" }
);
const messageSchema: Entity = new Entity("messages", { author: authorSchema });

class Messages extends Container {
  private messages: Array<Message>;
  constructor(messages: Array<Message> = []) {
    super("./data/messages.json");
    this.messages = messages;
  }

  async create(message: Message): Promise<Message> {
    message.date = Date.now();
    const id: number = await this.save(message);
    const record: Message = { id, ...message };
    this.messages.push(record);
    return record;
  }

  async getAll(): Promise<Array<Message>> {
    return await super.getAll();
  }

  normalize(data: object): object {
    return normalize(data, messageSchema);
  }

  denormalize(data: NormalizedSchema<any, any>): object {
    return denormalize(data.result, messageSchema, data.entities);
  }
}

export { Message };
export default Messages;
