import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DaoClass } from "@/lib/crud";
import { validate } from "class-validator";
import { UserLogin } from "@/classes/user/user";
import { Result } from "@/lib/results";
import { HttpStatusCode } from "@/lib/statusCodes";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

//TODO: Create  class validator checks

/**
 * @swagger
* /api/user/login:
 *   post:
 *     tags:
 *       - user
 *     description: Login User
 *     consumes:
 *       - "application/json"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         required: true
 *         schema:
 *            type: object
 *            required:
 *                - email
 *                - password
 *            properties:
 *               email:
 *                   type: "string"
 *               password:
 *                   type: "string"
 *     responses:
 *       500:
 *         description: "something went wrong"
 *       200:
 *         description: "User Login Successfully"
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const loginBody = new UserLogin(body);
    const erros = await validate(loginBody);
    if (erros.length > 0) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.PARTIAL_CONTENT,
        message: "Partial  Content",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }
    const user = await prisma.user.findUnique({
      where: { email: loginBody.email },
    });
    if (!user) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "User Not Found",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }

    const match = await bcrypt.compare(loginBody.password, user.password);

    if (match) {
      const JwtAccessTokenResult = await generateAccessToken({
        id: user.id,
        email: user.email,
      });
      const jwtRefreshTokenResult = await generateRefreshToken({
        id: user.id,
        email: user.email,
      });
      if (JwtAccessTokenResult.error || jwtRefreshTokenResult.error) {
        const res: Result = {
          error: true,
          statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: "Somethin Went  Wrong",
          result: null,
        };
        return NextResponse.json(res, { status: res.statusCode });
      }
      const res: Result = {
        error: false,
        statusCode: HttpStatusCode.OK,
        message: "User Data",
        result: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user?.phone,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          accessToken: JwtAccessTokenResult.token,
          refreshToken: jwtRefreshTokenResult.token,
        },
      };
      return NextResponse.json(res, { status: res.statusCode });
    }
    const res: Result = {
      error: true,
      statusCode: HttpStatusCode.UNAUTHORIZED,
      message: "Incorrect  Password",
      result: null,
    };
    return NextResponse.json(res, { status: res.statusCode });
  } catch (error) {
    const res: Result = {
      error: true,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Somethin Went  Wrong",
      result: null,
    };
    return NextResponse.json(res, { status: res.statusCode });
  }

  // const  user =  await  prisma.user.findUnique({email: req.body?.email})
}
