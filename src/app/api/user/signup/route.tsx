import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DaoClass } from "@/lib/crud";
import { validate } from "class-validator";
import { UserLogin, UserSignUp } from "@/classes/user/user";
import { Result } from "@/lib/results";
import { HttpStatusCode } from "@/lib/statusCodes";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { has } from "lodash";

//TODO: Create  class validator checks


/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     description: Signup user's
 *     responses:
 *       200:
 *         description:
 *             {
 *                 result: "Chat App  Server"
 *            }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signupBody = new UserSignUp(body);
    const erros = await validate(signupBody);
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
      where: { email: signupBody.email },
    });
    if (user) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.FORBIDDEN,
        message: "User Already Signed In  Try  Loging In",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }

    const hash = await bcrypt.hash(signupBody.password, 10);

    if (hash) {
      //createUser
      signupBody.password = hash;
      const newUser = await prisma.user.create({
        data: signupBody,
      });

      if (newUser) {
        const JwtAccessTokenResult = await generateAccessToken({
          id: newUser.id,
          email: newUser.email,
        });
        const jwtRefreshTokenResult = await generateRefreshToken({
          id: newUser.id,
          email: newUser.email,
        });
        if (JwtAccessTokenResult.error || jwtRefreshTokenResult.error) {
          const res: Result = {
            error: true,
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: "Error Generating Tokens",
            result: null,
          };
          return NextResponse.json(res, { status: res.statusCode });
        }

        await prisma.user.update({
          where: {
            id: newUser.id,
          },
          data: {
            refreshToken: jwtRefreshTokenResult.token,
          },
        });

        const res: Result = {
          error: false,
          statusCode: HttpStatusCode.OK,
          message: "New User Data",
          result: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            newUsername: newUser.username,
            phone: newUser?.phone,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            accessToken: JwtAccessTokenResult.token,
            refreshToken: jwtRefreshTokenResult.token,
          },
        };
        return NextResponse.json(res, { status: res.statusCode });
      }
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "Error Creating New User",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }
    const res: Result = {
      error: true,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Error Hashing Password",
      result: null,
    };
    return NextResponse.json(res, { status: res.statusCode });
  } catch (error) {
    console.log("error", error);
    const res: Result = {
      error: true,
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Something Went  Wrong",
      result: null,
    };
    return NextResponse.json(res, { status: res.statusCode });
  }
}
