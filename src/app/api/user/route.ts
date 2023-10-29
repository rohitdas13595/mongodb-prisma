import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DaoClass } from "@/lib/crud";

/**
 * @swagger
 * tags:
 *   - name: "User"
 *     description: "Everything related to User"
 * paths:
 *   /api/user:
 *     get:
 *       tags:
 *         - user
 *       description: Get Users
 *       produces:
 *         - "application/json"
 *       parameters:
 *         - in: query
 *           name: string
 *           email: string
 *           username: string
 *       responses:
 *         500:
 *           description: "something went wrong"
 *         200:
 *           description: "Users fetched"
 */
export async function GET(req: NextRequest, { params }: any) {
  const dao = new DaoClass(req, prisma.user, params?.id);
  const res = await dao.getMany();
  return NextResponse.json(res, { status: res.statusCode });
}

// export async function POST(req: NextRequest) {
//   const dao = new DaoClass(req, prisma.user);
//   const res = await dao.create();
//   return NextResponse.json(res, { status: res.statusCode });
// }
