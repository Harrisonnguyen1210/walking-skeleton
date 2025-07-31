FROM denoland/deno:alpine-2.0.2

WORKDIR /app

COPY deno.json .

RUN DENO_FUTURE=1 deno install

COPY . .

CMD [ "run", "--allow-env", "--allow-net", "--allow-read", "--watch", "app-run.js" ]