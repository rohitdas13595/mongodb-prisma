import { headers } from "next/headers";
import { HttpStatusCode } from "../../lib/statusCodes";
import { NextResponse, NextRequest } from "next/server";

/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns the hello world
 *     responses:
 *       200:
 *         description: Hello World!
 */
export async function GET(request: Request, { params }: any) {
  // const headersList = headers();
  // const referer = headersList.get("referer");
  // const { searchParams } = new URL(request.url);
  // let query: any = {};
  // const keys = searchParams.keys();
  // let result = keys.next();
  // while (!result.done) {
  //   // console.log(result.value); // 1 3 5 7 9
  //   query[`${result.value}`] = searchParams.get(`${result.value}`);
  //   result = keys.next();
  // }

  // console.log("query", query);

  return NextResponse.json({ result: "Chat App Server" }, { status: 200 });
}
