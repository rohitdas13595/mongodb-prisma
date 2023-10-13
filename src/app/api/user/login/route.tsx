import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DaoClass } from "@/lib/crud";

//TODO: Create  class validator checks

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
  } catch (error) {}

  // const  user =  await  prisma.user.findUnique({email: req.body?.email})

  // return NextResponse.json(res, { status: res.statusCode });
}
