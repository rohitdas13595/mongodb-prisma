import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Result } from "@/lib/results";
import { HttpStatusCode } from "@/lib/statusCodes";
import { generateAccessToken, validateToken } from "@/lib/jwt";

const isTokenExpired = (token: String) =>
  Date.now() >= JSON.parse(atob(token.split(".")[1])).exp * 1000;

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    if (!body?.refreshToken) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.PARTIAL_CONTENT,
        message: "Missing  Refresh  Token",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }
    const expired = isTokenExpired(body?.refreshToken);

    if (expired) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "Refresh Token  Expired",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }
    const secret = process.env.JWTSECRET;
    if (!secret) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "No Secret",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }
    const decoded = await validateToken(body?.refreshToken);

    if (decoded?.error || !decoded.data) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "No Decoded Data",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }

    if (!decoded?.data?.id) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "Missing id",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decoded?.data?.id,
      },
    });
    if (!user) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.UNAUTHORIZED,
        message: "No User",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }

    const accessTokenResult = await generateAccessToken({
      id: user?.id,
      email: user?.email,
    });

    if (accessTokenResult.error || !accessTokenResult.token) {
      const res: Result = {
        error: true,
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        message: "Error Generating Token",
        result: null,
      };
      return NextResponse.json(res, { status: res.statusCode });
    }

    const res: Result = {
      error: false,
      statusCode: HttpStatusCode.OK,
      message: "New Access Token",
      result: {
        accessToken: accessTokenResult.token,
      },
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
}
