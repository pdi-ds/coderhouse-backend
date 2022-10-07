import * as fs from "fs";
import { ObjectEncodingOptions, PathLike } from "fs";

class Container {
  private readonly file: PathLike;
  private readonly encoding: ObjectEncodingOptions;
  constructor(file: PathLike, encoding: string = "utf-8") {
    this.file = file;
    this.encoding = { encoding: "utf8" };
  }
  async save(object: Object): Promise<Number> {
    const content: Array<any> | boolean = await this.read();
    const id: Number =
      typeof content !== "boolean"
        ? content[content.length - 1]?.id + 1 || 1
        : 1;
    const record = { id, ...object };
    await this.write(
      JSON.stringify(
        typeof content !== "boolean" ? [...content, record] : [record]
      )
    );
    return id;
  }
  async getById(id: Number): Promise<Object | boolean> {
    const content: Array<any> | boolean = await this.read();
    return typeof content !== "boolean"
      ? content.filter((result) => result.id === id)[0]
      : false;
  }
  async getAll(): Promise<Array<any>> {
    const content: Array<any> | boolean = await this.read();
    return typeof content !== "boolean" ? content : [];
  }
  async deleteById(id: Number): Promise<boolean> {
    const content: Array<any> | boolean = await this.read();
    return typeof content !== "boolean"
      ? await this.write(
          JSON.stringify(content.filter((record) => record.id !== id))
        )
      : false;
  }
  async deleteAll(): Promise<boolean> {
    return await this.write(JSON.stringify([]));
  }
  private async read(): Promise<Array<any> | boolean> {
    try {
      const response: string | Buffer = await fs.promises.readFile(
        this.file,
        this.encoding
      );
      return JSON.parse(<string>response);
    } catch (err) {
      return false;
    }
  }
  private async write(data: string): Promise<boolean> {
    try {
      await fs.promises.writeFile(this.file, data, this.encoding);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default Container;
