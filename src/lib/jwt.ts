import jwt from "jsonwebtoken";

type JWTResult = {
  error: Error | undefined;
  token: string | undefined;
};

type JWTDecoded = {
  data: any;
  error: Error | undefined;
};

export async function generateAccessToken(data: any): Promise<JWTResult> {
  const secret = process.env.JWTSECRET;
  if (secret) {
    try {
      const token = jwt.sign(data, secret, { expiresIn: "10h" });
      if (token) {
        return {
          token: token,
          error: undefined,
        };
      }
      return {
        token: undefined,
        error: new Error("Error Generating token"),
      };
    } catch (error: any) {
      return {
        token: undefined,
        error: error,
      };
    }
  }
  return {
    token: undefined,
    error: new Error("No  Secret"),
  };
}

export async function generateRefreshToken(data: any): Promise<JWTResult> {
  const secret = process.env.JWTSECRET;
  if (secret) {
    try {
      const token = jwt.sign(data, secret, { expiresIn: "7d" });
      if (token) {
        return {
          token: token,
          error: undefined,
        };
      }
      return {
        token: undefined,
        error: new Error("Error Generating token"),
      };
    } catch (error: any) {
      return {
        token: undefined,
        error: error,
      };
    }
  }
  return {
    token: undefined,
    error: new Error("No  Secret"),
  };
}

export async function validateToken(token: any): Promise<JWTDecoded> {
  const secret = process.env.JWTSECRET;
  if (secret) {
    try {
      const decoded = jwt.verify(token, secret);
      if (decoded) {
        return {
          data: decoded,
          error: undefined,
        };
      }
      return {
        data: undefined,
        error: new Error("Error Generating Data"),
      };
    } catch (error: any) {
      return {
        data: undefined,
        error: error,
      };
    }
  }
  return {
    data: undefined,
    error: new Error("No  Data"),
  };
}
