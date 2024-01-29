export default function (res, { access, refresh }) {
  res.cookie('access_token', access, { maxAge: +process.env.JWT_ACCESS_MAX_AGE, httpOnly: true })
  res.cookie('refresh_token', refresh, { maxAge: +process.env.JWT_REFRESH_MAX_AGE, httpOnly: true })
}