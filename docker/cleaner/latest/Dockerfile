FROM perl:5:30:1

RUN true \
  && cpanm --notest File::Path \
  && cpanm --notest JSON \
  && mkdir -p /usr/local/altar/cleaner

COPY ./bin /usr/local/altar/cleaner/bin

WORKDIR /usr/local/PROJECT/workspace

CMD ["perl5.30.1", "-de0"]