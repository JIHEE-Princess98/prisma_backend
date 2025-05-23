import { resultFormat } from "./requestUtil.js";

export const errorHandler = (err, req, res, next) => {
  if (!err) {
    err = new Error("Unknown error");
  }

  console.error("[Error]", err);

  const status = err.status || 500;

  res.status(status).json(
    resultFormat({
      title: "서버 에러",
      success: false,
      message: err.message || "알 수 없는 에러가 발생했습니다.",
    })
  );
};
