FROM golang
LABEL maintener="MRS Tecno <desenvolvimento@mrstecno.com.br>"

WORKDIR /gatekeeper

ENV GOPATH=/app

COPY . /app/src/gatekeeper/

RUN go build main.go

ENTRYPOINT [ "./main" ]
EXPOSE 3000