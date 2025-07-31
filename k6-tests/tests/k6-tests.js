import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 5,
  duration: "10s",
};

export default () => {
  const url = "http://traefik:8000/";
  const res = http.get(url);

  check(res, {
    "status is 200": (r) => r.status === 200,
  });
};