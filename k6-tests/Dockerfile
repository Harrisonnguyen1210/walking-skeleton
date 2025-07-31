FROM grafana/k6:latest-with-browser

WORKDIR /tests

COPY tests /tests/

CMD [ "run", "/tests/hello-k6.js" ]