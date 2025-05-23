import jwt from "jsonwebtoken";

export const autheticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startWith("Bearer ")) {
    return res.status(401).json({
      title: "인증 실패",
      success: false,
      message: "Access Token이 없습니다.",
      data: [],
      total: 0,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      title: "인증 실패",
      success: false,
      message: "유효하지 않은 Access Token입니다.",
      data: [],
      total: 0,
    });
  }
};
