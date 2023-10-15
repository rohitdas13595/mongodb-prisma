import { NextApiHandler } from "next";
import { Result } from "./results";
import { HttpStatusCode } from "./statusCodes";
import * as lodash from "lodash";
import { prisma } from "./prisma";
import { NextResponse, NextRequest } from "next/server";

export class DaoClass {
  req: NextRequest;

  client: any;
  id?: string;
  handler?: NextApiHandler;

  constructor(
    req: NextRequest,
    client: any,
    id?: any,
    handler?: NextApiHandler
  ) {
    this.req = req;
    this.id = String(id);
    this.handler = handler;
    this.client = client;
  }

  private async parseFilter1(where: any) {
    if (where instanceof Array) {
      where.forEach(() => this.parseFilter1(where));
    }
    Object.keys(where).forEach((key) => {
      if ((where as any)[key] instanceof Array) {
        (where as any)[key] = { in: where[key] };
      }
      if ((where as any)[key] === "true") {
        (where as any)[key] = true;
      }
      if ((where as any)[key] === "false") {
        (where as any)[key] = false;
      }
      if (key.indexOf(".") >= 0) {
        const temp = lodash.set({}, key, (where as any)[key]);
        where = { ...temp, ...where };
        delete (where as any)[key];
      }
    });
    return where;
  }

  public async deleteOne() {
    try {
      const response = await this.client.delete({
        where: { id: String(this.id) },
      });
      if (response) {
        const result: Result = {
          error: false,
          statusCode: HttpStatusCode.OK,
          message: "deleted",
          result: response,
        };
        return result;
        return;
      }

      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "error in deleting",
      };

      return result;
    } catch (error: any) {
      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "error in creating",
      };

      return result;
    }
  }

  public async getOne() {
    console.log("client", this.id);

    try {
      const response = await this.client.findUnique({
        where: { id: String(this.id) },
      });
      console.log("here.....", response);
      if (response?.id) {
        const result: Result = {
          error: false,
          statusCode: HttpStatusCode.OK,
          message: "Found!",
          result: response,
        };
        return result;
      }

      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "not found",
      };

      return result;
    } catch (error: any) {
      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };

      return result;
    }
  }

  public async updateOne() {
    try {
      const response = await this.client.update({
        data: this.req?.body,
        where: { id: String(this.id) },
      });
      if (response?.id) {
        const result: Result = {
          error: false,
          statusCode: HttpStatusCode.OK,
          message: "updated",
          result: response,
        };
        return result;
        return;
      }

      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "error in updating",
      };

      return result;
    } catch (error: any) {
      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };

      return result;
    }
  }

  public async create():Promise<Result> {
    try {
      const body = await this.req.json();
      // console.log("Request body", body);
      const response = await this.client.create({
        data: body,
      });
      if (response) {
        const result: Result = {
          error: false,
          statusCode: HttpStatusCode.CREATED,
          message: "created",
          result: response,
        };
        return result;
      }

      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "error in creating",
      };

      return result;
    } catch (error: any) {
      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };

      return result;
    }
  }

  public async getMany() {
    const { searchParams } = new URL(this.req.url);
    let query: any = {};
    const keys = searchParams.keys();
    let result = keys.next();
    while (!result.done) {
      // console.log(result.value); // 1 3 5 7 9
      query[`${result.value}`] = searchParams.get(`${result.value}`);
      result = keys.next();
    }

    let findOptions: any = {};

    //page
    if (query?.page && query?.count) {
      findOptions["take"] = Number(query?.count);
      findOptions["skip"] = (Number(query?.page) - 1) * Number(query?.count);
      delete query.count;
      delete query.page;
    }
    if (!query?.page || !query?.count) {
      if (query.count) {
        delete query.count;
      }
      if (query.page) {
        delete query.page;
      }
    }

    //sort
    if (query?.orderBy && query?.order) {
      let ob: any = {};
      ob[`${query?.orderBy}`] = String(query?.order).toLowerCase();
      findOptions["orderBy"] = ob;
      delete query?.orderBy;
      delete query?.order;
    }

    if (!query?.orderBy || query?.order) {
      if (query?.orderBy) {
        delete query?.orderBy;
      }
      if (query?.order) {
        delete query?.order;
      }
    }
    let wh: any = {};

    findOptions['where'] = await this.parseFilter1(query);

    console.log("findOptions", findOptions);

    try {
      const [data, total] = await prisma.$transaction([
        this.client.findMany(findOptions),
        this.client.count(findOptions),
      ]);
      // const students = await prisma.admin.findMany(findOptions);+
      const result: Result = {
        error: false,
        statusCode: HttpStatusCode.OK,
        message: "Found!",
        result: data,
        total: total,
      };
      return result;
    } catch (error: any) {
      const result: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message,
      };
      return result;
    }
  }
}
