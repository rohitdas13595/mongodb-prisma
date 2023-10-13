import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DaoClass } from "@/lib/crud";

export async function GET(req: NextRequest, { params }: any) {
  const dao = new DaoClass(req, prisma.admin, params?.id);
  const res = await dao.getMany();
  return NextResponse.json(res, { status: res.statusCode });
}


export async function POST(req: NextRequest,) {
  const dao = new DaoClass(req, prisma.admin);
  const res = await dao.create();
  return NextResponse.json(res, { status: res.statusCode });
}