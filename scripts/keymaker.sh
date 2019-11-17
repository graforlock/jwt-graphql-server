#!/bin/sh

for name in "$@"; do
  openssl req -x509 -newkey rsa:4096 -sha256 -nodes -keyout ${name}.key -out ${name}.pem -subj "/CN=${name}"
done