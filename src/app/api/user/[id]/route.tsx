import { headers } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { DaoClass } from "@/lib/crud";

export async function GET(req: NextRequest, { params }: any) {
  const dao = new DaoClass(req, prisma.user, params?.id);
  const res = await dao.getOne();
  return NextResponse.json(res, { status: res.statusCode });
}


export async function PUT(req: NextRequest, { params }: any) {
  const dao = new DaoClass(req, prisma.user, params?.id);
  const res = await dao.updateOne();
  return NextResponse.json(res, { status: res?.statusCode });
}



export async function DELETE(req: NextRequest, { params }: any) {
    const dao = new DaoClass(req, prisma.user, params?.id);
    const res = await dao.deleteOne();
    return NextResponse.json(res, { status: res?.statusCode });
  }

