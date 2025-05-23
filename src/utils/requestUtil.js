export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = forwarded ? forwarded.split(",")[0] : req.connection.remoteAddress;
  return ip.replace("::ffff:", "");
};

export const resultFormat = ({
  title = "",
  success = false,
  message = "",
  data = [],
  total = 0,
} = {}) => {
  return { title, success, message, data, total };
};
