import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null; // ✅ 오타 수정

  if (!token) {
    return res.status(401).json({
      title: "인증 실패",
      success: false,
      message: "Access Token이 없습니다.",
      data: [],
      total: 0,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      title: "인증 실패",
      success: false,
      message: "유효하지 않은 토큰입니다.",
      data: [],
      total: 0,
    });
  }
};
